'use client'

import { useState } from 'react';
import { DAppsListLimit } from "./DappListLimit";
import { Suspense } from "react";
import DappSupport from "./Support/DappSupport";
import DappCardsSkeleton from "./Skeletons/DappCardsSkeleton";
import { AirdropsListLimit } from "../AirDrops/AirdropListLimit";
import { AirdropsSkeletonVertical } from "../AirDrops/skeletons/AirdropsSkeleton";
import { ContentSkeleton } from './Skeletons/ContentSkeleton';
import { useAppContext } from '@/context/DappContexts';

export function DappInfo() {
    const { appData, loading } = useAppContext();
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!appData || loading) {
        return <ContentSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description & Details */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                <p className={`text-gray-600 dark:text-gray-300 mb-4 ${!showFullDescription ? 'line-clamp-5' : ''}`}>
                    {appData.description}
                </p>
                <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                </button>

                {/* Metadata */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Protocol</p>
                        <p className="text-gray-900 dark:text-white">{appData.protocol}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Released</p>
                        <p className="text-gray-900 dark:text-white">
                            {new Date(appData.createdTime).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* // Add new sections in the Details tab */}
                <div className="mt-12 space-y-12">
                    {/* Support Section */}
                    <Suspense fallback={<DappCardsSkeleton n={4} />}>
                        <DappSupport appData={appData} />
                    </Suspense>

                    {/* Similar DApps Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar DApps</h2>
                        <Suspense fallback={<DappCardsSkeleton n={4} />}>
                            <DAppsListLimit params={{ category: appData.projectType }} />
                        </Suspense>
                    </section>

                    {/* More from Company Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More from {appData.companyName}</h2>
                        <Suspense fallback={<DappCardsSkeleton n={4} />}>
                            <DAppsListLimit params={{ companyName: appData.companyName }} />
                        </Suspense>
                    </section>
                </div>
            </div>

            {/* Events & Offers */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events & Offers</h2>
                <Suspense fallback={<AirdropsSkeletonVertical n={4} />}>
                    <AirdropsListLimit appId={appData.appId} params={{ appId: appData.appId }} />
                </Suspense>
            </div>
        </div>
    )
}