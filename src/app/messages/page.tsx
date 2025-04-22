import { Suspense } from 'react';

import { ReceivedMessageList } from '../ui/Messages/ReceivedMessageList';
import { MessageFilters } from '../ui/Messages/MessageFilter';
import MessageListSkeleton from '../ui/Messages/skeletons/MessageListSkeleton';

export default function MessagesPage() {
    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <MessageFilters />
                </div>
            </div>

            <Suspense fallback={<MessageListSkeleton n={6} />}>
                <ReceivedMessageList />
            </Suspense>
        </div>
    );
}