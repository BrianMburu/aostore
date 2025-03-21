import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { ForumPost, ForumReply, updateOptions } from '@/types/forum';
import { Tip } from '@/types/tip';
import { DAPPIDS } from '@/utils/dataGenerators';
import { NextResponse } from 'next/server';
export interface FilterParams {
    topic?: string;
    search?: string;
    page?: string;
}

const generateDummyPosts = (): ForumPost[] => Array.from({ length: 50 }, (_, i) => ({
    postId: `post-${i}`,
    appId: DAPPIDS[i],
    title: `Discussion #${i + 1} about ${updateOptions[i % updateOptions.length].value}`,
    content: `Detailed discussion content for post ${i + 1}. `.repeat(10),
    topic: updateOptions[i % updateOptions.length].value,
    author: `user${i % 10}`,
    likes: Math.floor(Math.random() * 100),
    replies: Array.from({ length: Math.floor(Math.random() * 5) }, (_, j) => ({
        postId: `post-${i}`,
        replyId: `reply-${i}-${j}`,
        content: `Reply ${j + 1} to post ${i + 1}. `.repeat(3),
        author: `user${j % 10}`,
        likes: Math.floor(Math.random() * 50),
        createdAt: Date.now() - 86400000 * j
    })),
    createdAt: Date.now() - 86400000 * i,
    updatedAt: Date.now() - 86400000 * i
}));

export const dummyPosts = generateDummyPosts();

export const ForumService = {
    async fetchForumPosts(appId: string, params: FilterParams, useInfiniteScroll: boolean = false): Promise<{ posts: ForumPost[], total: number }> {
        await new Promise(resolve => setTimeout(resolve, 800));
        const dummyForumPosts = generateDummyPosts();

        // Filter the dummy Posts based on the parameters
        const filtered = dummyForumPosts.filter(dapp => {
            const matchesTopic = !params.topic || params.topic === 'all' || dapp.topic === params.topic;
            const matchesSearch = !params.search || dapp.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesTopic && matchesSearch;
        });

        // Pagination
        const page = Number(params.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort and slice the data for the current page
        const sortedData = filtered
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        const posts = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return {
            posts,
            total: filtered.length
        }
    },
    async fetchPost(appId: string, postId: string): Promise<ForumPost> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const post = dummyPosts.find(p => p.postId === postId);

        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    },

    async createForumPost(appId: string, userId: string, postData: Partial<ForumPost>): Promise<ForumPost> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const newPost = {
            ...postData,
            postId: `post-${Date.now()}`,
            author: userId,
            appId: appId,
            likes: 0,
            replies: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        } as ForumPost;

        dummyPosts.unshift(newPost);

        return newPost;
    },
    async editForumPost(postId: string, postData: Partial<ForumPost>): Promise<ForumPost> {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate update in dummy data
        const postIndex = dummyPosts.findIndex(p => p.postId === postId);

        dummyPosts[postIndex] = {
            ...dummyPosts[postIndex],
            ...postData
        };

        // Return the updated review array
        return dummyPosts[postIndex];
    },

    async submitReply(postId: string, userId: string, replyData: Partial<ForumReply>): Promise<ForumReply> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find the post by postId
        const post = dummyPosts.find((post: ForumPost) => post.postId === postId);

        if (!post) {
            throw new Error('post not found');
        }

        // Ensure replies array exists
        if (!post.replies) {
            post.replies = [];
        }
        const newReply = {
            ...replyData,
            postId: postId,
            author: userId,
            replyId: crypto.randomUUID(),
            createdAt: Date.now(),
            likes: 0,
        } as ForumReply;

        // Add the reply to the beginning of the replies array
        post.replies.unshift(newReply);

        // Return the updated replies array
        return newReply;
    },
    async editReply(replyId: string, replyData: Partial<ForumReply>): Promise<ForumReply> {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const postId = "post-5"
        // Find the post by postId
        const post = dummyPosts.find((post: ForumPost) => post.postId === postId);

        if (!post) {
            throw new Error('post not found');
        }

        // Ensure replies array exists
        if (!post.replies) {
            post.replies = [];
        }

        // Simulate update in dummy data
        const postIndex = post.replies.findIndex(p => p.replyId === replyId);

        post.replies[postIndex] = {
            ...post.replies[postIndex],
            ...replyData
        };

        return post.replies[postIndex];
    },

    async like(postId: string, replyId?: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulate update in dummy data
        const postIndex = dummyPosts.findIndex(p => p.postId === postId);
        if (postIndex === -1) {
            NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (replyId) {
            const replyIndex = dummyPosts[postIndex].replies.findIndex(r => r.replyId === replyId);
            if (replyIndex === -1) {
                return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
            }
            dummyPosts[postIndex].replies[replyIndex].likes++;
        } else {
            dummyPosts[postIndex].likes++;
        }

        return NextResponse.json({ success: true });
    },
    async dislike(postId: string, replyId?: string) {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Simulate update in dummy data
        const postIndex = dummyPosts.findIndex(p => p.postId === postId);
        if (postIndex === -1) {
            NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (replyId) {
            const replyIndex = dummyPosts[postIndex].replies.findIndex(r => r.replyId === replyId);
            if (replyIndex === -1) {
                return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
            }
            dummyPosts[postIndex].replies[replyIndex].likes--;
        } else {
            dummyPosts[postIndex].likes--;
        }

        return NextResponse.json({ success: true });
    },
    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },
}