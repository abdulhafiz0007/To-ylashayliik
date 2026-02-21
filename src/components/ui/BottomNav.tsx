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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800 rounded-full shadow-2xl p-1.5 flex items-center">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex flex-col items-center justify-center transition-all h-12 px-6 rounded-full group min-w-[80px]",
                            isActive
                                ? "bg-primary-500 text-white shadow-lg"
                                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                        )}
                    >
                        <Icon className={cn("h-5 w-5 mb-0.5 transition-transform group-hover:scale-110", isActive ? "stroke-[2.5]" : "stroke-2")} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                    </Link>
                )
            })}
        </div>
    )
}
