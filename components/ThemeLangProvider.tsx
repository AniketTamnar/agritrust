"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type Lang = "en" | "hi" | "mr";

interface ThemeLangContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

const ThemeLangContext = createContext<ThemeLangContextType | null>(null);

export const useThemeLang = () => {
  const ctx = useContext(ThemeLangContext);
  if (!ctx) throw new Error("useThemeLang must be inside ThemeLangProvider");
  return ctx;
};

export default function ThemeLangProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    const savedLang = (localStorage.getItem("language") as Lang) || "en";
    setLang(savedLang);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeLangContext.Provider value={{ theme, toggleTheme, lang, setLang }}>
      {children}
    </ThemeLangContext.Provider>
  );
}
