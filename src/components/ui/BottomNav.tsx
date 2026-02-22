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
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-1.5 flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center transition-all px-4 h-12 rounded-2xl group relative min-w-[70px]",
                                isActive ? "text-primary-500" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400"
                            )}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-primary-50/50 dark:bg-primary-900/20 rounded-2xl animate-in fade-in zoom-in-95 duration-300" />
                            )}

                            <Icon className={cn(
                                "h-5 w-5 transition-all duration-300 relative z-10",
                                isActive ? "stroke-[2.5]" : "stroke-2 group-hover:scale-110"
                            )} />
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider relative z-10 mt-0.5",
                                isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
