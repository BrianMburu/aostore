'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { AnimatedList } from "../../animations/AnimatedList";
import { AnimatedListItem } from "../../animations/AnimatedListItem";
import InfinityScrollControls from "../../InfinityScrollControls";
import { FeatureRequestItem } from "./FeatureRequestItem";
import { useEffect, useState } from "react";
import { SupportService } from "@/services/ao/supportServices";
import { BugReport, FeatureRequest } from "@/types/support";
import { EmptyState } from "../../EmptyState";
import { useAuth } from "@/context/AuthContext";
import { FeatureRequestsListSkeleton } from "../../MyDapps/FeatureRequests/skeletons/FeatureRequestSkeleton";

interface FeatureRequestList {
    appId: string,
    searchParams: { type?: string; search?: string, page?: string }
}

export function FeatureRequestList({ appId, searchParams }: FeatureRequestList) {
    const [requests, setRequests] = useState<(BugReport | FeatureRequest)[]>([]);
    const [total, setTotal] = useState(0);
    const [isFetching, setIsFetching] = useState(true);
    const { isConnected } = useAuth()

    useEffect(() => {
        const fetchRequests = async () => {
            setIsFetching(true);
            try {
                let requestData = [];
                let totalRequests = 0;

                const type = searchParams.type;
                if (type === "feature" || !type) {
                    const { data, total } = await SupportService.getFeatureRequests(appId, searchParams, true);
                    requestData = data
                    totalRequests = total
                } else {
                    const { data, total } = await SupportService.getBugReports(appId, searchParams, true);
                    requestData = data
                    totalRequests = total
                }
                if (requestData.length) {
                    setRequests(requestData);
                    setTotal(totalRequests);
                }

            } catch (error) {
                console.error(error);

            } finally {
                setIsFetching(false);
            }
        };
        fetchRequests();
    }, [isConnected, appId, searchParams]);

    if (isFetching) return <FeatureRequestsListSkeleton />;

    if (!isFetching && requests.length === 0) {
        return (
            <EmptyState
                title="No Dapps Found"
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
                                requestType={(searchParams.type === 'feature' || searchParams.type === 'bug') ? searchParams.type : 'feature'}
                            />
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