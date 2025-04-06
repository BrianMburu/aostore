'use client'

import { AnalyticsService } from "@/services/ao/analyticsService";
import { useEffect, useState, useTransition } from "react";
import { TotalCardSkeleton } from "./skeletons/TotalCardSkeleton";
import { TotalCard } from "./TotalCard";
import { useAuth } from "@/context/AuthContext";


export default function ReviewTotals({ appId }: { appId: string }) {
    const [totalReviews, setTotalReview] = useState(0);
    const [isLoading, startTransition] = useTransition();

    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (isConnected) {
                        const fetchedReviewsTotal = await AnalyticsService.fetchTotalDappRatings(appId);
                        if (fetchedReviewsTotal) {
                            setTotalReview(Number(fetchedReviewsTotal));
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
        <TotalCard title={"Total Reviews Posted"} total={totalReviews} icon={'📝'} />
    )
}