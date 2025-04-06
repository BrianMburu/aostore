import ForumQuestionForm from '@/app/ui/forum/ForumQuestionForm';
import { ForumFilterParams } from '@/services/ao/forumService';
import { ForumFilters } from '@/app/ui/forum/ForumFilters';
import { ForumQuestionsList } from '@/app/ui/forum/ForumQuestionsList';
import { ForumPostsSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';
import { Suspense } from 'react';

interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<ForumFilterParams>;
}
export default async function ForumPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId
    const searchParams = await props.searchParams

    return (
        <div className="max-w-7xl mx-auto">
            {/* New Post Form */}
            <ForumQuestionForm appId={appId} />

            {/* Filters */}
            <ForumFilters />

            {/* Posts List */}
            <Suspense fallback={<ForumPostsSkeleton />}>
                <ForumQuestionsList appId={appId} searchParams={searchParams} />
            </Suspense>


        </div>

    );
}