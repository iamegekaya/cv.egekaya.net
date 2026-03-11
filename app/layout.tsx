import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import SiteBackground from "./components/SiteBackground";
import {
  dictionaries,
  LANGUAGE_COOKIE_NAME,
  resolveLanguage,
} from "./i18n";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


async function getRequestLanguage() {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;

  return {
    hasLanguageCookie: languageCookie !== undefined,
    language: resolveLanguage(languageCookie),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { language } = await getRequestLanguage();
  const dictionary = dictionaries[language];

  return {
    title: dictionary.metaTitle,
    description: dictionary.metaDescription,
    icons: {
      icon: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hasLanguageCookie, language } = await getRequestLanguage();

  return (
    <html lang={language} className={cn("font-sans", inter.variable)}>
      <body className="relative isolate min-h-screen text-white">
        <SiteBackground />
        <LanguageProvider
          initialLanguage={language}
          hasLanguageCookie={hasLanguageCookie}
        >
          <div className="relative z-10">
            <Header />
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
