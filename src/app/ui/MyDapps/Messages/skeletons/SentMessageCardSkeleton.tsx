// components/SentMessageCardSkeleton.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/app/ui/skeleton';

const SentMessageCardSkeleton: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 dark:border-gray-700"
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    {/* Title Skeleton */}
                    <Skeleton className="w-3/4 h-6" />
                </div>
                <div className="ml-4">
                    {/* Edit Button Skeleton */}
                    <Skeleton className="w-12 h-6" />
                </div>
            </div>
            <div className="mt-2">
                {/* Content Skeleton (simulate two lines) */}
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-5/6 h-4" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {/* Type Skeleton */}
                <Skeleton className="w-24 h-4" />
                {/* Created Date Skeleton */}
                <Skeleton className="w-32 h-4" />
                {/* Last Updated Date Skeleton */}
                <Skeleton className="w-40 h-4" />
            </div>
        </motion.div>
    );
};

export default React.memo(SentMessageCardSkeleton);
