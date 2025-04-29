import { ReviewItemSkeleton } from "./ReviewItemSkeleton";

export default function ReviewsListSkeleton({ n }: { n: number }) {
    return (
        <div className="min-h-screen mx-auto space-y-4 animate-pulse">
            <main className="max-w-7xl mx-auto space-y-6">
                {Array.from({ length: n || 6 }).map((_, i) => (
                    <ReviewItemSkeleton key={i} />
                ))}
            </main>
        </div>
    )
}