import { Link, useLocation } from "react-router-dom"
import { Home, Palette } from "lucide-react"
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
                                "flex flex-col items-center justify-center space-y-1 transition-all",
                                isActive
                                    ? "text-primary-600 dark:text-primary-400"
                                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                            )}
                        >
                            <div className={cn(
                                "p-1 rounded-lg transition-all",
                                isActive && "bg-primary-50 dark:bg-primary-900/20"
                            )}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
