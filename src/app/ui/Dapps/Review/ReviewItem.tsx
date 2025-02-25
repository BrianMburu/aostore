'use client'

import Image from 'next/image'
import { StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Review } from "@/types/review"
import { ReplyItem } from './ReplyItem'
import { Reply } from '@/types/review'

export default function ReviewItem({ review }: { review: Review }) {
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
                {/* <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                    <HandThumbUpIcon className="h-5 w-5" />
                    <span>{review.upvotes}</span>
                </button> */}
                <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>{review.replies?.length || 0}</span>
                </button>
            </div>

            {/* Replies */}
            {review.replies?.map((reply: Reply) => (
                <ReplyItem key={reply.replyId} reply={reply} />
            ))}
        </motion.div>
    )
}

