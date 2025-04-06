'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { ForumPostItem } from "./ForumPostItem";
import { ForumPost } from "@/types/forum";
import InfinityScrollControls from "../InfinityScrollControls";
import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { ForumFilterParams, ForumService } from "@/services/ao/forumService";
import { EmptyState } from "../EmptyState";
import { ForumPostsSkeleton } from "./skeletons/ForumPostSkeleton";


// QuestionsList component
export function ForumQuestionsList({ appId, searchParams }: { appId: string, searchParams: ForumFilterParams }) {
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (!isAuthLoading && isConnected) {
                        const { posts, total } = await ForumService.fetchForumPosts(appId, searchParams, true);

                        if (posts) {
                            setForumPosts(posts);
                            setTotalItems(total)
                        }
                    } else {
                        setForumPosts([]);
                        setTotalItems(0)
                    }
                } catch (error) {
                    setForumPosts([]);
                    setTotalItems(0);
                    console.error(error)
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, searchParams])

    if (isLoading) {
        return <ForumPostsSkeleton n={6} />
    }

    if (!isLoading && forumPosts.length === 0) {
        return (
            <EmptyState
                title="No ForumPosts Found"
                description="We couldn't find any ForumPosts from the results"
                interactive
                className="my-8"
            />
        )
    }

    return (
        <div className="space-y-6">
            {forumPosts.map(post => (
                <ForumPostItem key={post.devForumId} post={post} appId={appId as string} />
            ))}

            {forumPosts &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}