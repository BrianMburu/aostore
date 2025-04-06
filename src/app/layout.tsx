import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "./ui/Header/Header";
import Footer from "./ui/Footer/Footer";
import AppToaster from "./ui/Toaster";
// import { SessionRefreshOverlay } from './ui/SessionRefreshOverlay';

import "./globals.css";
import { RankProvider } from "@/context/RankContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "AOStore",
    description:
        "Playstorelike store for decentralized applications in AO ecosystem.",
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
                <ThemeProvider>
                    <AuthProvider>
                        <RankProvider>
                            <Header />
                            <div className="flex-1">{children}</div>
                            <Footer />
                            <AppToaster />
                            {/* <SessionRefreshOverlay /> */}
                        </RankProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
