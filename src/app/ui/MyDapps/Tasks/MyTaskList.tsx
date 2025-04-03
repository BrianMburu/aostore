'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "../../EmptyState";
import InfinityScrollControls from "../../InfinityScrollControls";
import { TaskFilterParams, TaskService } from "@/services/ao/taskService";
import { Task } from "@/types/task";
import { TaskItemMini } from "./TaskItemMini";
import { MyTaskListSkeleton } from "./skeletons/MyTaskListSkeleton";
import { AddTaskForm } from "./CreateTaskForm";


export function MyTasksList({ appId, searchParams }: { appId: string, searchParams: TaskFilterParams }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (!isAuthLoading && isConnected) {
                        // const { posts, total } = await ForumService.fetchForumPosts(appId, searchParams, true);
                        const { tasks, total } = await TaskService.fetchTasks(appId, searchParams, true);
                        if (tasks) {
                            setTasks(tasks);
                            setTotalItems(total)
                        }
                    } else {
                        setTasks([]);
                        setTotalItems(0)
                    }
                } catch (error) {
                    setTasks([]);
                    setTotalItems(0);
                    console.error(error)
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, searchParams])

    if (isLoading) {
        return <MyTaskListSkeleton n={6} />
    }

    if (!isLoading && tasks.length === 0) {
        return (
            <div>
                <AddTaskForm />
                <EmptyState
                    title="No Tasks Found"
                    description="We couldn't find any Tasks from the results"
                    interactive
                    className="my-8"
                />
            </div>

        )
    }

    return (
        <div>
            <AddTaskForm />

            <div className="space-y-6">
                {tasks.map(task => (
                    <TaskItemMini key={task.taskId} task={task} appId={appId as string} />
                ))}

                {tasks &&
                    <InfinityScrollControls
                        totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                    />}
            </div>
        </div>

    )
}