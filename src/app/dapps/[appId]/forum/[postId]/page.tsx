import ForumDetails from '@/app/ui/forum/ForumDetails';
import { fetchAllPages } from '@/helpers/idsPaginator';
import { DAppService } from '@/services/ao/dappService';
import { ForumService } from '@/services/ao/forumService';
// Usage in generateStaticParams
export async function generateStaticParams() {
    try {
        const [appIds, postIds] = await Promise.all([
            fetchAllPages((page) => DAppService.getAllDappIds(page)),
            fetchAllPages((page) => ForumService.getAllForumIds(page)),
        ]);

        return appIds.flatMap((appId) =>
            postIds.map((postId) => ({ ...appId, ...postId }))
        );
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

export default async function ForumPostPage() {
    return (
        <div>
            <ForumDetails />
        </div>

    );
}