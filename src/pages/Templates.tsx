import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { templates } from "../lib/templates"
import { useLanguage } from "../context/LanguageContext"
import { useInvitation } from "../context/InvitationContext"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Heart, Sparkles } from "lucide-react"

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template, index) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="overflow-hidden border-gold-100 dark:border-slate-800 shadow-lg dark:bg-slate-900">
                            <div className="aspect-[3/4] relative group">
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 space-y-4">
                                    <div className="flex gap-2">
                                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white">
                                            <Heart className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-white text-gray-900 hover:bg-gold-50"
                                        onClick={() => handleSelectTemplate(template.id)}
                                    >
                                        Tanlash
                                    </Button>
                                </div>
                                {template.id === 'royal_gold' && (
                                    <div className="absolute top-4 right-4 bg-gold-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
                                        Premium
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-4 text-center">
                                <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-tighter">
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
