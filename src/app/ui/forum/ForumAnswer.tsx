'use client'

import { ForumService } from '@/services/ao/forumService';
import { ForumPost, ForumReply } from "@/types/forum";
import { formatActivityTime } from "@/utils/forum";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { ForumEditAnswerForm } from '../MyDapps/Forum/ForumEditAnswerForm';
import { useAuth } from '@/context/AuthContext';

export default function ForumAnswer({ reply, setPost }: { reply: ForumReply, setPost: React.Dispatch<React.SetStateAction<ForumPost | null>> }) {
    const params = useParams();
    const postId = params.postId as string;
    const { user } = useAuth()

    const handleLike = async (replyId?: string) => {
        // Update local state first
        setPost(prev => {
            if (!prev) return prev;
            if (replyId) {
                return {
                    ...prev,
                    replies: prev.replies.map(r =>
                        r.replyId === replyId ? { ...r, likes: r.likes + 1 } : r
                    )
                };
            }
            return { ...prev, likes: prev.likes + 1 };
        });


        const response = replyId ? await ForumService.like(postId) : await ForumService.like(postId, replyId);
        const data = await response.json();

        if (data.success) {
            toast.success("Like Added Successfuly.")
        }
    };

    return (
        <div key={reply.replyId} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-medium text-gray-900 dark:text-white">{reply.author}</span>
                <div className='flex gap-2'>
                    {user && user.walletAddress == reply.author && <ForumEditAnswerForm reply={reply} />}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatActivityTime(reply.createdAt)}
                    </span>
                </div>

            </div>
            <p className="text-gray-600 dark:text-gray-300">{reply.content}</p>
            <div className="flex items-center gap-2 mt-4">
                <button
                    onClick={() => handleLike(reply.replyId)}
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>{reply.likes}</span>
                </button>
            </div>
        </div>

    )
}