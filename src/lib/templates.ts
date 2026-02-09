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
}

export const templates: TemplateConfig[] = [
    {
        id: "classic",
        name: "Classic Elegance",
        backgroundImage: "/templates/classic.png",
        wrapperClass: "bg-white border-0 shadow-2xl",
        introClass: "text-gold-600 uppercase tracking-widest text-xs font-bold pt-12",
        namesClass: "font-serif text-3xl md:text-5xl text-gray-900 pb-4",
        ampersandClass: "text-gold-500 text-2xl my-1",
        messageClass: "italic font-serif text-lg text-gray-800",
        detailsClass: "text-gray-800 py-4",
        iconClass: "text-gold-600",
    },
    {
        id: "modern",
        name: "Modern Minimalist",
        backgroundImage: "/templates/minimal.png",
        wrapperClass: "bg-white border-0 shadow-xl",
        introClass: "text-gray-400 uppercase tracking-[0.3em] text-[10px] font-bold pt-20",
        namesClass: "font-sans text-4xl md:text-6xl text-gray-900 font-light tracking-tighter uppercase",
        ampersandClass: "text-primary-500 text-3xl my-2 font-light",
        messageClass: "font-sans text-sm text-gray-500 leading-relaxed",
        detailsClass: "mt-4 pt-4 text-gray-600",
        iconClass: "text-gray-900",
    },
    {
        id: "vintage",
        name: "Vintage Paper",
        backgroundImage: "/templates/vintage.png",
        wrapperClass: "bg-transparent border-0 shadow-inner",
        introClass: "text-gray-600 font-serif italic tracking-widest pt-24",
        namesClass: "font-serif text-3xl md:text-5xl text-gray-900 font-bold",
        ampersandClass: "text-gray-500 text-2xl my-1",
        messageClass: "text-gray-700 font-serif italic",
        detailsClass: "text-gray-800 py-4",
        iconClass: "text-gray-600",
    },
    {
        id: "floral",
        name: "Floral Romance",
        backgroundImage: "/templates/floral.png",
        wrapperClass: "bg-white border-0 rounded-3xl overflow-hidden shadow-2xl",
        introClass: "text-primary-600 font-serif italic pt-16",
        namesClass: "font-serif text-3xl md:text-5xl text-primary-900",
        ampersandClass: "text-primary-400 text-3xl",
        messageClass: "text-primary-700 font-serif",
        detailsClass: "text-primary-950 py-2",
        iconClass: "text-primary-500",
    },
    {
        id: "midnight",
        name: "Midnight Luxury",
        backgroundImage: "/templates/midnight.png",
        wrapperClass: "bg-[#050b18] border-0 text-white shadow-[0_0_50px_rgba(30,58,138,0.5)]",
        introClass: "text-gold-300 uppercase tracking-widest pt-12",
        namesClass: "font-serif text-3xl md:text-5xl text-white font-bold",
        ampersandClass: "text-gold-500 text-3xl my-2",
        messageClass: "text-gray-300 font-light",
        detailsClass: "text-gold-100 py-4",
        iconClass: "text-gold-400",
    },
    {
        id: "vibrant",
        name: "Vibrant Love",
        wrapperClass: "bg-gradient-to-br from-primary-500 to-purple-600 text-white shadow-2xl",
        introClass: "text-white/80 font-bold uppercase tracking-wider pt-8",
        namesClass: "font-serif text-4xl md:text-6xl text-white drop-shadow-md",
        ampersandClass: "text-white/70 text-4xl",
        messageClass: "text-white/90 text-lg font-medium",
        detailsClass: "bg-white/10 backdrop-blur-md rounded-xl p-4",
        iconClass: "text-white",
    },
    {
        id: "rustic",
        name: "Rustic Charm",
        wrapperClass: "bg-[#f4ebd0] border-4 border-[#8c522b] border-dashed",
        introClass: "text-[#8c522b] font-serif italic text-lg pt-4",
        namesClass: "font-serif text-5xl text-[#603823] font-bold",
        ampersandClass: "text-[#8c522b] text-2xl my-2",
        messageClass: "font-serif text-lg text-[#603823]",
        detailsClass: "border-y-2 border-[#8c522b] border-dotted text-[#603823]",
        iconClass: "text-[#8c522b]",
    },
    {
        id: "dark_classic",
        name: "Dark Classic",
        wrapperClass: "bg-gray-950 border border-gray-800 text-white",
        introClass: "text-gray-400 uppercase tracking-widest pt-4",
        namesClass: "font-serif text-5xl text-gray-100",
        ampersandClass: "text-gray-500 text-3xl",
        messageClass: "text-gray-400 font-light",
        detailsClass: "border-y border-gray-800 text-gray-200",
        iconClass: "text-gray-400",
    },
    {
        id: "forest",
        name: "Enchanted Forest",
        wrapperClass: "bg-green-50 border-2 border-green-800",
        introClass: "text-green-800 uppercase font-bold tracking-widest pt-4",
        namesClass: "font-serif text-5xl text-green-900",
        ampersandClass: "text-green-600 text-3xl",
        messageClass: "text-green-800 italic",
        detailsClass: "border-y border-green-200 text-green-900",
        iconClass: "text-green-700",
    },
]

