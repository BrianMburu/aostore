'use client'

import { useEffect, useState, useTransition } from "react";
import { DAppService, DAppsFilterParams } from "@/services/ao/dappService"
import DAppCard from "./DappCard"

import { AppData } from "@/types/dapp";
import DappCardsSkeleton from "./Skeletons/DappCardsSkeleton";

export function DAppsListLimit({ params }: { params: DAppsFilterParams }) {
    const [dapps, setDapps] = useState<AppData[]>([]);

    const [fetching, StartTransition] = useTransition();

    useEffect(() => {
        StartTransition(
            async () => {
                const { data: dapps, } = await DAppService.getDAppsLimited(params, 4)
                setDapps(dapps)
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {/* Add DApp Form Modal */}
            {fetching ? <DappCardsSkeleton n={4} /> :
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dapps.map(dapp => (
                            <DAppCard key={dapp.appId} dapp={dapp} />
                        ))}
                    </div>
                </div>
            }
        </>

    )
}