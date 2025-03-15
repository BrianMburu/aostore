// components/SentMessageListSkeleton.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SentMessageCardSkeleton from './SentMessageCardSkeleton';
import { Skeleton } from '@/app/ui/skeleton';

const SentMessageListSkeleton: React.FC<{ n: number | undefined }> = ({ n = 5 }) => {
    const skeletonCount = n || 5;
    return (
        <div className="space-y-6">
            {Array.from({ length: skeletonCount }).map((_, index) => (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <SentMessageCardSkeleton />
                </motion.div>
            ))}
            {/* Skeleton for pagination/infinity scroll controls */}
            <div className="mt-4">
                <Skeleton className="w-full h-8" />
            </div>
        </div>
    );
};

export default React.memo(SentMessageListSkeleton);
