// app/forum/[postId]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ForumPost } from '@/types/forum';
import { ForumService } from '@/services/ao/forumService';
import { ForumPostItemMini } from '@/app/ui/forum/PostItemMini';
import ForumQuestion from '@/app/ui/forum/ForumQuestion';
import ForumAnswer from '@/app/ui/forum/ForumAnswer';
import { notFound } from 'next/navigation';
import ForumPageSkeleton from './skeletons/ForumSkeleton';
import { useAuth } from '@/context/AuthContext';

export default function ForumDetails({ appId, postId }: { appId: string, postId: string }) {
    const [post, setPost] = useState<ForumPost | null>(null);
    const [suggestedPosts, setSuggestedPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const { isConnected } = useAuth()

    const loadPost = useCallback(async () => {
        try {
            const postData = await ForumService.fetchPost(appId, postId);

            if (postData) {
                setPost(postData);

                const { posts, } = await ForumService.fetchForumPosts(appId, { page: '1', topic: postData.topic })
                setSuggestedPosts(posts);
            }
        } finally {
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
            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Suggested Topics
                </h2>
                <div className="grid gap-6">
                    {suggestedPosts.map(post => (
                        <ForumPostItemMini key={post.devForumId} post={post} appId={appId} />
                    ))}
                </div>
            </div>
        </div>
    );
}