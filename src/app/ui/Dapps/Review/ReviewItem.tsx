import { StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Review } from "@/types/review"
import { ReplyItem } from './ReplyItem'
import { TipForm } from '../TipButton'
import { DappReviewEditForm } from './DappReviewEditForm'
import { HelpfulButton } from '../HelpfulButton'
import toast from 'react-hot-toast'
import { useState, useTransition } from 'react'
import { ReviewService } from '@/services/ao/reviewService'
import { useAuth } from '@/context/AuthContext'
import { Voters } from '@/types/voter'
import { Reply } from '@/types/reply'
import ProfileImage from '../../ProfilePic'
import { TipHistoryDialog } from '../TipHistoryButton'

export function ReviewItem({ appId, review }: { appId: string, review: Review }) {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [voters, setVoters] = useState<Voters>(review.voters);

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
                    ? await ReviewService.helpfulVote(appId, review.reviewId)
                    : await ReviewService.unhelpfulVote(appId, review.reviewId);

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

    return (
        <>
            {user?.walletAddress === user?.walletAddress &&
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                >
                    <div className="flex justify-between mb-4">
                        <div className="flex items-start gap-4">
                            <ProfileImage
                                imgUrl={review.profileUrl}
                                alt={review.username}
                                className='h-10 w-10' />

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
                                    {new Date(Number(review.createdTime)).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            {user?.walletAddress === review.user && (
                                <DappReviewEditForm review={review} appId={appId} />
                            )}
                            <TipHistoryDialog appId={appId} userId={review.user} taskId={review.reviewId} />
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">{review.description}</p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                            <ChatBubbleLeftIcon className="h-5 w-5" />
                            <span>{Object.values(review.replies)?.length || 0}</span>
                        </div>

                        <TipForm recipientWallet={review.username} appId={appId} tipId={review.reviewId} />
                        <HelpfulButton
                            helpfulVotes={voters.foundHelpful?.count || 0}
                            isPending={isPending} handleVote={handleVote} />
                    </div>

                    {/* Replies */}
                    {Object.values(review.replies)?.map((reply: Reply) => (
                        <ReplyItem key={reply.replyId} reply={reply} />
                    ))}
                </motion.div>
            }
        </>
    )
}
