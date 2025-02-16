export function DAppsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-8">
                    {/* Header Skeleton */}
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-full max-w-xl" />

                    {/* Favorites Section */}
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 mx-auto" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top DApps Section */}
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 mx-auto" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}