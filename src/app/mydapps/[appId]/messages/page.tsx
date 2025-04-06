// app/mydapps/[appId]/messages/page.tsx
import { MessageFilters } from '@/app/ui/Messages/MessageFilter'
import MessagesForm from '@/app/ui/MyDapps/Messages/MessageForm'
import { MessagesList } from '@/app/ui/MyDapps/Messages/MessagesList'
import SentMessageListSkeleton from '@/app/ui/MyDapps/Messages/skeletons/SentMessageListSkeleton'
import { MessageFilterParams } from '@/services/ao/messageService'
import { Suspense } from 'react'
interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<MessageFilterParams>;
}
export default async function MessagesPage(props: Props) {
    const searchParams = await props.searchParams;
    return (
        <div className="space-y-8">
            {/* Message Form */}
            <MessagesForm />

            {/* Messages Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white mb-4 md:mb-0">Sent Messages</h2>
                <MessageFilters />
            </div>

            {/* Messages List */}
            <Suspense fallback={<SentMessageListSkeleton n={5} />}>
                <MessagesList searchParams={searchParams} />
            </Suspense>


        </div>
    )
}