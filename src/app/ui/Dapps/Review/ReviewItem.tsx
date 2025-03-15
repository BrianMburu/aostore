import Image from 'next/image'
import { StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Review } from "@/types/review"
import { ReplyItem } from './ReplyItem'
import { Reply } from '@/types/review'
import { TipForm } from '../TipButton'
import { DappReviewEditForm } from './DappReviewEditForm'
import { HelpfulButton } from '../HelpfulButton'
import toast from 'react-hot-toast'
import { useOptimistic, useTransition } from 'react'
import { ReviewService } from '@/services/ao/reviewService'
import { UserDetails } from '@othent/kms'

export default function ReviewItem({ review }: { review: Review }) {
    const [isPending, startTransition] = useTransition();
    const [optimisticState, setOptimisticState] = useOptimistic(
        review,
        (current, action: 'helpful' | 'unhelpful') => ({
            ...current,
            helpfulVotes: current.helpfulVotes + (action === 'helpful' ? 1 : 0),
            unhelpfulVotes: current.unhelpfulVotes + (action === 'unhelpful' ? 1 : 0),
        })
    )

    const handleVote = async (action: 'helpful' | 'unhelpful') => {
        startTransition(async () => {
            try {
                // Optimistically update the count
                setOptimisticState(action);

                let response;
                let data;
                if (action == 'helpful') {
                    response = await ReviewService.helpfulVote(review.reviewId);
                    data = await response.json();
                } else {
                    response = await ReviewService.unhelpfulVote(review.reviewId);
                    data = await response.json();
                }

                if (data.success) {
                    toast.success(`Review Marked as ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                } else {

                    // Revert the optimistic update if the operation failed
                    setOptimisticState(action === 'helpful' ? 'unhelpful' : 'helpful')
                    toast.error(`Failed to vote ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                }
            } catch (error) {
                // Revert the optimistic update in case of an error
                setOptimisticState(action === 'helpful' ? 'unhelpful' : 'helpful')
                toast.error(`An error occurred while voting ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                console.error('Voting failed:', error);

            }
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
            <div className="flex items-start gap-4 mb-4">
                <Image
                    src={review.profileUrl || 'https://picsum.photos/40'}
                    alt={review.username}
                    height={40}
                    width={40}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">{review.username}</h3>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.timestamp).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">{review.comment}</p>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>{review.replies?.length || 0}</span>
                </div>

                <TipForm recipientWallet={review.username} />

                <HelpfulButton helpfulVotes={optimisticState.helpfulVotes} isPending={isPending} handleVote={handleVote} />
            </div>

            {/* Replies */}
            {review.replies?.map((reply: Reply) => (
                <ReplyItem key={reply.replyId} reply={reply} />
            ))}
        </motion.div>
    )
}


export function UserReviewItem({ user, review }: { user: UserDetails, review: Review }) {
    const [isPending, startTransition] = useTransition();
    const [optimisticState, setOptimisticState] = useOptimistic(
        review,
        (current, action: 'helpful' | 'unhelpful') => ({
            ...current,
            helpfulVotes: current.helpfulVotes + (action === 'helpful' ? 1 : 0),
            unhelpfulVotes: current.unhelpfulVotes + (action === 'unhelpful' ? 1 : 0),
        })
    )

    const handleVote = async (action: 'helpful' | 'unhelpful') => {
        startTransition(async () => {
            try {
                // Optimistically update the count
                setOptimisticState(action);

                let response;
                let data;
                if (action == 'helpful') {
                    response = await ReviewService.helpfulVote(review.reviewId);
                    data = await response.json();
                } else {
                    response = await ReviewService.unhelpfulVote(review.reviewId);
                    data = await response.json();
                }

                if (data.success) {
                    toast.success(`Review Marked as ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                } else {

                    // Revert the optimistic update if the operation failed
                    setOptimisticState(action === 'helpful' ? 'unhelpful' : 'helpful')
                    toast.error(`Failed to vote ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                }
            } catch (error) {
                // Revert the optimistic update in case of an error
                setOptimisticState(action === 'helpful' ? 'unhelpful' : 'helpful')
                toast.error(`An error occurred while voting ${action == 'helpful' ? 'helpful' : 'unhelpful'}.`);
                console.error('Voting failed:', error);

            }
        });
    }

    return (
        <>
            {user?.walletAddress === user?.walletAddress &&
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <Image
                            src={review.profileUrl || 'https://picsum.photos/40'}
                            alt={review.username}
                            height={40}
                            width={40}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-900 dark:text-white">{review.username}</h3>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                        />
                                    ))}
                                </div>

                                <DappReviewEditForm review={review} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">{review.comment}</p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                            <span>{review.replies?.length || 0}</span>
                        </div>

                        <TipForm recipientWallet={review.username} />
                        <HelpfulButton helpfulVotes={optimisticState.helpfulVotes} isPending={isPending} handleVote={handleVote} />
                    </div>

                    {/* Replies */}
                    {review.replies?.map((reply: Reply) => (
                        <ReplyItem key={reply.replyId} reply={reply} />
                    ))}
                </motion.div>
            }
        </>
    )
}
