'use client';

import React from 'react';
import { Skeleton } from '../../skeleton';

export function ChartSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-40 mb-4" />
            {/* Chart skeleton */}
            <Skeleton className="h-64" />
        </div>
    );
}
