'use client'
import { AnalyticsService } from '@/services/ao/analyticsService';
import { BarChart } from '@tremor/react'
import { ChartSkeleton } from '../../Analytics/skeletons/ChartSkeleton';
import { useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/context/AuthContext';


export function DappRatingsChart({ appId, title }: { appId: string, title: string }) {
    const [ratingsData, setRatingsData] = useState<{ name: string; value: number; }[]>([]);
    const [isLoading, startTransition] = useTransition();

    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (isConnected) {
                        const ratingsData = await AnalyticsService.fetchDappRatingsData(appId);

                        if (ratingsData) {
                            setRatingsData(ratingsData);
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

    const categories = ["value"];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <BarChart
                data={ratingsData}
                categories={categories}
                index="name"
                colors={["blue", "green", "yellow", "orange", "red"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};