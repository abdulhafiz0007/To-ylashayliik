import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Calendar, MapPin, Trash2, MoreVertical, Eye, MessageCircle, Share2 } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { useInvitation } from "../context/InvitationContext"
import { api } from "../lib/api"
import { cn, isValidImageUrl } from "../lib/utils"
import { useTelegram } from "../hooks/useTelegram"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import defaultGroom from "../assets/default_groom.jpg"
import defaultBride from "../assets/default_bride.jpg"

interface InvitationCardProps {
    id: string | number
    title: string
    date: string
    location: string
    groomPicture?: string
    bridePicture?: string
    showMenu?: boolean
    onMenu?: (e: React.MouseEvent, id: string | number, title: string) => void
}

function InvitationSmallCard({ id, title, date, location, groomPicture, bridePicture, showMenu = true, onMenu }: InvitationCardProps) {
    const initialGroom = isValidImageUrl(groomPicture) ? (groomPicture as string) : defaultGroom;
    const initialBride = isValidImageUrl(bridePicture) ? (bridePicture as string) : defaultBride;

    const [groomImg, setGroomImg] = useState<string>(initialGroom);
    const [brideImg, setBrideImg] = useState<string>(initialBride);
    const [groomLoaded, setGroomLoaded] = useState(initialGroom === defaultGroom);
    const [brideLoaded, setBrideLoaded] = useState(initialBride === defaultBride);

    return (
        <Card className="overflow-hidden border-none shadow-sm dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group relative">
            <CardContent className="p-4 flex items-center gap-4">
                {/* Overlapping Thumbnails */}
                <div className="h-16 w-16 relative flex-shrink-0">
                    <div className="relative h-full w-full">
                        <div className="absolute top-0 right-0 h-11 w-11 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md z-10 transform translate-x-1 -translate-y-1 bg-gray-50 dark:bg-slate-900">
                            <img
                                src={brideImg}
                                alt="Bride"
                                className={cn(
                                    "h-full w-full object-cover transition-opacity duration-300",
                                    brideLoaded ? "opacity-100" : "opacity-0"
                                )}
                                onLoad={() => setBrideLoaded(true)}
                                onError={() => {
                                    if (brideImg !== defaultBride) {
                                        setBrideImg(defaultBride);
                                        setBrideLoaded(true);
                                    }
                                }}
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 h-11 w-11 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm z-0 bg-gray-50 dark:bg-slate-900">
                            <img
                                src={groomImg}
                                alt="Groom"
                                className={cn(
                                    "h-full w-full object-cover transition-opacity duration-300",
                                    groomLoaded ? "opacity-100" : "opacity-0"
                                )}
                                onLoad={() => setGroomLoaded(true)}
                                onError={() => {
                                    if (groomImg !== defaultGroom) {
                                        setGroomImg(defaultGroom);
                                        setGroomLoaded(true);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{date}</span>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{location}</span>
                    </div>
                </div>

                {showMenu && onMenu && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onMenu(e, id, title);
                        }}
                        className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>
                )}
            </CardContent>
        </Card>
    )
}

