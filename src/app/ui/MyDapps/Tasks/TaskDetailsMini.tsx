'use client'

import { motion } from 'framer-motion'
import { formatActivityTime } from '@/utils/forum'
import { Task } from '@/types/task'
import { ClockIcon, CheckBadgeIcon } from "@heroicons/react/24/outline"
import { Progress } from '../../Dapps/Tasks/TaskProgress'


export function TaskDetailsMini({ task }: { task: Task }) {
    const progress = (task.completedRate.completeCount / task.taskerCount) * 100

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm">
                        {task.task}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4" />
                        {formatActivityTime(task.createdTime)}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckBadgeIcon className="h-5 w-5" />
                    <span>{task.completedRate.remainingTasks} Slots Remaining</span>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{task.title}</h1>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Task Description</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{task.description}</p>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {task.completedRate.completeCount}/{task.taskerCount} Participants
                    </span>
                    <span className="text-sm text-indigo-600 dark:text-indigo-400">
                        {Math.round(progress)}% Completed
                    </span>
                </div>
                <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
            </div>
        </motion.div>
    )
}