"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    dictionaries,
    isLanguage,
    LANGUAGE_COOKIE_NAME,
    type Language,
    type TranslationKey,
} from "../i18n";

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({
    children,
    initialLanguage,
    hasLanguageCookie,
}: {
    children: ReactNode;
    initialLanguage: Language;
    hasLanguageCookie: boolean;
}) => {
    const [language, setLanguageState] = useState<Language>(initialLanguage);
    const [isLanguageReady, setIsLanguageReady] = useState(hasLanguageCookie);

    const setLanguage = (nextLanguage: Language) => {
        setLanguageState(nextLanguage);
    };

    useEffect(() => {
        if (hasLanguageCookie) {
            return;
        }

        const savedLanguage = localStorage.getItem(LANGUAGE_COOKIE_NAME);
        const animationFrame = window.requestAnimationFrame(() => {
            if (isLanguage(savedLanguage)) {
                setLanguageState(savedLanguage);
            }
            setIsLanguageReady(true);
        });

        return () => {
            window.cancelAnimationFrame(animationFrame);
        };
    }, [hasLanguageCookie]);

    useEffect(() => {
        if (!isLanguageReady) {
            return;
        }

        const dictionary = dictionaries[language];
        const descriptionElement = document.querySelector('meta[name="description"]');

        localStorage.setItem(LANGUAGE_COOKIE_NAME, language);
        document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = language;
        document.title = dictionary.metaTitle;
        descriptionElement?.setAttribute("content", dictionary.metaDescription);
    }, [isLanguageReady, language]);

    const t = (key: TranslationKey) => {
        return dictionaries[language][key];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
