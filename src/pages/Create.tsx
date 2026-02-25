import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useInvitation } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Calendar, MapPin, MessageSquare, Users, Clock, Camera, ChevronRight, ChevronLeft, Music, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { cn } from "../lib/utils"
import { useTelegram } from "../hooks/useTelegram"
import { api } from "../lib/api"

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

const STEPS = ['groomInfo', 'brideInfo', 'weddingInfo'] as const;

export function Create() {
    const navigate = useNavigate()
    const { data, updateData, saveInvitation, error: contextError } = useInvitation()
    const { t } = useLanguage()
    const { user: tgUser } = useTelegram()

    const [currentStep, setCurrentStep] = useState(0)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [playingMusic, setPlayingMusic] = useState<string | null>(null)

    const groomInputRef = useRef<HTMLInputElement>(null)
    const brideInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'groom' | 'bride') => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setSaveError(null)

        try {
            // First we need to get the upload URLs by calling init with empty data or just the names
            // Actually, the API says init returns the PutUrls. 
            // So we call init with current data to get the URLs.
            const result = await api.saveInvitation({
                ...data,
                creatorUser: tgUser
            })

            if (result && (type === 'groom' ? result.groomPicturePutUrl : result.bridePicturePutUrl)) {
                const putUrl = type === 'groom' ? result.groomPicturePutUrl : result.bridePicturePutUrl
                const getUrl = type === 'groom' ? result.groomPictureGetUrl : result.bridePictureGetUrl
                const key = type === 'groom' ? result.groomPictureKey : result.bridePictureKey

                // Upload to S3
                await api.uploadImage(file, putUrl)

                // Update context with the new data from backend (keys and getUrls)
                updateData({
                    id: result.id,
                    [`${type}PictureKey`]: key,
                    [`${type}PictureGetUrl`]: getUrl,
                })
            }
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Rasm yuklashda xatolik yuz berdi.";
            setSaveError(errorMsg)
        } finally {
            setIsUploading(false)
        }
    }

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (currentStep < STEPS.length - 1) {
            nextStep()
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            const finalData = {
                ...data,
                template: data.template || 'classic',
                creatorUser: tgUser
            }

            const id = await saveInvitation(finalData)
            if (id) {
                navigate(`/invitation/${id}`)
            }
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Server bilan bog'lanishda xatolik yuz berdi.";
            setSaveError(errorMsg)
        } finally {
            setIsSaving(false)
        }
    }

    const displayError = saveError || contextError;

    const renderStep = () => {
        switch (currentStep) {
            case 0: // Groom Info
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex flex-col items-center space-y-4">
                            <div
                                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gold-200 dark:border-slate-700 bg-gold-50 dark:bg-slate-800 cursor-pointer group"
                                onClick={() => groomInputRef.current?.click()}
                            >
                                {data.groomPictureGetUrl ? (
                                    <img src={data.groomPictureGetUrl} alt="Groom" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gold-400">
                                        <Users className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={groomInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'groom')}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => groomInputRef.current?.click()}
                            >
                                {data.groomPictureGetUrl ? t('changePhoto') : t('uploadPhoto')}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('groomName')}
                                </label>
                                <Input
                                    placeholder="John"
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
                                    placeholder="Doe"
                                    value={data.groomLastname}
                                    onChange={(e) => updateData({ groomLastname: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )
            case 1: // Bride Info
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex flex-col items-center space-y-4">
                            <div
                                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gold-200 dark:border-slate-700 bg-gold-50 dark:bg-slate-800 cursor-pointer group"
                                onClick={() => brideInputRef.current?.click()}
                            >
                                {data.bridePictureGetUrl ? (
                                    <img src={data.bridePictureGetUrl} alt="Bride" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gold-400">
                                        <Users className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={brideInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'bride')}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => brideInputRef.current?.click()}
                            >
                                {data.bridePictureGetUrl ? t('changePhoto') : t('uploadPhoto')}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('brideName')}
                                </label>
                                <Input
                                    placeholder="Sarah"
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
                                    placeholder="Algorithm"
                                    value={data.brideLastname}
                                    onChange={(e) => updateData({ brideLastname: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )
            case 2: // Wedding Info
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
                                            "flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer",
                                            data.backgroundMusic === music.id
                                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
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
                                                        audio.pause();
                                                        audio.currentTime = 0;
                                                        setPlayingMusic(null);
                                                    } else {
                                                        document.querySelectorAll('audio').forEach(a => { a.pause(); a.currentTime = 0; });
                                                        setPlayingMusic(music.id);
                                                        audio.play();
                                                    }
                                                }}
                                                className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center"
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
                                className="flex min-h-[80px] w-full rounded-md border border-gold-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 outline-none transition-all shadow-sm"
                                placeholder={t('message')}
                                value={data.text}
                                onChange={(e) => updateData({ text: e.target.value })}
                            />
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen flex flex-col">
            <h1 className="text-3xl font-serif font-bold text-center text-primary-800 dark:text-primary-300 mb-8">
                {t('createTitle')}
            </h1>

            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gold-100 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
                {STEPS.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
                            currentStep === idx
                                ? "bg-primary-500 text-white border-primary-500 scale-110 shadow-lg"
                                : currentStep > idx
                                    ? "bg-gold-500 text-white border-gold-500"
                                    : "bg-white dark:bg-slate-900 text-gold-400 border-gold-200 dark:border-slate-800"
                        )}>
                            {idx + 1}
                        </div>
                        <span className={cn(
                            "text-[10px] sm:text-xs mt-2 font-medium",
                            currentStep === idx ? "text-primary-600 dark:text-primary-400" : "text-gray-400"
                        )}>
                            {t(step)}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-grow">
                <Card className="shadow-xl border-gold-100 dark:border-slate-800 overflow-hidden">
                    <CardHeader className="bg-gold-50/50 dark:bg-slate-900/50 border-b border-gold-100 dark:border-slate-800">
                        <CardTitle className="text-xl font-serif text-gold-900 dark:text-gold-200">{t(STEPS[currentStep])}</CardTitle>
                        <CardDescription>{t('step')} {currentStep + 1} / 3</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {displayError && (
                            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {displayError}
                            </div>
                        )}
                        {renderStep()}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-gold-100 dark:border-slate-800 bg-gold-50/30 dark:bg-slate-900/20 p-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={currentStep === 0 ? () => navigate("/") : prevStep}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            {currentStep === 0 ? t('cancel') : t('back')}
                        </Button>
                        <Button type="submit" disabled={isSaving || isUploading}>
                            {currentStep === STEPS.length - 1
                                ? (isSaving ? t('saving') : t('previewBtn'))
                                : <>{t('next')} <ChevronRight className="ml-2 h-4 w-4" /></>}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
