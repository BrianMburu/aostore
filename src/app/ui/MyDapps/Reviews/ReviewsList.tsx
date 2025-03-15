'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import StarIcon from '@heroicons/react/24/outline/StarIcon';


import { ReviewReplyForm } from './ReviewReplyForm'
import { Review, Reply } from '@/types/review'
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import InfinityScrollControls from '../../InfinityScrollControls'
import { AnimatedList } from '../../animations/AnimatedList'
import { AnimatedListItem } from '../../animations/AnimatedListItem'
import { AnimatedButton } from '../../animations/AnimatedButton'
import { ReviewService } from '@/services/ao/reviewService'
import toast from 'react-hot-toast'
import { TipForm } from '../../Dapps/TipButton'
import { DetailedHelpfulButton } from '../DetailedHelpfulButton'
import { DappReplyEditForm } from './ReviewReplyEditForm'
import { useAuth } from '@/context/AuthContext'
import { UserDetails } from '@othent/kms'

// ReviewsList component
export function ReviewsList({ reviews, totalItems }: { reviews: Review[]; totalItems: number }) {
  return (
    <div className="space-y-6">
      <AnimatedList>
        <div className='space-y-6'>
          {reviews.map((review) => (
            <AnimatedListItem key={review.reviewId}>
              <ReviewItem review={review} />

            </AnimatedListItem>
          ))}
        </div>
      </AnimatedList>


      {reviews &&
        <InfinityScrollControls
          totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
        />}
    </div>
  )
}


// StarRating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        />
      ))}
    </div>
  )
}

// RepliesList component
function RepliesList({ replies }: { replies: Reply[] }) {
  const { user } = useAuth()
  return (
    <div className="mt-4 pl-6 border-l-2 dark:border-gray-700 space-y-4">
      {replies.map((reply) => (
        <ReplyItem key={reply.replyId} reply={reply} user={user} />
      ))}
    </div>
  )
}

export function ReplyItem({ reply, user }: { reply: Reply, user: UserDetails | null }) {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium dark:text-white">{reply.username}</span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          {new Date(reply.timestamp).toLocaleDateString()}
        </span>
        {user && user.walletAddress == reply.user && <DappReplyEditForm reply={reply} />}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{reply.comment}</p>
    </div>
  );
}

export function ReviewItem({ review }: { review: Review }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useOptimistic(
    review,
    (current, action: 'helpful' | 'unhelpful') => ({
      ...current,
      helpfulVotes: current.helpfulVotes + (action === 'helpful' ? 1 : -1),
      unhelpfulVotes: current.unhelpfulVotes + (action === 'unhelpful' ? 1 : -1),
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

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
  };

  return (
    <div className="border rounded-lg p-4 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-medium dark:text-white">{review.username}</span>
            <StarRating rating={review.rating} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>

          <div className='flex flex-col'>
            <div className="mt-4 flex items-center gap-4">
              <DetailedHelpfulButton helpfulVotes={optimisticState.helpfulVotes}
                unhelpfulVotes={optimisticState.unhelpfulVotes}
                isPending={isPending} handleVote={handleVote}
              />
              <TipForm recipientWallet={review.userId} />
              <ReplyButton onClick={handleReplyClick} />
            </div>
            {showReplyForm && <ReviewReplyForm reviewId={review.reviewId} />}
          </div>

          <RepliesList replies={review.replies} />
        </div>
      </div>
    </div>
  );
}


export function LikeButton({ initialCount }: { initialCount: number }) {
  const [optimisticLikes, execute] = useOptimisticMutation(
    initialCount,
    (current, increment: number) => current + increment
  )

  const handleLike = async () => {
    try {
      await execute(
        fetch('/api/like', { method: 'POST' }),
        1 // Optimistic increment
      )
    } catch (error) {
      console.error('Like failed:', error)
    }
  }

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500"
    >
      {optimisticLikes > initialCount ? (
        <HeartSolidIcon className="w-5 h-5 text-red-500" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
      <span>{optimisticLikes}</span>
    </button>
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