import { ChatBubbleLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { ForumPost } from "@/types/forum";
import { formatActivityTime } from "@/utils/forum";

export function ForumPostItemMini({ post, appId }: { post: ForumPost, appId: string }) {
    return (
        <div key={post.devForumId} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <Link
                    href={`/dapps/${appId}/forum/${post.devForumId}`}
                    className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-600"
                >
                    {post.title}
                </Link>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatActivityTime(post.createdTime)}
                </span>
            </div>

            <div className="flex items-center gap-4 mt-4 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>{post.voters.foundHelpful?.count}</span>
                </div>
                <div className="flex items-center gap-1">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>{Object.values(post.replies).length}</span>
                </div>
            </div>
        </div>

    )
}