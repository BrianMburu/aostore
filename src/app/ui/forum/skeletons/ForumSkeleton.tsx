// app/forum/loading.tsx
export default function ForumPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded-xl mb-8" />

            <div className="flex gap-4 mb-6">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4" />
            </div>

            <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                ))}
            </div>
        </div>

    );
}