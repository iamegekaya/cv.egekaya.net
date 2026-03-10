export const LANGUAGE_COOKIE_NAME = "language";
export const DEFAULT_LANGUAGE = "tr";

export const dictionaries = {
  tr: {
    metaTitle: "Ege Kaya - CV İndir",
    metaDescription:
      "Ege Kaya'nın CV'sini indirmek için tercih ettiğiniz formatı seçin.",
    title:
      "Ege Kaya'nın CV'sini indirmek için tercih ettiğiniz formatın simgesine tıklayın.",
    footer: "© 2026 Ege Kaya – egekaya.net. Tüm hakları saklıdır.",
    downloadPdfTr: "Türkçe PDF olarak indir",
    downloadWordTr: "Türkçe Word olarak indir",
    downloadPdfEn: "İngilizce PDF olarak indir",
    downloadWordEn: "İngilizce Word olarak indir",
    switchToEnglish: "İngilizceye geç",
    switchToTurkish: "Türkçeye geç",
    currentLanguageTr: "Geçerli dil Türkçe.",
    currentLanguageEn: "Geçerli dil İngilizce.",
  },
  en: {
    metaTitle: "Ege Kaya - Download CV",
    metaDescription: "Choose your preferred format to download Ege Kaya's CV.",
    title: "Click on the icon of the format you prefer to download Ege Kaya's CV.",
    footer: "© 2026 Ege Kaya – egekaya.net. All rights reserved.",
    downloadPdfTr: "Download as Turkish PDF",
    downloadWordTr: "Download as Turkish Word",
    downloadPdfEn: "Download as English PDF",
    downloadWordEn: "Download as English Word",
    switchToEnglish: "Switch to English",
    switchToTurkish: "Switch to Turkish",
    currentLanguageTr: "Current language is Turkish.",
    currentLanguageEn: "Current language is English.",
  },
} as const;

export type Language = keyof typeof dictionaries;
export type TranslationKey = keyof (typeof dictionaries)[Language];

export function isLanguage(value: string | undefined | null): value is Language {
  return value === "tr" || value === "en";
}

export function resolveLanguage(
  value: string | undefined | null,
): Language {
  return isLanguage(value) ? value : DEFAULT_LANGUAGE;
}
