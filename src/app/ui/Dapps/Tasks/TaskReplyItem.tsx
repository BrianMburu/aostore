'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { formatActivityTime } from '@/utils/forum'
import { TaskReply } from '@/types/task'
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline"

export function TaskReplyItem({ reply }: { reply: TaskReply }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-4 border-l-4 border-indigo-500"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Image
                        src={reply.profileUrl}
                        alt={reply.username}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{reply.username}</h4>
                        <span className="text-sm text-indigo-600 dark:text-indigo-400">{reply.rank}</span>
                    </div>
                </div>

                <div className={`flex items-center gap-1 ${reply.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {reply.status === 'completed' ? (
                        <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                        <ClockIcon className="h-5 w-5" />
                    )}
                    <span className="text-sm capitalize">{reply.status}</span>
                </div>
            </div>

            <div className="mb-4 text-gray-600 dark:text-gray-300">{reply.url}</div>

            {reply.completedTasks && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <div className='dark:text-gray-300'>
                            <span className="font-medium">Completed:</span>
                            <span className="ml-2">{reply.completedTasks.amount} to be rewarded</span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                            {formatActivityTime(reply.completedTasks.completedTime)}
                        </div>
                    </div>
                    {reply.completedTasks.proof && (
                        <a
                            href={reply.completedTasks.proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2 inline-block"
                        >
                            View Proof
                        </a>
                    )}
                </div>
            )}
        </motion.div>
    )
}
