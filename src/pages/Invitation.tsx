import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useInvitation, type InvitationData } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Download, Share2, Heart, Music, X, VolumeX, MapPin, Mail, Sparkles, Clock, User, Eye, ChevronRight } from 'lucide-react'


// Import music assets
import musicAzizam from "../assets/music_azizam.mp3"
import musicImg from "../assets/IMG_3421.mp3"
import musicDate from "../assets/2026-02-23 09.26.00.mp3"

const MUSIC_MAP: Record<string, string> = {
    'MUSIC_0000': musicAzizam,
    'MUSIC_0001': musicImg,
    'MUSIC_1000': musicDate,
    'music1': musicAzizam,
    'music2': musicImg,
    'music3': musicDate,
}
import { cn } from "../lib/utils"
import { templates } from "../lib/templates"
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { useLanguage } from "../context/LanguageContext"
import { api } from "../lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { useTelegram } from "../hooks/useTelegram"
import { WeddingCard } from "../components/WeddingCard"

export function Invitation() {
    const { id } = useParams<{ id: string }>()
    const { user: tgUser, tg } = useTelegram()
    const { updateData, loading: contextLoading, error: contextError } = useInvitation()
    const { t } = useLanguage()
    const [invitation, setInvitation] = useState<InvitationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showTemplates, setShowTemplates] = useState(false)
    const [wishes, setWishes] = useState<any[]>([])
    const [sights, setSights] = useState<any[]>([])
    const [newWish, setNewWish] = useState("")
    const [senderName, setSenderName] = useState("")
    const [isPlaying, setIsPlaying] = useState(false)
    const [showMapOptions, setShowMapOptions] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Ref for the invitation card to capture as image
    const cardRef = useRef<HTMLDivElement>(null)

    const musicUrl = invitation?.backgroundMusic ? MUSIC_MAP[invitation.backgroundMusic as string] : null;

    // Pre-fill sender name from Telegram user data
    useEffect(() => {
        if (tgUser && !senderName) {
            const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ');
            if (fullName) setSenderName(fullName);
        }
    }, [tgUser]);

    // Autoplay logic
    useEffect(() => {
        if (!loading && invitation && musicUrl && audioRef.current) {
            const playAudio = async () => {
                try {
                    // Browsers require a gesture, but we try anyway.
                    // If blocked, the user can still manual play.
                    await audioRef.current?.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay blocked or failed:", err);
                }
            };
            playAudio();
        }
    }, [loading, invitation, musicUrl])

    useEffect(() => {
        const loadInvitation = async () => {
            if (id) {
                // Helper: attempt to load invitation from API
                const tryLoad = async (): Promise<any> => {
                    const data = await api.getInvitation(id)
                    return data
                }

                // Load invitation - with retry for shared links (auth may not be ready yet)
                let data = null
                try {
                    data = await tryLoad()
                } catch (err) {
                    console.warn("First load attempt failed, retrying in 2s...", err)
                    // Wait for authTelegram to finish setting the token
                    await new Promise(r => setTimeout(r, 2000))
                    try {
                        data = await tryLoad()
                    } catch (retryErr) {
                        console.error("Retry also failed:", retryErr)
                    }
                }

                if (data) {
                    data.id = data.id || id
                    setInvitation(data)
                }

                // Load wishes separately
                try {
                    const wishesData = await api.getWishes(id)
                    const wishArray = Array.isArray(wishesData)
                        ? wishesData
                        : (wishesData?.content || wishesData?.data || [])
                    setWishes(Array.isArray(wishArray) ? wishArray : [])
                } catch (err) {
                    console.error("Failed to load wishes:", err)
                    setWishes([])
                }

                // NEW: Load sights if user is the creator
                if (data) {
                    const tgUserId = tgUser?.id?.toString()
                    const creatorTgId = (data.creator?.telegramId || data.creatorId)?.toString()
                    if (tgUserId && creatorTgId && tgUserId === creatorTgId) {
                        try {
                            const sightsData = await api.getSights(id)
                            const sightsArray = Array.isArray(sightsData)
                                ? sightsData
                                : (sightsData?.content || sightsData?.data || [])
                            setSights(Array.isArray(sightsArray) ? sightsArray : [])
                        } catch (err) {
                            console.error("Failed to load sights:", err)
                        }
                    }
                }
            }
            setLoading(false)
        }
        loadInvitation()
    }, [id])



    const handleTemplateChange = async (templateId: string) => {
        if (!invitation || !id) return;
        try {
            const updated = { ...invitation, template: templateId };
            setInvitation(updated);
            updateData({ template: templateId });
            await api.saveInvitation(updated);
            setShowTemplates(false);
        } catch (err) {
            console.error("Failed to change template:", err);
        }
    }

    const handleDownload = async () => {
        if (!cardRef.current) return;

        // Helper: check if an element has problematic external resources
        const hasExternalBg = (node: HTMLElement) => {
            if (!node || !node.className || typeof node.className !== 'string') return false;
            // Skip external texture overlays and animated elements
            return node.className.includes('bg-[url') ||
                node.className.includes('animate-pulse') ||
                node.className.includes('animate-ping');
        };

        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
                filter: (node: HTMLElement) => !hasExternalBg(node),
            });
            download(dataUrl, 'my-wedding-invitation.png');
        } catch (err) {
            console.error('Download failed:', err);
            // Fallback: aggressively skip all potentially problematic nodes
            try {
                const dataUrl = await toPng(cardRef.current, {
                    cacheBust: true,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                    skipFonts: true,
                    filter: (node: HTMLElement) => {
                        if (hasExternalBg(node)) return false;
                        // Also skip any node with inline external bg
                        const style = node?.style;
                        if (style?.backgroundImage?.includes('http')) return false;
                        // Skip external images (cross-origin)
                        if (node.tagName === 'IMG') {
                            const src = (node as HTMLImageElement).src;
                            if (src && src.startsWith('http') && !src.includes(window.location.host)) {
                                return false;
                            }
                        }
                        return true;
                    },
                });
                download(dataUrl, 'my-wedding-invitation.png');
            } catch (err2) {
                console.error('Fallback download also failed:', err2);
                alert("Rasmni yuklab olishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
            }
        }
    }

    const handleShare = async () => {
        // Construct a direct Telegram link to ensure the invitation opens in the Mini App
        const botUsername = 'etaklif_bot';
        const appShortName = 'taklifnoma';
        const shareUrl = `https://t.me/${botUsername}/${appShortName}?startapp=inv_${id}`;
        const shareText = `Sizni ${invitation?.groomName} & ${invitation?.brideName}larning to'y oqshomiga taklif etamiz! 💍`;

        // If in Telegram WebApp, use native Telegram share via openTelegramLink
        if (tg?.openTelegramLink) {
            try {
                const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                tg.openTelegramLink(tgShareUrl);
                return;
            } catch (err) {
                console.warn('openTelegramLink failed, falling back:', err);
            }
        }

        // Fallback: use native share or clipboard
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'To\'y Taklifnomasi',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Taklifnoma havolasi nusxalandi!");
            } catch (err) {
                console.error('Clipboard error:', err);
            }
        }
    }

    const handlePostWish = async () => {
        if (!newWish.trim() || !senderName.trim() || !id) return;

        try {
            await api.postWish(Number(id), newWish, senderName);
            setNewWish("");
            // Reload wishes from backend to get complete creator data (photoUrl, telegramUsername, etc.)
            try {
                const wishesData = await api.getWishes(id);
                const wishArray = Array.isArray(wishesData)
                    ? wishesData
                    : (wishesData?.content || wishesData?.data || []);
                setWishes(Array.isArray(wishArray) ? wishArray : []);
            } catch (reloadErr) {
                console.warn("Failed to reload wishes after post:", reloadErr);
            }
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


    const templateId = invitation.template || 'toylashaylik'
    const template = templates.find(temp => temp.id === templateId) || templates[0]

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleOpenMap = () => {
        if (invitation?.weddingHallLatitude && invitation?.weddingHallLongitude) {
            setShowMapOptions(true)
        }
    }

    const openDeepLink = (type: 'google' | 'yandex') => {
        if (!invitation?.weddingHallLatitude || !invitation?.weddingHallLongitude) return

        const lat = invitation.weddingHallLatitude
        const lng = invitation.weddingHallLongitude

        let url = ""
        if (type === 'google') {
            url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        } else {
            // Yandex Maps LBS (location based service) url
            url = `yandexmaps://maps.yandex.ru/?pt=${lng},${lat}&z=16&l=map`
            // Fallback for browser if app not installed
            const fallbackUrl = `https://yandex.com/maps/?pt=${lng},${lat}&z=16&l=map`

            // Try to open app, if it fails (not easy to check in web), we just open the link
            // For web, we usually just provide the web link or a more complex intent
            url = fallbackUrl
        }
        window.open(url, '_blank')
        setShowMapOptions(false)
    }

    const tgUserId = tgUser?.id?.toString()
    const creatorTgId = (invitation?.creator?.telegramId || invitation?.creatorId)?.toString()
    const isCreator = tgUserId && creatorTgId && tgUserId === creatorTgId
    const hasCoords = invitation?.weddingHallLatitude && invitation?.weddingHallLongitude

    return (
        <div className="min-h-screen flex flex-col items-center relative pb-10 bg-gradient-to-b from-[#fff5f5] via-[#fffdf9] to-[#fffef2] dark:from-slate-950 dark:to-slate-900 transition-colors duration-500 overflow-y-auto overflow-x-hidden">
            {/* Music Player */}
            {musicUrl && (
                <>
                    <audio
                        ref={audioRef}
                        src={musicUrl}
                        loop
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMusic}
                        className="fixed right-6 bottom-32 z-50 h-12 w-12 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-pink-100 dark:border-slate-800 shadow-lg flex items-center justify-center text-[#ec4899]"
                    >
                        {isPlaying ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <Music className="h-6 w-6" />
                            </motion.div>
                        ) : (
                            <VolumeX className="h-6 w-6 opacity-40" />
                        )}
                        {isPlaying && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                            </span>
                        )}
                    </motion.button>
                </>
            )}

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
                {/* Map Selection Modal */}
                {showMapOptions && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowMapOptions(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] overflow-hidden relative z-10 shadow-2xl"
                        >
                            <div className="p-6 text-center space-y-4">
                                <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <MapPin className="h-7 w-7 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Xaritani tanlang</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manzilni qaysi xarita orqali ko'rmoqchisiz?</p>

                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <button
                                        onClick={() => openDeepLink('google')}
                                        className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 flex items-center gap-4 px-6 hover:border-blue-400 transition-all group"
                                    >
                                        <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Maps_icon_%282020%29.svg/1024px-Google_Maps_icon_%282020%29.svg.png" alt="Google" className="h-full w-full object-contain" />
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">Google Maps</span>
                                        <ChevronRight className="h-5 w-5 ml-auto text-gray-300 group-hover:text-blue-500" />
                                    </button>

                                    <button
                                        onClick={() => openDeepLink('yandex')}
                                        className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 flex items-center gap-4 px-6 hover:border-red-400 transition-all group"
                                    >
                                        <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Yandex_Maps_icon.svg/1024px-Yandex_Maps_icon.svg.png" alt="Yandex" className="h-full w-full object-contain" />
                                        </div>
                                        <span className="font-bold text-gray-800 dark:text-gray-200">Yandex Maps</span>
                                        <ChevronRight className="h-5 w-5 ml-auto text-gray-300 group-hover:text-red-500" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowMapOptions(false)}
                                    className="w-full py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* Main Content View */}
            <WeddingCard
                invitation={invitation}
                template={template}
                cardRef={cardRef}
            />


            {/* Actions & Wishes Section - Below Card */}
            <div className="w-full max-w-[420px] px-6 space-y-8 pb-32 relative z-10">
                {/* Download & Share Actions (Only for Creator) */}
                {isCreator ? (
                    <div className="flex gap-3 mt-8">
                        <Button
                            variant="ghost"
                            className="flex-1 h-12 rounded-2xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800 font-bold text-gray-600 dark:text-gray-300 gap-2 shadow-sm"
                            onClick={handleDownload}
                        >
                            <Download className="h-5 w-5 text-pink-500" />
                            <span>{t('save')}</span>
                        </Button>
                        <Button
                            className="flex-1 h-12 rounded-2xl bg-[#ec4899] hover:bg-[#db2777] text-white font-bold shadow-lg shadow-pink-200 gap-2"
                            onClick={handleShare}
                        >
                            <Share2 className="h-5 w-5 fill-current" />
                            <span>{t('share')}</span>
                        </Button>
                    </div>
                ) : (
                    /* View on Map Action (For Guests if coordinates exist) */
                    hasCoords && (
                        <div className="mt-8">
                            <Button
                                className="w-full h-14 rounded-2xl bg-gradient-to-r bg-[#ec4899] hover:bg-[#db2777] text-white font-extrabold shadow-lg shadow-blue-100 flex items-center justify-center gap-3 text-lg transition-all active:scale-[0.98]"
                                onClick={handleOpenMap}
                            >
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <span>{t('viewOnMap')}</span>
                            </Button>
                        </div>
                    )
                )}

                {/* 💌 Send Your Wishes */}
                <div className="space-y-4">
                    <h2 className="text-left text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Mail className="h-5 w-5 text-pink-500" />
                        Send Your Wishes
                    </h2>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 space-y-3">
                        <Input
                            placeholder={t('name')}
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="bg-gray-50/50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 h-11 px-4 focus:ring-2 focus:ring-pink-200 dark:text-white outline-none"
                        />
                        <textarea
                            placeholder={t('addComment')}
                            value={newWish}
                            onChange={(e) => setNewWish(e.target.value)}
                            className="w-full min-h-[80px] bg-gray-50/50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 p-4 focus:ring-2 focus:ring-pink-200 resize-none text-base dark:text-white outline-none"
                        />
                        <Button
                            onClick={handlePostWish}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-md flex items-center justify-center gap-2"
                            disabled={!newWish.trim() || !senderName.trim()}
                        >
                            Send Wish <Heart className="h-4 w-4 fill-current" />
                        </Button>
                    </div>
                </div>

                {/* ✨ Guest Wishes */}
                <div className="space-y-4">
                    <h2 className="text-left text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-gold-500" />
                        Guest Wishes
                    </h2>

                    {!Array.isArray(wishes) || wishes.length === 0 ? (
                        <p className="text-center text-gray-400 italic py-6">{t('noReceivedInvitations')}</p>
                    ) : (
                        <div className="space-y-3">
                            {wishes.map((wish, i) => {
                                // Support both new nested creator object and old flat properties
                                const creator = wish.creator || {};
                                const photoUrl = creator.photoUrl || wish.photoUrl;
                                const username = creator.telegramUsername || wish.username;
                                const telegramId = creator.telegramId || wish.telegramId;
                                const displayName = wish.name || creator.firstname || 'Mehmon';

                                const hasPhoto = !!photoUrl;
                                const profileLink = username
                                    ? `https://t.me/${username}`
                                    : telegramId
                                        ? `tg://user?id=${telegramId}`
                                        : null;

                                // Calculate time ago
                                const getTimeAgo = (dateStr: string) => {
                                    if (!dateStr) return '';
                                    const now = new Date();
                                    const date = new Date(dateStr);
                                    const diffMs = now.getTime() - date.getTime();
                                    const diffMins = Math.floor(diffMs / 60000);
                                    if (diffMins < 1) return 'Hozirgina';
                                    if (diffMins < 60) return `${diffMins} daq oldin`;
                                    const diffHours = Math.floor(diffMins / 60);
                                    if (diffHours < 24) return `${diffHours} soat oldin`;
                                    const diffDays = Math.floor(diffHours / 24);
                                    if (diffDays < 30) return `${diffDays} kun oldin`;
                                    return `${Math.floor(diffDays / 30)} oy oldin`;
                                };
                                const timeAgo = getTimeAgo(wish.createdAt);

                                const avatar = hasPhoto ? (
                                    <img
                                        src={photoUrl}
                                        alt={displayName}
                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-100 dark:ring-slate-700"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null;

                                const initials = (
                                    <div className={cn(
                                        "h-10 w-10 shrink-0 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-500 rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-pink-100 dark:ring-slate-700",
                                        hasPhoto ? "hidden" : ""
                                    )}>
                                        {displayName?.[0]?.toUpperCase() || 'M'}
                                    </div>
                                );

                                return (
                                    <div
                                        key={i}
                                        className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm space-y-3"
                                    >
                                        {/* Header: Avatar + Name */}
                                        <div className="flex items-center gap-3">
                                            {profileLink ? (
                                                <a href={profileLink} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                                    {avatar}
                                                    {initials}
                                                </a>
                                            ) : (
                                                <div className="shrink-0">
                                                    {avatar}
                                                    {initials}
                                                </div>
                                            )}
                                            {profileLink ? (
                                                <a
                                                    href={profileLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold text-gray-900 dark:text-white hover:text-pink-500 transition-colors flex items-center gap-1.5"
                                                >
                                                    <User className="h-4 w-4 text-gray-400" /> {displayName}
                                                </a>
                                            ) : (
                                                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                                    <User className="h-4 w-4 text-gray-400" /> {displayName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Wish Text */}
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-1">
                                            "{wish.wishText}"
                                        </p>

                                        {/* Timestamp */}
                                        {timeAgo && (
                                            <p className="text-xs text-gray-400 dark:text-gray-500 pl-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {timeAgo}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 👀 Who Viewed Section (Only for Creator) */}
                {(() => {
                    if (isCreator && sights.length > 0) {
                        return (
                            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-slate-800">
                                <h2 className="text-left text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-primary-500" />
                                    Kimlar ko'rdi ({sights.length})
                                </h2>
                                <div className="flex flex-wrap gap-2 pb-6">
                                    {sights.map((sight, idx) => {
                                        const viewer = sight.creator || sight.user
                                        const name = viewer?.firstname || viewer?.telegramUsername || viewer?.first_name || 'Mehmon'
                                        const photo = viewer?.photoUrl || viewer?.photo_url

                                        return (
                                            <div
                                                key={sight.id || idx}
                                                className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-slate-800 shadow-sm"
                                            >
                                                <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 overflow-hidden flex items-center justify-center text-[10px] font-bold text-primary-600">
                                                    {photo ? (
                                                        <img src={photo} alt={name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        name[0]?.toUpperCase() || '?'
                                                    )}
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                    {name}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    }
                    return null
                })()}
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-x-0 top-0 h-full bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-20 pointer-events-none z-0" />
        </div >
    )
}
