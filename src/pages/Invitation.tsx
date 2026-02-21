import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useInvitation, type InvitationData } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Heart, Download, Palette, X, Sparkles, Clock, User, MapPin, Calendar } from "lucide-react"
import { cn } from "../lib/utils"
import { templates } from "../lib/templates"
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { useLanguage } from "../context/LanguageContext"
import { api } from "../lib/api"
import { motion, AnimatePresence } from "framer-motion"

export function Invitation() {
    const { id } = useParams<{ id: string }>()
    const { getInvitation, updateData, saveInvitation, loading: contextLoading, error: contextError } = useInvitation()
    const { t } = useLanguage()
    const [invitation, setInvitation] = useState<InvitationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showTemplates, setShowTemplates] = useState(false)
    const [wishes, setWishes] = useState<any[]>([])
    const [newWish, setNewWish] = useState("")
    const [senderName, setSenderName] = useState("")

    // Ref for the invitation card to capture as image
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadInvitation = async () => {
            console.log("DEBUG: Invitation component loading with ID:", id);
            if (id) {
                try {
                    const data = await getInvitation(id)
                    console.log("DEBUG: getInvitation result:", data);
                    setInvitation(data)

                    const wishesData = await api.getWishes(id)
                    console.log("DEBUG: getWishes result:", wishesData);
                    setWishes(wishesData || [])
                } catch (err) {
                    console.error("DEBUG: Failed to load invitation or wishes:", err)
                }
            }
            setLoading(false)
        }
        loadInvitation()
    }, [id])

    const handleTemplateChange = async (template: string) => {
        if (invitation && id) {
            const updated = { ...invitation, template }
            setInvitation(updated)
            updateData({ template })
            await saveInvitation(updated)
        }
    }

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
                download(dataUrl, 'my-wedding-invitation.png');
            } catch (err) {
                console.error('oops, something went wrong!', err);
            }
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Wedding Invitation',
                    text: `You are invited to the wedding of ${invitation?.brideName} ${invitation?.brideLastname} & ${invitation?.groomName} ${invitation?.groomLastname}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link nusxalandi!");
        }
    }

    const handlePostWish = async () => {
        if (!newWish.trim() || !senderName.trim() || !id) return;

        try {
            const result = await api.postWish(Number(id), newWish, senderName);
            setWishes([result, ...wishes]);
            setNewWish("");
        } catch (err) {
            console.error("Failed to post wish:", err);
        }
    }

    if (loading || contextLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background transition-colors duration-500">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <Heart className="h-12 w-12 text-primary-300" />
                    <p className="text-gray-400 dark:text-gray-500 font-medium">{t('loading')}</p>
                </div>
            </div>
        )
    }

    if (contextError || (!invitation && !loading)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4 text-center bg-background transition-colors duration-500">
                <h1 className="text-2xl font-serif text-gold-900 dark:text-gold-200 font-bold">{t('invitationNotFound')}</h1>
                <p className="text-gold-600 dark:text-gold-400 font-light">{t('invitationNotFoundDesc')}</p>
                <Link to="/create">
                    <Button variant="primary">{t('createNew')}</Button>
                </Link>
            </div>
        )
    }

    if (!invitation) return null

    return (
        <div className="min-h-screen flex flex-col items-center relative pb-10 bg-gradient-to-b from-[#fff5f5] via-[#fffdf9] to-[#fffef2] dark:from-slate-950 dark:to-slate-900 transition-colors duration-500 overflow-y-auto overflow-x-hidden">

            {/* Toolbar - Only Templates Selector */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-24 z-50 flex items-center bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-2xl border border-white dark:border-slate-800"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 hover:text-pink-600 transition-all p-2 px-4 h-10"
                    onClick={() => setShowTemplates(!showTemplates)}
                >
                    <Palette className="h-5 w-5" />
                    <span>Andozalar</span>
                </Button>
            </motion.div>

            {/* Template Chooser Drawer */}
            <AnimatePresence>
                {showTemplates && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm"
                            onClick={() => setShowTemplates(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="fixed inset-x-0 bottom-0 z-[70] bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl p-8 pb-32 max-h-[60vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6 px-2">
                                <h3 className="font-serif text-xl font-bold dark:text-white">{t('chooseStyle')}</h3>
                                <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {templates.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleTemplateChange(theme.id)}
                                        className={cn(
                                            "relative overflow-hidden rounded-2xl border-2 transition-all aspect-[3/4] group",
                                            (invitation.template || 'classic') === theme.id
                                                ? "border-primary-500 ring-4 ring-primary-50"
                                                : "border-transparent opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                                        )}
                                    >
                                        <img src={theme.thumbnail} alt={theme.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute bottom-3 left-3 text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                                            {theme.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content View (v3 Scaling Restored) */}
            <div
                ref={cardRef}
                className="w-full max-w-[420px] flex flex-col items-center py-8 px-6 relative z-10"
            >
                {/* Header Decoration */}
                <div className="mb-4 text-center">
                    <div className="flex justify-center mb-1">
                        <Sparkles className="h-6 w-6 text-[#f472b6] opacity-60" />
                    </div>
                    <p className="text-[10px] tracking-[0.6em] text-gray-400 uppercase ml-2">
                        TO'Y TAKLIFI
                    </p>
                </div>

                {/* Avatar Section - v3 sizes */}
                <div className="flex items-center justify-center mb-8 gap-2">
                    <div className="flex flex-col items-center">
                        <div className="relative p-1 bg-white dark:bg-slate-800 rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]">
                            <div className="h-24 w-24 rounded-full border-4 border-[#ffdde1] overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                                <User className="h-12 w-12 text-gray-200" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#f472b6] text-white text-[8px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                                Kuyov
                            </div>
                        </div>
                    </div>

                    <div className="px-1 text-[#f472b6]">
                        <Heart className="h-8 w-8 fill-current" />
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative p-1 bg-white dark:bg-slate-800 rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]">
                            <div className="h-24 w-24 rounded-full border-4 border-[#ffdde1] overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                                <User className="h-12 w-12 text-gray-200" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#f472b6] text-white text-[8px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                                Kelin
                            </div>
                        </div>
                    </div>
                </div>

                {/* Names & Subtext - v3 sizes */}
                <div className="text-center space-y-1 mb-8">
                    <h1 className="font-serif text-3xl md:text-4xl text-[#7e22ce] dark:text-white flex items-center justify-center gap-2">
                        {invitation?.brideName} <span className="text-[#f472b6] italic">&</span> {invitation?.groomName}
                    </h1>
                    <p className="text-[11px] text-pink-600/70 dark:text-pink-400/70 font-medium italic">
                        Oilalari sizni to'yga taklif qiladi
                    </p>
                </div>

                {/* Main Info Card - v3 sizes */}
                <div className="w-full bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-[0_20px_40px_-10px_rgba(244,114,182,0.15)] space-y-5 border border-white dark:border-slate-800">
                    <div className="flex flex-col items-center gap-1 mb-1">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                            <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-gray-800 dark:text-white mt-1 uppercase tracking-widest">To'y marosimi</h3>
                    </div>

                    {/* Date/Time Row */}
                    <div className="flex justify-between items-center bg-[#fff5f7] dark:bg-pink-900/10 rounded-3xl p-5 px-10">
                        <div className="text-center">
                            <p className="text-2xl font-serif font-black text-[#ec4899] leading-none mb-1">
                                {invitation?.date ? (invitation.date.includes('-') ? invitation.date.split('-')[2] : invitation.date.split(' ')[0]) : '28'}
                            </p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-[#f87171]">
                                {invitation?.date ? (invitation.date.includes('-') ? new Date(invitation.date).toLocaleString('default', { month: 'long' }) : invitation.date.split(' ')[1]) : 'February'}
                            </p>
                            <p className="text-[8px] text-gray-400 mt-0.5">2026</p>
                        </div>
                        <div className="w-px h-10 bg-pink-200/50 dark:bg-pink-800/20" />
                        <div className="flex flex-col items-center gap-1">
                            <Clock className="h-4 w-4 text-[#ec4899] opacity-40 mb-1" />
                            <span className="text-xl font-black text-[#ec4899]">
                                {invitation?.time || '18:00'}
                            </span>
                        </div>
                    </div>

                    {/* Location Box */}
                    <div className="bg-[#fffbeb] dark:bg-orange-900/10 rounded-2xl p-4 flex items-center gap-4 border border-orange-50 dark:border-orange-900/20">
                        <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                                {invitation?.hall || 'Mumtoz to\'yxonasi'}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                                {invitation?.location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions & Wishes Section - Below Card */}
            <div className="w-full max-w-[420px] px-6 space-y-8 pb-32 relative z-10">
                {/* Download & Share Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        className="flex-1 h-12 rounded-2xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800 font-bold text-gray-600 dark:text-gray-300 gap-2 shadow-sm"
                        onClick={handleDownload}
                    >
                        <Download className="h-5 w-5 text-pink-500" />
                        <span>Yuklab olish</span>
                    </Button>
                    <Button
                        className="flex-1 h-12 rounded-2xl bg-[#ec4899] hover:bg-[#db2777] text-white font-bold shadow-lg shadow-pink-200 gap-2"
                        onClick={handleShare}
                    >
                        <Heart className="h-5 w-5 fill-current" />
                        <span>Ulashish</span>
                    </Button>
                </div>

                {/* Wishes Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-px bg-pink-500 rounded-full" />
                        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Tabrik yo'llash</h2>
                    </div>

                    {/* Wish Form */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-white dark:border-slate-800 space-y-4">
                        <Input
                            placeholder="Ismingiz"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border-none h-12 px-4 focus:ring-2 focus:ring-pink-200 dark:text-white outline-none"
                        />
                        <textarea
                            placeholder="Tabrik so'zlari..."
                            value={newWish}
                            onChange={(e) => setNewWish(e.target.value)}
                            className="w-full min-h-[100px] bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border-none p-4 focus:ring-2 focus:ring-pink-200 resize-none text-sm dark:text-white outline-none"
                        />
                        <Button
                            onClick={handlePostWish}
                            className="w-full h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-lg shadow-pink-100"
                            disabled={!newWish.trim() || !senderName.trim()}
                        >
                            Yuborish
                        </Button>
                    </div>

                    {/* Wishes List */}
                    <div className="space-y-4">
                        {wishes.length === 0 ? (
                            <p className="text-center text-gray-400 italic py-8">Hali tabriklar yo'q. Birinchilardan bo'ling!</p>
                        ) : (
                            wishes.map((wish, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-5 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-[28px] border border-white/50 dark:border-slate-800/50 flex gap-4"
                                >
                                    <div className="h-12 w-12 shrink-0 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-500 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                                        {wish.author?.[0]?.toUpperCase() || 'G'}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900 dark:text-white">{wish.author}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">"{wish.text}"</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-x-0 top-0 h-full bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-20 pointer-events-none z-0" />
        </div>
    )
}
