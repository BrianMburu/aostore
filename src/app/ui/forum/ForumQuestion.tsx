'use client'

import { ForumPost } from "@/types/forum";
import { formatActivityTime } from "@/utils/forum";
import { useParams } from 'next/navigation';
import { ShareIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import { ForumService } from '@/services/ao/forumService';
import { TipForm } from "../Dapps/TipButton";
import { ForumEditQuestionForm } from "./ForumQuestionEditForm";
import { useAuth } from "@/context/AuthContext";

export default function ForumQuestion({ post, setPost }: { post: ForumPost, setPost: React.Dispatch<React.SetStateAction<ForumPost | null>> }) {
    const params = useParams();
    const postId = params.postId as string;
    const appId = params.appId as string;
    const { user } = useAuth()

    const handleLike = async () => {
        // Update local state first
        setPost(prev => {
            if (!prev) return prev;
            return { ...prev, likes: prev.likes + 1 };
        });

        // Simulate update in dummy data
        const response = await ForumService.like(postId)
        const data = await response.json();

        if (data.success) {
            toast.success("Like Added Successfuly.")
        }

    };

    const sharePost = async () => {
        const url = `/dapps/${appId}/forum/${post.postId}`;
        await navigator.clipboard.writeText(`${post.title}: ${window.location.origin + url}`);
        toast.success('Link copied to clipboard!');
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm">
                        {post.topic}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Posted by {post.author} • {formatActivityTime(post.createdAt)}
                    </span>
                </div>

                {user && user.walletAddress === post.author && <ForumEditQuestionForm post={post} />}

            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={() => handleLike()}
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>{post.likes}</span>
                </button>
                <button
                    onClick={sharePost}
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    <ShareIcon className="h-5 w-5" />
                </button>
                <TipForm recipientWallet={post.author} />
            </div>
        </div>

    )
}