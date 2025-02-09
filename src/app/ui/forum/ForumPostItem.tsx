import { ChatBubbleLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { ForumPost } from "@/types/forum";
import { formatActivityTime } from "@/utils/forum";


export function ForumPostItem({ post, appId }: { post: ForumPost, appId: string }) {
    return (
        <div key={post.postId} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm">
                    {post.topic}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatActivityTime(post.createdAt)}
                </span>
            </div>

            <Link
                href={`/dapps/${appId}/forum/${post.postId}`}
                className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-600"
            >
                {post.title}
            </Link>

            <div className="flex items-center gap-4 mt-4 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>{post.replies.length}</span>
                </div>
            </div>
        </div>

    )
}