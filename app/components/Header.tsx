"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Header.module.css";

const Header = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div
                    className={styles.languageSwitcher}
                    role="group"
                    aria-label={t("languageSwitcherLabel")}
                >
                    <button
                        type="button"
                        onClick={() => setLanguage("tr")}
                        className={`${styles.languageButton} ${language === "tr" ? styles.active : ""}`}
                        aria-pressed={language === "tr"}
                        title={t("switchToTurkish")}
                    >
                        {t("languageOptionTurkish")}
                        <span className={styles.srOnly}>{t("currentLanguageTr")}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setLanguage("en")}
                        className={`${styles.languageButton} ${language === "en" ? styles.active : ""}`}
                        aria-pressed={language === "en"}
                        title={t("switchToEnglish")}
                    >
                        {t("languageOptionEnglish")}
                        <span className={styles.srOnly}>{t("currentLanguageEn")}</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
