import { ForumFilterParams } from '@/services/ao/forumService';
import { ForumPostsSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';
import { Suspense } from 'react';
import { TasksList } from '@/app/ui/Dapps/Tasks/TasksList';
import { TaskFilters } from '@/app/ui/Dapps/Tasks/TaskFilters';

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
            {/* Filters */}
            <TaskFilters />

            {/* Posts List */}
            <Suspense fallback={<ForumPostsSkeleton />}>
                <TasksList appId={appId} searchParams={searchParams} />
            </Suspense>
        </div>

    );
}