import { Suspense } from 'react';
import { DappUserAcquisitionChart } from '@/app/ui/MyDapps/Analytics/DappUserAcquisitionChart';
import { ChartSkeleton } from '@/app/ui/Analytics/skeletons/ChartSkeleton';
import { FeatureBugChart } from '@/app/ui/MyDapps/Analytics/FeatureBugChart';
import { DappRatingsChart } from '@/app/ui/MyDapps/Analytics/DappRatingsChart';
import ReviewTotals from '@/app/ui/Analytics/ReviewTotals';
import UserTotals from '@/app/ui/Analytics/UserTotals';
import ForumTotals from '@/app/ui/Analytics/ForumTotals';
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

export default function AnalyticsPage() {
    // const stats = [
    //     { title: 'Total Reviews Posted', metric: 'reviews', icon: '📝' },
    //     { title: 'Total Forum Posts', metric: 'forumPosts', icon: '💬' },
    //     { title: 'Total Subscribed Users', metric: 'users', icon: '👥' },
    // ];

    return (
        <div className="w-full p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <Suspense fallback={<ChartSkeleton />}>
                    <ReviewTotals />
                </Suspense>
                <Suspense fallback={<ChartSkeleton />}>
                    <ForumTotals />
                </Suspense>
                <Suspense fallback={<ChartSkeleton />}>
                    <UserTotals />
                </Suspense>
            </div>
            <Suspense fallback={<ChartSkeleton />}>
                <DappUserAcquisitionChart title='User Acquisition' />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<ChartSkeleton />}>
                    <DappRatingsChart title='Ratings Distribution' />
                </Suspense>

                <Suspense fallback={<ChartSkeleton />}>
                    <FeatureBugChart title='Feature/Bug Ratio' />
                </Suspense>
            </div>
        </div>
    )
}