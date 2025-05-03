'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { ForumPostItem } from "./ForumPostItem";
import { ForumPost } from "@/types/forum";
import InfinityScrollControls from "../InfinityScrollControls";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { ForumFilterParams, ForumService } from "@/services/ao/forumService";
import { EmptyState } from "../EmptyState";
import { ForumPostsSkeleton } from "./skeletons/ForumPostSkeleton";
import { useSearchParams } from "next/navigation";


// QuestionsList component
export function ForumQuestionsList() {
    // const appId = useParams().appId as string;
    const searchParams = useSearchParams();
    const appId = searchParams.get('appId') as string || "";


    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    const filterParams = Object.fromEntries(searchParams.entries()) as ForumFilterParams;

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (!isAuthLoading && isConnected) {
                        const { posts, total } = await ForumService.fetchForumPosts(appId, filterParams, true);

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
    }, [appId, isAuthLoading, isConnected, filterParams.page, filterParams.topic, filterParams.search, filterParams.sort])

    if (isLoading) {
        return <ForumPostsSkeleton n={6} />
    }

    if (!isLoading && forumPosts.length === 0) {
        return (
            <EmptyState
                title="No ForumPosts Found"
                description={!isConnected ? "Connect wallet to view Forum Posts!" :
                    "We couldn't find any Forum Posts from the results!"}
                interactive
                className="my-8"
            />
        )
    }

    return (
        <div className="space-y-6">
            {forumPosts.map(post => (
                <ForumPostItem key={post.devForumId} post={post} appId={appId as string}
                    isConnected={isConnected} />
            ))}

            {forumPosts &&
                <Suspense>
                    <InfinityScrollControls
                        totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                    />
                </Suspense>
            }
        </div>
    )
}