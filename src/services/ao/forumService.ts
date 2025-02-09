import { dummyPosts } from '@/types/forum';
import { NextResponse } from 'next/server';

export async function fetchPosts(appId: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    // const posts = dummyPosts.filter(p => p.appId === appId);

    return NextResponse.json({
        posts: dummyPosts,
        total: dummyPosts.length
    });
}

export async function fetchPost(appId: string, postId: string) {
    const post = dummyPosts.find(p => p.postId === postId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return post
        ? NextResponse.json(post)
        : NextResponse.json({ error: 'Post not found' }, { status: 404 });
}


export async function like(postId: string, replyId?: string) {
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

    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json({ success: true });
};