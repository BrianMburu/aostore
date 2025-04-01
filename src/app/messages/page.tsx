import { Suspense } from 'react';

import { ReceivedMessageList } from '../ui/Messages/ReceivedMessageList';
import { MessageFilters } from '../ui/Messages/MessageFilter';
import MessageListSkeleton from '../ui/Messages/skeletons/MessageListSkeleton';
import { MessageFilterParams } from '@/services/ao/messageService';
interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<MessageFilterParams>;
}
export default async function MessagesPage(props: Props) {

    const searchParams = await props.searchParams;
    return (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    {/* <input
                        {...register('search')}
                        placeholder="Search messages..."
                        className="px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    /> */}
                    <MessageFilters />
                    {/* <button
                        onClick={() => selectedIds.length > 0 && markAsRead(selectedIds)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
                        disabled={selectedIds.length === 0}
                    >
                        Mark Read
                    </button> */}
                    {/* <button
                        onClick={() => selectedIds.length > 0 && deleteMessages(selectedIds)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
                        disabled={selectedIds.length === 0}
                    >
                        Delete
                    </button> */}
                </div>
            </div>

            <Suspense fallback={<MessageListSkeleton n={6} />}>
                <ReceivedMessageList searchParams={searchParams} />
            </Suspense>
        </div>
    );
}