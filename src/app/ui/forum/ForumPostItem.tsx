'use client'

import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { ForumPost } from "@/types/forum";
import { formatActivityTime } from "@/utils/forum";
import { useState, useTransition } from "react";
import { Voters } from "@/types/voter";
import { HelpfulButton } from "../Dapps/HelpfulButton";
import { ForumService } from "@/services/ao/forumService";
import toast from "react-hot-toast";


export function ForumPostItem({ post, appId }: { post: ForumPost, appId: string }) {
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
                    ? await ForumService.helpfulVote(appId, post.devForumId)
                    : await ForumService.unhelpfulVote(appId, post.devForumId);

                if (data) {
                    toast.success(`Question marked as ${action}.`);
                } else {
                    // If the API call did not return data, revert the optimistic update
                    setVoters(previousVoters);
                    toast.error(`Failed to mark Question as ${action}.`);
                }
            } catch (error) {
                // On error, revert the optimistic update
                setVoters(previousVoters);
                toast.error(`An error occurred while marking as ${action}.`);
                console.error('Voting failed:', error);
            }
        });
    };
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm">
                    {post.topic}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatActivityTime(Number(post.createdTime))}
                </span>
            </div>

            <Link
                href={`/dapps/${appId}/forum/${post.devForumId}`}
                className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-600"
            >
                {post.title}
            </Link>

            <div className="flex items-center gap-4 mt-4 text-gray-500 dark:text-gray-400">
                <HelpfulButton
                    helpfulVotes={voters.foundHelpful.count}
                    isPending={isPending}
                    handleVote={handleVote}
                />
                {/* <div className="flex items-center gap-1">
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>{post.likes}</span>
                </div> */}
                <div className="flex items-center gap-1">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>{Object.values(post.replies).length}</span>
                </div>
            </div>
        </div>

    )
}