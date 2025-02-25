// app/forum/[postId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ForumPost } from '@/types/forum';
import { ForumService } from '@/services/ao/forumService';
import { ForumPostItemMini } from '@/app/ui/forum/PostItemMini';
import ForumQuestion from '@/app/ui/forum/ForumQuestion';
import ForumAnswer from '@/app/ui/forum/ForumAnswer';
import { ForumPostSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';
import { notFound } from 'next/navigation';

export default function ForumPostPage() {
    const params = useParams();
    const postId = params.postId as string;
    const appId = params.appId as string;

    const [post, setPost] = useState<ForumPost | null>(null);
    const [suggestedPosts, setSuggestedPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const postData = await ForumService.fetchPost(appId, postId);
                setPost(postData || null);

                if (postData) {
                    const { posts, } = await ForumService.fetchForumPosts(appId, { page: '1', topic: postData.topic })
                    setSuggestedPosts(posts);
                }
            } finally {
                setLoading(false)
            }
        };

        loadPost();
    }, [postId]);

    if (loading) return <ForumPostSkeleton />;

    if (!post) {
        notFound()
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Post */}
            <ForumQuestion post={post} setPost={setPost} />

            {/* Replies */}
            <div className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Replies ({post.replies.length})
                </h2>
                {post.replies.map(reply => (
                    <ForumAnswer key={reply.replyId} reply={reply} setPost={setPost} />
                ))}
            </div>

            {/* Suggested Topics */}
            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Suggested Topics
                </h2>
                <div className="grid gap-6">
                    {suggestedPosts.map(post => (
                        <ForumPostItemMini key={post.postId} post={post} appId={appId} />
                    ))}
                </div>
            </div>
        </div>

    );
}