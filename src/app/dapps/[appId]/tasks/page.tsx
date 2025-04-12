import { ForumPostsSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';
import { Suspense } from 'react';
import { TasksList } from '@/app/ui/Dapps/Tasks/TasksList';
import { TaskFilters } from '@/app/ui/Dapps/Tasks/TaskFilters';

export default function ForumPage() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <TaskFilters />

            {/* Posts List */}
            <Suspense fallback={<ForumPostsSkeleton />}>
                <TasksList />
            </Suspense>
        </div>

    );
}