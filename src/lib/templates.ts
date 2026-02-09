export interface TemplateConfig {
    id: string
    name: string
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
}

export const templates: TemplateConfig[] = [
    {
        id: "classic",
        name: "Classic Elegance",
        wrapperClass: "bg-white border-8 border-double border-gold-200",
        introClass: "text-gold-500 uppercase tracking-widest text-sm font-medium",
        namesClass: "font-serif text-4xl md:text-5xl text-primary-800",
        ampersandClass: "text-gold-400 text-3xl my-2",
        messageClass: "italic font-serif text-lg text-gold-800",
        detailsClass: "border-y border-gold-100 text-gold-800",
        iconClass: "text-primary-500",
    },
    {
        id: "modern",
        name: "Modern Minimalist",
        wrapperClass: "bg-white border border-gray-200 shadow-xl",
        introClass: "text-gray-400 uppercase tracking-[0.2em] text-xs font-bold",
        namesClass: "font-sans text-5xl md:text-6xl text-gray-900 font-light tracking-tight",
        ampersandClass: "text-primary-500 text-4xl my-4 font-light",
        messageClass: "font-sans text-base text-gray-500 leading-relaxed",
        detailsClass: "border-t border-gray-100 mt-8 pt-8 text-gray-800",
        iconClass: "text-gray-900",
    },
    {
        id: "rustic",
        name: "Rustic Charm",
        wrapperClass: "bg-[#f4ebd0] border-4 border-[#8c522b] border-dashed",
        introClass: "text-[#8c522b] font-serif italic text-lg",
        namesClass: "font-serif text-5xl text-[#603823] font-bold",
        ampersandClass: "text-[#8c522b] text-2xl my-2",
        messageClass: "font-serif text-lg text-[#603823]",
        detailsClass: "border-y-2 border-[#8c522b] border-dotted text-[#603823]",
        iconClass: "text-[#8c522b]",
    },
    {
        id: "floral",
        name: "Floral Romance",
        wrapperClass: "bg-primary-50 border-4 border-primary-200 rounded-3xl",
        introClass: "text-primary-600 font-serif italic",
        namesClass: "font-serif text-5xl text-primary-800",
        ampersandClass: "text-primary-400 text-3xl",
        messageClass: "text-primary-700 font-serif",
        detailsClass: "bg-primary-100/50 rounded-xl p-4 text-primary-900",
        iconClass: "text-primary-500",
    },
    {
        id: "dark",
        name: "Midnight Luxury",
        wrapperClass: "bg-gray-900 border border-gold-400 text-white",
        introClass: "text-gold-300 uppercase tracking-widest",
        namesClass: "font-serif text-5xl text-gold-200",
        ampersandClass: "text-gold-500 text-3xl",
        messageClass: "text-gray-300 font-light",
        detailsClass: "border-y border-gray-700 text-gold-100",
        iconClass: "text-gold-400",
    },
    {
        id: "vibrant",
        name: "Vibrant Love",
        wrapperClass: "bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-2xl",
        introClass: "text-white/80 font-bold uppercase tracking-wider",
        namesClass: "font-serif text-6xl text-white drop-shadow-md",
        ampersandClass: "text-white/70 text-4xl",
        messageClass: "text-white/90 text-lg font-medium",
        detailsClass: "bg-white/10 backdrop-blur-md rounded-xl p-4",
        iconClass: "text-white",
    },
    {
        id: "vintage",
        name: "Vintage Paper",
        wrapperClass: "bg-[#faf4e1] shadow-inner",
        introClass: "text-gray-500 font-serif italic tracking-widest",
        namesClass: "font-serif text-5xl text-gray-800 uppercase tracking-widest",
        ampersandClass: "text-gray-400 text-2xl",
        messageClass: "text-gray-600 font-serif italic",
        detailsClass: "border-t-2 border-b-2 border-double border-gray-300 text-gray-700",
        iconClass: "text-gray-500",
    },
    {
        id: "ocean",
        name: "Ocean Breeze",
        wrapperClass: "bg-cyan-50 border border-cyan-200",
        introClass: "text-cyan-600 uppercase tracking-wider font-bold",
        namesClass: "font-serif text-5xl text-cyan-900",
        ampersandClass: "text-cyan-400 text-3xl",
        messageClass: "text-cyan-800",
        detailsClass: "bg-cyan-100/50 p-6 rounded-lg text-cyan-900",
        iconClass: "text-cyan-600",
    },
    {
        id: "forest",
        name: "Enchanted Forest",
        wrapperClass: "bg-green-50 border-2 border-green-800",
        introClass: "text-green-800 uppercase font-bold tracking-widest",
        namesClass: "font-serif text-5xl text-green-900",
        ampersandClass: "text-green-600 text-3xl",
        messageClass: "text-green-800 italic",
        detailsClass: "border-y border-green-200 text-green-900",
        iconClass: "text-green-700",
    },
]
