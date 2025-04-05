'use client'

import { useEffect, useState, useTransition } from 'react'
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import StarIcon from '@heroicons/react/24/outline/StarIcon';
import toast from 'react-hot-toast'


import { ReviewReplyForm } from './ReviewReplyForm'
import { Review } from '@/types/review'
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import InfinityScrollControls from '../../InfinityScrollControls'
import { AnimatedList } from '../../animations/AnimatedList'
import { AnimatedListItem } from '../../animations/AnimatedListItem'
import { AnimatedButton } from '../../animations/AnimatedButton'
import { ReviewFilterParams, ReviewService } from '@/services/ao/reviewService'
import { TipForm } from '../../Dapps/TipButton'
import { DetailedHelpfulButton } from '../DetailedHelpfulButton'
import { DappReplyEditForm } from './ReviewReplyEditForm'
import { useAuth } from '@/context/AuthContext'
import { Voters } from '@/types/voter'
import { User } from '@/types/user'
import { Reply } from '@/types/reply'
import ReviewListSkeleton from './skeletons/ReviewListSkeleton'
import { EmptyState } from '../../EmptyState'

// ReviewsList component
export function ReviewsList({ appId, searchParams }: { appId: string, searchParams: ReviewFilterParams; }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [fetching, startTransition] = useTransition();
  const { isConnected } = useAuth()

  useEffect(() => {
    startTransition(async () => {
      try {
        const { data, total } = await ReviewService.getReviews(appId, searchParams, true);
        if (data !== null) {
          setReviews(data);
          setTotal(total);
        }
      } catch (error) {
        console.error(error)
      }
    });
  }, [isConnected, appId, searchParams]);

  if (fetching) return <ReviewListSkeleton n={6} />;

  if (!fetching && reviews.length === 0) {
    return (
      <EmptyState
        title="No Reviews Found"
        description="We couldn't find any Reviews from the results."
        interactive
        className="my-12"
      />
    )
  }
  return (
    <div className="space-y-6">
      <AnimatedList>
        <div className='space-y-6'>
          {reviews.map((review) => (
            <AnimatedListItem key={review.reviewId}>
              <ReviewItem appId={appId} review={review} />

            </AnimatedListItem>
          ))}
        </div>
      </AnimatedList>


      {reviews &&
        <InfinityScrollControls
          totalPages={Math.ceil(total / DEFAULT_PAGE_SIZE)}
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
function RepliesList({ appId, reviewId, replies }:
  { appId: string, reviewId: string, replies: Reply[] }) {
  const { user } = useAuth();

  return (
    <div className="mt-4 pl-6 border-l-2 dark:border-gray-700 space-y-4">
      {replies.map((reply) => (
        <ReplyItem key={reply.replyId} reply={reply} user={user} appId={appId} reviewId={reviewId} />
      ))}
    </div>
  )
}

export function ReplyItem({ appId, reviewId, reply, user }:
  { appId: string, reviewId: string, reply: Reply, user: User | null }) {
  return (
    <div className="text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium dark:text-white">{reply.username}</span>
        <span className="text-gray-500 dark:text-gray-400 text-xs">
          {new Date(Number(reply.createdTime)).toLocaleDateString()}
        </span>
        {user && user.walletAddress == reply.user && <DappReplyEditForm reply={reply} appId={appId} reviewId={reviewId} />}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-1">{reply.description}</p>
    </div>
  );
}

export function ReviewItem({ appId, review }: { appId: string, review: Review }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

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
              {new Date(Number(review.createdTime)).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{review.description}</p>

          <div className='flex flex-col'>
            <div className="mt-4 flex items-center gap-4">
              <DetailedHelpfulButton
                helpfulVotes={voters.foundHelpful?.count || 0}
                unhelpfulVotes={voters.foundUnhelpful?.count || 0}
                isPending={isPending} handleVote={handleVote}
              />
              <TipForm recipientWallet={review.user} appId={appId} tipId={review.reviewId} />
              <ReplyButton onClick={handleReplyClick} />
            </div>
            {showReplyForm && <ReviewReplyForm reviewId={review.reviewId} appId={appId} />}
          </div>

          <RepliesList appId={appId} reviewId={review.reviewId} replies={Object.values(review.replies)} />
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