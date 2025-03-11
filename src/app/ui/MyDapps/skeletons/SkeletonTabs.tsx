// components/mydapps/SkeletonTabs.tsx
export default function SkeletonTabs() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8" />

            <div className="flex gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24" />
                ))}
            </div>

            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                ))}
            </div>
        </div>
    );
}