import { useState, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useInvitation } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardFooter } from "../components/ui/Card"
import { Calendar, MapPin, MessageSquare, Users, Clock, Camera, ChevronRight, ChevronLeft, Music, Play, Pause, Volume2, VolumeX, Cake, X, Check, ZoomIn, Sparkles } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { cn } from "../lib/utils"
import { useTelegram } from "../hooks/useTelegram"
import { api } from "../lib/api"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "../lib/cropImage"
import defaultGroom from "../assets/default_groom.jpg"
import defaultBride from "../assets/default_bride.jpg"
import { templates } from "../lib/templates"
import { WeddingCard } from "../components/WeddingCard"
import { motion, AnimatePresence } from "framer-motion"

// Import music assets
import musicAzizam from "../assets/music_azizam.mp3"
import musicImg from "../assets/IMG_3421.mp3"
import musicDate from "../assets/2026-02-23 09.26.00.mp3"

const MUSIC_OPTIONS = [
    { id: 'music1', name: 'Musiqa 1 (Azizam)', url: musicAzizam },
    { id: 'music2', name: 'Musiqa 2 (IMG)', url: musicImg },
    { id: 'music3', name: 'Musiqa 3 (Wedding)', url: musicDate },
    { id: 'none', name: 'Musiqasiz', url: null },
]

const STEPS = ['groomInfo', 'brideInfo', 'weddingInfo', 'chooseTemplate'] as const;

// ─── Crop Modal ───────────────────────────────────────────────────────────────
interface CropModalProps {
    imageSrc: string
    onCropDone: (file: File, previewUrl: string) => void
    onCancel: () => void
}

function CropModal({ imageSrc, onCropDone, onCancel }: CropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedArea, setCroppedArea] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedArea(croppedAreaPixels)
    }, [])

    const handleConfirm = async () => {
        if (!croppedArea) return
        setLoading(true)
        try {
            const file = await getCroppedImg(imageSrc, croppedArea)
            const previewUrl = URL.createObjectURL(file)
            onCropDone(file, previewUrl)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-sm">
                <button onClick={onCancel} className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    <X className="h-5 w-5" />
                </button>
                <p className="text-white font-bold text-sm">Rasmni kesish</p>
                <div className="w-9" />
            </div>

            {/* Crop area */}
            <div className="flex-1 relative">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: { background: 'transparent' },
                        cropAreaStyle: { border: '3px solid #ec4899', boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)' },
                    }}
                />
            </div>

            {/* Zoom slider */}
            <div className="px-8 py-4 bg-black/60 backdrop-blur-sm flex items-center gap-3">
                <ZoomIn className="h-4 w-4 text-white/50 shrink-0" />
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-primary-500"
                />
            </div>

            {/* Confirm */}
            <div className="px-4 pb-6 pt-2 bg-black/60 backdrop-blur-sm">
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 py-4"
                >
                    {loading ? (
                        <span className="animate-pulse">Yuklanmoqda...</span>
                    ) : (
                        <><Check className="h-4 w-4" /> Tasdiqlash</>
                    )}
                </button>
            </div>
        </div>
    )
}

