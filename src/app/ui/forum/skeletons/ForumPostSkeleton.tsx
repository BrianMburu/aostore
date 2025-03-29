// components/ForumSkeleton.tsx
export const ForumPostsSkeleton = ({ n = 5 }: { n?: number }) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {[...Array(n)].map((_, i) => (
            <div key={i} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            </div>
        ))}
    </div>

);