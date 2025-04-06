import { Suspense } from 'react';
import { DappUserAcquisitionChart } from '@/app/ui/MyDapps/Analytics/DappUserAcquisitionChart';
import { ChartSkeleton } from '@/app/ui/Analytics/skeletons/ChartSkeleton';
import { FeatureBugChart } from '@/app/ui/MyDapps/Analytics/FeatureBugChart';
import { DappRatingsChart } from '@/app/ui/MyDapps/Analytics/DappRatingsChart';
import ReviewTotals from '@/app/ui/Analytics/ReviewTotals';
import UserTotals from '@/app/ui/Analytics/UserTotals';
import ForumTotals from '@/app/ui/Analytics/ForumTotals';
interface Props {
    params: Promise<{ appId: string }>;
}
export default async function AnalyticsPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId
    // const stats = [
    //     { title: 'Total Reviews Posted', metric: 'reviews', icon: '📝' },
    //     { title: 'Total Forum Posts', metric: 'forumPosts', icon: '💬' },
    //     { title: 'Total Subscribed Users', metric: 'users', icon: '👥' },
    // ];

    return (
        <div className="w-full p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <Suspense fallback={<ChartSkeleton />}>
                    <ReviewTotals appId={appId} />
                </Suspense>
                <Suspense fallback={<ChartSkeleton />}>
                    <ForumTotals appId={appId} />
                </Suspense>
                <Suspense fallback={<ChartSkeleton />}>
                    <UserTotals appId={appId} />
                </Suspense>
            </div>
            <Suspense fallback={<ChartSkeleton />}>
                <DappUserAcquisitionChart appId={appId} title='User Acquisition' />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<ChartSkeleton />}>
                    <DappRatingsChart appId={appId} title='Ratings Distribution' />
                </Suspense>

                <Suspense fallback={<ChartSkeleton />}>
                    <FeatureBugChart appId={appId} title='Feature/Bug Ratio' />
                </Suspense>
            </div>
        </div>
    )
}