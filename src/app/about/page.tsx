// import { UserAcquisitionGraph } from '../ui/Analytics/UserAcquisitionGraph';
// import { DevAcquisitionChart } from '../ui/Analytics/DeveloperAcquisitionChart';
// import { Suspense } from 'react';
// import { UserTransactionsChart } from '../ui/Analytics/UserTransactionsChart';
// import { DappsGrowthChart } from '../ui/Analytics/DappsGrowthChart';
// import { TotalCard } from '../ui/Analytics/TotalCard';
// import { TotalCardSkeleton } from '../ui/Analytics/skeletons/TotalCardSkeleton';
// import { ChartSkeleton } from '../ui/Analytics/skeletons/ChartSkeleton';

export default async function AboutPage() {
    // const stats = [
    //     { title: 'Total dApps', metric: 'dapps', icon: '📱' },
    //     { title: 'Active Developers', metric: 'developers', icon: '👩💻' },
    //     { title: 'Daily Transactions', metric: 'transactions', icon: '💸' },
    //     { title: 'Community Members', metric: 'users', icon: '👥' },
    // ]

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
            {/* <section className="container mx-auto px-4 py-10">
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
            </section> */}
        </div>
    )
}