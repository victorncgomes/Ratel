import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '../lib/i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: <T = string>(key: string) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('pt');

    useEffect(() => {
        const storedLang = localStorage.getItem('ratel_language') as Language;
        if (storedLang && ['pt', 'es', 'en'].includes(storedLang)) {
            setLanguage(storedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('ratel_language', lang);
    };

    const t = <T = string>(path: string): T => {
        const keys = path.split('.');
        let current: any = translations[language];

        for (const key of keys) {
            if (current && current[key] !== undefined) {
                current = current[key];
            } else {
                console.warn(`Translation key not found: ${path} for language ${language}`);
                return path as T;
            }
        }

        return current as T;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
