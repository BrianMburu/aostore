'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "../../EmptyState";
import InfinityScrollControls from "../../InfinityScrollControls";
import { TaskFilterParams, TaskService } from "@/services/ao/taskService";
import { TaskReply } from "@/types/task";
import { MyTaskReplyItem } from "./MyTaskReplyItem";


export function MyTaskReplyList({ replies, searchParams, appId, taskId }: { appId: string, taskId: string, replies: TaskReply[], searchParams: TaskFilterParams }) {
    const [taskReplies, setTaskReplies] = useState<TaskReply[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const { isConnected, isLoading } = useAuth();

    useEffect(() => {
        try {
            const { replies: data, total } = TaskService.processTaskReplies(replies, searchParams, true);
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
                <MyTaskReplyItem key={reply.replyId} reply={reply} appId={appId as string} taskId={taskId} />
            ))}

            {taskReplies &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}