import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { I18nPair } from "@/locales";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Inline pair — use for dynamic or one-off strings. */
  t: (en: string, ar: string) => string;
  /** Locale-file pair — use with centralized locale constants. */
  tx: (pair: I18nPair) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang === "en" || savedLang === "ar") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (en: string, ar: string) => (language === "en" ? en : ar);
  const tx = ([en, ar]: I18nPair) => (language === "en" ? en : ar);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tx, isRtl: language === "ar" }}>
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
