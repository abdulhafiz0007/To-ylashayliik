import type { InvitationData } from "../context/InvitationContext"
import type { TemplateConfig } from "../lib/templates"
import { Clock, User, MapPin, Calendar, Heart, Star, Flower2, Diamond } from "lucide-react"

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

// ─── PhotoSlot ───────────────────────────────────────────────────────────────
function Photo({ src, size = 80, className = "" }: { src?: string; size?: number; className?: string }) {
    return (
        <div
            className={`overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            {src ? (
                <img src={src} alt="" className="w-full h-full object-cover" />
            ) : (
                <User className="text-gray-300" style={{ width: size * 0.45, height: size * 0.45 }} />
            )}
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — Classic Royale
// Gold bordered, vertical layout, side-by-side oval portraits, info below
// ════════════════════════════════════════════════════════════════════════════
function ClassicRoyale({ invitation }: { invitation: Partial<InvitationData> }) {
    return (
        <div className="relative w-full min-h-[680px] bg-[#fffdf5] flex flex-col items-center overflow-hidden select-none">
            {/* Gold corner ornaments */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-amber-400/60" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-amber-400/60" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-amber-400/60" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-amber-400/60" />

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
            <div className="w-full mx-6 border-t border-b border-amber-100 py-6 px-8 space-y-4 bg-amber-50/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-700">
                        <Calendar className="h-4 w-4" />
                        <div>
                            <p className="text-[8px] uppercase tracking-widest opacity-60 font-bold">Sana</p>
                            <p className="font-black text-base leading-tight">
                                {getDay(invitation.date)} {getMonth(invitation.date)}
                            </p>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-amber-200" />
                    <div className="flex items-center gap-2 text-amber-700">
                        <Clock className="h-4 w-4" />
                        <div>
                            <p className="text-[8px] uppercase tracking-widest opacity-60 font-bold">Vaqt</p>
                            <p className="font-black text-base leading-tight">{invitation.time || "18:00"}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3 text-amber-800">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-black text-sm">{invitation.hall || "Zarafshon Saroyi"}</p>
                        <p className="text-[10px] opacity-60 mt-0.5">{invitation.location || "Manzil ko'rsatilmagan"}</p>
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
        <div className="w-full min-h-[680px] bg-white flex flex-col overflow-hidden select-none">
            {/* Split photo hero */}
            <div className="flex h-64 relative">
                {/* Left — Groom, dark */}
                <div className="w-1/2 bg-slate-900 flex flex-col items-center justify-end pb-4 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <Photo src={invitation.groomPictureGetUrl} size={999} className="w-full h-full opacity-40 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                    </div>
                    <div className="relative z-10 text-center">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-slate-400 font-bold">Kuyov</p>
                        <p className="text-lg font-black text-white mt-0.5 leading-tight">
                            {invitation.groomName || "Sanjar"}
                        </p>
                    </div>
                </div>

                {/* Right — Bride, light */}
                <div className="w-1/2 bg-slate-100 flex flex-col items-center justify-end pb-4 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <Photo src={invitation.bridePictureGetUrl} size={999} className="w-full h-full opacity-50 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-100/60 to-transparent" />
                    </div>
                    <div className="relative z-10 text-center">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-slate-500 font-bold">Kelin</p>
                        <p className="text-lg font-black text-slate-800 mt-0.5 leading-tight">
                            {invitation.brideName || "Malika"}
                        </p>
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
                <div className="flex flex-col items-center py-5 gap-1 border-r border-slate-100">
                    <Calendar className="h-4 w-4 text-slate-400 mb-1" />
                    <p className="text-2xl font-black text-slate-900 leading-none">{getDay(invitation.date)}</p>
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{getMonth(invitation.date)}</p>
                </div>
                <div className="flex flex-col items-center py-5 gap-1 border-r border-slate-100">
                    <Clock className="h-4 w-4 text-slate-400 mb-1" />
                    <p className="text-2xl font-black text-slate-900 leading-none">{invitation.time || "18:00"}</p>
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Vaqt</p>
                </div>
                <div className="flex flex-col items-center py-5 gap-1">
                    <MapPin className="h-4 w-4 text-slate-400 mb-1" />
                    <p className="text-xs font-black text-slate-900 leading-tight text-center px-2">
                        {invitation.hall || "Zarafshon"}
                    </p>
                    <p className="text-[8px] text-slate-400 text-center px-2 leading-tight">
                        {invitation.location || "Toshkent"}
                    </p>
                </div>
            </div>

            {/* Footer bar */}
            <div className="mt-auto bg-slate-900 py-5 flex items-center justify-center">
                <p className="text-[9px] uppercase tracking-[0.5em] text-slate-400 font-bold">Sizni kutib qolamiz</p>
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
        <div className="w-full min-h-[680px] bg-[#fdf8f0] flex flex-col items-center overflow-hidden select-none relative">
            {/* Floral decoration top */}
            <div className="w-full h-3 bg-gradient-to-r from-pink-200 via-emerald-200 to-pink-200" />

            {/* Overlapping circles header */}
            <div className="relative mt-8 mb-4 flex items-center justify-center" style={{ height: 140 }}>
                {/* Groom oval — left */}
                <div className="absolute"
                    style={{ left: '50%', transform: 'translateX(-108px)', top: 0 }}>
                    <div className="relative" style={{ width: 96, height: 120 }}>
                        <div className="absolute inset-0 rounded-[50%] border-4 border-pink-200 bg-pink-50" />
                        <Photo
                            src={invitation.groomPictureGetUrl}
                            className="rounded-[50%] border-2 border-white absolute inset-1"
                            size={80}
                        />
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[8px] text-emerald-600 uppercase tracking-[0.3em] font-bold">Kuyov</p>
                        <p className="font-black text-slate-800 text-sm">{invitation.groomName || "Sanjar"}</p>
                    </div>
                </div>

                {/* Heart center */}
                <div className="absolute z-20" style={{ left: '50%', transform: 'translateX(-20px)', top: 40 }}>
                    <div className="w-10 h-10 bg-white rounded-full border-2 border-pink-200 flex items-center justify-center shadow-md">
                        <Flower2 className="h-5 w-5 text-pink-400" />
                    </div>
                </div>

                {/* Bride oval — right */}
                <div className="absolute"
                    style={{ left: '50%', transform: 'translateX(12px)', top: 0 }}>
                    <div className="relative" style={{ width: 96, height: 120 }}>
                        <div className="absolute inset-0 rounded-[50%] border-4 border-emerald-200 bg-emerald-50" />
                        <Photo
                            src={invitation.bridePictureGetUrl}
                            className="rounded-[50%] border-2 border-white absolute inset-1"
                            size={80}
                        />
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[8px] text-pink-500 uppercase tracking-[0.3em] font-bold">Kelin</p>
                        <p className="font-black text-slate-800 text-sm">{invitation.brideName || "Malika"}</p>
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
                        <p className="text-[10px] text-slate-400 leading-tight">{invitation.location || "Toshkent"}</p>
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
        <div className="w-full min-h-[680px] bg-[#080b12] flex flex-col items-center overflow-hidden select-none relative">
            {/* Stars background */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40"
                    style={{
                        top: `${Math.sin(i * 1.7) * 40 + 50}%`,
                        left: `${(i * 4.7 + 10) % 90 + 5}%`,
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
            <div className="flex gap-3 px-8 w-full mb-6">
                {/* Groom */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl border border-amber-500/30" style={{ transform: 'translate(4px, 4px)' }} />
                        <Photo
                            src={invitation.groomPictureGetUrl}
                            className="rounded-2xl border border-amber-500/20 w-full relative z-10"
                            size={152}
                        />
                        {/* Groom label */}
                        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl py-2 px-3">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-amber-400 font-bold">Kuyov</p>
                            <p className="font-black text-white text-sm leading-tight">{invitation.groomName || "Sanjar"}</p>
                        </div>
                    </div>
                </div>

                {/* Bride */}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl border border-amber-500/30" style={{ transform: 'translate(-4px, 4px)' }} />
                        <Photo
                            src={invitation.bridePictureGetUrl}
                            className="rounded-2xl border border-amber-500/20 w-full relative z-10"
                            size={152}
                        />
                        {/* Bride label */}
                        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent rounded-b-2xl py-2 px-3">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-amber-400 font-bold">Kelin</p>
                            <p className="font-black text-white text-sm leading-tight">{invitation.brideName || "Malika"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Names */}
            <div className="text-center px-6 mb-6">
                <h2 className="text-3xl font-black text-amber-100 italic font-serif tracking-wide leading-tight">
                    {invitation.groomName?.split(' ')[0] || "Sanjar"}
                    <br />
                    <span className="text-amber-500 text-xl not-italic">&</span>
                    <br />
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
                        <div className="min-w-0">
                            <p className="font-black text-amber-100 text-sm truncate">{invitation.hall || "Zarafshon Saroyi"}</p>
                            <p className="text-[10px] text-slate-400">{invitation.location || "Toshkent"}</p>
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
// Main WeddingCard — routes to the correct template
// ════════════════════════════════════════════════════════════════════════════
export function WeddingCard({ invitation, template, cardRef }: WeddingCardProps) {
    const isDefault = !template || template.id === 'default'

    const renderCard = () => {
        if (isDefault || !template) {
            return <ClassicRoyale invitation={invitation} />
        }
        switch (template.id) {
            case 'classic_royale': return <ClassicRoyale invitation={invitation} />
            case 'modern_minimal': return <ModernMinimal invitation={invitation} />
            case 'garden_bliss': return <GardenBliss invitation={invitation} />
            case 'midnight_star': return <MidnightStar invitation={invitation} />
            default: return <ClassicRoyale invitation={invitation} />
        }
    }

    return (
        <div ref={cardRef} className="w-full max-w-[420px] mx-auto overflow-hidden">
            {renderCard()}
        </div>
    )
}
