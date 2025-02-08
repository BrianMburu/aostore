// app/airdrops/[airdropId]/loading.tsx
export default function AirdropDetailsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-8">
                {/* Back Button Skeleton */}
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-12" />

                {/* Header Skeleton */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Description Skeleton */}
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                        </div>
                    </div>

                    {/* Details Skeleton */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                </div>
                            ))}
                        </div>

                        {/* <div className="space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                            <div className="grid grid-cols-2 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                                ))}
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        </div> */}

                        {/* New User ID & Token ID Skeleton */}
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                </div>
                            ))}
                        </div>

                        {/* Eligibility Check Skeleton */}
                        <div className="space-y-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        </div>
                    </div>
                </div>


                {/* Timeline Skeleton */}
                <div className="mt-8 space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="flex gap-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}