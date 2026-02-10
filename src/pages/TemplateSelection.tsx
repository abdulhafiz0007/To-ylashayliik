import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useInvitation } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { templates } from "../lib/templates"
import { cn } from "../lib/utils"
import { Calendar, Heart, MapPin, Clock, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"

export function TemplateSelection() {
    const navigate = useNavigate()
    const { data, saveInvitation, loading } = useInvitation()
    const { t, language } = useLanguage()
    const [currentIndex, setCurrentIndex] = useState(() => {
        const idx = templates.findIndex(t => t.id === data.templateId);
        return idx !== -1 ? idx : 0;
    })

    const displayTemplates = templates

    const nextTemplate = () => {
        setCurrentIndex((prev) => (prev + 1) % displayTemplates.length)
    }

    const prevTemplate = () => {
        setCurrentIndex((prev) => (prev - 1 + displayTemplates.length) % displayTemplates.length)
    }

    const handleSave = async () => {
        if (loading) return
        const currentData = { ...data, templateId: displayTemplates[currentIndex].id }
        const id = await saveInvitation(currentData)
        if (id) {
            navigate(`/invitation/${id}`)
        }
    }

    const currentTemplate = displayTemplates[currentIndex]

    return (
        <div className="min-h-[calc(100-64px)] bg-gradient-to-b from-amber-50/50 to-white dark:from-slate-900 dark:to-slate-950 py-8 lg:py-16 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        {t('chooseStyle')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 dark:text-gray-400"
                    >
                        {t('selectTemplate')}
                    </motion.p>
                </div>

                {/* Immersive Mobile-First Preview Area */}
                <div className="relative flex flex-col items-center">
                    {/* Main Stage */}
                    <div className="relative w-full max-w-[320px] lg:max-w-md aspect-[9/19] lg:aspect-[9/16] mb-12">
                        {/* Phone Frame wrapper */}
                        <div className="absolute inset-0 border-8 border-gray-900 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden bg-white dark:bg-slate-900 z-10 transition-colors">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentTemplate.id}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 300 }}
                                    className={cn("h-full w-full p-6 lg:p-10 flex flex-col justify-between text-center relative bg-cover bg-center transition-all", currentTemplate.wrapperClass)}
                                    style={currentTemplate.backgroundImage ? { backgroundImage: `url(${currentTemplate.backgroundImage})` } : {}}
                                >
                                    {/* Decorative Overlay */}
                                    {currentTemplate.overlayClass && (
                                        <div className={currentTemplate.overlayClass} />
                                    )}

                                    {/* Content Preview */}
                                    <div className="space-y-4 lg:space-y-6 relative z-10 mt-4 md:mt-8">
                                        <p className={cn("transition-all", currentTemplate.introClass)}>
                                            {t('weddingOf')}
                                        </p>
                                        <div className={cn("transition-all break-words", currentTemplate.namesClass)}>
                                            <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold mb-1">
                                                {data.brideName || (language === 'uz' ? "Kelin" : language === 'ru' ? "Невеста" : "Bride")}
                                            </h3>
                                            <div className={cn("transition-all", currentTemplate.ampersandClass)}>
                                                &
                                            </div>
                                            <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold mt-1">
                                                {data.groomName || (language === 'uz' ? "Kuyov" : language === 'ru' ? "Жених" : "Groom")}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex justify-center relative z-10 flex-1 items-center">
                                        <Heart className={cn("h-6 w-6 lg:h-10 lg:w-10 fill-current", currentTemplate.iconClass)} />
                                    </div>

                                    <div className="space-y-4 lg:space-y-6 relative z-10 mb-8 md:mb-12">
                                        <div className={cn("transition-all text-[10px] md:text-sm lg:text-base", currentTemplate.detailsClass)}>
                                            <div className="flex items-center justify-center gap-2">
                                                <Calendar className={cn("h-3 w-3 lg:h-5 lg:w-5", currentTemplate.iconClass)} />
                                                <span className="font-medium">{data.date || t('date')}</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                <Clock className={cn("h-3 w-3 lg:h-5 lg:w-5", currentTemplate.iconClass)} />
                                                <span className="font-medium">{data.time || t('time')}</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 mt-2 px-6">
                                                <MapPin className={cn("h-3 w-3 lg:h-5 lg:w-5", currentTemplate.iconClass)} />
                                                <span className="line-clamp-2 leading-tight">{data.location || t('location')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating check for selected state */}
                                    <div className="absolute top-6 right-6 bg-primary-500 text-white rounded-full p-2 shadow-lg z-20">
                                        <Check className="h-5 w-5" />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-16 lg:-left-24 z-20 hidden lg:block">
                            <button
                                onClick={prevTemplate}
                                className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 hover:scale-110 transition-transform dark:text-gray-200"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-16 lg:-right-24 z-20 hidden lg:block">
                            <button
                                onClick={nextTemplate}
                                className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 hover:scale-110 transition-transform dark:text-gray-200"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        </div>
                    </div>

                    {/* Small Thumbnails Carousel for Mobile */}
                    <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 px-4 w-full justify-start lg:justify-center no-scrollbar">
                        {displayTemplates.map((template, idx) => (
                            <button
                                key={template.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "flex-shrink-0 w-24 aspect-[2/3] rounded-lg border-2 transition-all p-1 overflow-hidden relative grayscale hover:grayscale-0",
                                    currentIndex === idx
                                        ? "border-primary-500 ring-2 ring-primary-500/20 grayscale-0 scale-110 z-10"
                                        : "border-transparent opacity-60"
                                )}
                            >
                                <div
                                    className={cn("h-full w-full rounded p-1 flex flex-col justify-center text-[6px]", template.wrapperClass)}
                                    style={template.backgroundImage ? { backgroundImage: `url(${template.backgroundImage})` } : {}}
                                >
                                    <div className={template.namesClass}>
                                        <p>Preview</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <motion.div
                    layout
                    className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8"
                >
                    <button
                        onClick={() => navigate("/create")}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    >
                        ← {t('backToEdit')}
                    </button>
                    <Button
                        size="lg"
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full lg:w-72 h-14 text-lg font-bold shadow-[0_20px_50px_rgba(236,72,153,0.3)] dark:shadow-[0_20px_50px_rgba(236,72,153,0.1)] rounded-2xl"
                    >
                        {loading ? t('saving') : `${t('saveContinue')} →`}
                    </Button>
                </motion.div>
            </div>

            {/* Background Decorative Blobs */}
            <div className="fixed -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-[120px] -z-10" />
            <div className="fixed -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gold-100 dark:bg-gold-900/10 rounded-full blur-[120px] -z-10" />
        </div>
    )
}