export function Home() {
    const { t } = useLanguage()
    const { receivedInvitations, refreshReceivedInvitations, currentUser } = useInvitation()
    const { tg } = useTelegram()
    const [activeTab, setActiveTab] = useState<'myEvents' | 'invitations'>('myEvents')
    const [invitations, setInvitations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | number | null }>({ show: false, id: null })
    const [isDeleting, setIsDeleting] = useState(false)
    const [menuModal, setMenuModal] = useState<{ show: boolean, id: string | number | null, title?: string, x: number, y: number }>({
        show: false,
        id: null,
        title: '',
        x: 0,
        y: 0
    })

    // Filter received invitations to exclude user's own created invitations
    const myInvitationIds = new Set(invitations.map(inv => String(inv.id)))
    const filteredReceived = receivedInvitations.filter(inv => !myInvitationIds.has(String(inv.id)))

    const fetchMyInvitations = async () => {
        try {
            const data = await api.getMyInvitations()
            setInvitations(data || [])
        } catch (err) {
            console.error("Home: Failed to fetch invitations", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyInvitations()
        refreshReceivedInvitations()
    }, [currentUser]) // Re-fetch when user identity is confirmed

    const handleTabChange = (tab: 'myEvents' | 'invitations') => {
        setActiveTab(tab)
        if (tab === 'myEvents') {
            fetchMyInvitations()
        } else {
            refreshReceivedInvitations()
        }
    }

    const handleMenu = (e: React.MouseEvent, id: string | number, title: string) => {
        e.preventDefault()
        e.stopPropagation()
        setMenuModal({
            show: true,
            id,
            title,
            x: e.clientX,
            y: e.clientY
        })
    }

    const handleShare = async (id: string | number, title: string) => {
        // Construct a direct Telegram link to ensure the invitation opens in the Mini App
        const botUsername = 'etaklif_bot';
        const appShortName = 'taklifnoma';
        const shareUrl = `https://t.me/${botUsername}/${appShortName}?startapp=inv_${id}`;
        const shareText = `Sizni ${title}larning to'y oqshomiga taklif etamiz! 💍`;

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
            copyToClipboard(shareUrl);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(t('linkCopied'));
    }

    const confirmDelete = async () => {
        if (!deleteModal.id) return

        setIsDeleting(true)
        try {
            await api.deleteInvitation(deleteModal.id)
            setDeleteModal({ show: false, id: null })
            fetchMyInvitations()
        } catch (err) {
            console.error("Failed to delete invitation", err)
            alert("O'chirishda xatolik yuz berdi")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-background" style={{ height: '100dvh', overflow: 'hidden', overscrollBehavior: 'none' }}>
            {/* Fixed Top Section */}
            <div className="shrink-0 px-4 pt-[75px] pb-2 space-y-6">
                {/* Create Invitation Card */}
                <Link to="/create">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="bg-gradient-to-br from-slate-900 to-primary-900 border-none shadow-xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary-500/20 blur-3xl rounded-full" />
                            <CardContent className="p-8 relative">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-white mb-1">{t('createPrompt')}</h2>
                                        <p className="text-primary-200 text-sm opacity-80">
                                            {t('digitalWorld')}
                                        </p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                        <Plus className="h-8 w-8" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Link>

                {/* Tabs */}
                <div className="bg-gray-100 dark:bg-slate-900 p-1.5 rounded-2xl flex gap-1 relative overflow-hidden mt-3">
                    <button
                        onClick={() => handleTabChange('myEvents')}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all relative z-10",
                            activeTab === 'myEvents' ? "text-gray-900 dark:text-white" : "text-gray-500"
                        )}
                    >
                        {t('myEvents')}
                        {activeTab === 'myEvents' && (
                            <motion.div
                                layoutId="tab-bg"
                                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm -z-10"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => handleTabChange('invitations')}
                        className={cn(
                            "flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all relative z-10",
                            activeTab === 'invitations' ? "text-gray-900 dark:text-white" : "text-gray-500"
                        )}
                    >
                        {t('receivedInvitations')}
                        {activeTab === 'invitations' && (
                            <motion.div
                                layoutId="tab-bg"
                                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm -z-10"
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Scrollable List Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ overscrollBehavior: 'contain' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'myEvents' ? (
                        <motion.div
                            key="myEvents"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-1"
                        >
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-2xl w-full" />
                                ))
                            ) : invitations.length > 0 ? (
                                invitations.map((inv, i) => (
                                    <Link key={inv.id || i} to={`/invitation/${inv.id}`}>
                                        <InvitationSmallCard
                                            id={inv.id || ''}
                                            title={`${inv.groomName} & ${inv.brideName}`}
                                            date={inv.date}
                                            location={inv.hall || inv.location}
                                            groomPicture={inv.groomPictureGetUrl}
                                            bridePicture={inv.bridePictureGetUrl}
                                            onMenu={handleMenu}
                                        />
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12 space-y-4">
                                    <div className="h-20 w-20 bg-gold-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                        <Calendar className="h-10 w-10 text-gold-400" />
                                    </div>
                                    <p className="text-gray-500">{t('invitationNotFound')}</p>
                                    <Link to="/create">
                                        <Button variant="outline" size="sm">
                                            {t('createNew')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="invitations"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-1"
                        >
                            {filteredReceived.length > 0 ? (
                                filteredReceived.map((inv, i) => (
                                    <Link key={inv.id || i} to={`/invitation/${inv.id}`}>
                                        <InvitationSmallCard
                                            id={inv.id || ''}
                                            title={`${inv.groomName} & ${inv.brideName}`}
                                            date={inv.date}
                                            location={inv.hall || inv.location}
                                            groomPicture={inv.groomPictureGetUrl}
                                            bridePicture={inv.bridePictureGetUrl}
                                            showMenu={false}
                                        />
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12 space-y-4">
                                    <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mx-auto">
                                        <Plus className="h-10 w-10 text-blue-400" />
                                    </div>
                                    <p className="text-gray-500">{t('noReceivedInvitations')}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Spacer for Floating BottomNav */}
            <div className="shrink-0 h-[100px]" />

            {/* Action Menu Modal (Popover) */}
            <AnimatePresence>
                {menuModal.show && (
                    <div className="fixed inset-0 z-[10050]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-transparent"
                            onClick={() => setMenuModal({ show: false, id: null, x: 0, y: 0 })}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ type: "spring", damping: 30, stiffness: 450 }}
                            style={{
                                top: Math.min(Math.max(80, menuModal.y - 120), window.innerHeight - 280),
                                left: Math.min(menuModal.x - 170, window.innerWidth - 190)
                            }}
                            className="fixed w-44 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden z-10 shadow-2xl border border-gray-100 dark:border-slate-800"
                        >
                            <div className="p-1.5 space-y-0.5">
                                <button
                                    onClick={() => {
                                        if (menuModal.id) {
                                            window.location.href = `/invitation/${menuModal.id}?view=sights`
                                            setMenuModal({ show: false, id: null, x: 0, y: 0 })
                                        }
                                    }}
                                    className="w-full h-10 rounded-xl flex items-center gap-3 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <Eye className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Ko'rganlar</span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (menuModal.id) {
                                            window.location.href = `/invitation/${menuModal.id}#wishes`
                                            setMenuModal({ show: false, id: null, x: 0, y: 0 })
                                        }
                                    }}
                                    className="w-full h-10 rounded-xl flex items-center gap-3 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-500">
                                        <MessageCircle className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Tilaklar</span>
                                </button>

                                <button
                                    onClick={() => {
                                        if (menuModal.id) {
                                            handleShare(menuModal.id, menuModal.title || "");
                                            setMenuModal({ show: false, id: null, x: 0, y: 0 })
                                        }
                                    }}
                                    className="w-full h-10 rounded-xl flex items-center gap-3 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                                        <Share2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{t('share')}</span>
                                </button>

                                <div className="h-px bg-gray-100 dark:bg-slate-800 mx-2 my-1" />

                                <button
                                    onClick={() => {
                                        if (menuModal.id) {
                                            const id = menuModal.id;
                                            setMenuModal({ show: false, id: null, x: 0, y: 0 })
                                            setDeleteModal({ show: true, id })
                                        }
                                    }}
                                    className="w-full h-10 rounded-xl flex items-center gap-3 px-3 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                                >
                                    <div className="h-7 w-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-red-600">O'chirish</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Delete Modal */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div className="fixed inset-0 z-[10010] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            onClick={() => !isDeleting && setDeleteModal({ show: false, id: null })}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] overflow-hidden relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="p-8 text-center">
                                <div className="h-16 w-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Trash2 className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Haqiqatdan ham o'chirmoqchimisiz?</h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="ghost"
                                        className="h-13 rounded-2xl font-bold bg-slate-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                                        onClick={() => setDeleteModal({ show: false, id: null })}
                                        disabled={isDeleting}
                                    >
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        className="h-13 rounded-2xl font-black bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-100 dark:shadow-none flex items-center justify-center gap-2"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            "O'chirish"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
