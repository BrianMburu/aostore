'use client';

import { motion } from 'framer-motion';
import MessageCardSkeleton from './MessageCardSkeleton';
import { Skeleton } from '../../skeleton';

const MessageListSkeleton = ({ n }: { n: number | undefined }) => {
    const skeletonCards = Array.from({ length: n || 5 });
    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 shadow rounded-lg"
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
