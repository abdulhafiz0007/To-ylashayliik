import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useInvitation, type InvitationData } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Calendar, MapPin, Clock, Heart, Download, Share2, Palette, X } from "lucide-react"
import { cn } from "../lib/utils"
import { templates } from "../lib/templates"
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { useLanguage } from "../context/LanguageContext"

export function Invitation() {
    const { id } = useParams<{ id: string }>()
    const { getInvitation, updateData, saveInvitation, loading: contextLoading, error: contextError } = useInvitation()
    const { t } = useLanguage()
    const [invitation, setInvitation] = useState<InvitationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showTemplates, setShowTemplates] = useState(false)

    // Ref for the invitation card to capture as image
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadInvitation = async () => {
            if (id) {
                const data = await getInvitation(id)
                setInvitation(data)
            }
            setLoading(false)
        }
        loadInvitation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])  // Only depend on id, not getInvitation (it's stable from context)

    const handleTemplateChange = async (template: string) => {
        if (invitation && id) {
            const updated = { ...invitation, template }
            setInvitation(updated)
            // Update global context
            updateData({ template })
            // Save to backend
            await saveInvitation(updated)
        }
    }

    const handleDownload = async () => {
        if (cardRef.current) {
            try {
                const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
                download(dataUrl, 'my-wedding-invitation.png');
            } catch (err) {
                console.error('oops, something went wrong!', err);
            }
        }
    }

    const handleShare = async () => {
        // Use Web Share API if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Wedding Invitation',
                    text: `You are invited to the wedding of ${invitation?.brideName} ${invitation?.brideLastname} & ${invitation?.groomName} ${invitation?.groomLastname}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard copy
            navigator.clipboard.writeText(window.location.href);
            alert(t('linkCopied'));
        }
    }

    if (loading || contextLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background transition-colors duration-500">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <Heart className="h-12 w-12 text-primary-300" />
                    <p className="text-gray-400 dark:text-gray-500 font-medium">{t('loading')}</p>
                </div>
            </div>
        )
    }

    if (contextError || (!invitation && !loading)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4 text-center bg-background transition-colors duration-500">
                <h1 className="text-2xl font-serif text-gold-900 dark:text-gold-200 font-bold">{t('notFound')}</h1>
                <p className="text-gold-600 dark:text-gold-400">{contextError || t('notAvailable')}</p>
                <Link to="/create">
                    <Button>{t('createNew')}</Button>
                </Link>
            </div>
        )
    }

    if (!invitation) return null

    const currentTemplate = templates.find(t => t.id === invitation.template) || templates[0]

    return (
        <div className="min-h-screen bg-background dark:bg-[#0f172a]/50 py-8 px-4 flex flex-col items-center relative transition-colors duration-500">

            {/* Toolbar */}
            <div className="fixed bottom-6 z-50 flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-full shadow-xl border border-gold-200 dark:border-slate-800">
                <Button
                    className="flex flex-col h-auto gap-1 p-2 text-xs bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-primary-900/20"
                    onClick={() => setShowTemplates(!showTemplates)}
                >
                    <Palette className="h-5 w-5" />
                    {t('style')}
                </Button>
                <div className="w-px h-8 bg-gold-200 dark:bg-slate-800"></div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-xs dark:text-gray-300 dark:hover:bg-slate-800"
                    onClick={handleDownload}
                >
                    <Download className="h-5 w-5" />
                    {t('save')}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-xs dark:text-gray-300 dark:hover:bg-slate-800"
                    onClick={handleShare}
                >
                    <Share2 className="h-5 w-5" />
                    {t('share')}
                </Button>
            </div>

            {/* Template Selection Drawer */}
            {showTemplates && (
                <div className="fixed inset-x-0 bottom-0 z-40 bg-card border-t border-border rounded-t-3xl shadow-2xl p-6 pb-24 animate-slide-up max-h-[60vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-serif text-xl text-gold-900 dark:text-gold-200">{t('chooseStyle')}</h3>
                        <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gold-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X className="h-5 w-5 text-gold-500 dark:text-gold-400" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {templates.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleTemplateChange(t.id)}
                                className={cn(
                                    "text-left p-3 rounded-xl border border-transparent transition-all hover:scale-105",
                                    invitation.template === t.id
                                        ? "ring-2 ring-primary-500 border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800"
                                        : "hover:bg-gold-50 dark:hover:bg-slate-800 border-gold-100 dark:border-slate-800"
                                )}
                            >
                                <div className={cn("text-sm font-medium", invitation.templateId === t.id ? "text-primary-700 dark:text-primary-300" : "text-gray-700 dark:text-gray-300")}>
                                    {t.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Invitation Card */}
            <div
                ref={cardRef}
                className={cn(
                    "w-full max-w-lg shadow-2xl overflow-hidden relative transition-all duration-500 aspect-[3/4] bg-cover bg-center",
                    currentTemplate.wrapperClass
                )}
                style={currentTemplate.backgroundImage ? { backgroundImage: `url(${currentTemplate.backgroundImage})` } : {}}
            >
                {/* Decorative Overlay */}
                {currentTemplate.overlayClass && (
                    <div className={currentTemplate.overlayClass} />
                )}

                <div className="h-full p-6 md:p-12 text-center flex flex-col justify-between relative z-10">
                    <div className="space-y-4 md:space-y-6">
                        <p className={cn("transition-all duration-500", currentTemplate.introClass)}>
                            {t('weddingOf')}
                        </p>
                        <div className={cn("transition-all duration-500 break-words", currentTemplate.namesClass)}>
                            <span className="block mb-1">{invitation.brideName} {invitation.brideLastname}</span>
                            <span className={cn("block font-normal", currentTemplate.ampersandClass)}>&</span>
                            <span className="block mt-1">{invitation.groomName} {invitation.groomLastname}</span>
                        </div>
                    </div>

                    <div className="flex justify-center flex-1 items-center py-4">
                        <Heart className={cn("h-8 w-8 md:h-12 md:w-12 fill-current animate-pulse transition-all duration-500", currentTemplate.iconClass)} />
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        {invitation.text && (
                            <p className={cn("whitespace-pre-wrap line-clamp-4 transition-all duration-500", currentTemplate.messageClass)}>
                                {invitation.text}
                            </p>
                        )}

                        <div className={cn("grid gap-3 md:gap-5 py-2 md:py-4 place-items-center transition-all duration-500", currentTemplate.detailsClass)}>
                            <div className="flex flex-col items-center space-y-1">
                                <Calendar className={cn("h-4 w-4 md:h-6 md:w-6 transition-colors duration-500", currentTemplate.iconClass)} />
                                <span className="font-semibold text-base md:text-xl font-sans tracking-tight">{invitation.date}</span>
                            </div>

                            <div className="flex flex-col items-center space-y-1">
                                <Clock className={cn("h-4 w-4 md:h-6 md:w-6 transition-colors duration-500", currentTemplate.iconClass)} />
                                <span className="font-semibold text-base md:text-xl font-sans tracking-tight">{invitation.time}</span>
                            </div>

                            <div className="flex flex-col items-center space-y-1">
                                <MapPin className={cn("h-4 w-4 md:h-6 md:w-6 transition-colors duration-500", currentTemplate.iconClass)} />
                                <span className="font-semibold text-sm md:text-lg text-center font-sans tooltip leading-tight max-w-[240px] px-2">{invitation.hall && <span className="block border-b border-white/20 pb-0.5 mb-0.5">{invitation.hall}</span>} {invitation.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 opacity-30 text-[8px] md:text-[10px] uppercase tracking-[0.2em] dark:text-gray-500">
                        Forever & Always • {new Date().getFullYear()}
                    </div>
                </div>
            </div>

        </div>
    )
}
