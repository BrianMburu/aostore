'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '../../skeleton';
import { MessageCardSkeleton } from './MessageCardSkeleton';

const MessageListSkeleton = ({ n = 5 }: { n?: number | undefined }) => {
    const skeletonCards = Array.from({ length: n || 5 });
    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 shadow rounded-lg"
            >
                {skeletonCards.map((_, i) => (
                    <MessageCardSkeleton key={i} />
                ))}
            </motion.div>

            {/* Skeleton for pagination/infinite scroll controls */}
            <div className="mt-4">
                <Skeleton className="w-full h-8" />
            </div>
        </div>
    );
};

export default MessageListSkeleton;
