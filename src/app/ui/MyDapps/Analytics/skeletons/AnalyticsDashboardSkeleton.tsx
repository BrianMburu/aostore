// components/AnalyticsDashboardSkeleton.tsx
'use client';
import React from 'react';
import { Skeleton } from '../../../skeleton';

const AnalyticsDashboardSkeleton: React.FC = () => {
    return (
        <div className="w-full p-6 space-y-8">
            <Skeleton className="w-full h-96" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="w-full h-96" />
                <Skeleton className="w-full h-96" />
            </div>
        </div>
    );
};

export default AnalyticsDashboardSkeleton;
