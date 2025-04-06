'use client'

import { DAppService } from "@/services/ao/dappService";
import { StarIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "../skeleton";

export function RatingStars({ appId }: { appId: string }) {
    const [ratingsData, setRatingsData] = useState<{ rating: number, totalReviews: number }>({ rating: 0, totalReviews: 0 });
    const [fetching, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            try {
                const ratingsData = await DAppService.getDappRating(appId);

                if (ratingsData) {
                    setRatingsData(ratingsData)
                };
            }
            catch (error) {
                console.error(error);
            }

        });
    }, [appId]);

    if (fetching) {
        return <RatingStarsSkeleton />
    }
    return (
        <div className="flex flex-wrap items-center gap-3 ">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        className={`h-4 w-4 ${i < ratingsData.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'}`
                        }
                    />
                ))}
            </div>
            <span className="text-gray-600 dark:text-gray-300">
                {ratingsData.totalReviews} reviews
            </span>
        </div>

    )
}


export function RatingStarsSkeleton() {
    return (
        <div className="flex items-center gap-2 ">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 rounded-full" />
                ))}
            </div>
            <span className="text-gray-600 dark:text-gray-300">
                <Skeleton className="h-4 w-10 rounded" />
            </span>
        </div>
    );
}
