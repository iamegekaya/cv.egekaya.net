"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          {t("title")}
        </h1>

        <div className={styles.cards}>

          {/* PDF TR Card */}
          <a
            href="/cv/ege-kaya-cv.pdf"
            download
            className={`${styles.card} ${styles.pdfCard}`}
            aria-label={t("downloadPdfTr")}
          >
            <div className={styles.cardContent}>
              <Image
                src="/logo/pdf.png"
                alt="PDF"
                width={64}
                height={64}
                className={styles.logoImage}
              />
              <span className={styles.label}>tr</span>
            </div>
          </a>

          {/* Word TR Card */}
          <a
            href="/cv/ege-kaya-cv.docx"
            download
            className={`${styles.card} ${styles.wordCard}`}
            aria-label={t("downloadWordTr")}
          >
            <div className={styles.cardContent}>
              <Image
                src="/logo/doc.png"
                alt="Word"
                width={64}
                height={64}
                className={styles.logoImage}
              />
              <span className={styles.label}>tr</span>
            </div>
          </a>

          {/* PDF EN Card */}
          <a
            href="/cv/ege-kaya-cv-en.pdf"
            download
            className={`${styles.card} ${styles.pdfCard}`}
            aria-label={t("downloadPdfEn")}
          >
            <div className={styles.cardContent}>
              <Image
                src="/logo/pdf.png"
                alt="PDF"
                width={64}
                height={64}
                className={styles.logoImage}
              />
              <span className={styles.label}>en</span>
            </div>
          </a>

          {/* Word EN Card */}
          <a
            href="/cv/ege-kaya-cv-en.docx"
            download
            className={`${styles.card} ${styles.wordCard}`}
            aria-label={t("downloadWordEn")}
          >
            <div className={styles.cardContent}>
              <Image
                src="/logo/doc.png"
                alt="Word"
                width={64}
                height={64}
                className={styles.logoImage}
              />
              <span className={styles.label}>en</span>
            </div>
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        {t("footer")}
      </footer>
    </main>
  );
}
