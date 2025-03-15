
import { ForumFilters } from "@/app/ui/MyDapps/Forum/ForumFilters";
import { QuestionsList } from "@/app/ui/MyDapps/Forum/QuestionsList"
import { ForumService } from "@/services/ao/forumService";

interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<{ topic?: string; search?: string }>;
}
export default async function ForumPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId
    const searchParams = await props.searchParams
    const { posts, total } = await ForumService.fetchForumPosts(appId, searchParams, true);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white mb-4 md:mb-0">Forum Questions</h2>
                <ForumFilters />
            </div>

            <QuestionsList questions={posts} totalItems={total} />
        </div>
    )
}