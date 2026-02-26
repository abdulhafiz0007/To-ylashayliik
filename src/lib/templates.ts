export interface TemplateConfig {
    id: string
    name: string
    type?: string
    thumbnail?: string
    backgroundImage?: string
    category: 'Free' | 'Premium'
    // Wrapper classes for the main card container
    wrapperClass: string
    // Classes for the "Wedding Of" text
    introClass: string
    // Classes for the names
    namesClass: string
    // Classes for the ampersand
    ampersandClass: string
    // Classes for the message
    messageClass: string
    // Classes for the details section (date, time, location)
    detailsClass: string
    // Classes for the icons
    iconClass: string
    // For decorative elements
    overlayClass?: string
}

export const templates: TemplateConfig[] = [
    {
        id: "classic_royale",
        name: "Classic Royale",
        type: "Traditional",
        category: "Free",
        thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
        wrapperClass: "bg-[#fffdf9] dark:bg-slate-950 border-0 shadow-2xl relative",
        introClass: "text-gold-600 dark:text-gold-400 uppercase tracking-[0.4em] text-[10px] font-bold pt-12 underline decoration-gold-200 decoration-1 underline-offset-8",
        namesClass: "font-serif text-4xl md:text-6xl text-slate-900 dark:text-white font-black leading-tight",
        ampersandClass: "text-gold-500 text-3xl my-2 italic font-serif",
        messageClass: "font-sans text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-8 mt-4 italic",
        detailsClass: "text-slate-800 dark:text-slate-200 mt-6 py-8 border-y border-gold-100 dark:border-slate-800/50 mx-6",
        iconClass: "text-gold-500",
        overlayClass: "absolute inset-0 border-[12px] border-gold-50/20 dark:border-gold-900/10 pointer-events-none"
    },
    {
        id: "modern_minimal",
        name: "Modern Minimal",
        type: "Contemporary",
        category: "Free",
        thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600",
        wrapperClass: "bg-white dark:bg-slate-900 border-0 shadow-2xl relative",
        introClass: "text-slate-400 uppercase tracking-[0.6em] text-[9px] font-black pt-12",
        namesClass: "font-sans text-4xl md:text-7xl font-light tracking-tighter text-slate-900 dark:text-white",
        ampersandClass: "text-primary-500 text-2xl my-4 font-bold opacity-50",
        messageClass: "text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em] leading-loose px-12",
        detailsClass: "bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 mx-6 mt-8 border border-slate-100 dark:border-slate-800",
        iconClass: "text-primary-500"
    },
    {
        id: "garden_bliss",
        name: "Garden Bliss",
        type: "Floral",
        category: "Premium",
        thumbnail: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=600",
        wrapperClass: "bg-[#fcf8f8] dark:bg-slate-950 border-0 shadow-2xl relative overflow-hidden",
        introClass: "text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] text-[10px] font-bold pt-12",
        namesClass: "font-serif text-4xl md:text-6xl text-pink-600 dark:text-pink-400 font-bold",
        ampersandClass: "text-emerald-500 text-4xl my-2 flex justify-center items-center h-8",
        messageClass: "text-slate-600 dark:text-slate-400 text-sm px-10 mt-4 leading-relaxed",
        detailsClass: "text-emerald-900 dark:text-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl py-10 mt-8 mx-6 border border-emerald-100/50",
        iconClass: "text-emerald-600"
    },
    {
        id: "midnight_star",
        name: "Midnight Star",
        type: "Luxury",
        category: "Premium",
        thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600",
        wrapperClass: "bg-[#0a0c14] border-0 text-white shadow-2xl relative",
        introClass: "text-gold-500 uppercase tracking-[0.5em] text-[9px] pt-12 font-black",
        namesClass: "font-serif text-4xl md:text-6xl text-gold-100 font-bold italic tracking-wider",
        ampersandClass: "text-gold-600 text-4xl my-4 drop-shadow-lg",
        messageClass: "text-slate-300 text-sm leading-relaxed px-12 opacity-80",
        detailsClass: "text-gold-100 mt-10 space-y-6 px-4 border-t border-gold-900/30 pt-10 mx-6",
        iconClass: "text-gold-500",
        overlayClass: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 pointer-events-none"
    }
];
