import { FeatureRequestList } from "@/app/ui/Dapps/FeatureRequests/FeatureRequestList";
import { FeatureRequestFilter } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestFilter";
import { FeatureRequestsListSkeleton } from "@/app/ui/MyDapps/FeatureRequests/skeletons/FeatureRequestSkeleton";
import { Suspense } from "react";

interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<{ type?: string; search?: string }>;
}
export default async function DappFeatureRequestsPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId as string;
    const searchParams = await props.searchParams;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Feature Requests & Bugs</h2>
                    <FeatureRequestFilter />
                </div>

                <Suspense fallback={<FeatureRequestsListSkeleton />}>
                    <FeatureRequestList appId={appId} searchParams={await searchParams} />
                </Suspense>

            </div>
        </div>

    )
}