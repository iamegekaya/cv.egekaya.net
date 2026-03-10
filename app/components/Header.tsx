"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Header.module.css";

const Header = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const toggleLabelKey = language === "tr" ? "switchToEnglish" : "switchToTurkish";
    const currentLanguageLabelKey = language === "tr" ? "currentLanguageTr" : "currentLanguageEn";

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <button
                    type="button"
                    onClick={toggleLanguage}
                    className={styles.languageButton}
                    aria-label={t(toggleLabelKey)}
                    title={t(toggleLabelKey)}
                >
                    <span
                        aria-hidden="true"
                        lang="tr"
                        className={language === "tr" ? styles.active : ""}
                    >
                        TR
                    </span>
                    <span aria-hidden="true" className={styles.separator}>|</span>
                    <span
                        aria-hidden="true"
                        lang="en"
                        className={language === "en" ? styles.active : ""}
                    >
                        EN
                    </span>
                    <span className={styles.srOnly}>
                        {t(currentLanguageLabelKey)} {t(toggleLabelKey)}.
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Header;
