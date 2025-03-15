import { Reply } from "@/types/review";
import Image from "next/image";

export function ReplyItem({ reply }: { reply: Reply }) {
    return (
        <div className="ml-4 md:ml-12 mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
                <Image
                    src={reply.profileUrl}
                    alt={reply.username}
                    height={40}
                    width={40}
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{reply.username}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{reply.comment}</p>
                </div>
            </div>
        </div>
    )
}