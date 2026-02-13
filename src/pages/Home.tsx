import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, MapPin, ChevronRight, Heart } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { api } from "../lib/api"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"

interface InvitationCardProps {
    title: string
    date: string
    location: string
    status: 'confirmed' | 'completed' | 'pending' | 'low-rsvp'
    progress: number
    image?: string
}

function InvitationSmallCard({ title, date, location, status, progress, image }: InvitationCardProps) {
    const statusColors = {
        confirmed: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
        completed: "text-green-500 bg-green-50 dark:bg-green-900/20",
        pending: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
        'low-rsvp': "text-red-500 bg-red-50 dark:bg-red-900/20"
    }

    const progressColors = {
        confirmed: "bg-blue-500",
        completed: "bg-green-500",
        pending: "bg-yellow-500",
        'low-rsvp': "bg-red-500"
    }

    return (
        <Card className="overflow-hidden border-none shadow-sm dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-gold-100 dark:bg-slate-700">
                    {image ? (
                        <img src={image} alt={title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <Heart className="h-8 w-8 text-primary-300" />
                        </div>
                    )}
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
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center">
                            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", statusColors[status])}>
                                {status.replace('-', ' ')}
                            </span>
                            <span className="text-[10px] font-medium text-gray-400">{progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className={cn("h-full rounded-full transition-all", progressColors[status])}
                            />
                        </div>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
            </CardContent>
        </Card>
    )
}

export function Home() {
    const { t } = useLanguage()
    const [activeTab, setActiveTab] = useState<'myEvents' | 'invitations'>('myEvents')
    const [invitations, setInvitations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        fetchMyInvitations()
    }, [])

    return (
        <div className="container mx-auto px-4 py-12 space-y-8 animate-fade-in">
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
                                        Elegant va raqamli taklifnomalar olami
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
                    onClick={() => setActiveTab('myEvents')}
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
                    onClick={() => setActiveTab('invitations')}
                    className={cn(
                        "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all relative z-10",
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

            {/* List Content */}
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'myEvents' ? (
                        <motion.div
                            key="myEvents"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-2xl w-full" />
                                ))
                            ) : invitations.length > 0 ? (
                                invitations.map((inv) => (
                                    <Link key={inv.id} to={`/invitation/${inv.id}`}>
                                        <InvitationSmallCard
                                            title={`${inv.brideName} & ${inv.groomName}`}
                                            date={inv.date}
                                            location={inv.hall || inv.location}
                                            status={inv.id % 2 === 0 ? 'confirmed' : 'pending'}
                                            progress={inv.id % 2 === 0 ? 85 : 32}
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
                            className="text-center py-12 space-y-4"
                        >
                            <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mx-auto">
                                <Plus className="h-10 w-10 text-blue-400" />
                            </div>
                            <p className="text-gray-500">Hozircha qabul qilingan taklifnomalar yo'q</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
