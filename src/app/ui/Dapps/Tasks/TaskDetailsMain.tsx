'use client'

import { Task } from '@/types/task'
import { useCallback, useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext'
import { TaskReplyParams, TaskService } from '@/services/ao/taskService'
import { TaskPageSkeleton } from './skeletons/TaskPageSkeleton'
import { notFound } from 'next/navigation'
import { TaskDetails } from './TaskDetails'
import { TasksListSuggested } from './TaskListSuggested'
import { TaskReplyList } from './TaskReplyList'

export function TaskDetailsMain({ taskId, appId, searchParams }: { taskId: string; appId: string, searchParams: TaskReplyParams }) {
    const [task, setTask] = useState<Task | null>(null)
    const [loading, setLoading] = useState(true)
    const { isConnected } = useAuth()

    const loadTask = useCallback(async () => {
        try {
            const taskData = await TaskService.fetchTask(appId, taskId);

            if (taskData) {
                setTask(taskData);
            }
        } finally {
            setLoading(false)
        }
    }, [appId, taskId]);

    useEffect(() => {
        loadTask()
    }, [loadTask, isConnected])

    const refreshTask = () => {
        loadTask();
    };

    if (loading) return <TaskPageSkeleton />

    if (!task) {
        notFound()
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Task Details */}
            <TaskDetails task={task} appId={appId} refreshTask={refreshTask} />

            {/* Task Submissions */}
            <div className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Submissions ({Object.values(task.replies).length})
                </h2>
                <TaskReplyList replies={Object.values(task.replies)} searchParams={searchParams} />
            </div>

            {/* Suggested Tasks */}
            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Similar Tasks
                </h2>
                <TasksListSuggested appId={appId} searchParams={{ tokenId: task.tokenId }} />
            </div>
        </div>
    )
}