import { useParams, useNavigate } from "react-router-dom"
import { templates } from "../lib/templates"
import { WeddingCard } from "../components/WeddingCard"
import { Button } from "../components/ui/Button"
import { ChevronLeft, Check } from "lucide-react"
import { useInvitation } from "../context/InvitationContext"
import { useLanguage } from "../context/LanguageContext"
import { motion } from "framer-motion"

export function TemplatePreview() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { updateData } = useInvitation()
    const { t } = useLanguage()

    const template = templates.find(t => t.id === id)

    if (!template) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 mb-4">{t('invitationNotFound')}</p>
                <Button onClick={() => navigate("/templates")}>{t('back')}</Button>
            </div>
        )
    }

    // Sample data for preview
    const sampleInvitation = {
        groomName: "Sanjar",
        brideName: "Malika",
        date: "2026-08-28",
        time: "18:00",
        hall: "Zarafshon Tantanalar Saroyi",
        location: "Toshkent shahri, Yunusobod tumani",
        text: "Allohning izni bilan, qalblarimiz birikadigan ushbu fayzli oqshomda siz azizlarni go'zal to'y bazmimizda kutib qolamiz.",
    }

    const handleUseTemplate = () => {
        updateData({ template: template.id })
        navigate("/create")
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black/40 flex flex-col">
            {/* Top Bar */}
            {/* <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
                <button
                    onClick={() => navigate("/templates")}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"
                >
                    <ChevronLeft className="h-5 w-5" />
                    <span>{t('back')}</span>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none">Preview</span>
                    <span className="text-[10px] text-slate-400 font-medium">{template.name}</span>
                </div>
                <div className="w-10" /> 
            </header> */}

            <main className="flex-1 overflow-y-auto py-8 px-4 flex justify-center items-start">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[420px] shadow-2xl rounded-[2.5rem] overflow-hidden bg-white"
                >
                    <WeddingCard
                        invitation={sampleInvitation}
                        template={template}
                    />
                </motion.div>
            </main>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-0 z-50 w-full p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800">
                <div className="container mx-auto max-w-lg flex gap-4">
                    <Button
                        variant="ghost"
                        className="flex-1 h-12 rounded-2xl font-bold bg-white dark:bg-slate-800 mr-2"
                        onClick={() => navigate("/templates")}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        {t('back')}
                    </Button>
                    <Button
                        className="flex-[2] h-12 rounded-2xl font-black bg-primary-500 hover:bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-none space-x-2"
                        onClick={handleUseTemplate}
                    >
                        <Check className="h-5 w-5 stroke-[3]" />
                        <span>{t('saveContinue')}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
