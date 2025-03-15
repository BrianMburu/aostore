import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatedButton } from "../animations/AnimatedButton";

interface HelpfulVotesProps {
    helpfulVotes: number,
    isPending: boolean,
    handleVote: (action: "helpful" | "unhelpful") => void
}

export function HelpfulButton({ helpfulVotes, isPending, handleVote }: HelpfulVotesProps) {

    return (
        <div className='flex items-center gap-2'>
            <span className='text-gray-600 dark:text-gray-300'>
                Helpful ({helpfulVotes})
            </span>
            <AnimatedButton
                onClick={() => handleVote("helpful")}
                disabled={isPending}
                className="p-1 border border-gray-800 rounded dark:border-gray-300 hover:border-cyan-600 dark:hover:border-cyan-300  text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-300">
                <CheckIcon className="h-3 w-3" />
            </AnimatedButton>
            <AnimatedButton
                onClick={() => handleVote("unhelpful")}
                disabled={isPending}
                className="p-1 border border-gray-600 rounded dark:border-gray-300 hover:border-red-600 dark:hover:border-red-400 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400">
                <XMarkIcon className="h-3 w-3" />
            </AnimatedButton>
        </div>
    )
}