// app/mydapps/[appId]/loading.tsx

import { Skeleton } from "../../skeleton";

export default function SettingsSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-700" />
                </div>
                <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-10 bg-gray-200 dark:bg-gray-700" />
                    </div>
                ))}
            </div>

            <div className="border-t pt-6">
                <Skeleton className="h-10 w-32 bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
    )
}