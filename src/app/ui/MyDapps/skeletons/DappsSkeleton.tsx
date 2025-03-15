// components/DAppSkeleton.tsx
export function DAppSkeleton() {
    return (
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-48">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between mt-4">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
        </div>
    );
}