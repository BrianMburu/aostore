'use client'

import React, { useEffect, useState, useTransition } from 'react';
import { AnalyticsService } from '@/services/ao/analyticsService';
import { AreaChart } from '@tremor/react'
import { useAuth } from '@/context/AuthContext';
import { ChartSkeleton } from '../../Analytics/skeletons/ChartSkeleton';

export function DappUserAcquisitionChart({ appId, title }: { appId: string, title: string }) {
    const [userData, setUserData] = useState<{ date: string; users: number; }[]>([]);
    const [isLoading, startTransition] = useTransition();

    const { isConnected } = useAuth();
    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (isConnected) {
                        const ratingsData = await AnalyticsService.fetchFavoritesData(appId);

                        if (ratingsData) {
                            setUserData(ratingsData);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching total reviews:", error);
                }

            })
    }, [appId, isConnected])

    if (isLoading) {
        return (
            <ChartSkeleton />
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <AreaChart
                data={userData}
                categories={["users"]}
                index="date"
                colors={["indigo"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};