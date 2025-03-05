import { FeatureRequestFilter } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestFilter";
import { FeatureRequestList } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestList";
import { FeatureRequestsListSkeleton } from "@/app/ui/MyDapps/FeatureRequests/skeletons/FeatureRequestSkeleton";
import { Suspense } from "react";

// app/mydapps/[appId]/feature-requests/page.tsx
export default async function FeatureRequestsPage({ params, searchParams }: {
    params: { appId: string }
    searchParams: { type?: string; search?: string }
}) {

    const currParams = await params;
    const appId = currParams.appId as string;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Feature Requests & Bugs</h2>
                <FeatureRequestFilter />
            </div>

            <Suspense fallback={<FeatureRequestsListSkeleton />}>
                <FeatureRequestList appId={appId} searchParams={await searchParams} />
            </Suspense>
        </div>
    )
}
