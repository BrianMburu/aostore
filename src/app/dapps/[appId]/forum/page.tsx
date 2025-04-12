import ForumQuestionForm from '@/app/ui/forum/ForumQuestionForm';
import { ForumFilters } from '@/app/ui/forum/ForumFilters';
import { ForumQuestionsList } from '@/app/ui/forum/ForumQuestionsList';
import { ForumPostsSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';
import { Suspense } from 'react';

export default function ForumPage() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* New Post Form */}
            <ForumQuestionForm />

            {/* Filters */}
            <ForumFilters />

            {/* Posts List */}
            <Suspense fallback={<ForumPostsSkeleton />}>
                <ForumQuestionsList />
            </Suspense>
        </div>

    );
}