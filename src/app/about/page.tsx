// app/about/page.tsx
// import { LineChart, AreaChart, BarChart } from '@tremor/react'
// import { generateDailyData, generateDailyDataSpec } from '@/lib/analytics'
import { UserAcquisitionGraph } from '../ui/Analytics/UserAcquisitionGraph';
import { DevAcquisitionChart } from '../ui/Analytics/DeveloperAcquisitionChart';
import { Suspense } from 'react';
import { UserTransactionsChart } from '../ui/Analytics/UserTransactionsChart';
import { DappsGrowthChart } from '../ui/Analytics/DappsGrowthChart';
import { TotalCard } from '../ui/Analytics/TotalCard';
import { TotalCardSkeleton } from '../ui/Analytics/skeletons/TotalCardSkeleton';
import { ChartSkeleton } from '../ui/Analytics/skeletons/ChartSkeleton';

export default async function AboutPage() {
    // const devActivity = await generateDailyData(30, 'commits')
    // const userGrowth = await generateDailyData(30, 'users')
    // const statsData = {
    //     dapps: await generateDailyDataSpec(365, 'dapps'),
    //     developers: await generateDailyDataSpec(365, 'developers'),
    //     transactions: await generateDailyDataSpec(365, 'transactions'),
    //     community: await generateDailyDataSpec(365, 'community')
    // };
    const stats = [
        { title: 'Total dApps', metric: 'dapps', icon: '📱' },
        { title: 'Active Developers', metric: 'developers', icon: '👩💻' },
        { title: 'Daily Transactions', metric: 'transactions', icon: '💸' },
        { title: 'Community Members', metric: 'users', icon: '👥' },
    ]

    return (
        <div className="space-y-10">
            {/* Mission Section */}
            <section className="container mx-auto px-4 pt-20 pb-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-6 dark:text-white">
                        Why AoStore?
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                        We&apos;re solving the fragmentation in Web3 by creating a unified platform
                        where users can safely discover, interact with, and manage decentralized
                        applications across multiple chains.
                    </p>
                </div>
            </section>

            {/* Detailed Statistics Grid */}
            <section className="container mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                    Platform Growth Metrics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, i) => (

                        <Suspense key={i} fallback={<TotalCardSkeleton />}>
                            <TotalCard {...stat}></TotalCard>
                        </Suspense>
                    ))}
                </div>

                {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { title: "Total dApps", value: "1,234", data: statsData.dapps },
                        { title: "Active Developers", value: "856", data: statsData.developers },
                        { title: "Daily Transactions", value: "2.4M", data: statsData.transactions },
                        { title: "Community Members", value: "89K", data: statsData.community },
                    ].map((metric, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700"
                        >
                            <h3 className="text-lg font-semibold mb-2 dark:text-white">
                                {metric.title}
                            </h3>
                            <p className="text-3xl font-bold mb-4 dark:text-white">
                                {metric.value}
                            </p>
                            <AreaChart
                                data={metric.data}
                                index="date"
                                categories={[Object.keys(metric.data[0])[1]]}
                                colors={["indigo"]}
                                showAnimation
                                className="h-32"
                                showXAxis={false}
                                showYAxis={true}
                                showTooltip={false}
                                showLegend={false}
                            />
                        </div>
                    ))}
                </div> */}

                {/* Detailed Graphs */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <Suspense fallback={<ChartSkeleton />}>
                        <DappsGrowthChart title='Dapp Growth Timeline' />
                    </Suspense>

                    <Suspense fallback={<ChartSkeleton />}>
                        <DevAcquisitionChart title='Developer Growth' />
                    </Suspense>

                    <Suspense fallback={<ChartSkeleton />}>
                        <UserTransactionsChart title='Monthly Transactions' />
                    </Suspense>

                    <Suspense fallback={<ChartSkeleton />}>
                        <UserAcquisitionGraph title='User Acquisition' />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}