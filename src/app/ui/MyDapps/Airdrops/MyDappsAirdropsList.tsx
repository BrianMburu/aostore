'use client'

import { DEFAULT_PAGE_SIZE } from "@/config/page";
import { MyDappsAirDropCard } from "./MyDappsAirdropsCard";
import InfinityScrollControls from "../../InfinityScrollControls";
import { AirdropsSkeleton } from "../../AirDrops/skeletons/AirdropsSkeleton";
import { EmptyState } from "../../EmptyState";
import { Airdrop } from "@/types/airDrop";
import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { AidropsFilterParams, AirdropService } from "@/services/ao/airdropService";

export function MyDappsAirdropsList({ appId, searchParams }: { appId: string, searchParams: AidropsFilterParams }) {

    const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    const [isLoading, startTransition] = useTransition();
    const { isConnected, isLoading: isAuthLoading } = useAuth();

    useEffect(() => {
        startTransition(
            async () => {
                try {
                    if (!isAuthLoading && isConnected) {
                        const { data, total } = await AirdropService.fetchAirdrops(appId, searchParams, true);

                        if (data) {
                            setAirdrops(data);
                            setTotalItems(total)
                        }
                    } else {
                        setAirdrops([]);
                        setTotalItems(0)
                    }
                } catch (error) {
                    setAirdrops([]);
                    setTotalItems(0);
                    console.error(error)
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, searchParams])

    if (isLoading) {
        return <AirdropsSkeleton n={6} />
    }

    if (!isLoading && airdrops.length === 0) {
        return (
            <EmptyState
                title="No Airdrops Found"
                description="We couldn't find any Airdrops from the results"
                interactive
                className="my-8"
            />
        )
    }
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {airdrops.map(airdrop => (
                    <MyDappsAirDropCard
                        key={airdrop.airdropId}
                        airdrop={airdrop}
                    />
                ))}
            </div>
            {airdrops &&
                <InfinityScrollControls
                    totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                />
            }
        </>

    )
}