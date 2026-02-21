import { Link, useLocation } from "react-router-dom"
import { Home, Palette, User } from "lucide-react"
import { cn } from "../../lib/utils"
import { useLanguage } from "../../context/LanguageContext"

export function BottomNav() {
    const location = useLocation()
    const { t } = useLanguage()

    const navItems = [
        {
            label: t('home'),
            path: '/',
            icon: Home
        },
        {
            label: t('templates'),
            path: '/templates',
            icon: Palette
        },
        {
            label: t('profile.title'),
            path: '/profile',
            icon: User
        }
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-gold-100 dark:border-slate-800 pb-safe">
            <div className="container mx-auto px-4 h-16 flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center transition-all h-full px-4 rounded-2xl",
                                isActive
                                    ? "bg-blue-600 text-white shadow-md scale-105"
                                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                            )}
                        >
                            <Icon className={cn("h-6 w-6 mb-1", isActive ? "stroke-[2.5]" : "stroke-2")} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
