import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useInvitation, type InvitationData } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card } from "../components/ui/Card"
import { Heart, Download, Share2, Palette, X, MessageSquare, Send, Music2, Music } from "lucide-react"
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
        <div className="min-h-screen bg-background dark:bg-slate-950 py-8 px-4 pb-64 flex flex-col items-center relative transition-colors duration-500">
            {/* Background Music Audio Element */}
            <audio
                ref={audioRef}
                loop
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            />

            {/* Toolbar */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-24 z-50 flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-full shadow-2xl border border-gold-200 dark:border-slate-800"
            >
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "flex flex-col h-auto gap-1 p-2 text-[10px] uppercase font-bold transition-all",
                        isMusicPlaying ? "text-primary-600 dark:text-primary-400" : "text-gray-400"
                    )}
                    onClick={toggleMusic}
                >
                    {isMusicPlaying ? <Music2 className="h-5 w-5 animate-bounce" /> : <Music className="h-5 w-5" />}
                    {t('backgroundMusic')}
                </Button>
                <div className="w-px h-8 bg-gold-200 dark:bg-slate-800"></div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-[10px] uppercase font-bold text-gray-500"
                    onClick={() => setShowTemplates(!showTemplates)}
                >
                    <Palette className="h-5 w-5" />
                    {t('style')}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-[10px] uppercase font-bold text-gray-500"
                    onClick={handleDownload}
                >
                    <Download className="h-5 w-5" />
                    {t('save')}
                </Button>
                <Button
                    className="flex flex-col h-auto gap-1 p-2 text-[10px] uppercase font-bold bg-primary-600 text-white rounded-full px-6"
                    onClick={handleShare}
                >
                    <Share2 className="h-5 w-5" />
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
                            className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
                            onClick={() => setShowTemplates(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="fixed inset-x-0 bottom-16 z-40 bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl p-6 pb-24 max-h-[70vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-serif text-2xl font-bold dark:text-white">{t('chooseStyle')}</h3>
                                <button onClick={() => setShowTemplates(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full">
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {templates.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleTemplateChange(t.id)}
                                        className={cn(
                                            "relative overflow-hidden group rounded-2xl border-2 transition-all aspect-[4/3]",
                                            (invitation.template || 'classic') === t.id
                                                ? "border-primary-500 scale-[1.02]"
                                                : "border-transparent opacity-80"
                                        )}
                                    >
                                        <img src={t.thumbnail} alt={t.name} className="h-full w-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-[10px] font-bold uppercase truncate">
                                            {t.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Invitation Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                ref={cardRef}
                className={cn(
                    "w-full max-w-lg shadow-2xl overflow-hidden relative transition-all duration-700 bg-cover bg-center min-h-[700px] flex flex-col rounded-3xl",
                    currentTemplate.wrapperClass
                )}
                style={currentTemplate.backgroundImage ? { backgroundImage: `url(${currentTemplate.backgroundImage})` } : {}}
            >
                {/* Decorative Overlay */}
                {currentTemplate.overlayClass && (
                    <div className={currentTemplate.overlayClass} />
                )}

                <div className="h-full p-8 md:p-14 text-center flex flex-col justify-between relative z-10 flex-1">
                    <div className="space-y-6 md:space-y-8 mt-12">
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className={cn("transition-all duration-500 font-serif italic tracking-widest", currentTemplate.introClass)}
                        >
                            {t('weddingOf')}
                        </motion.p>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className={cn("transition-all duration-500 break-words font-serif", currentTemplate.namesClass)}
                        >
                            <span className="block mb-2">{invitation.brideName} {invitation.brideLastname}</span>
                            <span className={cn("block font-normal", currentTemplate.ampersandClass)}>&</span>
                            <span className="block mt-2">{invitation.groomName} {invitation.groomLastname}</span>
                        </motion.div>
                    </div>

                    <div className="flex justify-center flex-1 items-center py-6">
                        <Heart className={cn("h-10 w-10 md:h-16 md:w-16 fill-current animate-pulse transition-all duration-500 opacity-60", currentTemplate.iconClass)} />
                    </div>

                    <div className="space-y-6 md:space-y-10 mt-auto mb-16 px-4">
                        {invitation.text && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className={cn("whitespace-pre-wrap transition-all duration-500 text-sm leading-relaxed overflow-hidden line-clamp-6 max-h-[120px]", currentTemplate.messageClass)}
                            >
                                {invitation.text}
                            </motion.p>
                        )}

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className={cn("grid gap-4 py-6 border-t border-b border-primary-500/10 transition-all duration-500", currentTemplate.detailsClass)}
                        >
                            <div className="flex flex-col items-center space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Date</span>
                                <span className="font-bold text-xl md:text-2xl font-serif">{invitation.date}</span>
                            </div>

                            <div className="flex flex-col items-center space-y-1">
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Time</span>
                                <span className="font-bold text-xl md:text-2xl font-serif">{invitation.time}</span>
                            </div>

                            <div className="flex flex-col items-center space-y-1 px-4">
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">Location</span>
                                <span className="font-bold text-lg md:text-xl text-center font-serif leading-tight">
                                    {invitation.hall && <span className="block mb-1 text-primary-600 dark:text-primary-400">{invitation.hall}</span>}
                                    <span className="text-gray-600 dark:text-gray-400 text-sm font-normal">{invitation.location}</span>
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
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
