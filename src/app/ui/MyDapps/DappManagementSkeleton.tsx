export function DAppManagementSkeleton() {
    return (
        <div className="animate-pulse space-y-8">
            {/* Verification Status Skeleton */}
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
            </div>

            {/* Edit Form Skeleton */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm space-y-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/4" />
                        <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg" />
                    </div>
                ))}
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg w-32" />
            </div>

            {/* Danger Zone Skeleton */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-1/4 mb-4" />
                <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg w-32" />
            </div>
        </div>
    );
}