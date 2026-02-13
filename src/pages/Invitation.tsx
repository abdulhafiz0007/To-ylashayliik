import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useInvitation, type InvitationData } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card } from "../components/ui/Card"
import { Heart, Download, Palette, X, MessageSquare, Send, Music } from "lucide-react"
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

    const currentTemplate = templates.find(t => t.id === (invitation.template || 'classic')) || templates[0]

    return (
        <div className="min-h-screen bg-[#faf9f6] dark:bg-slate-950 py-12 px-4 pb-64 flex flex-col items-center relative transition-colors duration-500">
            {/* Background Music Audio Element */}
            <audio
                ref={audioRef}
                loop
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            />

            {/* Toolbar */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-24 z-50 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800"
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
                    className="flex flex-col h-auto gap-1 p-2 text-[9px] uppercase font-bold text-gray-400"
                    onClick={() => setShowTemplates(!showTemplates)}
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
                    className="h-10 px-6 rounded-xl bg-primary-600 text-white font-bold text-xs shadow-lg shadow-primary-200"
                    onClick={handleShare}
                >
                    {t('share')}
                </Button>
            </motion.div>

            {/* Template Selection Drawer */}
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
                            className="fixed inset-x-0 bottom-16 z-[70] bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl p-8 pb-32 max-h-[60vh] overflow-y-auto"
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
            </AnimatePresence>

            {/* Main Invitation Card (Redesigned Compact Version) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                ref={cardRef}
                className={cn(
                    "w-full max-w-[380px] min-h-[580px] bg-white dark:bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden relative border border-gray-100/50 dark:border-slate-800",
                    currentTemplate.wrapperClass
                )}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-200 via-primary-500 to-primary-200 opacity-20" />

                <div className="p-10 flex flex-col items-center text-center h-full relative z-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="inline-block p-1 border border-primary-100 rounded-full mb-4">
                            <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-full">
                                <Heart className="h-5 w-5 text-primary-500 fill-primary-500" />
                            </div>
                        </div>
                        <p className={cn("text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 dark:text-gray-500", currentTemplate.introClass)}>
                            {t('weddingOf')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-1 mb-8 w-full"
                    >
                        <h1 className={cn("font-serif text-3xl md:text-4xl text-gray-900 dark:text-white leading-tight", currentTemplate.namesClass)}>
                            {invitation.brideName}
                        </h1>
                        <span className={cn("block text-primary-400 font-serif italic text-2xl", currentTemplate.ampersandClass)}>&</span>
                        <h1 className={cn("font-serif text-3xl md:text-4xl text-gray-900 dark:text-white leading-tight", currentTemplate.namesClass)}>
                            {invitation.groomName}
                        </h1>
                    </motion.div>

                    {invitation.text && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className={cn("text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-10 px-4 font-light italic", currentTemplate.messageClass)}
                        >
                            "{invitation.text}"
                        </motion.p>
                    )}

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={cn("w-full py-8 border-y border-gray-50 dark:border-slate-800 space-y-6", currentTemplate.detailsClass)}
                    >
                        <div className="flex justify-between px-4">
                            <div className="text-left">
                                <span className="block text-[8px] uppercase tracking-[0.3em] text-gray-400 mb-1">KUN</span>
                                <span className="text-lg font-serif font-bold text-gray-800 dark:text-white">{invitation.date}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[8px] uppercase tracking-[0.3em] text-gray-400 mb-1">VAQT</span>
                                <span className="text-lg font-serif font-bold text-gray-800 dark:text-white">{invitation.time}</span>
                            </div>
                        </div>

                        <div className="px-4 text-center">
                            <span className="block text-[8px] uppercase tracking-[0.3em] text-gray-400 mb-1">MANZIL</span>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {invitation.hall && <span className="block text-primary-600 font-bold mb-0.5">{invitation.hall}</span>}
                                {invitation.location}
                            </p>
                        </div>
                    </motion.div>

                    <div className="mt-10 opacity-30">
                        <Heart className="h-4 w-4 text-gray-300" />
                    </div>
                </div>

                {/* Background Pattern/Texture overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-10 pointer-events-none" />
            </motion.div>

            {/* Comments Section */}
            <div className="w-full max-w-lg mt-12 space-y-6 animate-slide-up">
                <div className="flex items-center gap-2 px-2">
                    <MessageSquare className="h-6 w-6 text-primary-500" />
                    <h2 className="text-2xl font-serif font-bold dark:text-white">{t('congratulations')}</h2>
                </div>

                {/* Comment Box */}
                <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-lg rounded-[24px]">
                    <div className="space-y-4">
                        <Input
                            placeholder={t('name')}
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="bg-gray-50 border-none rounded-xl"
                        />
                        <div className="relative">
                            <textarea
                                placeholder={t('addComment')}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full min-h-[100px] p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl resize-none border-none focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                            />
                            <Button
                                onClick={handlePostComment}
                                disabled={!newComment.trim() || !senderName.trim()}
                                className="absolute bottom-4 right-4 h-10 w-10 p-0 rounded-full shadow-lg"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.map((comment, i) => (
                        <motion.div
                            key={comment.id || i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-none rounded-2xl">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-gray-900 dark:text-white">{comment.senderName}</span>
                                    <span className="text-[10px] text-gray-400 capitalize">
                                        {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                                    "{comment.text}"
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                    {comments.length === 0 && (
                        <p className="text-center text-gray-400 font-light italic">Hozircha tabriklar yo'q. Birinchilardan bo'ling!</p>
                    )}
                </div>
            </div>
        </div>
    )
}
