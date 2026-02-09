import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useInvitation, type InvitationData } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Calendar, MapPin, Clock, Heart, Download, Share2, Palette, X } from "lucide-react"
import { cn } from "../lib/utils"
import { templates } from "../lib/templates"
import { toPng } from 'html-to-image'
import download from 'downloadjs'

export function Invitation() {
    const { id } = useParams<{ id: string }>()
    const { getInvitation, updateData, saveInvitation, loading: contextLoading, error: contextError } = useInvitation()
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
    }, [id, getInvitation])

    const handleTemplateChange = async (templateId: string) => {
        if (invitation && id) {
            const updated = { ...invitation, templateId }
            setInvitation(updated)
            // Update global context
            updateData({ templateId })
            // Save to backend
            await saveInvitation()
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
                    text: `You are invited to the wedding of ${invitation?.brideName} & ${invitation?.groomName}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard copy
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    }

    if (loading || contextLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                    <Heart className="h-12 w-12 text-primary-300" />
                    <p className="text-gray-400 font-medium">Yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (contextError || (!invitation && !loading)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4 text-center">
                <h1 className="text-2xl font-serif text-gold-900 font-bold">Taklifnoma topilmadi</h1>
                <p className="text-gold-600">{contextError || "Taklifnoma mavjud emas yoki muddati o'tgan."}</p>
                <Link to="/create">
                    <Button>Yangi yaratish</Button>
                </Link>
            </div>
        )
    }

    const currentTemplate = templates.find(t => t.id === invitation.templateId) || templates[0]

    return (
        <div className="min-h-screen bg-[#fbf9f1] py-8 px-4 flex flex-col items-center relative">

            {/* Toolbar */}
            <div className="fixed bottom-6 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl border border-gold-200">
                <Button
                    className="flex flex-col h-auto gap-1 p-2 text-xs bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200"
                    onClick={() => setShowTemplates(!showTemplates)}
                >
                    <Palette className="h-5 w-5" />
                    Style
                </Button>
                <div className="w-px h-8 bg-gold-200"></div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-xs"
                    onClick={handleDownload}
                >
                    <Download className="h-5 w-5" />
                    Save
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto gap-1 p-2 text-xs"
                    onClick={handleShare}
                >
                    <Share2 className="h-5 w-5" />
                    Share
                </Button>
            </div>

            {/* Template Selection Drawer */}
            {showTemplates && (
                <div className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-gold-200 rounded-t-3xl shadow-2xl p-6 pb-24 animate-slide-up max-h-[60vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-serif text-xl text-gold-900">Choose a Style</h3>
                        <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-gold-50 rounded-full">
                            <X className="h-5 w-5 text-gold-500" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {templates.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleTemplateChange(t.id)}
                                className={cn(
                                    "text-left p-3 rounded-xl border border-transparent transition-all hover:scale-105",
                                    invitation.templateId === t.id ? "ring-2 ring-primary-500 border-primary-200 bg-primary-50" : "hover:bg-gold-50 border-gold-100"
                                )}
                            >
                                <div className={cn("text-sm font-medium", invitation.templateId === t.id ? "text-primary-700" : "text-gray-700")}>
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
                <div className="h-full p-8 md:p-12 text-center flex flex-col justify-between">
                    <div className="space-y-4">
                        <p className={currentTemplate.introClass}>The Wedding Of</p>
                        <div className={currentTemplate.namesClass}>
                            <span className="block leading-tight">{invitation.brideName}</span>
                            <span className={currentTemplate.ampersandClass}>&</span>
                            <span className="block leading-tight">{invitation.groomName}</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Heart className={cn("h-8 w-8 fill-current animate-pulse", currentTemplate.iconClass)} />
                    </div>

                    <div className="space-y-6">
                        <p className={currentTemplate.messageClass}>{invitation.message}</p>

                        <div className={cn("grid gap-4 py-4 place-items-center", currentTemplate.detailsClass)}>
                            <div className="flex flex-col items-center space-y-1">
                                <Calendar className={cn("h-5 w-5", currentTemplate.iconClass)} />
                                <span className="font-semibold text-lg font-sans tracking-tight">{invitation.date}</span>
                            </div>

                            <div className="flex flex-col items-center space-y-1">
                                <Clock className={cn("h-5 w-5", currentTemplate.iconClass)} />
                                <span className="font-semibold text-lg font-sans tracking-tight">{invitation.time}</span>
                            </div>

                            <div className="flex flex-col items-center space-y-1">
                                <MapPin className={cn("h-5 w-5", currentTemplate.iconClass)} />
                                <span className="font-semibold text-base text-center font-sans leading-tight max-w-[200px]">{invitation.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="opacity-40 text-[10px] uppercase tracking-[0.2em]">Forever & Always • {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}
