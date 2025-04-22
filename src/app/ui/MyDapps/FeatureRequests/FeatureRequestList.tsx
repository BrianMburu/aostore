'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { AnimatedList } from "../../animations/AnimatedList";
import { AnimatedListItem } from "../../animations/AnimatedListItem";
import InfinityScrollControls from "../../InfinityScrollControls";
import { FeatureRequestItem } from "./FeatureRequestItem";
import { Suspense, useCallback, useEffect, useState } from "react";
import { FeatureRequestsListSkeleton } from "./skeletons/FeatureRequestSkeleton";
import { FeatureBugParams, SupportService } from "@/services/ao/supportServices";
import { BugReport, FeatureRequest } from "@/types/support";
import { EmptyState } from "../../EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

export function FeatureRequestList() {
    const searchParams = useSearchParams();
    const appId = searchParams.get('appId') as string || "";

    const [requests, setRequests] = useState<(BugReport | FeatureRequest)[]>([]);
    const [total, setTotal] = useState(0);
    const [isFetching, setIsFetching] = useState(true);
    const { isConnected, isLoading: isAuthLoading } = useAuth()

    const fetchfilterParams = useCallback(() => {
        const filterParams = Object.fromEntries(searchParams.entries()) as FeatureBugParams;
        return filterParams
    }, [searchParams])

    const filterParams = fetchfilterParams();

    useEffect(() => {
        const fetchRequests = async () => {
            setIsFetching(true);
            const filterParams = fetchfilterParams();

            try {
                if (!isAuthLoading && isConnected) {
                    let requestData = [];
                    let totalRequests = 0;
                    const type = filterParams.type;

                    if (type === "feature" || !type) {
                        const { data, total } = await SupportService.getFeatureRequests(appId, filterParams, true);
                        requestData = data
                        totalRequests = total
                    } else {
                        const { data, total } = await SupportService.getBugReports(appId, filterParams, true);
                        requestData = data
                        totalRequests = total
                    }

                    if (requestData) {
                        setRequests(requestData);
                        setTotal(totalRequests);
                    }
                } else {
                    setRequests([]);
                    setTotal(0)
                }

            } catch (error) {
                console.error(error);

            } finally {
                setIsFetching(false);
            }
        };
        fetchRequests();
    }, [isConnected, isAuthLoading, appId, fetchfilterParams]);

    if (isFetching) return <FeatureRequestsListSkeleton />;

    if (!isFetching && requests.length === 0) {
        return (
            <EmptyState
                title="No Requests Found"
                description="We couldn't find any requests from the results."
                interactive
                className="my-12"
            />
        )
    }

    return (
        <div className="space-y-4">
            <AnimatedList>
                <div className="space-y-4">
                    {requests.map((request) => (
                        <AnimatedListItem key={request.requestId}>
                            <FeatureRequestItem
                                request={request}
                                appId={appId}
                                requestType={(filterParams.type === 'feature' || filterParams.type === 'bug') ? filterParams.type : 'feature'}
                            />
                        </AnimatedListItem>
                    ))}
                </div>
            </AnimatedList>


            {requests &&
                <Suspense>
                    <InfinityScrollControls
                        totalPages={Math.ceil(total / DEFAULT_PAGE_SIZE)}
                    />
                </Suspense>
            }
        </div>
    )
}