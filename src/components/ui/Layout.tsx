import { type ReactNode } from "react"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import { useTelegram } from "../../hooks/useTelegram"

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
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {t('home')}
                        </Link>
                        <Link to="/create" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {t('templates')}
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {t('about')}
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
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

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t border-gold-100 dark:border-slate-800 bg-gold-50/50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Heart className="h-5 w-5 text-primary-400" />
                            <span className="font-serif text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {t('appName')}
                            </span>
                        </div>
                        <p className="text-sm text-gold-600 dark:text-gold-400">
                            © {new Date().getFullYear()} {t('appName')}. Made with love.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
