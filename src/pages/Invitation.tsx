import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useInvitation, type InvitationData } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Heart, Download, Palette, X, MessageSquare, Send, Music, Sparkles, Clock, User, MapPin, Calendar } from "lucide-react"
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
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState<any[]>([])
    const [newComment, setNewComment] = useState("")
    const [senderName, setSenderName] = useState("")
    const [isMusicPlaying, setIsMusicPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    // Ref for the invitation card to capture as image
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadInvitation = async () => {
            if (id) {
                const data = await getInvitation(id)
                setInvitation(data)

                try {
                    const commentsData = await api.getComments(id)
                    setComments(commentsData || [])
                } catch (err) {
                    console.error("Failed to fetch comments:", err)
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

    const handlePostComment = async () => {
        if (!newComment.trim() || !senderName.trim() || !id) return;

        try {
            const result = await api.postComment(id, newComment, senderName);
            setComments([result, ...comments]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to post comment:", err);
        }
    }

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsMusicPlaying(!isMusicPlaying);
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
        <div className="min-h-[calc(100vh-130px)] flex flex-col items-center relative pb-32 bg-gradient-to-b from-[#fff5f5] via-[#fffdf9] to-[#fffef2] dark:from-slate-950 dark:to-slate-900 transition-colors duration-500">
            {/* Background Music Audio Element */}
            <audio
                ref={audioRef}
                loop
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            />

            {/* Toolbar - Positioned above BottomNav (approx 80px) */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-24 z-50 flex items-center gap-2 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "flex flex-col h-auto gap-1 p-2 text-[9px] uppercase font-bold transition-all",
                        isMusicPlaying ? "text-primary-600" : "text-gray-400"
                    )}
                    onClick={toggleMusic}
                >
                    <Music className={cn("h-4 w-4", isMusicPlaying && "animate-pulse")} />
                </Button>
                <div className="w-px h-6 bg-gray-100 dark:bg-slate-800"></div>

                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "flex flex-col h-auto gap-1 p-2 text-[9px] uppercase font-bold transition-all",
                        showComments ? "text-primary-600" : "text-gray-400"
                    )}
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageSquare className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-[9px] uppercase font-bold text-gray-400"
                    onClick={() => {
                        setShowTemplates(!showTemplates)
                        setShowComments(false)
                    }}
                >
                    <Palette className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-[9px] uppercase font-bold text-gray-400"
                    onClick={handleDownload}
                >
                    <Download className="h-4 w-4" />
                </Button>

                <Button
                    className="h-10 px-6 rounded-xl bg-[#ec4899] hover:bg-[#db2777] text-white font-bold text-xs shadow-lg shadow-pink-200"
                    onClick={handleShare}
                >
                    {t('share')}
                </Button>
            </motion.div>

            {/* Drawers */}
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
                                {templates.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleTemplateChange(t.id)}
                                        className={cn(
                                            "relative overflow-hidden rounded-2xl border-2 transition-all aspect-[3/4] group",
                                            (invitation.template || 'classic') === t.id
                                                ? "border-primary-500 ring-4 ring-primary-50"
                                                : "border-transparent opacity-70 grayscale hover:grayscale-0 hover:opacity-100"
                                        )}
                                    >
                                        <img src={t.thumbnail} alt={t.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20" />
                                        <div className="absolute bottom-3 left-3 text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                                            {t.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}

                {showComments && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm"
                            onClick={() => setShowComments(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="fixed inset-x-0 bottom-0 z-[70] bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl p-8 pb-10 max-h-[80vh] overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6 px-2 shrink-0">
                                <h3 className="font-serif text-xl font-bold dark:text-white">{t('congratulations')}</h3>
                                <button onClick={() => setShowComments(false)} className="p-2 rounded-full transition-colors">
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                                {comments.length === 0 ? (
                                    <div className="text-center py-10 opacity-40 italic text-sm">Hali tabriklar yo'q. Birinchilardan bo'ling!</div>
                                ) : (
                                    comments.map((comment, i) => (
                                        <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-start gap-4">
                                            <div className="h-10 w-10 shrink-0 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center font-bold">
                                                {comment.senderName?.[0]?.toUpperCase() || 'G'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{comment.senderName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic leading-relaxed">"{comment.text}"</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="space-y-3 shrink-0 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-gray-100 dark:border-slate-800">
                                <Input
                                    placeholder={t('name')}
                                    value={senderName}
                                    onChange={(e) => setSenderName(e.target.value)}
                                    className="rounded-xl border-none shadow-sm h-11"
                                />
                                <div className="flex gap-2">
                                    <Input
                                        placeholder={t('addComment')}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="rounded-xl border-none shadow-sm flex-1 h-11"
                                    />
                                    <Button
                                        onClick={handlePostComment}
                                        className="rounded-xl bg-pink-500 hover:bg-pink-600 h-11 w-11 p-0 shadow-lg shadow-pink-100"
                                        disabled={!newComment.trim() || !senderName.trim()}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content View (v4 Scaled Down) */}
            <div
                ref={cardRef}
                className="flex-1 w-full max-w-[400px] flex flex-col items-center py-4 px-6 relative z-10"
            >
                {/* Header Decoration */}
                <div className="mb-2 text-center">
                    <div className="flex justify-center mb-0.5">
                        <Sparkles className="h-5 w-5 text-[#f472b6] opacity-60" />
                    </div>
                    <p className="text-[9px] tracking-[0.5em] text-gray-400 uppercase ml-1.5">
                        TO'Y TAKLIFI
                    </p>
                </div>

                {/* Avatar Section - Scaled down */}
                <div className="flex items-center justify-center mb-4 gap-2">
                    <div className="flex flex-col items-center">
                        <div className="relative p-0.5 bg-white dark:bg-slate-800 rounded-full shadow-md">
                            <div className="h-20 w-20 rounded-full border-[3px] border-[#ffdde1] overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                                <User className="h-10 w-10 text-gray-200" />
                            </div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#f472b6] text-white text-[7px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                                Kuyov
                            </div>
                        </div>
                    </div>

                    <div className="px-1 text-[#f472b6]">
                        <Heart className="h-6 w-6 fill-current" />
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative p-0.5 bg-white dark:bg-slate-800 rounded-full shadow-md">
                            <div className="h-20 w-20 rounded-full border-[3px] border-[#ffdde1] overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                                <User className="h-10 w-10 text-gray-200" />
                            </div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#f472b6] text-white text-[7px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                                Kelin
                            </div>
                        </div>
                    </div>
                </div>

                {/* Names & Subtext - Scaled down */}
                <div className="text-center space-y-0.5 mb-4">
                    <h1 className="font-serif text-2xl md:text-3xl text-[#7e22ce] dark:text-white flex items-center justify-center gap-2">
                        {invitation?.brideName} <span className="text-[#f472b6] italic">&</span> {invitation?.groomName}
                    </h1>
                    <p className="text-[10px] text-pink-600/70 dark:text-pink-400/70 font-medium italic">
                        Oilalari sizni to'yga taklif qiladi
                    </p>
                </div>

                {/* Main Info Card - Scaled down */}
                <div className="w-full bg-white dark:bg-slate-900 rounded-[28px] p-5 shadow-[0_15px_30px_-10px_rgba(244,114,182,0.12)] space-y-4 border border-white dark:border-slate-800">
                    <div className="flex flex-col items-center gap-0.5 mb-0.5">
                        <div className="h-8 w-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-md transform rotate-2">
                            <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-[10px] font-bold text-gray-800 dark:text-white mt-1 uppercase tracking-widest">To'y marosimi</h3>
                    </div>

                    {/* Date/Time Row */}
                    <div className="flex justify-between items-center bg-[#fff5f7] dark:bg-pink-900/10 rounded-2xl p-4 px-8">
                        <div className="text-center">
                            <p className="text-xl font-serif font-black text-[#ec4899] leading-none mb-0.5">
                                {invitation?.date?.split(' ')[0] || '28'}
                            </p>
                            <p className="text-[9px] uppercase font-bold tracking-widest text-[#f87171]">
                                {invitation?.date?.split(' ')[1] || 'February'}
                            </p>
                            <p className="text-[7px] text-gray-400">2026</p>
                        </div>
                        <div className="w-px h-8 bg-pink-200/50 dark:bg-pink-800/20" />
                        <div className="flex flex-col items-center gap-0.5">
                            <Clock className="h-3.5 w-3.5 text-[#ec4899] opacity-40 mb-0.5" />
                            <span className="text-lg font-black text-[#ec4899]">
                                {invitation?.time || '18:00'}
                            </span>
                        </div>
                    </div>

                    {/* Location Box */}
                    <div className="bg-[#fffbeb] dark:bg-orange-900/10 rounded-xl p-3 flex items-center gap-3 border border-orange-50 dark:border-orange-900/20">
                        <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
                            <MapPin className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 dark:text-white truncate">
                                {invitation?.hall || 'Mumtoz to\'yxonasi'}
                            </p>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate leading-tight">
                                {invitation?.location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Graphic */}
                <div className="opacity-10 py-2">
                    <Heart className="h-6 w-6 text-[#f472b6]" />
                </div>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-20 pointer-events-none" />
        </div>
    )
}
