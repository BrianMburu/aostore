// components/skeletons/TransactionHistorySkeleton.tsx
'use client';

export default function TransactionHistorySkeleton() {
    return (
        <div className="animate-pulse space-y-4 p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                        <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
