import { Suspense } from 'react';
import { TaskFilters } from '@/app/ui/Dapps/Tasks/TaskFilters';
import { MyTasksList } from '@/app/ui/MyDapps/Tasks/MyTaskList';
import { MyTaskListSkeleton } from '@/app/ui/MyDapps/Tasks/skeletons/MyTaskListSkeleton';
import { TaskFilterParams } from '@/services/ao/taskService';

interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<TaskFilterParams>;
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
            <Suspense fallback={<MyTaskListSkeleton />}>
                <MyTasksList appId={appId} searchParams={searchParams} />
            </Suspense>
        </div>

    );
}