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
    const { data, updateData, saveInvitation, error: contextError } = useInvitation()
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
                template: data.template || 'classic'
            }

            const id = await saveInvitation(finalData)
            if (id) {
                navigate(`/invitation/${id}`)
            }
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : "Server bilan bog'lanishda xatolik yuz berdi.";
            console.error("DEBUG: Create.tsx handleSubmit error:", err);
            setSaveError(errorMsg)
        } finally {
            setIsSaving(false)
        }
    }

    // Combine local error state with context error state
    const displayError = saveError || contextError;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-serif font-bold text-center text-primary-800 dark:text-primary-300 mb-8">
                {t('createTitle')}
            </h1>

            <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('weddingDetails')}</CardTitle>
                        <CardDescription>{t('enterDetails')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {displayError && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                {displayError}
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('brideName')}
                                </label>
                                <Input
                                    placeholder="Sarah"
                                    value={data.brideName}
                                    onChange={(e) => updateData({ brideName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('brideLastname')}
                                </label>
                                <Input
                                    placeholder="Algorithm"
                                    value={data.brideLastname}
                                    onChange={(e) => updateData({ brideLastname: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('groomName')}
                                </label>
                                <Input
                                    placeholder="John"
                                    value={data.groomName}
                                    onChange={(e) => updateData({ groomName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> {t('groomLastname')}
                                </label>
                                <Input
                                    placeholder="Coder"
                                    value={data.groomLastname}
                                    onChange={(e) => updateData({ groomLastname: e.target.value })}
                                    required
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {t('hall')}
                                </label>
                                <Input
                                    placeholder="e.g. Grand Hotel"
                                    value={data.hall}
                                    onChange={(e) => updateData({ hall: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {t('location')}
                                </label>
                                <Input
                                    placeholder="e.g. Tashkent, buyuk ipak yo'li"
                                    value={data.location}
                                    onChange={(e) => updateData({ location: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gold-900 dark:text-gold-200 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> {t('message')}
                            </label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-gold-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm placeholder:text-gold-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm dark:text-white"
                                placeholder={t('message')}
                                value={data.text}
                                onChange={(e) => updateData({ text: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t bg-gold-50/30 dark:bg-slate-900/10 p-6">
                        <Button type="button" variant="secondary" onClick={() => navigate("/")}>
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
