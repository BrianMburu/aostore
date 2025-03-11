'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { AnimatedList } from "../../animations/AnimatedList";
import { AnimatedListItem } from "../../animations/AnimatedListItem";
import InfinityScrollControls from "../../InfinityScrollControls";
import { notFound, useSearchParams } from "next/navigation";
import { FeatureRequestItem } from "./FeatureRequestItem";
import { useEffect, useState, useTransition } from "react";
import { FeatureRequestsListSkeleton } from "./skeletons/FeatureRequestSkeleton";
import { FeatureBugParams, SupportService } from "@/services/ao/supportServices";
import { BugReport, FeatureRequest } from "@/types/support";

interface FeatureRequestList {
    appId: string,
    searchParams: { type?: string; search?: string }
}

export function FeatureRequestList({ appId }: FeatureRequestList) {
    const searchParams = useSearchParams()
    const [requests, setRequests] = useState<(BugReport | FeatureRequest)[]>([]);
    const [total, setTotal] = useState(0);
    const [fetching, startTransition] = useTransition();

    useEffect(() => {
        const filterParams: FeatureBugParams = {
            search: searchParams.get("search") || "",
            page: searchParams.get("page") || "",
            type: searchParams.get("type") || ""
        }

        startTransition(async () => {
            const { data, total } = await SupportService.getFeatureRequests(appId, filterParams, true);

            if (!data) return notFound();

            if (data !== null) {
                setRequests(data);
                setTotal(total);
            }
        });
    }, [appId, searchParams]);

    if (fetching) return <FeatureRequestsListSkeleton />;

    return (
        <div className="space-y-4">
            <AnimatedList>
                <div className="space-y-4">
                    {requests.map((request) => (
                        <AnimatedListItem key={request.id}>
                            <FeatureRequestItem request={request} />
                        </AnimatedListItem>

                    ))}
                </div>
            </AnimatedList>


            {requests &&
                <InfinityScrollControls
                    totalPages={Math.ceil(total / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}