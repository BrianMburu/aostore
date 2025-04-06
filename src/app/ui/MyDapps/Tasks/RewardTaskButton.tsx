import { useTransition } from "react"
import { AnimatedButton } from "../../animations/AnimatedButton";
import Loader from "../../Loader";
import { TaskService } from "@/services/ao/taskService";
import toast from "react-hot-toast";

export default function RewardTaskButton({ appId, taskId, replyId }: { appId: string, taskId: string, replyId: string }) {
    const [isSubmitting, startTransition] = useTransition()
    const verifyReply = async () => {
        startTransition(async () => {
            try {
                // Call createDapp to submit the data to the server
                await TaskService.RewardTask(appId, taskId, replyId)

                toast.success("Tasker Rewarded successfully.");

            } catch {
                // Handle error and rollback
                toast.error("Failed to award Tasker. Please try again.");
            }
        });

    }
    return (
        <AnimatedButton
            onClick={verifyReply}
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isSubmitting}
        >
            {isSubmitting ? (
                <div className="flex items-center justify-center">
                    <Loader />
                    Rewarding ...
                </div>
            ) : (
                "Reward User"
            )}
        </AnimatedButton>
    )
}