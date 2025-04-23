'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { TaskListSkeleton } from "./skeletons/TaskListSkeleton";
import { TaskItem } from "./TaskItem";
import { EmptyState } from "../../EmptyState";
import InfinityScrollControls from "../../InfinityScrollControls";
import { TaskFilterParams, TaskService } from "@/services/ao/taskService";
import { Task } from "@/types/task";
import { useSearchParams } from "next/navigation";


export function TasksList() {
    // const appId = useParams().appId as string;
    const searchParams = useSearchParams();
    const appId = searchParams.get('appId') as string || "";


    const [tasks, setTasks] = useState<Task[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        const filterParams = Object.fromEntries(searchParams.entries()) as TaskFilterParams;

        startTransition(
            async () => {
                try {
                    if (!isAuthLoading && isConnected) {
                        // const { posts, total } = await ForumService.fetchForumPosts(appId, searchParams, true);
                        const { tasks, total } = await TaskService.fetchTasks(appId, filterParams, true);

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
        return <TaskListSkeleton n={6} />
    }

    if (!isLoading && tasks.length === 0) {
        return (
            <EmptyState
                title="No Tasks Found"
                description="We couldn't find any Tasks from the results"
                interactive
                className="my-8"
            />
        )
    }

    return (
        <div className="space-y-6">
            {tasks.map(task => (
                <TaskItem key={task.taskId} task={task} appId={appId as string} />
            ))}

            {tasks &&
                <Suspense>
                    <InfinityScrollControls
                        totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                    />
                </Suspense>
            }
        </div>
    )
}