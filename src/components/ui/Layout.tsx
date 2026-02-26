import { type ReactNode, useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import { useTelegram } from "../../hooks/useTelegram"
import { useTheme } from "../../context/ThemeContext"
import { BottomNav } from "./BottomNav"
import { Moon, Sun, User, ChevronDown, Heart } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface LayoutProps {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    const { language, setLanguage } = useLanguage()
    const { user } = useTelegram()
    const { theme, toggleTheme } = useTheme()
    const [isLangOpen, setIsLangOpen] = useState(false)
    const langRef = useRef<HTMLDivElement>(null)
    const location = useLocation()

    const languages = [
        { code: 'uz', label: 'UZ' },
        { code: 'ru', label: 'RU' },
        { code: 'en', label: 'EN' }
    ]

    const currentLangLabel = languages.find(l => l.code === language)?.label || 'UZ'

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const isCreatePage = location.pathname === '/create' || location.pathname.startsWith('/templates/preview');

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Logo & Brand Name */}
                    <Link to="/" className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary-500 fill-primary-500" />
                        <span className="text-lg font-serif font-bold text-slate-900 dark:text-white">To'ylashaylik</span>
                    </Link>

                    <div className="flex items-center space-x-3">
                        {/* Language Dropdown */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all border border-transparent active:scale-95"
                            >
                                {currentLangLabel}
                                <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", isLangOpen ? "rotate-180" : "")} />
                            </button>

                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 mt-2 w-24 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-[60]"
                                    >
                                        <div className="p-1.5 space-y-1">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => {
                                                        setLanguage(lang.code as "uz" | "ru" | "en")
                                                        setIsLangOpen(false)
                                                    }}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all",
                                                        language === lang.code
                                                            ? "bg-primary-500 text-white shadow-sm"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                                    )}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-gray-100 dark:bg-slate-800 rounded-2xl text-primary-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors active:scale-90"
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        {/* Profile Wrapper */}
                        <Link to="/profile" className="relative group">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-400 to-primary-100 dark:from-primary-600 dark:to-primary-400 flex items-center justify-center text-white border-2 border-primary-50 dark:border-slate-800 shadow-sm transition-all group-hover:scale-105 active:scale-90">
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

            <main className={cn("flex-1", !isCreatePage && "pb-20")}>
                {children}
            </main>

            {!isCreatePage && <BottomNav />}
        </div>
    )
}
