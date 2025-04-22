// app/mydapps/[appId]/messages/page.tsx
import { MessageFilters } from '@/app/ui/Messages/MessageFilter'
import MessagesForm from '@/app/ui/MyDapps/Messages/MessageForm'
import { MessagesList } from '@/app/ui/MyDapps/Messages/MessagesList'
import SentMessageListSkeleton from '@/app/ui/MyDapps/Messages/skeletons/SentMessageListSkeleton'
import { Suspense } from 'react'
// import { fetchAllPages } from '@/helpers/idsPaginator';
// import { DAppService } from '@/services/ao/dappService';

// export async function generateStaticParams() {
//     try {
//         const appIds = await fetchAllPages((page) => DAppService.getAllDappIds(page));
//         return appIds;
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [{ appId: "TX1" }];
//     }
// }

export default function MessagesPage() {
    return (
        <div className="space-y-8">
            {/* Message Form */}
            <Suspense>
                <MessagesForm />
            </Suspense>

            {/* Messages Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white mb-4 md:mb-0">Sent Messages</h2>
                <Suspense>
                    <MessageFilters />
                </Suspense>
            </div>

            {/* Messages List */}
            <Suspense fallback={<SentMessageListSkeleton n={5} />}>
                <MessagesList />
            </Suspense>
        </div>
    )
}