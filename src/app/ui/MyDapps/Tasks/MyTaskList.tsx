'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { Suspense, useEffect, useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "../../EmptyState";
import InfinityScrollControls from "../../InfinityScrollControls";
import { TaskFilterParams, TaskService } from "@/services/ao/taskService";
import { Task } from "@/types/task";
import { TaskItemMini } from "./TaskItemMini";
import { MyTaskListSkeleton } from "./skeletons/MyTaskListSkeleton";
import { AddTaskForm } from "./CreateTaskForm";
import { useSearchParams } from "next/navigation";


export function MyTasksList() {
    // const appId = useParams().appId as string;
    const searchParams = useSearchParams();
    const appId = searchParams.get("appId") as string;

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

    }, [appId, isConnected, isAuthLoading, searchParams])

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
            <Suspense>
                <AddTaskForm />
            </Suspense>

            <div className="space-y-6">
                {tasks.map(task => (
                    <TaskItemMini key={task.taskId} task={task} appId={appId as string} />
                ))}

                {tasks &&
                    <Suspense>
                        <InfinityScrollControls
                            totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                        />
                    </Suspense>
                }
            </div>
        </div>

    )
}