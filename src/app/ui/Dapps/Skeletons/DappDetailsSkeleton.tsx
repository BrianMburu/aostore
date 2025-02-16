export function DappDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* App Header Skeleton */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    <div className="flex-1 space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-48" />
                    </div>
                </div>

                {/* Banner Skeleton */}
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8" />

                {/* Tabs Skeleton */}
                <div className="flex gap-8 mb-8">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        ))}
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    </div>

                    <div className="space-y-6">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}