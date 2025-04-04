// components/DAppCardSkeleton.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/app/ui/skeleton';

export const DAppCardSkeleton: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
            <div className="flex flex-row md:flex-col items-center justify-center w-full gap-4">
                {/* Image Skeleton */}
                <div className="flex-shrink-0">
                    <Skeleton className="w-24 h-24 rounded-2xl" />
                </div>
                {/* Content Skeleton */}
                <div className="flex flex-col items-center w-full sm:text-center text-left space-y-2">
                    {/* Title Skeleton */}
                    <Skeleton className="w-3/4 h-6" />
                    {/* Company Name Skeleton */}
                    <Skeleton className="w-1/2 h-4" />
                    {/* Ratings Skeleton */}
                    {/* <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="w-4 h-4 rounded" />
                        ))}
                    </div> */}
                    {/* Project Type Skeleton */}
                    <Skeleton className="w-1/3 h-6 rounded-full" />
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(DAppCardSkeleton);
