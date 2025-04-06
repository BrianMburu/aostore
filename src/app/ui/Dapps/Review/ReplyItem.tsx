import { Reply } from "@/types/reply";
import ProfileImage from "../../ProfilePic";

export function ReplyItem({ reply }: { reply: Reply }) {
    return (
        <div className="ml-4 md:ml-12 mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
                <ProfileImage
                    imgUrl={reply.profileUrl}
                    alt={reply.username}
                    className='h-8 w-8' />
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{reply.username}</h4>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                            {new Date(Number(reply.createdTime)).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300">{reply.description}</p>
                </div>
            </div>
        </div>
    )
}