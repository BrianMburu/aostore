'use client'

import { useState, useEffect } from 'react';
import { AppDataContext, AppLoadingContext } from '@/context/DappContexts';
import { MobileTabs, DesktopTabs } from '@/app/ui/Dapps/Tabs';
import Link from 'next/link';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import DappHeader from '@/app/ui/Dapps/DappHeader';
import DappBanner from '@/app/ui/Dapps/DappBanner';
import { notFound, useParams } from 'next/navigation';
import { DAppService } from '@/services/ao/dappService';
import { Dapp } from '@/types/dapp';
import { HeaderSkeleton } from '@/app/ui/Dapps/Skeletons/HeaderSkeleton';
import { BannerSkeleton } from '@/app/ui/Dapps/Skeletons/BannerSkeleton';
import { useAuth } from '@/context/AuthContext';

export default function MyDAppsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [appData, setAppData] = useState<Dapp | null>(null);
    const [fetching, setIsFetching] = useState<boolean>(true);
    const params = useParams();
    const appId = params.appId as string;
    const { isConnected } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dapp = await DAppService.getDApp(appId);
                if (!dapp) notFound();
                setAppData(dapp);
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [appId, isConnected]);

    return (
        <AppLoadingContext.Provider value={fetching}>
            <AppDataContext.Provider value={appData}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <header className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <Link
                                href="/dapps"
                                className="flex items-center text-indigo-600 dark:text-indigo-400"
                            >
                                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                                Back to DApps
                            </Link>
                        </div>
                    </header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* App Header with conditional rendering */}
                        {!appData ? <HeaderSkeleton /> : <DappHeader appData={appData} />}

                        {/* Banner Carousel with conditional rendering */}
                        {!appData ? (
                            <BannerSkeleton />
                        ) : (
                            <DappBanner mainBannerImageUrls={Object.values(appData.bannerUrls)} />
                        )}

                        {/* Navigation Tabs */}
                        <div className="sm:hidden">
                            <MobileTabs />
                        </div>
                        <div className="hidden sm:block">
                            <DesktopTabs />
                        </div>

                        {/* Main Content */}
                        <div className="py-8">{children}</div>
                    </div>
                </div>
            </AppDataContext.Provider>
        </AppLoadingContext.Provider>
    );
}
