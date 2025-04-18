import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteSettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "./ui/Header/Header";
import Footer from "./ui/Footer/Footer";
import AppToaster from "./ui/Toaster";
// import { SessionRefreshOverlay } from './ui/SessionRefreshOverlay';

import "./globals.css";
import { RankProvider } from "@/context/RankContext";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
    robots: { index: true, follow: true },
    icons: {
        icon: '/favicon/favicon.ico',
        shortcut: '/favicon/favicon-16x16.png',
        apple: '/favicon/apple-touch-icon.png',
    },
    manifest: `/favicon/site.webmanifest`,
    openGraph: {
        url: siteConfig.url,
        title: siteConfig.title,
        description: siteConfig.description,
        siteName: siteConfig.title,
        images: [`${siteConfig.url}/images/og.jpg`],
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.title,
        description: siteConfig.description,
        images: [`${siteConfig.url}/images/og.jpg`],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}
            >
                <SiteSettingsProvider>
                    <AuthProvider>
                        <RankProvider>
                            <Header />
                            <div className="flex-1">{children}</div>
                            <Footer />
                            <AppToaster />
                            {/* <SessionRefreshOverlay /> */}
                        </RankProvider>
                    </AuthProvider>
                </SiteSettingsProvider>
            </body>
        </html>
    );
}
