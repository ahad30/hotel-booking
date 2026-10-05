import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionary } from "./dictionary";

const STORAGE_KEY = "behb:lang";
const LanguageContext = createContext(null);

const initialLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "bn") return saved;
  } catch {
    /* storage unavailable */
  }
  return "en";
};

// English / Bangla for the public site. Missing keys fall back to English, then to the key.
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* the choice just won't persist */
    }
  }, [lang]);

  const t = useCallback(
    (key, vars) => {
      let text = dictionary[lang][key] ?? dictionary.en[key] ?? key;
      if (vars) Object.entries(vars).forEach(([k, v]) => (text = text.replaceAll(`{${k}}`, v)));
      return text;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, toggle: () => setLang((l) => (l === "en" ? "bn" : "en")), t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(LanguageContext);
  // Outside the provider (e.g. isolated tests) behave as English.
  return ctx || { lang: "en", setLang: () => {}, toggle: () => {}, t: (k) => dictionary.en[k] ?? k };
};
