'use client'

import { useParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { ForumPostItem } from "./ForumPostItem";
import { ForumPost } from "@/types/forum";
import InfinityScrollControls from "../InfinityScrollControls";


// QuestionsList component
export function ForumQuestionsList({ questions, totalItems }: { questions: ForumPost[], totalItems: number }) {
    const params = useParams();
    const appId = params.appId

    return (
        <div className="space-y-6">
            {questions.map(post => (
                <ForumPostItem key={post.postId} post={post} appId={appId as string} />
            ))}

            {questions &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />}
        </div>
    )
}