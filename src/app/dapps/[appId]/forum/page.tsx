'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams, useSearchParams } from 'next/navigation'
import ForumQuestionForm from '@/app/ui/forum/ForumQuestionForm';
import { ForumService, FilterParams } from '@/services/ao/forumService';
import { ForumFilters } from '@/app/ui/forum/ForumFilters';
import { ForumQuestionsList } from '@/app/ui/forum/ForumQuestionsList';
import { ForumPost } from '@/types/forum';
import { ForumPostSkeleton } from '@/app/ui/forum/skeletons/ForumPostSkeleton';


export default function ForumPage() {
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [totalPosts, setTotalPosts] = useState(0)
    const params = useParams();
    const searchParams = useSearchParams();
    const [fetching, startTransition] = useTransition();

    const appId = params.appId as string;

    useEffect(() => {
        const filterParams: FilterParams = {
            search: searchParams.get('search') || "",
            topic: searchParams.get('topic') || "",
            page: searchParams.get('page') || "",
        }
        startTransition(
            async () => {

                const { posts: forumPosts, total } = await ForumService.fetchForumPosts(appId, filterParams, true)

                setTotalPosts(total)
                setForumPosts(forumPosts);
            });
    }, [appId, searchParams]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* New Post Form */}
            <ForumQuestionForm setPosts={setForumPosts} />

            {/* Filters */}
            <ForumFilters />

            {/* Posts List */}
            {fetching ?
                <ForumPostSkeleton /> :
                <ForumQuestionsList questions={forumPosts} totalItems={totalPosts} />
            }

        </div>

    );
}