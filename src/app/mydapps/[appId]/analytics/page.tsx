// 'use client'

import { fetchAnalytics } from '@/lib/analytics'
import AnalyticsDashboard from '@/app/ui/MyDapps/Analytics/AnalyticsDashboard'
export default async function AnalyticsPage({ params }: { params: { appId: string } }) {

    const currParams = await params;
    const appId = currParams.appId
    const data = await fetchAnalytics(appId);


    return (
        <div className="">
            <AnalyticsDashboard data={data!} />
        </div>
    )
}