'use client'

import React, { useState, useTransition, useOptimistic } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

import { ForumPost } from "@/types/forum"
import { DEFAULT_PAGE_SIZE } from "@/config/page"
import InfinityScrollControls from '../../InfinityScrollControls'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AnimatedButton } from '../../animations/AnimatedButton'
import { ForumAnswerForm } from './ForumAnswerForm'
import { AnimatedList } from '../../animations/AnimatedList'
import { AnimatedListItem } from '../../animations/AnimatedListItem'
import { ForumService } from '@/services/ao/forumService'
import toast from 'react-hot-toast'

// QuestionsList component
export function QuestionsList({ questions, totalItems }: { questions: ForumPost[], totalItems: number }) {

    return (
        <div className="space-y-6">
            <AnimatedList>
                <div className="space-y-6">
                    {questions.map((question) => (
                        <AnimatedListItem key={question.postId}>
                            <QuestionItem question={question} />
                        </AnimatedListItem>
                    ))}
                </div>

            </AnimatedList>


            {questions &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}

// QuestionItem component
export function QuestionItem({ question }: { question: ForumPost }) {
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleReplyClick = () => {
        setShowReplyForm(!showReplyForm);
    };
    const params = useParams()
    const appId = params.appId as string;

    return (
        <div className="border rounded-lg p-4 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <Link
                        href={`/dapps/${appId}/forum/${question.postId}`}
                        className="block hover:no-underline"
                    >
                        <h3 className="font-medium dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            {question.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{question.content}</p>

                    <div className='flex flex-col'>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-indigo-600 dark:text-indigo-400">
                                {question.topic}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {question.replies.length} answers
                            </span>

                            <LikeButton initialCount={question.likes} postId={question.postId} />
                            <ReplyButton onClick={handleReplyClick} />
                        </div>
                        {showReplyForm && <ForumAnswerForm postId={question.postId} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function LikeButton({ initialCount, postId, }: {
    initialCount: number; postId: string;
}) {
    const [isPending, startTransition] = useTransition();

    // Use useOptimistic
    const [optimisticLikes, addOptimisticLike] = useOptimistic(
        initialCount,
        (state: number, action: number) => state + action
    );

    const handleLike = () => {
        // Start the transition for the async operation
        startTransition(async () => {
            try {
                // Optimistically update the count
                addOptimisticLike(1);
                const response = await ForumService.like(postId);
                const data = await response.json();

                if (data.success) {
                    toast.success('Like added successfully.');
                } else {
                    // Revert the optimistic update if the operation failed
                    addOptimisticLike(-1);
                    toast.error('Failed to add like.');
                }
            } catch (error) {
                // Revert the optimistic update in case of an error
                addOptimisticLike(-1);
                console.error('Like failed:', error);
                toast.error('An error occurred while liking the post.');
            }
        });
    };

    return (
        <AnimatedButton
            onClick={handleLike}
            disabled={isPending}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500"
            aria-label="Like post"
        >
            {optimisticLikes > initialCount ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
                <HeartIcon className="w-5 h-5" />
            )}
            <span>{optimisticLikes}</span>
        </AnimatedButton>
    );
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