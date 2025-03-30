'use client'

import { Task } from '@/types/task'
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext'
import { TaskReplyParams, TaskService } from '@/services/ao/taskService'
import { notFound } from 'next/navigation'
import { TaskDetailsMini } from './TaskDetailsMini'
import { MyTaskPageSkeleton } from './skeletons/MyTaskPageSkeleton'
import { MyTaskReplyList } from './MyTaskReplyList'

export function TaskDetailsRewards({ taskId, appId, searchParams }: { taskId: string; appId: string, searchParams: TaskReplyParams }) {
    const [task, setTask] = useState<Task | null>(null)
    const [loading, setLoading] = useState(true)
    const { isConnected } = useAuth()

    useEffect(() => {
        const loadTask = async () => {
            try {
                const taskData = await TaskService.fetchTask(appId, taskId);

                if (taskData) {
                    setTask(taskData);
                }
            } finally {
                setLoading(false)
            }
        }

        loadTask()
    }, [appId, taskId, isConnected])

    if (loading) return <MyTaskPageSkeleton />

    if (!task) {
        notFound()
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Main Task Details */}
            <TaskDetailsMini task={task} />

            {/* Task Submissions */}
            <div className="space-y-6 mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Submissions ({Object.values(task.replies).length})
                </h2>
                <MyTaskReplyList replies={Object.values(task.replies)} appId={appId}
                    taskId={taskId} searchParams={searchParams} />
            </div>
        </div>
    )
}