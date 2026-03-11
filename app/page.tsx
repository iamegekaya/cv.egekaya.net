"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const { language, t } = useLanguage();

  const documents = language === "tr"
    ? [
        {
          href: "/cv/ege-kaya-cv.pdf",
          ariaLabel: t("downloadPdfTr"),
          iconSrc: "/logo/pdf.png",
          iconAlt: "PDF",
          format: "PDF",
        },
        {
          href: "/cv/ege-kaya-cv.docx",
          ariaLabel: t("downloadWordTr"),
          iconSrc: "/logo/doc.png",
          iconAlt: "Word",
          format: "DOCX",
        },
      ]
    : [
        {
          href: "/cv/ege-kaya-cv-en.pdf",
          ariaLabel: t("downloadPdfEn"),
          iconSrc: "/logo/pdf.png",
          iconAlt: "PDF",
          format: "PDF",
        },
        {
          href: "/cv/ege-kaya-cv-en.docx",
          ariaLabel: t("downloadWordEn"),
          iconSrc: "/logo/doc.png",
          iconAlt: "Word",
          format: "DOCX",
        },
      ];

  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>{t("selectedLanguage")}</p>
          <div className={styles.languageBadge}>
            <span>{t("languageName")}</span>
          </div>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.description}>{t("description")}</p>
        </div>

        <div className={styles.cards}>
          {documents.map((document) => (
            <a
              key={document.href}
              href={document.href}
              download
              className={`${styles.card} ${document.format === "PDF" ? styles.pdfCard : styles.wordCard}`}
              aria-label={document.ariaLabel}
            >
              <div className={styles.cardContent}>
                <Image
                  src={document.iconSrc}
                  alt={document.iconAlt}
                  width={64}
                  height={64}
                  className={styles.logoImage}
                />
                <div className={styles.cardText}>
                  <span className={styles.cardTitle}>{document.format}</span>
                  <span className={styles.cardSubtitle}>{t("downloadNow")}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        {t("footer")}
      </footer>
    </main>
  );
}
