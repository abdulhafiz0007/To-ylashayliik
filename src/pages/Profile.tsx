import { useTelegram } from "../hooks/useTelegram";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import type { InvitationData } from "../context/InvitationContext";
import { useLanguage } from "../context/LanguageContext";

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

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8 pb-24">
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>

            {/* User Info Card */}
            <Card className="border-gold-200 dark:border-slate-700 overflow-hidden dark:bg-slate-800 shadow-lg">
                <div className="h-24 bg-gradient-to-r from-primary-500 to-gold-500 opacity-90" />
                <CardContent className="relative pt-12 pb-6 text-center">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-800 bg-white shadow-lg flex items-center justify-center overflow-hidden">
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user?.first_name} {user?.last_name || ''}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">@{user?.username || 'taklifnoma_user'}</p>
                </CardContent>
            </Card>

            {/* My Invitations */}
            <Card className="border-gold-100 dark:border-slate-700 shadow-sm dark:bg-slate-800">
                <CardHeader className="pb-2 border-b border-gold-50 dark:border-slate-700">
                    <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                        {t('profile.myInvitations')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400 italic">
                            {t('loading')}
                        </div>
                    ) : invitations.length > 0 ? (
                        <div className="divide-y divide-gold-50 dark:divide-slate-700">
                            {invitations.map((inv) => (
                                <Link
                                    key={inv.id || inv._id}
                                    to={`/invitation/${inv.id || inv._id}`}
                                    className="p-4 flex items-center justify-between hover:bg-gold-50 dark:hover:bg-slate-700/50 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                            {inv.groomPictureGetUrl ? (
                                                <img src={inv.groomPictureGetUrl} alt="Wedding" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <img
                                                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=200&auto=format&fit=crop"
                                                    alt="Wedding Placeholder"
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                                                />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-sm">
                                                {inv.groomName} & {inv.brideName}
                                            </h4>
                                            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> {inv.date}
                                                </span>
                                                <span className="flex items-center gap-1 truncate max-w-[120px]">
                                                    <MapPin className="h-3 w-3" /> {inv.hall || inv.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500 space-y-4 dark:text-gray-400">
                            <p className="font-medium">{t('invitationNotFound')}</p>
                            <Link to="/create">
                                <Button size="sm" variant="primary" className="rounded-xl px-6">
                                    {t('createNew')}
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
