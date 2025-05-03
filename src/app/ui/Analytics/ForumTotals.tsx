'use client'

import { AnalyticsService } from "@/services/ao/analyticsService";
import { useEffect, useState, useTransition } from "react";
import { TotalCardSkeleton } from "./skeletons/TotalCardSkeleton";
import { TotalCard } from "./TotalCard";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";


export default function ForumTotals() {
    // const appId = useParams().appId as string;
    const appId = useSearchParams().get('appId') as string || "";

    const [totalForums, setTotalForums] = useState(0);
    const [isLoading, startTransition] = useTransition();

    const { isConnected } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    // if (isConnected) {
                    const fetchedForumTotal = await AnalyticsService.fetchForumCount(appId);

                    if (fetchedForumTotal) {
                        setTotalForums(Number(fetchedForumTotal));
                    }
                    // }
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
        <TotalCard title={"Total Forum Posts"} total={totalForums} icon={'💬'} />
    )
}