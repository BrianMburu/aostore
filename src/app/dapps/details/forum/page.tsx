import ForumQuestionForm from '@/app/ui/forum/ForumQuestionForm';
import { ForumFilters } from '@/app/ui/forum/ForumFilters';
import { ForumQuestionsList } from '@/app/ui/forum/ForumQuestionsList';
import { ForumPostsSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';
import { Suspense } from 'react';
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

export default function ForumPage() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* New Post Form */}
            <Suspense >
                <ForumQuestionForm />
            </Suspense>
            {/* Filters */}
            <Suspense >
                <ForumFilters />
            </Suspense>
            {/* Posts List */}
            <Suspense fallback={<ForumPostsSkeleton />}>
                <ForumQuestionsList />
            </Suspense>
        </div>
    );
}