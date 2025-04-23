'use client'

import { SiteSettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import AppToaster from "./Toaster";
import { SessionRefreshOverlay } from "./SessionRefreshOverlay";

export function RootBodyLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SiteSettingsProvider>
            <AuthProvider>
                <Header />
                <div className="flex-1">{children}</div>
                <Footer />
                <AppToaster />
                <SessionRefreshOverlay />
            </AuthProvider>
        </SiteSettingsProvider>
    );
}
