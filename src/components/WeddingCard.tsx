import type { InvitationData } from "../context/InvitationContext"
import type { TemplateConfig } from "../lib/templates"
import { Clock, MapPin, Calendar, Heart, Star, Flower2, Diamond, Sparkles, Building2 } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { cn } from "../lib/utils"
import defaultGroom from "../assets/default_groom.jpg"
import defaultBride from "../assets/default_bride.jpg"

interface WeddingCardProps {
    invitation: Partial<InvitationData>
    template: TemplateConfig
    cardRef?: React.RefObject<HTMLDivElement | null>
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function getDay(date?: string) {
    if (!date) return "28"
    return date.includes('-') ? date.split('-')[2] : date.split(' ')[0]
}
function getMonth(date?: string) {
    if (!date) return "August"
    if (date.includes('-')) return new Date(date).toLocaleString('default', { month: 'long' })
    return date.split(' ')[1]
}

// Default avatars
const DEFAULT_GROOM = defaultGroom
const DEFAULT_BRIDE = defaultBride

// ─── PhotoSlot ───────────────────────────────────────────────────────────────
function Photo({ src, size = 80, className = "", personType = "groom" }: {
    src?: string;
    size?: number | string;
    className?: string;
    personType?: "groom" | "bride"
}) {
    const fallback = personType === "bride" ? DEFAULT_BRIDE : DEFAULT_GROOM

    const trimmedSrc = typeof src === 'string' ? src.trim() : src
    const isValidSrc = !!trimmedSrc &&
        typeof trimmedSrc === 'string' &&
        trimmedSrc !== "" &&
        trimmedSrc !== "null" &&
        trimmedSrc !== "undefined" &&
        !trimmedSrc.toLowerCase().includes("null") &&
        !trimmedSrc.toLowerCase().includes("undefined") &&
        (trimmedSrc.startsWith("http") || trimmedSrc.startsWith("blob:") || trimmedSrc.startsWith("data:") || trimmedSrc.startsWith("/"))

    const finalSrc = isValidSrc ? (trimmedSrc as string) : fallback
    const dimStyle = typeof size === 'number' ? { width: size, height: size } : {}

    return (
        <div
            className={`overflow-hidden bg-gray-100/10 flex items-center justify-center ${className}`}
            style={dimStyle}
        >
            <img
                src={finalSrc}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== fallback) {
                        target.src = fallback;
                    }
                }}
            />
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — Classic Royale
// Gold bordered, vertical layout, side-by-side oval portraits, info below
// ════════════════════════════════════════════════════════════════════════════
function ClassicRoyale({ invitation }: { invitation: Partial<InvitationData> }) {
    return (
        <div className="relative w-full min-h-[620px] bg-[#fffdf5] flex flex-col items-center overflow-hidden select-none">
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')]" />

            {/* Gold corner ornaments - More Ornate */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-amber-400/40" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-amber-400/40" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-amber-400/40" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-amber-400/40" />

            {/* Inner gold border */}
            <div className="absolute inset-4 border border-amber-200/80 pointer-events-none" />

            {/* Header */}
            <div className="mt-10 mb-6 text-center">
                <p className="text-[9px] uppercase tracking-[0.5em] text-amber-600 font-bold">— To'y Taklifnomasi —</p>
            </div>

            {/* Portrait row */}
            <div className="flex items-end justify-center gap-6 px-6 mb-6">
                {/* Groom */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-300 to-amber-100 scale-105" />
                        <Photo
                            src={invitation.groomPictureGetUrl}
                            size={96}
                            className="rounded-full border-4 border-amber-300 relative z-10"
                        />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-1.5 mt-1">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-amber-600 font-bold text-center">Kuyov</p>
                        <p className="text-sm font-black text-slate-800 text-center mt-0.5">
                            {invitation.groomName || "Sanjar"}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex flex-col items-center gap-1 mb-6">
                    <div className="h-8 w-px bg-amber-200" />
                    <Heart className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <div className="h-8 w-px bg-amber-200" />
                </div>

                {/* Bride */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-pink-200 to-amber-100 scale-105" />
                        <Photo
                            src={invitation.bridePictureGetUrl}
                            size={96}
                            className="rounded-full border-4 border-pink-300 relative z-10"
                            personType="bride"
                        />
                    </div>
                    <div className="bg-pink-50 border border-pink-200 rounded-xl px-4 py-1.5 mt-1">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-pink-500 font-bold text-center">Kelin</p>
                        <p className="text-sm font-black text-slate-800 text-center mt-0.5">
                            {invitation.brideName || "Malika"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gold rule */}
            <div className="flex items-center gap-3 w-3/4 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-300" />
                <Diamond className="h-3 w-3 text-amber-400 fill-amber-400" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-300" />
            </div>

            {/* Invitation text */}
            <p className="text-[10px] text-slate-500 text-center px-10 leading-relaxed italic mb-6">
                {invitation.text || "Allohning izni bilan ikki qalbning to'yiga siz azizlarni taklif etamiz."}
            </p>

            {/* Wedding details */}
            <div className="w-full px-8 border-t border-b border-amber-100 py-6 space-y-4 bg-amber-50/50">
                <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center text-amber-700">
                        <Calendar className="h-4 w-4 mb-1 opacity-60" />
                        <p className="text-[8px] uppercase tracking-widest opacity-60 font-bold">Sana</p>
                        <p className="font-black text-base leading-tight mt-0.5">
                            {getDay(invitation.date)} {getMonth(invitation.date)}
                        </p>
                    </div>
                    <div className="w-px h-10 bg-amber-200" />
                    <div className="flex flex-col items-center text-amber-700">
                        <Clock className="h-4 w-4 mb-1 opacity-60" />
                        <p className="text-[8px] uppercase tracking-widest opacity-60 font-bold">Vaqt</p>
                        <p className="font-black text-base leading-tight mt-0.5">{invitation.time || "18:00"}</p>
                    </div>
                </div>
                <div className="flex items-start justify-center gap-2.5 text-amber-800 pt-2 border-t border-amber-100/80">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 opacity-60" />
                    <div className="text-center">
                        <p className="font-black text-sm">{invitation.hall || "Zarafshon Saroyi"}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 pb-8">
                <p className="text-[8px] text-amber-400 uppercase tracking-[0.4em] text-center">✦ Siz bilan birga ✦</p>
            </div>
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — Modern Minimal
// Black/white split, groom left panel, bride right panel, details below
// ════════════════════════════════════════════════════════════════════════════
function ModernMinimal({ invitation }: { invitation: Partial<InvitationData> }) {
    return (
        <div className="w-full min-h-[620px] bg-white flex flex-col overflow-hidden select-none">
            {/* Split photo hero */}
            <div className="flex h-64 relative">
                {/* Left — Groom, dark */}
                <div className="w-1/2 bg-slate-950 flex flex-col items-center justify-end pb-6 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <Photo src={invitation.groomPictureGetUrl} size="full" className="w-full h-full opacity-60 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    </div>
                    <div className="relative z-10 text-center">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-slate-400 font-bold">Kuyov</p>
                    </div>
                </div>

                {/* Right — Bride, light */}
                <div className="w-1/2 bg-white flex flex-col items-center justify-end pb-6 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <Photo src={invitation.bridePictureGetUrl} size="full" className="w-full h-full opacity-50 object-cover" personType="bride" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                    </div>
                    <div className="relative z-10 text-center">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-slate-500 font-black">Kelin</p>
                    </div>
                </div>

                {/* Center badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                </div>
            </div>

            {/* Center text block */}
            <div className="flex flex-col items-center py-8 px-8 text-center border-b border-slate-100">
                <p className="text-[8px] uppercase tracking-[0.5em] text-slate-400 font-bold mb-4">— To'y Taklifnomasi —</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {invitation.groomName?.split(' ')[0] || "Sanjar"}
                </h2>
                <p className="text-sm text-slate-400 font-bold tracking-[0.15em] my-1">&</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {invitation.brideName?.split(' ')[0] || "Malika"}
                </h2>
                <p className="text-[10px] text-slate-400 mt-4 leading-relaxed max-w-[240px]">
                    {invitation.text || "Ikki qalbning birikishiga guvoh bo'lishingizni so'raymiz."}
                </p>
            </div>

            {/* Details row */}
            <div className="grid grid-cols-3 border-b border-slate-100">
                <div className="flex flex-col items-center py-6 gap-1 border-r border-slate-100 bg-slate-50/50">
                    <Calendar className="h-4 w-4 text-slate-400 mb-1" />
                    <p className="text-2xl font-black text-slate-900 leading-none">{getDay(invitation.date)}</p>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">{getMonth(invitation.date)}</p>
                </div>
                <div className="flex flex-col items-center py-6 gap-1 border-r border-slate-100">
                    <Clock className="h-4 w-4 text-slate-400 mb-1" />
                    <p className="text-2xl font-black text-slate-900 leading-none">{invitation.time || "18:00"}</p>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Vaqt</p>
                </div>
                <div className="flex flex-col items-center py-6 gap-1 bg-slate-50/50">
                    <p className="text-xs font-black text-slate-900 leading-tight text-center px-2">
                        {invitation.hall || "Zarafshon"}
                    </p>
                </div>
            </div>

            {/* Footer bar */}
            <div className="mt-auto bg-slate-950 py-6 flex items-center justify-center">
                <p className="text-[9px] uppercase tracking-[0.5em] text-slate-400 font-black">Sizni kutib qolamiz</p>
            </div>
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — Garden Bliss
// Soft floral, overlapping oval portraits at top, botanical accent elements
// ════════════════════════════════════════════════════════════════════════════
function GardenBliss({ invitation }: { invitation: Partial<InvitationData> }) {
    return (
        <div className="w-full min-h-[620px] bg-[#fdfaf5] flex flex-col items-center overflow-hidden select-none relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/skulls.png')] saturate-0" />

            {/* Floral decoration top */}
            <div className="w-full h-2 bg-gradient-to-r from-pink-300 via-rose-200 to-emerald-200" />

            {/* Overlapping circles header */}
            <div className="flex flex-col items-center mt-8 mb-4">
                <div className="flex items-start justify-center">
                    {/* Groom */}
                    <div className="flex flex-col items-center z-10">
                        <div className="relative" style={{ width: 88, height: 88 }}>
                            <div className="absolute inset-0 rounded-full border-4 border-pink-200 bg-pink-50 shadow-inner" />
                            <Photo
                                src={invitation.groomPictureGetUrl}
                                className="rounded-full border-2 border-white absolute inset-1"
                                size="full"
                            />
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[8px] text-emerald-600 uppercase tracking-[0.3em] font-bold">Kuyov</p>
                        </div>
                    </div>

                    {/* Heart center — overlapping */}
                    <div className="z-20 -mx-3 mt-8">
                        <div className="w-10 h-10 bg-white rounded-full border-2 border-pink-200 flex items-center justify-center shadow-md">
                            <Flower2 className="h-5 w-5 text-pink-400" />
                        </div>
                    </div>

                    {/* Bride */}
                    <div className="flex flex-col items-center z-10">
                        <div className="relative" style={{ width: 88, height: 88 }}>
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-200 bg-emerald-50 shadow-inner" />
                            <Photo
                                src={invitation.bridePictureGetUrl}
                                className="rounded-full border-2 border-white absolute inset-1"
                                size="full"
                                personType="bride"
                            />
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[8px] text-pink-500 uppercase tracking-[0.3em] font-bold">Kelin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-2 w-3/4 my-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-pink-200" />
                <Flower2 className="h-3 w-3 text-pink-300" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-emerald-200" />
            </div>

            {/* Header text */}
            <div className="text-center px-8 mb-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-emerald-600 font-bold mb-2">To'y Taklifnomasi</p>
                <h2 className="text-2xl font-black text-pink-600 leading-tight">
                    {invitation.groomName?.split(' ')[0] || "Sanjar"}
                    <span className="text-emerald-400 mx-2 font-serif italic">&</span>
                    {invitation.brideName?.split(' ')[0] || "Malika"}
                </h2>
            </div>

            {/* Message */}
            <p className="text-[10px] text-slate-500 text-center px-10 leading-relaxed italic mb-6">
                {invitation.text || "Baxtimizni siz azizlar bilan ulashishdan mamnunmiz."}
            </p>

            {/* Wedding info cards */}
            <div className="w-full px-5 space-y-3">
                <div className="bg-white rounded-2xl px-5 py-4 border border-pink-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-pink-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Sana & Vaqt</p>
                        <p className="font-black text-slate-800 text-sm">
                            {getDay(invitation.date)} {getMonth(invitation.date)} — {invitation.time || "18:00"}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl px-5 py-4 border border-emerald-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Manzil</p>
                        <p className="font-black text-slate-800 text-sm truncate">{invitation.hall || "Zarafshon Saroyi"}</p>
                    </div>
                </div>
            </div>

            {/* Footer floral */}
            <div className="mt-auto pt-6 pb-6 flex items-center gap-2 opacity-50">
                <Flower2 className="h-4 w-4 text-pink-300" />
                <p className="text-[8px] uppercase tracking-[0.3em] text-slate-400">Baxt bilan</p>
                <Flower2 className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="w-full h-3 bg-gradient-to-r from-emerald-200 via-pink-200 to-emerald-200" />
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — Midnight Star
// Dark luxury, square grid photos top, gold star motif, dark bg throughout
// ════════════════════════════════════════════════════════════════════════════
function MidnightStar({ invitation }: { invitation: Partial<InvitationData> }) {
    return (
        <div className="w-full min-h-[580px] bg-[#05070a] flex flex-col items-center overflow-hidden select-none relative">
            {/* Stars background - Enhanced */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none" />
            {[...Array(30)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-pulse"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                    }}
                />
            ))}

            {/* Gold top accent */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {/* Header */}
            <div className="mt-8 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-px w-8 bg-amber-500/50" />
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <div className="h-px w-8 bg-amber-500/50" />
                </div>
                <p className="text-[8px] uppercase tracking-[0.6em] text-amber-400 font-bold">To'y Taklifnomasi</p>
            </div>

            {/* Two square photos side by side */}
            <div className="flex justify-center gap-6 px-8 w-full mb-8">
                {/* Groom */}
                <div className="relative group/photo">
                    {/* Decorative Background Border */}
                    <div className="absolute inset-0 rounded-2xl border border-amber-500/30 translate-x-1.5 translate-y-1.5 group-hover/photo:translate-x-1 group-hover/photo:translate-y-1 transition-transform" />

                    <div className="relative z-10 w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl">
                        <Photo
                            src={invitation.groomPictureGetUrl}
                            className="w-full h-full"
                            size="full"
                        />
                        {/* Label Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent py-2 px-3">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-amber-400 font-bold text-center">Kuyov</p>
                        </div>
                    </div>
                </div>

                {/* Bride */}
                <div className="relative group/photo">
                    {/* Decorative Background Border */}
                    <div className="absolute inset-0 rounded-2xl border border-amber-500/30 -translate-x-1.5 translate-y-1.5 group-hover/photo:-translate-x-1 group-hover/photo:translate-y-1 transition-transform" />

                    <div className="relative z-10 w-32 h-32 xs:w-36 xs:h-36 sm:w-40 sm:h-40 rounded-2xl border border-amber-500/20 overflow-hidden shadow-2xl">
                        <Photo
                            src={invitation.bridePictureGetUrl}
                            className="w-full h-full"
                            size="full"
                            personType="bride"
                        />
                        {/* Label Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent py-2 px-3">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-amber-400 font-bold text-center">Kelin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Names */}
            <div className="text-center px-6 mb-8 relative">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 italic font-serif tracking-wider leading-tight drop-shadow-sm">
                    {invitation.groomName?.split(' ')[0] || "Sanjar"}
                </h2>
                <div className="flex items-center justify-center gap-4 my-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
                    <span className="text-amber-500 text-2xl font-serif font-light">&</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
                </div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 italic font-serif tracking-wider leading-tight drop-shadow-sm">
                    {invitation.brideName?.split(' ')[0] || "Malika"}
                </h2>
            </div>

            {/* Gold divider */}
            <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-6" />

            {/* Message */}
            <p className="text-[10px] text-slate-400 text-center px-10 leading-relaxed italic mb-6">
                {invitation.text || "Muhtaram mehmonlar, sizlarni to'y bazmi uchun taklif etamiz."}
            </p>

            {/* Details row */}
            <div className="w-full px-6 mb-8">
                <div className="border border-amber-500/20 rounded-2xl bg-white/5 backdrop-blur-sm overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-amber-500/20">
                        <div className="flex flex-col items-center py-5 gap-1">
                            <Calendar className="h-4 w-4 text-amber-400 mb-1" />
                            <p className="text-2xl font-black text-amber-100 leading-none">{getDay(invitation.date)}</p>
                            <p className="text-[9px] uppercase tracking-widest text-amber-400/70 font-bold">{getMonth(invitation.date)}</p>
                            <p className="text-[8px] text-slate-500">2026</p>
                        </div>
                        <div className="flex flex-col items-center py-5 gap-1">
                            <Clock className="h-4 w-4 text-amber-400 mb-1" />
                            <p className="text-2xl font-black text-amber-100 leading-none">{invitation.time || "18:00"}</p>
                            <p className="text-[9px] uppercase tracking-widest text-amber-400/70 font-bold">Vaqt</p>
                        </div>
                    </div>
                    <div className="border-t border-amber-500/20 flex items-center gap-3 px-5 py-4">
                        <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="font-black text-amber-100 text-sm">{invitation.hall || "Zarafshon Saroyi"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pb-8 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-amber-500/30" />
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <div className="h-px w-12 bg-amber-500/30" />
                </div>
                <p className="text-[8px] uppercase tracking-[0.4em] text-amber-400/60 font-bold">Sizni kutib qolamiz</p>
            </div>

            {/* Gold bottom accent */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE 5 — Toylashaylik (Official Theme)
// Circular photos with badges, elegant initials, info cards below
// ════════════════════════════════════════════════════════════════════════════
function ToylashaylikTheme({ invitation }: { invitation: Partial<InvitationData> }) {
    const { t } = useLanguage()

    return (
        <div className="w-full flex flex-col items-center py-8 px-6 relative z-10 bg-[#fffafa] dark:bg-slate-950 overflow-hidden">
            {/* Header Decoration */}
            <div className="mb-4 text-center">
                <div className="flex justify-center mb-1">
                    <Sparkles className="h-6 w-6 text-[#f472b6] opacity-60" />
                </div>
                <p className="text-[10px] tracking-[0.6em] text-gray-400 uppercase ml-2">
                    TO'Y TAKLIFI
                </p>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center justify-center mb-8 gap-2">
                <div className="flex flex-col items-center">
                    <div className="relative p-1 bg-white dark:bg-slate-800 rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]">
                        <div className="h-24 w-24 rounded-full border-4 border-[#ffdde1] overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                            <Photo
                                src={invitation.groomPictureGetUrl}
                                size="full"
                                className="w-full h-full"
                            />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#f472b6] text-white text-[8px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                            {t('groom')}
                        </div>
                    </div>
                </div>

                <div className="px-1 text-[#f472b6]">
                    <Heart className="h-8 w-8 fill-current" />
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative p-1 bg-white dark:bg-slate-800 rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)]">
                        <div className="h-24 w-24 rounded-full border-4 border-[#ffdde1] overflow-hidden bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
                            <Photo
                                src={invitation.bridePictureGetUrl}
                                size="full"
                                className="w-full h-full"
                                personType="bride"
                            />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#f472b6] text-white text-[8px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                            {t('bride')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Names & Subtext */}
            <div className="text-center space-y-1 mb-8 w-full px-4">
                <h1 className={cn(
                    "font-serif text-[#7e22ce] dark:text-white flex items-center justify-center gap-2",
                    ((invitation?.groomName?.length || 0) > 11 || (invitation?.brideName?.length || 0) > 11)
                        ? "flex-col text-3xl md:text-3xl space-y-1"
                        : "text-3xl md:text-4xl"
                )}>
                    <span>{invitation?.groomName || 'Sanjar'}</span>
                    <span className={cn(
                        "text-[#f472b6] italic",
                        ((invitation?.groomName?.length || 0) > 11 || (invitation?.brideName?.length || 0) > 11) ? "text-xl" : ""
                    )}>&</span>
                    <span>{invitation?.brideName || 'Malika'}</span>
                </h1>
                <p className="text-[11px] text-pink-600/70 dark:text-pink-400/70 font-medium italic">
                    Oilalari sizni to'yga taklif qiladi
                </p>
            </div>

            {/* Main Info Card */}
            <div className="w-full bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-[0_20px_40px_-10px_rgba(244,114,182,0.15)] space-y-5 border border-white dark:border-slate-800">
                <div className="flex flex-col items-center gap-1 mb-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                        <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-800 dark:text-white mt-1 uppercase tracking-widest">To'y marosimi</h3>
                </div>

                {/* Date/Time Row */}
                <div className="flex justify-between items-center bg-[#fff5f7] dark:bg-pink-900/10 rounded-3xl p-5 px-10">
                    <div className="text-center">
                        <p className="text-2xl font-serif font-black text-[#ec4899] leading-none mb-1">
                            {invitation?.date ? (invitation.date.includes('-') ? invitation.date.split('-')[2] : invitation.date.split(' ')[0]) : '28'}
                        </p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#f87171]">
                            {invitation?.date ? (invitation.date.includes('-') ? new Date(invitation.date).toLocaleString('default', { month: 'long' }) : invitation.date.split(' ')[1]) : 'August'}
                        </p>
                        <p className="text-[8px] text-gray-400 mt-0.5">2026</p>
                    </div>
                    <div className="w-px h-10 bg-pink-200/50 dark:bg-pink-800/20" />
                    <div className="flex flex-col items-center gap-1">
                        <Clock className="h-4 w-4 text-[#ec4899] opacity-40 mb-1" />
                        <span className="text-xl font-black text-[#ec4899]">
                            {invitation?.time || '18:00'}
                        </span>
                    </div>
                </div>

                {/* Location Box */}
                <div className="bg-[#fffbeb] dark:bg-orange-900/10 rounded-2xl p-4 flex items-center gap-4 border border-orange-50 dark:border-orange-900/20">
                    <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                            {invitation?.hall || 'Mumtoz to\'yxonasi'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// Main WeddingCard — routes to the correct template
// ════════════════════════════════════════════════════════════════════════════
export function WeddingCard({ invitation, template, cardRef }: WeddingCardProps) {
    // Determine which template to render based on ID
    // Prioritize the passed template object (useful for previews), then the invitation data, then default
    const templateId = template?.id || invitation?.template || 'toylashaylik'

    const renderCard = () => {
        switch (templateId) {
            case 'toylashaylik': return <ToylashaylikTheme invitation={invitation} />
            case 'classic_royale': return <ClassicRoyale invitation={invitation} />
            case 'modern_minimal': return <ModernMinimal invitation={invitation} />
            case 'garden_bliss': return <GardenBliss invitation={invitation} />
            case 'midnight_star': return <MidnightStar invitation={invitation} />
            default: return <ToylashaylikTheme invitation={invitation} />
        }
    }

    return (
        <div ref={cardRef} className="w-full max-w-[420px] mx-auto overflow-hidden">
            {renderCard()}
        </div>
    )
}
