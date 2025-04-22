'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "../../EmptyState";
import InfinityScrollControls from "../../InfinityScrollControls";
import { TaskFilterParams, TaskService } from "@/services/ao/taskService";
import { TaskReply } from "@/types/task";
import { TaskReplyItem } from "./TaskReplyItem";
import { useSearchParams } from "next/navigation";


export function TaskReplyList({ replies }: { replies: TaskReply[] }) {
    const searchParams = useSearchParams();

    const [taskReplies, setTaskReplies] = useState<TaskReply[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const { isConnected, isLoading } = useAuth();

    useEffect(() => {
        const filterParams = Object.fromEntries(searchParams.entries()) as TaskFilterParams;

        try {
            const { replies: data, total } = TaskService.processTaskReplies(replies, filterParams, true);
            if (replies) {
                setTaskReplies(data);
                setTotalItems(total)
            }

        } catch (error) {
            setTaskReplies([]);
            setTotalItems(0);
            console.error(error)
        }

    }, [replies, isConnected, searchParams])

    if (!isLoading && taskReplies.length === 0) {
        return (
            <EmptyState
                title="No Replies Found"
                description="We couldn't find any Replies. Be the first to reply"
                interactive
                className="my-8"
            />
        )
    }

    return (
        <div className="space-y-6">
            {taskReplies.map(reply => (
                <TaskReplyItem key={reply.replyId} reply={reply} />
            ))}

            {taskReplies &&
                <Suspense>
                    <InfinityScrollControls
                        totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                    />
                </Suspense>
            }
        </div>
    )
}