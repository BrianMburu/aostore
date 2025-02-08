// app/airdrops/loading.tsx
import { AirdropSkeleton } from '../ui/AirDrops/AirdropsSkeleton';

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mx-auto mb-4 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 mx-auto animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <AirdropSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}