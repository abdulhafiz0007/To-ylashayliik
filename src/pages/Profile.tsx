import { useTelegram } from "../hooks/useTelegram";
import { Card } from "../components/ui/Card";
import { ChevronRight, Calendar, MapPin, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import type { InvitationData } from "../context/InvitationContext";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn, isValidImageUrl } from "../lib/utils";

export function Profile() {
    const { user } = useTelegram();
    const { t } = useLanguage();
    const [invitations, setInvitations] = useState<InvitationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const data = await api.getMyInvitations();
                setInvitations(data || []);
            } catch (err) {
                console.error("Profile: Failed to fetch invitations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvitations();
    }, []);

    const stats = [
        { label: t('profile.myInvitations'), value: invitations.length, icon: Heart, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
    ];


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-4 pt-8 max-w-2xl space-y-6"
                >
                    {/* Header Section */}
                    <div className="relative rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 via-transparent to-slate-900/90" />

                        <div className="relative p-8 flex flex-col items-center text-center">
                            <motion.div
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                className="relative mb-4"
                            >
                                <div className="h-28 w-28 rounded-[32px] border-4 border-white/10 p-1 bg-white/5 backdrop-blur-sm">
                                    <div className="h-full w-full rounded-[24px] overflow-hidden bg-slate-800 flex items-center justify-center border border-white/20 shadow-inner">
                                        {user?.photo_url ? (
                                            <img src={user.photo_url} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                                alt="Profile Placeholder"
                                                className="h-full w-full object-cover opacity-50 grayscale"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary-500 rounded-2xl border-4 border-slate-900 flex items-center justify-center text-white shadow-lg">
                                    <Heart className="h-4 w-4 fill-current" />
                                </div>
                            </motion.div>

                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {user?.first_name} {user?.last_name || ''}
                            </h2>
                            <p className="text-primary-300 font-medium text-sm">@{user?.username || 'taklifnoma_user'}</p>

                            <div className="mt-8 flex gap-4 w-full">
                                {stats.map((stat, i) => (
                                    <div key={i} className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10">
                                        <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-2", stat.bg)}>
                                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                                        </div>
                                        <div className="text-xl font-black text-white">{stat.value}</div>
                                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* My Invitations Card */}
                    <Card className="border-none shadow-sm dark:bg-slate-900/50 rounded-[32px] overflow-hidden">
                        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary-500" />
                                {t('profile.myInvitations')}
                            </h3>
                            <Link to="/create" className="text-xs font-bold text-primary-500 hover:opacity-80 transition-opacity">
                                {t('createNew')}
                            </Link>
                        </div>
                        <div className="p-2 space-y-1">
                            {loading ? (
                                Array(2).fill(0).map((_, i) => (
                                    <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-2xl w-full" />
                                ))
                            ) : invitations.length > 0 ? (
                                invitations.map((inv, i) => (
                                    <motion.div
                                        key={inv.id || i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            to={`/invitation/${inv.id}`}
                                            className="group block p-3 rounded-[24px] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                                    {isValidImageUrl(inv.groomPictureGetUrl) ? (
                                                        <img src={inv.groomPictureGetUrl} alt="Wedding" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <img
                                                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200&auto=format&fit=crop"
                                                            alt="Wedding Placeholder"
                                                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-slate-900 dark:text-white text-sm truncate">
                                                        {inv.groomName} & {inv.brideName}
                                                    </h4>
                                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" /> {inv.date}
                                                        </span>
                                                        <span className="flex items-center gap-1 truncate">
                                                            <MapPin className="h-3 w-3" /> {inv.hall || inv.location}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                                                    <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-12 px-6 text-center space-y-4">
                                    <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800">
                                        <Heart className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t('invitationNotFound')}</p>
                                        <p className="text-xs text-slate-500">{t('digitalWorld')}</p>
                                    </div>
                                    <Link to="/create">
                                        <Button size="sm" variant="primary" className="rounded-xl px-6">
                                            {t('createNew')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Card>


                </motion.div>
            </AnimatePresence>
        </div>
    );
}
