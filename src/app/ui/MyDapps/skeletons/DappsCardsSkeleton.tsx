import { MyDAppCardSkeleton } from "./DappCardSkeleton";

export default function DappCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <MyDAppCardSkeleton key={i} />
            ))}
        </div>
    )
}