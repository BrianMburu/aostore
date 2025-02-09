// app/forum/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import { dummyPosts, updateOptions, ForumPost } from '@/types/forum';
import ForumQuestionForm from '@/app/ui/forum/ForumQuestionForm';
import { ForumPostItem } from '@/app/ui/forum/ForumPostItem';


export default function ForumPage() {
    const { appId } = useParams()
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        topic: '',
        sort: 'latest'
    });

    const loadPosts = async (newPage = 1) => {
        const filtered = dummyPosts
            .filter(p =>
                p.title.toLowerCase().includes(filters.search.toLowerCase()) &&
                (filters.topic ? p.topic === filters.topic : true)
            )
            .sort((a, b) =>
                filters.sort === 'latest' ? b.createdAt - a.createdAt : b.likes - a.likes
            );

        const paginated = filtered.slice(0, newPage * 10);
        setPosts(paginated);
        setHasMore(paginated.length < filtered.length);
    };

    useEffect(() => {
        loadPosts(page);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, page]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* New Post Form */}
            <ForumQuestionForm setPosts={setPosts} />

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <input
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={filters.search}
                        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />
                </div>

                <select
                    className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={filters.topic}
                    onChange={e => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                >
                    <option value="">All Topics</option>
                    {updateOptions.map(opt => (
                        <option key={opt.key} value={opt.value}>
                            {opt.value}
                        </option>
                    ))}
                </select>

                <select
                    className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={filters.sort}
                    onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                >
                    <option value="latest">Latest</option>
                    <option value="top">Top Posts</option>
                </select>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
                {posts.map(post => (
                    <ForumPostItem key={post.postId} post={post} appId={appId as string} />
                ))}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:text-gray-500"
                    >
                        Load More Posts
                    </button>
                </div>
            )}
        </div>

    );
}