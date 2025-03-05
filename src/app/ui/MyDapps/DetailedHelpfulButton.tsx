import { AnimatedButton } from "../animations/AnimatedButton"

interface DetailedHelpfulVotesProps {
  helpfulVotes: number,
  unhelpfulVotes: number,
  isPending: boolean,
  handleVote: (action: 'helpful' | 'unhelpful') => void
}

export function DetailedHelpfulButton({ helpfulVotes, unhelpfulVotes, isPending, handleVote }: DetailedHelpfulVotesProps) {
  return (
    <div className="flex items-center gap-2">
      <AnimatedButton
        disabled={isPending}
        onClick={() => handleVote('helpful')}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-300"
      >
        Helpful ({helpfulVotes})
      </AnimatedButton>
      <span className="text-gray-400">•</span>
      <AnimatedButton
        disabled={isPending}
        onClick={() => handleVote('unhelpful')}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-300"
      >
        Unhelpful ({unhelpfulVotes})
      </AnimatedButton>
    </div>
  )
}