import { useTelegram } from "../hooks/useTelegram";
import { useLanguage } from "../context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { User, Settings, Globe, Moon, ChevronRight, Calendar, MapPin } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

export function Profile() {
    const { user } = useTelegram();
    const { language, setLanguage, t } = useLanguage();
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const data = await api.getMyInvitations();
                setInvitations(data || []);
            } catch (err) {
                console.error("Failed to fetch invitations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvitations();
    }, []);

    const languages = [
        { code: 'uz', name: "O'zbekcha" },
        { code: 'ru', name: "Русский" },
        { code: 'en', name: "English" }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">{t('profile.title')}</h1>

            {/* User Info Card */}
            <Card className="border-gold-200 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary-500 to-gold-500" />
                <CardContent className="relative pt-12 pb-6 text-center">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden">
                            {user?.photo_url ? (
                                <img src={user.photo_url} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-12 w-12 text-gray-400" />
                            )}
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-gray-500">@{user?.username || 'user'}</p>
                </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="border-gold-100 shadow-sm">
                <CardHeader className="pb-2 border-b border-gold-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5 text-gold-600" />
                        {t('profile.settings')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Language Selection */}
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Globe className="h-4 w-4 text-primary-500" />
                            {t('profile.language')}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code as any)}
                                    className={cn(
                                        "py-2 px-3 rounded-lg text-sm font-medium transition-all border",
                                        language === lang.code
                                            ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm"
                                            : "bg-white border-gray-100 text-gray-600 hover:border-gold-200"
                                    )}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gold-50" />

                    {/* Appearance */}
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Moon className="h-4 w-4 text-primary-500" />
                            {t('profile.appearance')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            {t('profile.darkMode')}
                            <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-not-allowed opacity-50">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* My Invitations */}
            <Card className="border-gold-100 shadow-sm">
                <CardHeader className="pb-2 border-b border-gold-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ChevronRight className="h-5 w-5 text-gold-600" />
                        {t('profile.myInvitations')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400 italic">
                            {t('loading')}
                        </div>
                    ) : invitations.length > 0 ? (
                        <div className="divide-y divide-gold-50">
                            {invitations.map((inv) => (
                                <Link
                                    key={inv._id}
                                    to={`/invitation/${inv._id}`}
                                    className="p-4 flex items-center justify-between hover:bg-gold-50 transition-colors group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">
                                                {inv.brideName} & {inv.groomName}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> {inv.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {inv.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary-400 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500 space-y-4">
                            <p>{t('invitationNotFound')}</p>
                            <Link to="/create">
                                <Button size="sm" variant="outline">
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