// ─── Main Create Page ─────────────────────────────────────────────────────────
export function Create() {
    const navigate = useNavigate()
    const { data, updateData, error: contextError } = useInvitation()
    const { t } = useLanguage()
    const { user: tgUser } = useTelegram()

    const [currentStep, setCurrentStep] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [playingMusic, setPlayingMusic] = useState<string | null>(null)

    // Local image previews (shown immediately after cropping)
    const [groomPreview, setGroomPreview] = useState<string | null>(null)
    const [bridePreview, setBridePreview] = useState<string | null>(null)

    // Crop modal state
    const [cropSource, setCropSource] = useState<string | null>(null)
    const [cropTarget, setCropTarget] = useState<'groom' | 'bride' | null>(null)

    // Store actual File objects for uploading during final submit
    const groomFileRef = useRef<File | null>(null)
    const brideFileRef = useRef<File | null>(null)

    const groomInputRef = useRef<HTMLInputElement>(null)
    const brideInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'groom' | 'bride') => {
        const file = e.target.files?.[0]
        if (!file) return
        // Open crop modal
        const objectUrl = URL.createObjectURL(file)
        setCropSource(objectUrl)
        setCropTarget(type)
        // Reset input so the same file can be re-selected
        e.target.value = ''
    }

    const handleCropDone = (file: File, previewUrl: string) => {
        if (cropTarget === 'groom') {
            groomFileRef.current = file
            setGroomPreview(previewUrl)
        } else {
            brideFileRef.current = file
            setBridePreview(previewUrl)
        }
        setCropSource(null)
        setCropTarget(null)
    }

    const handleCropCancel = () => {
        setCropSource(null)
        setCropTarget(null)
    }

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1)
    }

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (currentStep < STEPS.length - 1) { nextStep(); return }

        setIsSaving(true)
        setSaveError(null)

        try {
            const finalData = {
                ...data,
                template: data.template || 'classic_royale',
                creatorUser: tgUser
            }

            const result = await api.saveInvitation(finalData)

            if (!result || !result.id) {
                setSaveError("Taklifnoma saqlanmadi. Qayta urinib ko'ring.")
                setIsSaving(false)
                return
            }

            const invId = result.id

            const uploadPromises: Promise<any>[] = []
            if (groomFileRef.current && result.groomPicturePutUrl) {
                uploadPromises.push(api.uploadImage(groomFileRef.current, result.groomPicturePutUrl))
            }
            if (brideFileRef.current && result.bridePicturePutUrl) {
                uploadPromises.push(api.uploadImage(brideFileRef.current, result.bridePicturePutUrl))
            }
            if (uploadPromises.length > 0) await Promise.all(uploadPromises)

            navigate(`/invitation/${invId}`)
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Server bilan bog'lanishda xatolik yuz berdi."
            setSaveError(errorMsg)
        } finally {
            setIsSaving(false)
        }
    }

    const displayError = saveError || contextError

    // Photo upload button with default avatar display
    const PhotoUpload = ({
        preview,
        existing,
        inputRef,
        type,
        label,
    }: {
        preview: string | null
        existing?: string
        inputRef: { current: HTMLInputElement | null }
        type: 'groom' | 'bride'
        label: string
    }) => {
        const defaultAvatar = type === 'groom' ? defaultGroom : defaultBride

        // Robust check for truthy src that isn't a placeholder string
        const getValidSrc = () => {
            if (preview) return preview;
            if (existing &&
                existing !== "" &&
                existing !== "null" &&
                existing !== "undefined" &&
                !existing.includes("/null") &&
                !existing.includes("/undefined")
            ) {
                return existing;
            }
            return defaultAvatar;
        }

        const finalSrc = getValidSrc()
        const hasPhoto = !!(preview || (finalSrc !== defaultAvatar))

        return (
            <div className="flex flex-col items-center space-y-3">
                <div
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-200 dark:border-slate-700 cursor-pointer group shadow-lg"
                    onClick={() => inputRef.current?.click()}
                >
                    <img
                        src={finalSrc}
                        alt={label}
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 active:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white w-8 h-8" />
                    </div>
                    {!hasPhoto && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                            <div className="bg-primary-500 rounded-full p-1.5">
                                <Camera className="text-white w-4 h-4" />
                            </div>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, type)}
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => inputRef.current?.click()}
                >
                    <Camera className="h-3 w-3 mr-1" />
                    {hasPhoto ? t('changePhoto') : t('uploadPhoto')}
                </Button>
                {!hasPhoto && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Default rasm ishlatiladi</p>
                )}
            </div>
        )
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <PhotoUpload
                            preview={groomPreview}
                            existing={data.groomPictureGetUrl}
                            inputRef={groomInputRef}
                            type="groom"
                            label="Kuyov"
                        />
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('groomName')}
                                </label>
                                <Input
                                    placeholder="Ism"
                                    value={data.groomName}
                                    onChange={(e) => updateData({ groomName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('groomLastname')}
                                </label>
                                <Input
                                    placeholder="Familiya"
                                    value={data.groomLastname}
                                    onChange={(e) => updateData({ groomLastname: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Cake className="h-4 w-4" /> {t('dateOfBirth')}
                                </label>
                                <Input
                                    type="date"
                                    value={data.groomDateOfBirth || ''}
                                    onChange={(e) => updateData({ groomDateOfBirth: e.target.value })}
                                    className="dark:bg-slate-900 dark:border-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <PhotoUpload
                            preview={bridePreview}
                            existing={data.bridePictureGetUrl}
                            inputRef={brideInputRef}
                            type="bride"
                            label="Kelin"
                        />
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('brideName')}
                                </label>
                                <Input
                                    placeholder="Ism"
                                    value={data.brideName}
                                    onChange={(e) => updateData({ brideName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('brideLastname')}
                                </label>
                                <Input
                                    placeholder="Familiya"
                                    value={data.brideLastname}
                                    onChange={(e) => updateData({ brideLastname: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Cake className="h-4 w-4" /> {t('dateOfBirth')}
                                </label>
                                <Input
                                    type="date"
                                    value={data.brideDateOfBirth || ''}
                                    onChange={(e) => updateData({ brideDateOfBirth: e.target.value })}
                                    className="dark:bg-slate-900 dark:border-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> {t('date')}
                                </label>
                                <Input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => updateData({ date: e.target.value })}
                                    required
                                    className="dark:bg-slate-900 dark:border-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> {t('time')}
                                </label>
                                <Input
                                    type="time"
                                    value={data.time}
                                    onChange={(e) => updateData({ time: e.target.value })}
                                    required
                                    className="dark:bg-slate-900 dark:border-slate-700"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {t('hall')}
                                </label>
                                <Input
                                    placeholder="e.g. Grand Hotel"
                                    value={data.hall}
                                    onChange={(e) => updateData({ hall: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {t('location')}
                                </label>
                                <Input
                                    placeholder="e.g. Tashkent, buyuk ipak yo'li"
                                    value={data.location}
                                    onChange={(e) => updateData({ location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Music className="h-4 w-4" /> {t('backgroundMusic')}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {MUSIC_OPTIONS.map((music) => (
                                    <div
                                        key={music.id}
                                        onClick={() => updateData({ backgroundMusic: music.id })}
                                        className={cn(
                                            "flex items-center justify-between p-2.5 rounded-lg border-2 transition-all cursor-pointer",
                                            data.backgroundMusic === music.id
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm"
                                                : "border-gold-100 dark:border-slate-800 hover:border-gold-300 dark:hover:border-slate-700"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {music.id === 'none' ? <VolumeX className="h-4 w-4 text-gray-400" /> : <Volume2 className="h-4 w-4 text-primary-500" />}
                                            <span className="text-xs font-medium">{music.name}</span>
                                        </div>
                                        {music.url && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const audio = document.getElementById(`preview-${music.id}`) as HTMLAudioElement;
                                                    if (playingMusic === music.id) {
                                                        audio.pause(); audio.currentTime = 0; setPlayingMusic(null);
                                                    } else {
                                                        document.querySelectorAll('audio').forEach(a => { a.pause(); a.currentTime = 0; });
                                                        setPlayingMusic(music.id); audio.play();
                                                    }
                                                }}
                                                className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center hover:bg-primary-200 transition-colors"
                                            >
                                                {playingMusic === music.id ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                                                <audio id={`preview-${music.id}`} src={music.url} onEnded={() => setPlayingMusic(null)} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> {t('message')}
                            </label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-gold-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 outline-none transition-all shadow-sm dark:text-white"
                                placeholder={t('message')}
                                value={data.text}
                                onChange={(e) => updateData({ text: e.target.value })}
                            />
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-8 animate-fade-in -mx-5 -mt-2 pb-10">
                        {/* Elegant Header */}
                        <div className="text-center px-5 pt-4 pb-2">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-100 dark:border-primary-800/30 mb-3 shadow-sm"
                            >
                                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                                {t('chooseTemplate')}
                            </motion.div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">{t('chooseTemplate')}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Taklifnomangiz uchun eng go'zal dizaynni tanlang</p>
                        </div>

                        {/* Premium Template List */}
                        <div className="space-y-8 px-4">
                            {templates.map((template, index) => {
                                const isSelected = data.template === template.id
                                const previewInvitation = {
                                    ...data,
                                    groomPictureGetUrl: groomPreview || data.groomPictureGetUrl || undefined,
                                    bridePictureGetUrl: bridePreview || data.bridePictureGetUrl || undefined,
                                }

                                return (
                                    <motion.div
                                        key={template.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative group"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => updateData({ template: template.id })}
                                            className={cn(
                                                "w-full text-left rounded-[2.5rem] overflow-hidden transition-all duration-500 border-[3px] bg-white dark:bg-slate-900 relative",
                                                isSelected
                                                    ? "border-primary-500 shadow-[0_20px_50px_rgba(236,72,153,0.15)] scale-[1.02] ring-8 ring-primary-500/5"
                                                    : "border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:scale-[1.01] hover:border-primary-200 dark:hover:border-primary-900/30"
                                            )}
                                        >
                                            {/* Refined Header */}
                                            <div className={cn(
                                                "flex items-center justify-between px-6 py-4",
                                                isSelected
                                                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                                                    : "bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                                            )}>
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-1.5 h-6 rounded-full",
                                                        isSelected ? "bg-white" : "bg-primary-500"
                                                    )} />
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-sm tracking-tight">{template.name}</span>
                                                        <span className={cn(
                                                            "text-[9px] font-medium uppercase tracking-wider opacity-60",
                                                            isSelected ? "text-white" : "text-slate-500"
                                                        )}>
                                                            {template.type || 'Wedding Design'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {template.category === 'Premium' && (
                                                        <span className={cn(
                                                            "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1",
                                                            isSelected
                                                                ? "bg-white text-primary-600"
                                                                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm"
                                                        )}>
                                                            <Sparkles className="h-2.5 w-2.5" />
                                                            Premium
                                                        </span>
                                                    )}
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                                                        >
                                                            <Check className="h-4 w-4 text-white stroke-[3.5]" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Wedding Card Preview */}
                                            <div className="relative aspect-[4/5] overflow-hidden pointer-events-none group-hover:brightness-[1.02] transition-all duration-500">
                                                <div className="absolute inset-0 scale-[1.01] origin-top">
                                                    <WeddingCard
                                                        invitation={previewInvitation}
                                                        template={template}
                                                    />
                                                </div>
                                                {/* Soft Overlay for unselected cards */}
                                                {!isSelected && (
                                                    <div className="absolute inset-0 bg-slate-900/5 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                                )}
                                            </div>

                                            {/* Subtle indicator for selection */}
                                            {isSelected && (
                                                <div className="absolute top-1/2 left-0 w-1 h-12 bg-white rounded-r-full -translate-y-1/2 z-10" />
                                            )}
                                        </button>

                                        {/* Premium Inline Save & Create Action */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="overflow-hidden px-1"
                                                >
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSubmit(e as any);
                                                        }}
                                                        disabled={isSaving}
                                                        className="w-full h-16 rounded-[1.8rem] bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-[length:200%_auto] animate-shimmer text-white font-black text-base shadow-2xl shadow-primary-200 dark:shadow-none flex items-center justify-center gap-3 border-[3px] border-white/30 hover:scale-[0.99] transition-transform active:scale-95 overflow-hidden group/btn"
                                                    >
                                                        {isSaving ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                                <span className="animate-pulse tracking-wide">{t('saving')}</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Check className="h-6 w-6 stroke-[3.5] transition-transform group-hover/btn:scale-110" />
                                                                <span className="tracking-tight">Saqlash va Yaratish</span>
                                                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                )
        }
    }

    return (
        <>
            {/* Crop Modal */}
            {cropSource && cropTarget && (
                <CropModal
                    imageSrc={cropSource}
                    onCropDone={handleCropDone}
                    onCancel={handleCropCancel}
                />
            )}

            <div className="container mx-auto px-4 py-6 max-w-2xl min-h-screen flex flex-col">
                {/* Step Indicator */}
                <div className="flex justify-between mb-6 relative px-4">
                    <div className="absolute top-5 left-[15%] right-[15%] h-0.5 bg-gold-100 dark:bg-slate-800"></div>
                    {STEPS.map((step, idx) => (
                        <button
                            key={step}
                            type="button"
                            onClick={() => setCurrentStep(idx)}
                            className="flex flex-col items-center relative z-10 group cursor-pointer transition-transform active:scale-95"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
                                currentStep === idx
                                    ? "bg-primary-500 text-white border-primary-500 scale-110 shadow-lg shadow-primary-200"
                                    : currentStep > idx
                                        ? "bg-primary-400 text-white border-primary-400 group-hover:bg-primary-500 group-hover:border-primary-500"
                                        : "bg-white dark:bg-slate-900 text-gold-400 border-gold-200 dark:border-slate-700 group-hover:border-gold-300"
                            )}>
                                {currentStep > idx ? '✓' : idx + 1}
                            </div>
                            <span className={cn(
                                "text-[10px] sm:text-xs mt-2 font-medium text-center max-w-[80px] transition-colors",
                                currentStep === idx ? "text-primary-600 dark:text-primary-400 font-bold" : "text-gray-400 group-hover:text-gray-500"
                            )}>
                                {t(step)}
                            </span>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex-grow">
                    <Card className="shadow-xl border-gold-100 dark:border-slate-800 overflow-hidden">
                        <CardContent className="p-5">
                            {displayError && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                    {displayError}
                                </div>
                            )}
                            {renderStep()}
                        </CardContent>
                        {currentStep < 3 && (
                            <CardFooter className="flex justify-between border-t border-gold-100 dark:border-slate-800 bg-gold-50/30 dark:bg-slate-900/20 p-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={currentStep === 0 ? () => navigate("/") : prevStep}
                                >
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    {currentStep === 0 ? t('cancel') : t('back')}
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {currentStep === 2 ? t('chooseTemplate') : <>{t('next')} <ChevronRight className="ml-1 h-4 w-4" /></>}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </form>
            </div>
        </>
    )
}
