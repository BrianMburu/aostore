export function MessageListSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg" />
            ))}
        </div>
    );
}