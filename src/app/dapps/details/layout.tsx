'use client'

import { Suspense } from 'react';
import { MobileTabs, DesktopTabs } from '@/app/ui/Dapps/Tabs';
import DappHeader from '@/app/ui/Dapps/DappHeader';
import DappBanner from '@/app/ui/Dapps/DappBanner';
import { BackLink } from '@/app/ui/BackLink';
import { AppContextProvider } from '@/context/DappContext';

export default function MyDAppsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense>
            <AppContextProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <header className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <BackLink href="/dapps" value={'Back to DApps'} />
                        </div>
                    </header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* App Header with conditional rendering */}
                        <DappHeader />

                        {/* Banner Carousel with conditional rendering */}
                        <DappBanner />

                        {/* Navigation Tabs */}
                        <div className="sm:hidden">
                            <Suspense>
                                <MobileTabs />
                            </Suspense>

                        </div>
                        <div className="hidden sm:block">
                            <Suspense>
                                <DesktopTabs />
                            </Suspense>
                        </div>

                        {/* Main Content */}
                        <div className="py-8">
                            {children}
                        </div>
                    </div>
                </div>
            </AppContextProvider>
        </Suspense>
    );
}
