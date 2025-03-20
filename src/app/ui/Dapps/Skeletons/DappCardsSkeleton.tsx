import { DAppCardSkeleton } from "./DappCardSkeleton";

export default function DappCardsSkeleton({ n }: { n: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(n)].map((_, i) => (
                <DAppCardSkeleton key={i} />
            ))}
        </div>
    )
}