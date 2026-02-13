import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { templates } from "../lib/templates"
import { useLanguage } from "../context/LanguageContext"
import { useInvitation } from "../context/InvitationContext"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

export function Templates() {
    const navigate = useNavigate()
    const { t } = useLanguage()
    const { updateData } = useInvitation()

    const handleSelectTemplate = (templateId: string) => {
        updateData({ template: templateId })
        navigate("/create")
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 pb-24 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                    {t('templates')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    O'zingizga ma'qul kelgan premium uslubni tanlang va yaratishni boshlang.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                    >
                        <Card className="overflow-hidden border-gold-100 dark:border-slate-800 shadow-md hover:shadow-xl dark:bg-slate-900 rounded-2xl transition-all duration-300">
                            <div className="aspect-[3/4.5] relative overflow-hidden">
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-4">
                                    <Button
                                        size="sm"
                                        className="bg-white text-gray-900 hover:bg-gold-50 shadow-xl scale-90 group-hover:scale-100 transition-all duration-300"
                                        onClick={() => handleSelectTemplate(template.id)}
                                    >
                                        Tanlash
                                    </Button>
                                </div>
                                {template.id === 'royal_gold' && (
                                    <div className="absolute top-2 right-2 bg-gold-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg uppercase tracking-widest z-10">
                                        Vip
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-3 text-center border-t border-gold-50 dark:border-slate-800">
                                <h3 className="font-bold text-gray-900 dark:text-white text-xs truncate">{template.name}</h3>
                                <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-tighter">
                                    {template.type || 'Wedding Style'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
