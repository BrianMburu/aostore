'use client'

import { motion } from 'framer-motion';
import { UsersIcon, CurrencyDollarIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { formatActivityTime } from "@/utils/forum";
import { Task } from "@/types/task";
import { applyPrecision } from '@/utils/ao';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export function TaskItem({ task, appId }: { task: Task; appId: string }) {
    const progress = (task.completedRate.completeCount / task.taskerCount) * 100;
    const reward = task.amountPerTask.toLocaleString();

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="group bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('/grid-pattern.svg')]" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium">
                                {task.task}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {formatActivityTime(Number(task.createdTime))}
                            </span>
                        </div>

                        <Link
                            href={`/dapps/details/tasks/details/?appId=${appId}&taskId=${task.taskId}`}
                            className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                        >
                            {task.title}
                        </Link>

                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                            {task.description}
                        </p>
                    </div>

                    {/* Reward Preview */}
                    <div className="md:w-1/3 flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4 rounded-lg border border-indigo-100 dark:border-gray-700">
                        <div className="text-center mb-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Reward per task
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                                <span className="text-xl font-bold text-green-600">
                                    {reward}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {task.tokenDenomination}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress and Stats */}
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                            {task.completedRate.completeCount}/{task.taskerCount} participants
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                            {Math.round(progress)}% filled
                        </span>
                    </div>

                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                            <UsersIcon className="h-5 w-5" />
                            <span>{task.completedRate.remainingTasks} Active</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CurrencyDollarIcon className="h-5 w-5" />
                            <span>{applyPrecision(task.amountPerTask, task.tokenDenomination)} each</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}