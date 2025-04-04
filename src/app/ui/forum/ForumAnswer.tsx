'use client'

import { formatActivityTime } from "@/utils/forum";
import { ForumEditAnswerForm } from '../MyDapps/Forum/ForumEditAnswerForm';
import { useAuth } from '@/context/AuthContext';
import { Reply } from '@/types/reply';
import ProfileImage from "../ProfilePic";

export default function ForumAnswer({ reply, postId, appId, refreshPost }:
    { appId: string, postId: string, reply: Reply, refreshPost: () => void }) {
    const { user } = useAuth();

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">

            <div className="w-full">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-4">
                        <ProfileImage
                            imgUrl={reply.profileUrl}
                            alt={reply.username}
                            className='h-8 w-8' />
                        <span className="font-medium text-gray-900 dark:text-white">{reply.username}</span>
                    </div>
                    <div className='flex gap-2'>
                        {user && user.walletAddress == reply.user &&
                            <ForumEditAnswerForm reply={reply} appId={appId} postId={postId} refreshPost={refreshPost} />}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatActivityTime(reply.createdTime)}
                        </span>
                    </div>

                </div>
                <p className="text-gray-600 dark:text-gray-300">{reply.description}</p>
            </div>

        </div>

    )
}