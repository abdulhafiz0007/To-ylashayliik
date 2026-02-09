import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useInvitation } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { templates } from "../lib/templates"
import { cn } from "../lib/utils"
import { Calendar, Heart, MapPin, Clock } from "lucide-react"

export function TemplateSelection() {
    const navigate = useNavigate()
    const { data, updateData, saveInvitation } = useInvitation()
    const [selectedTemplate, setSelectedTemplate] = useState(data.templateId || "classic")

    // Show only first 6 templates
    const displayTemplates = templates.slice(0, 6)

    const handleSave = () => {
        // Generate ID and save
        const id = Math.random().toString(36).substring(7)
        updateData({ templateId: selectedTemplate })
        saveInvitation(id)
        navigate(`/invitation/${id}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Choose Your Perfect Design
                    </h1>
                    <p className="text-xl text-gray-600">
                        Select a template that matches your style
                    </p>
                </div>

                {/* Template Grid - Styled like physical cards on a table */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-12 mb-16">
                    {displayTemplates.map((template) => {
                        const isSelected = selectedTemplate === template.id

                        return (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={cn(
                                    "group relative bg-white rounded-lg overflow-hidden transition-all duration-300",
                                    "shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.2)]",
                                    "hover:-translate-y-2 transform",
                                    isSelected && "ring-4 ring-primary-500 shadow-[0_20px_60px_rgba(219,39,119,0.3)]"
                                )}
                            >
                                {/* Card Content - Full detailed invitation preview */}
                                <div
                                    className={cn("p-3 lg:p-8 aspect-[3/4] relative overflow-hidden bg-cover bg-center", template.wrapperClass)}
                                    style={template.backgroundImage ? { backgroundImage: `url(${template.backgroundImage})` } : {}}
                                >
                                    {/* Decorative elements based on template (only if no background image) */}
                                    {!template.backgroundImage && template.id === "classic" && (
                                        <>
                                            <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-gold-400 opacity-60"></div>
                                            <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-gold-400 opacity-60"></div>
                                            <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-gold-400 opacity-60"></div>
                                            <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-gold-400 opacity-60"></div>
                                        </>
                                    )}

                                    {template.id === "floral" && (
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300 to-transparent rounded-full blur-2xl"></div>
                                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-300 to-transparent rounded-full blur-2xl"></div>
                                        </div>
                                    )}

                                    {template.id === "midnight" && (
                                        <div className="absolute inset-0">
                                            <div className="absolute top-8 right-8 w-2 h-2 bg-gold-300 rounded-full animate-pulse"></div>
                                            <div className="absolute top-16 right-16 w-1 h-1 bg-gold-400 rounded-full animate-pulse delay-100"></div>
                                            <div className="absolute top-12 right-24 w-1.5 h-1.5 bg-gold-200 rounded-full animate-pulse delay-200"></div>
                                            <div className="absolute bottom-16 left-12 w-2 h-2 bg-gold-300 rounded-full animate-pulse delay-300"></div>
                                            <div className="absolute bottom-24 left-20 w-1 h-1 bg-gold-400 rounded-full animate-pulse delay-400"></div>
                                        </div>
                                    )}

                                    <div className="h-full flex flex-col justify-between text-center relative z-10">
                                        {/* Top Section */}
                                        <div className="space-y-1 lg:space-y-3">
                                            <p className={cn("text-[9px] lg:text-xs tracking-widest uppercase", template.introClass)}>
                                                The Wedding Of
                                            </p>

                                            {/* Names */}
                                            <div className={cn("space-y-0 lg:space-y-1", template.namesClass)}>
                                                <h3 className="text-base lg:text-3xl font-serif font-bold">
                                                    {data.brideName || "Bride"}
                                                </h3>
                                                <div className={cn("text-sm lg:text-2xl font-serif", template.ampersandClass)}>
                                                    &
                                                </div>
                                                <h3 className="text-base lg:text-3xl font-serif font-bold">
                                                    {data.groomName || "Groom"}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Center Heart */}
                                        <div className="flex justify-center">
                                            <Heart className={cn("h-4 w-4 lg:h-8 lg:w-8 fill-current", template.iconClass)} />
                                        </div>

                                        {/* Bottom Details */}
                                        <div className="space-y-1 lg:space-y-4">
                                            <div className={cn("space-y-1 lg:space-y-2 text-[9px] lg:text-sm", template.detailsClass)}>
                                                <div className="flex items-center justify-center gap-1 lg:gap-2">
                                                    <Calendar className={cn("h-2.5 w-2.5 lg:h-4 lg:w-4", template.iconClass)} />
                                                    <span>{data.date || "Date"}</span>
                                                </div>

                                                <div className="flex items-center justify-center gap-1 lg:gap-2">
                                                    <Clock className={cn("h-2.5 w-2.5 lg:h-4 lg:w-4", template.iconClass)} />
                                                    <span>{data.time || "Time"}</span>
                                                </div>

                                                <div className="flex items-center justify-center gap-1 lg:gap-2">
                                                    <MapPin className={cn("h-2.5 w-2.5 lg:h-4 lg:w-4", template.iconClass)} />
                                                    <span className="text-[8px] lg:text-xs">{data.location || "Location"}</span>
                                                </div>
                                            </div>

                                            {/* Footer tagline */}
                                            <p className={cn("text-[8px] lg:text-xs italic opacity-70", template.detailsClass)}>
                                                Forever & Always • {new Date().getFullYear()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Template Name Label */}
                                <div className={cn(
                                    "py-2 lg:py-4 px-3 lg:px-6 text-center font-semibold text-xs lg:text-base transition-all",
                                    isSelected
                                        ? "bg-primary-600 text-white"
                                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 group-hover:from-primary-50 group-hover:to-primary-100"
                                )}>
                                    {template.name}
                                </div>

                                {/* Selection Checkmark */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 lg:top-6 lg:right-6 bg-primary-600 text-white rounded-full p-1 lg:p-2.5 shadow-xl z-20 animate-scale-in">
                                        <svg className="w-3 h-3 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-6">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate("/create")}
                        className="px-8 text-base"
                    >
                        ← Back to Edit
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleSave}
                        className="px-16 text-base shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300"
                    >
                        Save & Continue →
                    </Button>
                </div>
            </div>
        </div>
    )
}
