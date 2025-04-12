'use client'

import { Task } from '@/types/task'
import { useEffect, useState } from "react"
import { useAuth } from '@/context/AuthContext'
import { TaskService } from '@/services/ao/taskService'
import { notFound, useParams } from 'next/navigation'
import { TaskDetailsMini } from './TaskDetailsMini'
import { MyTaskPageSkeleton } from './skeletons/MyTaskPageSkeleton'
import { MyTaskReplyList } from './MyTaskReplyList'
import { BackLink } from '../../BackLink'
import { StatusToggle } from './StatusToggle'

export function TaskDetailsRewards() {
    const appId = useParams().appId as string;
    const taskId = useParams().taskId as string;

    const [task, setTask] = useState<Task | null>(null)
    const [loading, setLoading] = useState(true)
    const { isConnected, isLoading: isAuthLoading } = useAuth()

    useEffect(() => {
        const loadTask = async () => {
            setLoading(true)
            try {
                const taskData = await TaskService.fetchTask(appId, taskId);

                if (taskData) {
                    setTask(taskData);
                }
            } catch (error) {
                console.error(error);
                setTask(null);
            }
            finally {
                setLoading(false)
            }
        }

        loadTask()
    }, [appId, isAuthLoading, taskId, isConnected])

    if (loading) return <MyTaskPageSkeleton />

    if (!task) {
        notFound()
    }

    return (
        <>
            <div className="mb-8">
                <BackLink href={`/mydapps/${appId}/tasks`} value={'Back to Tasks'} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Task Details */}
                <TaskDetailsMini task={task} />

                {/* Task Submissions */}
                <div className="space-y-6 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Submissions ({Object.values(task.replies).length})
                        </h2>
                        <StatusToggle />
                    </div>

                    <MyTaskReplyList replies={Object.values(task.replies)} appId={appId}
                        taskId={taskId} />
                </div>
            </div>
        </>

    )
}