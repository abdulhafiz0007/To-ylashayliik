export interface TemplateConfig {
    id: string
    name: string
    backgroundImage?: string
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
        id: "premium_minimal",
        name: "Premium Minimal",
        wrapperClass: "bg-white dark:bg-slate-900 border-0 shadow-2xl relative",
        introClass: "text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] text-[10px] md:text-xs font-medium pt-12 md:pt-16",
        namesClass: "font-serif text-3xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white font-bold leading-tight px-4",
        ampersandClass: "text-gold-500 text-3xl md:text-4xl my-2 italic",
        messageClass: "font-sans text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed px-8 md:px-12",
        detailsClass: "text-gray-800 dark:text-gray-200 mt-6 py-6 border-y border-gray-100 dark:border-slate-800 mx-8",
        iconClass: "text-primary-500",
        overlayClass: "absolute inset-0 border-[16px] border-gold-50/20 dark:border-slate-800/10 pointer-events-none"
    },
    {
        id: "royal_gold",
        name: "Royal Gold",
        wrapperClass: "bg-[#fdfcf5] dark:bg-slate-950 border-0 shadow-2xl relative",
        introClass: "text-gold-600 dark:text-gold-400 uppercase tracking-widest text-[10px] font-bold pt-12 md:pt-16",
        namesClass: "font-serif text-3xl md:text-5xl text-[#361d11] dark:text-gold-100 font-bold px-6",
        ampersandClass: "text-gold-500 text-4xl my-1",
        messageClass: "font-serif italic text-base md:text-lg text-gray-700 dark:text-gray-300 px-8",
        detailsClass: "text-[#361d11] dark:text-gold-200 mt-6 md:mt-8 space-y-4",
        iconClass: "text-gold-600 dark:text-gold-400",
        overlayClass: "absolute inset-0 border-double border-4 border-gold-200/30 dark:border-gold-800/20 m-4 pointer-events-none"
    },
    {
        id: "modern_slate",
        name: "Modern Slate",
        wrapperClass: "bg-slate-900 border-0 text-white shadow-2xl relative",
        introClass: "text-slate-400 uppercase tracking-[0.5em] text-[10px] pt-12 md:pt-16",
        namesClass: "font-sans text-4xl md:text-6xl font-light tracking-tighter text-white px-4",
        ampersandClass: "text-primary-400 text-2xl my-3",
        messageClass: "text-slate-300 text-xs md:text-sm uppercase tracking-widest leading-loose px-10",
        detailsClass: "bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mx-6 mt-8 border border-white/5",
        iconClass: "text-primary-400"
    }
]
