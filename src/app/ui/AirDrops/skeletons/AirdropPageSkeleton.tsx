// app/airdrops/loading.tsx
import { AirdropsSkeleton } from "./AirdropsSkeleton";

export default function AirdropsPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 mx-auto mb-4 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 mx-auto animate-pulse" />
            </div>

            <AirdropsSkeleton n={6} />
        </div>
    );
}