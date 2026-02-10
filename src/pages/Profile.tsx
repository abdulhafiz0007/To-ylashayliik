import { useTelegram } from "../hooks/useTelegram";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { User, Settings, Globe, Moon, Sun, ChevronRight, Calendar, MapPin } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

export function Profile() {
    const { user } = useTelegram();
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
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
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>

            {/* User Info Card */}
            <Card className="border-gold-200 dark:border-slate-700 overflow-hidden dark:bg-slate-800">
                <div className="h-24 bg-gradient-to-r from-primary-500 to-gold-500 opacity-90" />
                <CardContent className="relative pt-12 pb-6 text-center">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="h-24 w-24 rounded-full border-4 border-white dark:border-slate-800 bg-white shadow-lg flex items-center justify-center overflow-hidden">
                            {user?.photo_url ? (
                                <img src={user.photo_url} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-12 w-12 text-gray-400" />
                            )}
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">@{user?.username || 'user'}</p>
                </CardContent>
            </Card>

            {/* Settings Card */}
            <Card className="border-gold-100 dark:border-slate-700 shadow-sm dark:bg-slate-800">
                <CardHeader className="pb-2 border-b border-gold-50 dark:border-slate-700">
                    <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                        <Settings className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                        {t('profile.settings')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Language Selection */}
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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
                                            ? "bg-primary-50 border-primary-200 text-primary-700 shadow-sm dark:bg-primary-900 dark:border-primary-700 dark:text-primary-100"
                                            : "bg-white border-gray-100 text-gray-600 hover:border-gold-200 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"
                                    )}
                                >
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gold-50 dark:border-slate-700" />

                    {/* Appearance */}
                    <div className="p-4 flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                            {theme === 'dark' ? (
                                <Moon className="h-4 w-4 text-primary-400" />
                            ) : (
                                <Sun className="h-4 w-4 text-amber-500" />
                            )}
                            {t('profile.appearance')}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {theme === 'dark' ? t('profile.darkMode') : 'Light Mode'}
                            </span>
                            <button
                                onClick={toggleTheme}
                                className={cn(
                                    "w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400",
                                    theme === 'dark' ? "bg-primary-600" : "bg-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300",
                                    theme === 'dark' ? "translate-x-7" : "translate-x-1"
                                )} />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* My Invitations */}
            <Card className="border-gold-100 dark:border-slate-700 shadow-sm dark:bg-slate-800">
                <CardHeader className="pb-2 border-b border-gold-50 dark:border-slate-700">
                    <CardTitle className="text-lg flex items-center gap-2 dark:text-gray-100">
                        <ChevronRight className="h-5 w-5 text-gold-600 dark:text-gold-400" />
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
                                    key={inv._id}
                                    to={`/invitation/${inv._id}`}
                                    className="p-4 flex items-center justify-between hover:bg-gold-50 dark:hover:bg-slate-700/50 transition-colors group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                                                {inv.brideName} & {inv.groomName}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                        <div className="p-12 text-center text-gray-500 space-y-4 dark:text-gray-400">
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
