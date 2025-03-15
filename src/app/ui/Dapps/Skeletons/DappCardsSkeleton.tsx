export default function DappCardsSkeleton({ n }: { n: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(n)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 mx-auto" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto" />
                </div>
            ))}
        </div>
    )
}