import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "../context/LanguageContext"
import { cn } from "../lib/utils"

interface CountdownProps {
    date: string
    time: string
    className?: string
    variant?: 'classic' | 'modern' | 'garden' | 'midnight' | 'default'
}

export function Countdown({ date, time, className, variant = 'default' }: CountdownProps) {
    const { t } = useLanguage()
    const [timeLeft, setTimeLeft] = useState<{
        days: number
        hours: number
        minutes: number
        seconds: number
        isFinished: boolean
    }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isFinished: false
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const target = new Date(`${date}T${time}:00`)
            const now = new Date()
            const difference = target.getTime() - now.getTime()

            if (difference <= 0) {
                setTimeLeft(prev => ({ ...prev, isFinished: true }))
                return
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isFinished: false
            })
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [date, time])

    if (timeLeft.isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("text-center py-4 font-serif italic text-lg opacity-80", className)}
            >
                {t('countdown.weddingDay')}
            </motion.div>
        )
    }

    const units = [
        { label: t('countdown.days'), value: timeLeft.days },
        { label: t('countdown.hours'), value: timeLeft.hours },
        { label: t('countdown.minutes'), value: timeLeft.minutes },
        { label: t('countdown.seconds'), value: timeLeft.seconds },
    ]

    const getVariantStyles = () => {
        switch (variant) {
            case 'classic':
                return {
                    container: "gap-4",
                    box: "bg-amber-50/50 border border-amber-200/50 rounded-xl p-2 min-w-[60px]",
                    value: "text-amber-800 font-black text-xl leading-none",
                    label: "text-[8px] uppercase tracking-widest text-amber-600/70 font-bold mt-1"
                }
            case 'modern':
                return {
                    container: "gap-2",
                    box: "bg-slate-50 border border-slate-100 rounded-lg p-3 min-w-[70px]",
                    value: "text-slate-900 font-light text-2xl leading-none",
                    label: "text-[7px] uppercase tracking-[0.2em] text-slate-400 font-black mt-2"
                }
            case 'garden':
                return {
                    container: "gap-3",
                    box: "bg-pink-50/30 border border-pink-100/50 rounded-full w-14 h-14 flex flex-col items-center justify-center",
                    value: "text-pink-600 font-bold text-lg leading-none",
                    label: "text-[7px] uppercase text-emerald-600/70 font-bold"
                }
            case 'midnight':
                return {
                    container: "gap-4",
                    box: "bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-lg p-2 min-w-[60px]",
                    value: "text-amber-200 font-black text-xl leading-none",
                    label: "text-[8px] uppercase tracking-widest text-amber-500/60 font-bold mt-1"
                }
            default:
                return {
                    container: "gap-3",
                    box: "bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 rounded-2xl p-3 min-w-[65px]",
                    value: "text-[#7e22ce] dark:text-pink-400 font-black text-xl leading-none",
                    label: "text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-1"
                }
        }
    }

    const { container, box, value, label } = getVariantStyles()

    return (
        <div className={cn("flex flex-col items-center", className)}>
            <div className={cn(
                "mb-4 text-center px-4",
                variant === 'classic' ? "text-amber-600 font-bold uppercase tracking-[0.2em] text-[10px]" :
                    variant === 'modern' ? "text-slate-400 font-black uppercase tracking-[0.3em] text-[8px]" :
                        variant === 'garden' ? "text-pink-500 font-bold uppercase tracking-[0.2em] text-[9px]" :
                            variant === 'midnight' ? "text-amber-400 font-bold uppercase tracking-[0.3em] text-[8px]" :
                                "text-gray-400 font-bold uppercase tracking-widest text-[10px]"
            )}>
                {t('countdown.title')}
            </div>
            <div className={cn("flex justify-center", container)}>
                <AnimatePresence mode="popLayout">
                    {units.map((unit) => (
                        <motion.div
                            key={unit.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn("flex flex-col items-center justify-center", box)}
                        >
                            <span className={value}>{unit.value.toString().padStart(2, '0')}</span>
                            <span className={label}>{unit.label}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
