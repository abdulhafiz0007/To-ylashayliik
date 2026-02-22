import { type ReactNode } from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import { useTelegram } from "../../hooks/useTelegram"
import { useTheme } from "../../context/ThemeContext"
import { BottomNav } from "./BottomNav"
import { Moon, Sun, User } from "lucide-react"
import { cn } from "../../lib/utils"

interface LayoutProps {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    const { language, setLanguage } = useLanguage()
    const { user } = useTelegram()
    const { theme, toggleTheme } = useTheme()

    const languages = [
        { code: 'uz', label: 'UZ' },
        { code: 'ru', label: 'RU' },
        { code: 'en', label: 'EN' }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 shadow-sm border-b border-gray-100 dark:border-slate-800">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src="/logo.jpg" alt="Logo" className="h-8" />
                    </Link>

                    <div className="flex items-center space-x-3">
                        {/* Language Capsule */}
                        <div className="bg-gray-100 dark:bg-slate-800 rounded-full p-0.5 flex items-center">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setLanguage(lang.code as "uz" | "ru" | "en")}
                                    className={cn(
                                        "px-2 py-1 rounded-full text-[10px] font-bold transition-all",
                                        language === lang.code
                                            ? "bg-primary-500 text-white shadow-sm"
                                            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
                                    )}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-gray-100 dark:bg-slate-800 rounded-2xl text-primary-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        {/* Profile Wrapper */}
                        <Link to="/profile" className="relative group">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-400 to-primary-100 dark:from-primary-600 dark:to-primary-400 flex items-center justify-center text-white border-2 border-primary-50 dark:border-slate-800 shadow-sm transition-all group-hover:scale-105">
                                {user?.photo_url ? (
                                    <img src={user.photo_url} alt="Profile" className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    <span className="text-sm font-bold uppercase text-center flex items-center justify-center">
                                        {user?.first_name ? user.first_name[0] : <User className="h-5 w-5" />}
                                    </span>
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
