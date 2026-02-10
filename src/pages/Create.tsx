import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useInvitation } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Calendar, MapPin, MessageSquare, Users, Clock } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"

export function Create() {
    const navigate = useNavigate()
    const { data, updateData, saveInvitation } = useInvitation()
    const { t } = useLanguage()
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setSaveError(null)

        try {
            // Set a default template if none selected
            const finalData = {
                ...data,
                templateId: data.templateId || 'premium_minimal'
            }

            const id = await saveInvitation(finalData)
            if (id) {
                navigate(`/invitation/${id}`)
            } else {
                setSaveError("Ma'lumotlarni saqlashda xatolik yuz berdi. Iltimos qayta urinib ko'ring.")
            }
        } catch (err) {
            setSaveError("Server bilan bog'lanishda xatolik yuz berdi.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-serif font-bold text-center text-primary-800 dark:text-primary-300 mb-8">
                {t('createTitle')}
            </h1>

            <form onSubmit={handleSubmit}>
                <Card className="border-gold-200 dark:border-slate-700 shadow-lg dark:bg-slate-800">
                    <CardHeader>
                        <CardTitle className="dark:text-white">{t('weddingDetails')}</CardTitle>
                        <CardDescription className="dark:text-gray-400">{t('enterDetails')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {saveError && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {saveError}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('brideName')}
                                </label>
                                <Input
                                    placeholder="e.g. Sarah Algorithm"
                                    value={data.brideName}
                                    onChange={(e) => updateData({ brideName: e.target.value })}
                                    required
                                    className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('groomName')}
                                </label>
                                <Input
                                    placeholder="e.g. John Coder"
                                    value={data.groomName}
                                    onChange={(e) => updateData({ groomName: e.target.value })}
                                    required
                                    className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> {t('date')}
                                </label>
                                <Input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => updateData({ date: e.target.value })}
                                    required
                                    className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> {t('time')}
                                </label>
                                <Input
                                    type="time"
                                    value={data.time}
                                    onChange={(e) => updateData({ time: e.target.value })}
                                    required
                                    className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> {t('location')}
                            </label>
                            <Input
                                placeholder="e.g. Grand Hotel, Tashkent"
                                value={data.location}
                                onChange={(e) => updateData({ location: e.target.value })}
                                required
                                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> {t('message')}
                            </label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-gold-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm placeholder:text-gold-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm dark:text-white"
                                placeholder={t('message')}
                                value={data.message}
                                onChange={(e) => updateData({ message: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t border-gold-100 dark:border-slate-700 bg-gold-50/30 dark:bg-slate-900/30 p-6">
                        <Button type="button" variant="secondary" onClick={() => navigate("/")} className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? t('loading') : t('previewBtn')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
