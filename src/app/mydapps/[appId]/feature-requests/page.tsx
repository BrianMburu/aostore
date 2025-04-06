import { FeatureRequestFilter } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestFilter";
import { FeatureRequestList } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestList";
import { FeatureRequestsListSkeleton } from "@/app/ui/MyDapps/FeatureRequests/skeletons/FeatureRequestSkeleton";
import { Suspense } from "react";

interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<{ type?: string; search?: string, page?: string }>;
}
// app/mydapps/[appId]/feature-requests/page.tsx
export default async function FeatureRequestsPage(props: Props) {
    const currParams = await props.params;

    const searchParams = await props.searchParams;
    const appId = currParams.appId as string;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Feature Requests & Bugs</h2>
                <FeatureRequestFilter />
            </div>

            <Suspense fallback={<FeatureRequestsListSkeleton />}>
                <FeatureRequestList appId={appId} searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
