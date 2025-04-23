'use client';

import { getFromLocalStorage, writeToLocalStorage } from '@/helpers/session';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type SiteSettingsContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    rememberMe: boolean;
    setRememberMe: (rememberMe: boolean) => void;
    showNotifications: boolean;
    setShowNotifications: (rememberMe: boolean) => void;
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'system';
        const savedTheme = getFromLocalStorage('theme') as Theme;
        return savedTheme || 'system';
    }
    );

    const [rememberMe, setRememberMe] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const savedChoice = getFromLocalStorage('rememberMe');
        return savedChoice === "true" || false;
    });

    const [showNotifications, setShowNotifications] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        const savedChoice = getFromLocalStorage('showNotifications');
        return savedChoice === "true" || false;
    });

    // Memoized function to apply and persist the theme.
    const applyTheme = useCallback(() => {
        const root = document.documentElement;

        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (systemPrefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else if (theme === 'dark') {
            root.classList.add('dark');
        } else { // 'light'
            root.classList.remove('dark');
        }

        // Persist the theme in local storage.
        writeToLocalStorage('theme', theme);
    }, [theme]);

    useEffect(() => {
        applyTheme();
    }, [applyTheme]);

    useEffect(() => {
        writeToLocalStorage('rememberMe', rememberMe.toString());
    }, [rememberMe]);

    useEffect(() => {
        writeToLocalStorage('showNotifications', showNotifications.toString());
    }, [showNotifications]);

    // Memoize context value to optimize re-renders.
    const contextValue = useMemo(
        () => ({
            theme,
            setTheme,
            rememberMe,
            setRememberMe,
            showNotifications,
            setShowNotifications,
        }),
        [theme, rememberMe, showNotifications]
    );

    return (
        <SiteSettingsContext.Provider value={contextValue}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
