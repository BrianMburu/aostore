'use client'

import { motion } from 'framer-motion'
import { formatActivityTime } from '@/utils/forum'
import { Task } from '@/types/task'
import { UsersIcon, CurrencyDollarIcon, ClockIcon, CheckBadgeIcon } from "@heroicons/react/24/outline"
import { forwardRef, useState } from "react"
import { Loader2 } from "lucide-react"
import clsx from 'clsx'
import { TaskReplyForm } from './TaskReplyForm'
import { Progress } from './TaskProgress'
import { applyPrecision } from '@/utils/ao'


export function TaskDetails({ task, appId, refreshTask }: { task: Task, appId: string, refreshTask: () => void }) {
    const progress = (task.completedRate.completeCount / task.taskerCount) * 100
    const totalReward = applyPrecision(task.tasksAmount, task.tokenDenomination);
    const [showForm, setShowForm] = useState(false)

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

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-xl">
                    <div className="text-sm text-indigo-600 dark:text-indigo-300 mb-1">Reward per Task</div>
                    <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                        <span className="text-2xl dark:text-gray-300 font-bold">{task.amountPerTask.toLocaleString()}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{task.tokenDenomination}</span>
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-xl">
                    <div className="text-sm text-indigo-600 dark:text-indigo-300 mb-1">Total Tasks</div>
                    <div className="flex items-center gap-2">
                        <UsersIcon className="h-6 w-6 text-blue-600" />
                        <span className="text-2xl dark:text-gray-300 font-bold">{task.taskerCount}</span>
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-xl">
                    <div className="text-sm text-indigo-600 dark:text-indigo-300 mb-1">Total Reward Pool</div>
                    <div className="flex items-center text-2xl font-bold text-green-600 gap-2">
                        {totalReward}
                        <span className='text-gray-500 dark:text-gray-400 text-sm'>{task.tokenDenomination}</span>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Task Description</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{task.description}</p>
            </div>

            <div className="mb-8">
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

            <Button className="w-full md:w-auto" onClick={() => setShowForm(true)}>
                Participate Now
            </Button>
            <TaskReplyForm taskId={task.taskId} appId={appId} onParticipate={refreshTask}
                showForm={showForm} onClose={() => setShowForm(false)} />
        </motion.div>
    )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    variant?: 'default' | 'outline' | 'ghost'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, isLoading, variant = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    "px-6 py-3 rounded-xl font-medium transition-all",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                    variant === 'default' &&
                    "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600",
                    variant === 'outline' &&
                    "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-300",
                    variant === 'ghost' &&
                    "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300",
                    className
                )}
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading...
                    </div>
                ) : children}
            </button>
        )
    }
)

Button.displayName = "Button"

