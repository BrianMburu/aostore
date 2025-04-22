import { FeatureRequestFilter } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestFilter";
import { FeatureRequestList } from "@/app/ui/MyDapps/FeatureRequests/FeatureRequestList";
import { FeatureRequestsListSkeleton } from "@/app/ui/MyDapps/FeatureRequests/skeletons/FeatureRequestSkeleton";
import { Suspense } from "react";
// import { fetchAllPages } from '@/helpers/idsPaginator';
// import { DAppService } from '@/services/ao/dappService';

// export async function generateStaticParams() {
//     try {
//         const appIds = await fetchAllPages((page) => DAppService.getAllDappIds(page));
//         return appIds;
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [{ appId: "TX1" }];
//     }
// }

// app/mydapps/[appId]/feature-requests/page.tsx
export default function FeatureRequestsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl mb-4 md:mb-0 font-bold dark:text-white">Feature Requests & Bugs</h2>
                <Suspense>
                    <FeatureRequestFilter />
                </Suspense>
            </div>

            <Suspense fallback={<FeatureRequestsListSkeleton />}>
                <FeatureRequestList />
            </Suspense>
        </div>
    )
}
