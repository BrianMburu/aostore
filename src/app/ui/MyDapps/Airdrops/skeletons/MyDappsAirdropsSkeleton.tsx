import { AirdropsSkeleton } from "@/app/ui/AirDrops/skeletons/AirdropsSkeleton";
import { Skeleton } from "@/app/ui/skeleton";

export default function MyDappsAirdropsSkeleton() {
    return (
        <div className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <Skeleton className="w-1/4 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />

                <div className="flex gap-2 w-full sm:w-auto">
                    <Skeleton className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <Skeleton className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <AirdropsSkeleton n={6} />
            </main>
        </div>
    )
}