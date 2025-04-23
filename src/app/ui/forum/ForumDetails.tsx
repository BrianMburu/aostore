// app/forum/[postId]/page.tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { ForumPost } from '@/types/forum';
import { ForumService } from '@/services/ao/forumService';
import ForumQuestion from '@/app/ui/forum/ForumQuestion';
import ForumAnswer from '@/app/ui/forum/ForumAnswer';
import { notFound, useSearchParams } from 'next/navigation';
import ForumPageSkeleton from './skeletons/ForumSkeleton';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import SuggestedForumQuestionsList from './SuggestedForumQuestionsList';

export default function ForumDetails() {
    // const appId = useParams().appId as string;
    // const postId = useParams().postId as string;
    const appId = useSearchParams().get('appId') as string || "";
    const postId = useSearchParams().get('postId') as string;


    const [post, setPost] = useState<ForumPost | null>(null);
    const [loading, setLoading] = useState(true);
    const { isConnected } = useAuth()

    const loadPost = useCallback(async () => {
        try {
            const postData = await ForumService.fetchPost(appId, postId);

            if (postData) {
                setPost(postData);
            }
        } catch (error) {
            console.error(error);
            setPost(null);
        }
        finally {
            setLoading(false)
        }
    }, [appId, postId,]);

    useEffect(() => {
        loadPost();
    }, [loadPost, isConnected]);

    if (loading) return <ForumPageSkeleton />;

    if (!post) {
        notFound()
    };

    const refreshForumPost = () => {
        loadPost();
    };

    return (
        <Suspense>
            <div className="mb-6">
                <Link
                    href={`/dapps/details/forum/?appId=${appId}`}
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Forums
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Post */}
                <ForumQuestion post={post} postId={postId} appId={appId} refreshPost={refreshForumPost} />

                {/* Replies */}
                <div className="space-y-6 mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Replies ({Object.values(post.replies).length})
                    </h2>
                    {Object.values(post.replies).map(reply => (
                        <ForumAnswer key={reply.replyId} reply={reply} appId={appId}
                            postId={postId} refreshPost={refreshForumPost} />
                    ))}
                </div>

                {/* Suggested Topics */}
                {
                    post &&
                    <div className="border-t pt-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            Suggested Topics
                        </h2>
                        <SuggestedForumQuestionsList appId={appId} postData={post} />
                    </div>
                }
            </div>
        </Suspense>
    );
}