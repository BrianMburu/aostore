'use client'

import React, { useState, useTransition, useEffect } from 'react'

import { ForumPost } from "@/types/forum"
import { DEFAULT_PAGE_SIZE } from "@/config/page"
import InfinityScrollControls from '../../InfinityScrollControls'
import Link from 'next/link'
import { AnimatedButton } from '../../animations/AnimatedButton'
import { ForumAnswerForm } from './ForumAnswerForm'
import { AnimatedList } from '../../animations/AnimatedList'
import { AnimatedListItem } from '../../animations/AnimatedListItem'
import { ForumService } from '@/services/ao/forumService'
import toast from 'react-hot-toast'
import { EmptyState } from '../../EmptyState'
import ForumCardsSkeleton from './skeletons/ForumCardsSkeleton'
import { useAuth } from '@/context/AuthContext'
import { HelpfulButton } from '../../Dapps/HelpfulButton'
import { Voters } from '@/types/voter'

// QuestionsList component
export function QuestionsList({ appId, searchParams }: { appId: string, searchParams: { topic?: string; search?: string } }) {
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (!isAuthLoading && isConnected) {
                        const { posts, total } = await ForumService.fetchForumPosts(appId, searchParams, true);

                        if (posts) {
                            setForumPosts(posts);
                            setTotalItems(total)
                        }
                    } else {
                        setForumPosts([]);
                        setTotalItems(0)
                    }
                } catch (error) {
                    setForumPosts([]);
                    setTotalItems(0);
                    console.error(error)
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, searchParams])

    if (isLoading) {
        return <ForumCardsSkeleton n={6} />
    }

    if (!isLoading && forumPosts.length === 0) {
        return (
            <EmptyState
                title="No ForumPosts Found"
                description="We couldn't find any ForumPosts from the results"
                interactive
                className="my-8"
            />
        )
    }
    return (
        <div className="space-y-6">
            <AnimatedList>
                <div className="space-y-6">
                    {forumPosts.map((question) => (
                        <AnimatedListItem key={question.devForumId}>
                            <QuestionItem question={question} appId={appId} />
                        </AnimatedListItem>
                    ))}
                </div>

            </AnimatedList>


            {forumPosts &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}

// QuestionItem component
export function QuestionItem({ appId, question }: { appId: string, question: ForumPost }) {
    const handleReplyClick = () => {
        setShowReplyForm(!showReplyForm);
    };
    const [isPending, startTransition] = useTransition();
    const [voters, setVoters] = useState<Voters>(question.voters);
    const [showReplyForm, setShowReplyForm] = useState(false);


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
                    ? await ForumService.helpfulVote(appId, question.devForumId)
                    : await ForumService.unhelpfulVote(appId, question.devForumId);

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
        <div className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <Link
                        href={`/dapps/${appId}/forum/${question.devForumId}`}
                        className="block hover:no-underline"
                    >
                        <h3 className="font-medium dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            {question.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{question.description}</p>

                    <div className='flex flex-col'>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-indigo-600 dark:text-indigo-400">
                                {question.topic}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {Object.values(question.replies).length} answers
                            </span>
                            <HelpfulButton
                                helpfulVotes={voters.foundHelpful.count}
                                isPending={isPending}
                                handleVote={handleVote}
                            />

                            {/* <LikeButton initialCount={question.likes} postId={question.postId} /> */}
                            <ReplyButton onClick={handleReplyClick} />
                        </div>
                        {showReplyForm && <ForumAnswerForm appId={appId} postId={question.devForumId} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ReplyButton({ onClick }: { onClick: () => void }) {
    return (
        <div className='flex flex-col'>
            <AnimatedButton
                onClick={onClick}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500"
            >
                Reply
            </AnimatedButton>
        </div>
    )
}