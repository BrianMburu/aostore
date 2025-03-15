'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');

    // Load saved theme from localStorage on mount.
    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = (theme: Theme) => {
            if (theme === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                systemPrefersDark ? root.classList.add('dark') : root.classList.remove('dark');
            } else if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
