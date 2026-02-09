import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { translations, type Language } from "../lib/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('app_lang');
        return (saved as Language) || 'uz';
    });

    useEffect(() => {
        localStorage.setItem('app_lang', language);
    }, [language]);

    const t = (path: string) => {
        const keys = path.split('.');
        let current: any = translations[language];

        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key];
            } else {
                return path;
            }
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
