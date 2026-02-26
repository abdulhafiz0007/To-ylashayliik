import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { templates } from "../lib/templates"
import { useLanguage } from "../context/LanguageContext"
import { useInvitation } from "../context/InvitationContext"
import { Eye, Sparkles } from "lucide-react"

export function Templates() {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { updateData } = useInvitation()

    const handlePreviewTemplate = (templateId: string) => {
        updateData({ template: templateId })
        navigate(`/templates/preview/${templateId}`)
    }

    return (
        <div className="min-h-screen animate-fade-in pb-32">
            {/* Header */}
            <div className="text-center pt-10 pb-8 px-4 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase tracking-widest border border-primary-100 dark:border-primary-800/30">
                    <Sparkles className="h-3 w-3" />
                    {t('premiumDesigns') || 'Premium Designs'}
                </div>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
                    {t('chooseStyle')}
                </p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-4 px-4 max-w-2xl mx-auto">
                {templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                    >
                        <button
                            onClick={() => handlePreviewTemplate(template.id)}
                            className="w-full text-left group focus:outline-none"
                        >
                            <div className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-xl active:scale-[0.97] transition-all duration-300 border border-slate-100 dark:border-slate-800">
                                {/* Thumbnail */}
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img
                                        src={template.thumbnail}
                                        alt={template.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Category badge */}
                                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider 
                                        ${template.category === 'Premium'
                                            ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                                            : 'bg-white/90 dark:bg-slate-900/90 text-primary-600 dark:text-primary-400'
                                        }`}>
                                        {template.category}
                                    </div>

                                    {/* Preview icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                            <Eye className="h-5 w-5 text-slate-800" />
                                        </div>
                                    </div>

                                    {/* Bottom name overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-white text-[9px] uppercase tracking-[0.15em] font-bold opacity-80">
                                            {template.type}
                                        </p>
                                        <h3 className="text-white font-black text-sm leading-tight">
                                            {template.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* Preview Button */}
                                <div className="px-3 py-3">
                                    <div className="w-full h-10 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-primary-200 dark:group-hover:shadow-primary-900/30 transition-shadow">
                                        <Eye className="h-4 w-4 text-white" />
                                        <span className="text-white font-black text-sm">{t('previewBtn')}</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
