import ForumDetails from '@/app/ui/forum/ForumDetails';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
interface Props {
    params: Promise<{ appId: string, postId: string }>;
}
export default async function ForumPostPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId as string;
    const postId = currParams.postId as string;

    return (
        <div>
            <div className="mb-8">
                <Link
                    href={`/dapps/${appId}/forum`}
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Forums
                </Link>
            </div>
            <ForumDetails appId={appId} postId={postId} />
        </div>

    );
}