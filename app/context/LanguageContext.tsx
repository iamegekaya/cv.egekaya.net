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
    toggleLanguage: () => void;
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
    const [language, setLanguage] = useState<Language>(initialLanguage);

    const toggleLanguage = () => {
        setLanguage((prev) => {
            return prev === "tr" ? "en" : "tr";
        });
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem(LANGUAGE_COOKIE_NAME);

        if (!hasLanguageCookie && isLanguage(savedLanguage) && savedLanguage !== language) {
            const animationFrame = window.requestAnimationFrame(() => {
                setLanguage(savedLanguage);
            });

            return () => {
                window.cancelAnimationFrame(animationFrame);
            };
        }

        const dictionary = dictionaries[language];
        const descriptionElement = document.querySelector('meta[name="description"]');

        localStorage.setItem(LANGUAGE_COOKIE_NAME, language);
        document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = language;
        document.title = dictionary.metaTitle;
        descriptionElement?.setAttribute("content", dictionary.metaDescription);
    }, [hasLanguageCookie, language]);

    const t = (key: TranslationKey) => {
        return dictionaries[language][key];
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
