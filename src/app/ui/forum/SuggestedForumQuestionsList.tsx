'use client'

import { useCallback, useEffect, useState } from "react";
import { ForumPostItemMini } from "./PostItemMini";
import { ForumPost } from "@/types/forum";
import { ForumService } from "@/services/ao/forumService";
import { ForumPostsSkeleton } from "./skeletons/ForumPostSkeleton";
import { EmptyState } from "../EmptyState";

export default function SuggestedForumQuestionsList({ appId, postData }: { appId: string, postData: ForumPost }) {
    const [suggestedPosts, setSuggestedPosts] = useState<ForumPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadSuggestedPosts = useCallback(
        async () => {
            try {
                if (postData) {
                    const { posts, } = await ForumService.fetchForumPosts(appId, { page: '1', topic: postData.topic })
                    setSuggestedPosts(posts);
                }
            } catch (error) {
                console.error(error);
                setSuggestedPosts([]);
            } finally {
                setIsLoading(false)
            }
        }, [appId, postData]);

    useEffect(() => {
        loadSuggestedPosts();
    }, [loadSuggestedPosts]);

    if (isLoading) {
        return (
            <ForumPostsSkeleton n={3} />
        )
    }
    if (!isLoading && suggestedPosts.length === 0) {
        return (
            <EmptyState
                title="No ForumPosts Found"
                description="We couldn't find any suggested ForumPosts from the this post."
                interactive
                className="my-8"
            />
        )
    }

    return (

        <div className="gap-6">
            {suggestedPosts.map(post => (
                <ForumPostItemMini key={post.devForumId} post={post} appId={appId} />
            ))}
        </div>
    )
}