import { FeatureRequestList } from "@/app/ui/Dapps/FeatureRequests/FeatureRequestList";
import { FeatureRequestFilter } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestFilter";
import { FeatureRequestsListSkeleton } from "@/app/ui/MyDapps/FeatureRequests/skeletons/FeatureRequestSkeleton";
import { Suspense } from "react";

export default function DappFeatureRequestsPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Feature Requests & Bugs</h2>
                    <FeatureRequestFilter />
                </div>

                <Suspense fallback={<FeatureRequestsListSkeleton />}>
                    <FeatureRequestList />
                </Suspense>

            </div>
        </div>

    )
}