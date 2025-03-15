import React from 'react';
import { Skeleton } from '../../skeleton';


export function TotalCardSkeleton() {
    return (
        <div className="border p-6 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-4">
                {/* Icon skeleton */}
                <Skeleton className="h-10 w-10" />
                <div className="flex flex-col">
                    {/* Title skeleton */}
                    <Skeleton className="h-4 w-20 mb-2" />
                    {/* Total value skeleton */}
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
        </div>
    );
}
