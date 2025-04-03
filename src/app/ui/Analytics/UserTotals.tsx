'use client'

import { AnalyticsService } from "@/services/ao/analyticsService";
import { useEffect, useState, useTransition } from "react";
import { TotalCardSkeleton } from "./skeletons/TotalCardSkeleton";
import { TotalCard } from "./TotalCard";
import { useAuth } from "@/context/AuthContext";


export default function UserTotals({ appId }: { appId: string }) {
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, startTransition] = useTransition();

    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (isConnected) {
                        const fetchedUserTotal = await AnalyticsService.fetchFavoritesCount(appId);

                        if (fetchedUserTotal) {
                            setTotalUsers(Number(fetchedUserTotal));
                        }
                    }
                } catch (error) {
                    console.error("Error fetching total reviews:", error);
                }

            })
    }, [appId, isConnected])

    if (isLoading) {
        return (
            <TotalCardSkeleton />
        )
    }
    return (
        <TotalCard title={"Total Subscribed Users"} total={totalUsers} icon={'👥'} />
    )
}