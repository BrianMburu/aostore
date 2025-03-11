import { AirdropCardSkeleton } from "./AirdropCardSkeleton";

export function AirdropsSkeleton({ n = 6 }: { n: number | undefined }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: n || 6 }).map((_, i) => (
                <AirdropCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function AirdropsSkeletonVertical({ n = 6 }: { n: number | undefined }) {
    return (
        <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: n || 6 }).map((_, i) => (
                <AirdropCardSkeleton key={i} />
            ))}
        </div>
    )
}