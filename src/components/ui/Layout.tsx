import { type ReactNode } from "react"
import { Heart, Bell } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import { useTelegram } from "../../hooks/useTelegram"
import { BottomNav } from "./BottomNav"

interface LayoutProps {
    children: ReactNode
}


export function Layout({ children }: LayoutProps) {
    const { t } = useLanguage()
    const { user } = useTelegram()

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full border-b border-gold-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-primary-500 fill-current" />
                        <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                            {t('appName')}
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors">
                            <Bell className="h-6 w-6" />
                        </button>

                        <Link to="/profile" className="group">
                            <div className="h-10 w-10 rounded-full bg-gold-50 dark:bg-slate-800 border border-gold-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary-300 group-hover:ring-2 group-hover:ring-primary-100 dark:group-hover:ring-primary-900/30">
                                {user?.photo_url ? (
                                    <img src={user.photo_url} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-gold-50 dark:from-slate-700 dark:to-slate-800 text-primary-600 dark:text-primary-400 font-bold">
                                        {user?.first_name ? user.first_name[0] : 'U'}
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 pb-20">
                {children}
            </main>

            <BottomNav />
        </div>
    )
}
