'use client'

import { ForumPost } from "@/types/forum";
import { formatActivityTime } from "@/utils/forum";
import { ShareIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import { ForumService } from '@/services/ao/forumService';
import { TipForm } from "../Dapps/TipButton";
import { ForumEditQuestionForm } from "./ForumQuestionEditForm";
import { useAuth } from "@/context/AuthContext";
import { useState, useTransition } from "react";
import { Voters } from "@/types/voter";
import { DetailedHelpfulButton } from "../MyDapps/DetailedHelpfulButton";
import { TipHistoryDialog } from "../Dapps/TipHistoryButton";

export default function ForumQuestion({ post, appId, postId, refreshPost }: { post: ForumPost, postId: string, appId: string, refreshPost: () => void }) {
    const { user } = useAuth()

    const [isPending, startTransition] = useTransition();
    const [voters, setVoters] = useState<Voters>(post.voters);

    const handleVote = async (action: 'helpful' | 'unhelpful') => {
        // Store previous state for potential rollback
        const previousVoters = { ...voters };

        // Optimistically update the count in a shallow way (keeping the existing structure)
        setVoters({
            ...voters,
            foundHelpful: {
                ...voters.foundHelpful,
                count: voters.foundHelpful.count + (action === 'helpful' ? 1 : 0)
            },
            foundUnhelpful: {
                ...voters.foundUnhelpful,
                count: voters.foundUnhelpful.count + (action === 'unhelpful' ? 1 : 0)
            }
        });

        startTransition(async () => {
            try {
                const data = action === 'helpful'
                    ? await ForumService.helpfulVote(appId, postId)
                    : await ForumService.unhelpfulVote(appId, postId);

                if (data) {
                    toast.success(`Request marked as ${action}.`);
                } else {
                    // If the API call did not return data, revert the optimistic update
                    setVoters(previousVoters);
                    toast.error(`Failed to mark as ${action}.`);
                }
            } catch (error) {
                // On error, revert the optimistic update
                setVoters(previousVoters);
                toast.error(`An error occurred while marking as ${action}.`);
                console.error('Voting failed:', error);
            }
        });
    };

    const sharePost = async () => {
        const url = `/dapps/${appId}/forum/${post.devForumId}`;
        await navigator.clipboard.writeText(`${post.title}: ${window.location.origin + url}`);
        toast.success('Link copied to clipboard!');
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8">
            <div className="flex flex-row items-center justify-between gap-2 mb-4">
                <div className="flex items-start flex-col sm:flex-row sm:items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm">
                        {post.topic}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Posted by {post.username} • {formatActivityTime(Number(post.createdTime))}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {user && user.walletAddress === post.user && <ForumEditQuestionForm appId={appId} post={post} onEdit={refreshPost} />}
                    <TipHistoryDialog appId={appId} userId={post.user} taskId={post.devForumId} />
                </div>

            </div>

            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{post.description}</p>

            <div className="flex items-center flex-wrap gap-4 mt-6">
                <DetailedHelpfulButton
                    helpfulVotes={voters.foundHelpful?.count || 0}
                    unhelpfulVotes={voters.foundUnhelpful?.count || 0}
                    isPending={isPending} handleVote={handleVote}
                />
                <button
                    onClick={sharePost}
                    className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    <ShareIcon className="h-5 w-5" />
                </button>
                <TipForm recipientWallet={post.user} appId={appId} tipId={post.devForumId} />
            </div>
        </div>
    )
}