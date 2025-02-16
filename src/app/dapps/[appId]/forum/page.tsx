'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation'
import ForumQuestionForm from '@/app/ui/forum/ForumQuestionForm';
import { ForumService, FilterParams } from '@/services/ao/forumService';
import { ForumFilters } from '@/app/ui/forum/ForumFilters';
import { ForumQuestionsList } from '@/app/ui/forum/ForumQuestionsList';
import { ForumPost } from '@/types/forum';


export default function ForumPage() {
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [totalPosts, setTotalPosts] = useState(0)
    const params = useParams();
    const searchParams = useSearchParams();

    const appId = params.appId as string;

    useEffect(() => {
        const loadData = async () => {
            const filterParams: FilterParams = {
                search: searchParams.get('search') || "",
                topic: searchParams.get('topic') || "",
                page: searchParams.get('page') || "",
            }
            const { posts: forumPosts, total } = await ForumService.fetchForumPosts(appId, filterParams, true)

            setTotalPosts(total)
            setForumPosts(forumPosts);
        };
        loadData();
    }, [appId, searchParams]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* New Post Form */}
            <ForumQuestionForm setPosts={setForumPosts} />

            {/* Filters */}
            <ForumFilters />

            {/* Posts List */}
            <ForumQuestionsList questions={forumPosts} totalItems={totalPosts} />
        </div>

    );
}