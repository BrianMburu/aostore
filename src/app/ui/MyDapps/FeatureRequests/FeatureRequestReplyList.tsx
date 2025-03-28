import { useAuth } from "@/context/AuthContext"
import { Reply } from "@/types/reply"
import { User } from "@/types/user"
import { FeatureRequestReplyEditForm } from "./FeatureRequestReplyEditForm"

// RepliesList component
export function FeatureRequestRepliesList({ appId, requestId, replies, requestType }:
    { appId: string, requestId: string, replies: Reply[], requestType: string }) {
    const { user } = useAuth();

    return (
        <div className="mt-4 pl-6 border-l-2 dark:border-gray-700 space-y-4">
            {replies.map((reply) => (
                <ReplyItem key={reply.replyId} appId={appId} requestId={requestId}
                    reply={reply} requestType={requestType} user={user!}
                />
            ))}
        </div>
    )
}

export function ReplyItem({ appId, requestId, reply, requestType, user }:
    { appId: string, requestId: string, reply: Reply, requestType: string, user: User }) {
    return (
        <div className="text-sm">
            <div className="flex items-center gap-2">
                <span className="font-medium dark:text-white">{reply.username}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(Number(reply.createdTime)).toLocaleDateString()}
                </span>
                {user && user.walletAddress == reply.user &&
                    <FeatureRequestReplyEditForm appId={appId} requestId={requestId} reply={reply} requestType={requestType} />}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{reply.description}</p>
        </div>
    );
}