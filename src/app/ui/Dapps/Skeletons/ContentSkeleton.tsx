export function ContentSkeleton() {
    return (
        <>
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
        </>
    )
}