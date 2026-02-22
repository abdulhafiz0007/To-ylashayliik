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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0,05)]">
            <div className="container mx-auto px-6 h-16 flex items-center justify-around relative">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center transition-all px-4 h-full relative group",
                                isActive ? "text-primary-500" : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                            )}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary-500 rounded-b-full shadow-[0_2px_10px_rgba(236,72,153,0.3)] animate-in fade-in slide-in-from-top-1 duration-300" />
                            )}

                            <Icon className={cn(
                                "h-6 w-6 mb-1 transition-all duration-300",
                                isActive ? "stroke-[2.5]" : "stroke-2 group-hover:scale-110"
                            )} />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>
                                {item.label}
                            </span>

                            {/* Dot indicator for non-active hover or just a subtle flair */}
                            {!isActive && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-50/0 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/20 -z-10 transition-all duration-300 scale-75 group-hover:scale-100" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
