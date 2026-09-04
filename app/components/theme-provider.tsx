"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
    resolvedTheme: Theme;
    setTheme: (theme: Theme) => void;
}>({ resolvedTheme: "light", setTheme: () => undefined });

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [resolvedTheme, setResolvedTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";
        return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    });

    const setTheme = useCallback((theme: Theme) => {
        localStorage.setItem("theme", theme);
        setResolvedTheme(theme);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    }, [resolvedTheme]);

    const value = useMemo(() => ({ resolvedTheme, setTheme }), [resolvedTheme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
