'use client'
import { AnalyticsService } from '@/services/ao/analyticsService';
import { DonutChart } from '@tremor/react'
import { ChartSkeleton } from '../../Analytics/skeletons/ChartSkeleton';
import { useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/context/AuthContext';


export function FeatureBugChart({ appId, title }: { appId: string, title: string }) {
    const [featureBugData, setFeatureBugData] = useState<{ names: string[], categories: string[] }>({ names: ["feature", "bug"], categories: [] });
    const [isLoading, startTransition] = useTransition();

    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(async () => {
            try {
                if (isConnected) {
                    const [fetchedFeatureTotal, fetchedBugTotal] = await Promise.all([
                        AnalyticsService.fetchFeatureTotals(appId),
                        AnalyticsService.fetchBugTotals(appId)
                    ]);

                    if (fetchedFeatureTotal !== undefined && fetchedBugTotal !== undefined) {
                        setFeatureBugData((prev) => ({
                            ...prev, categories: [fetchedFeatureTotal, fetchedBugTotal],
                        }));
                    } else {
                        console.warn("One or both totals are undefined.");
                    }
                }
            } catch (error) {
                console.error("Error fetching feature or bug totals:", error);
            }
        });
    }, [appId, isConnected])

    if (isLoading) {
        return (
            <ChartSkeleton />
        )
    }
    const chartData = featureBugData.categories.map((value, index) => ({
        name: featureBugData.names[index],
        value,
    }))
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{title}</h3>
            <DonutChart
                data={chartData}
                variant="donut"
                colors={["green", "red"]}
                showAnimation
                className="h-64"
            />
        </div>
    )
};