'use client'

import { useEffect, useState, useTransition } from "react";
import { DAppService, DAppsFilterParams } from "@/services/ao/dappService"
import DAppCard from "./DappCard"

import { DappList } from "@/types/dapp";
import DappCardsSkeleton from "./Skeletons/DappCardsSkeleton";
import { EmptyState } from "../EmptyState";
import { useAuth } from "@/context/AuthContext";

export function DAppsListLimit({ params }: { params: DAppsFilterParams }) {
    const [dapps, setDapps] = useState<DappList[]>([]);

    const [fetching, StartTransition] = useTransition();
    const { isConnected, isLoading } = useAuth();

    useEffect(() => {
        StartTransition(
            async () => {
                try {
                    if (!isLoading && isConnected) {
                        const { data, } = await DAppService.getDAppsLimited(params, 4);

                        if (data) {
                            setDapps(data);
                        }
                    } else {
                        setDapps([]);
                    }
                } catch (error) {
                    setDapps([]);
                    console.error(error)
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);

    if (!isLoading && !fetching && dapps.length === 0) {
        return (
            <EmptyState
                title="No Dapps Found"
                description="We couldn't find any dapps from the results"
                interactive
                className="my-8"
            />
        )
    }

    return (
        <>
            {/* Add DApp Form Modal */}
            {fetching ? <DappCardsSkeleton n={4} /> :
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {dapps.map(dapp => (
                            <div key={dapp.appId} >
                                {dapp.appId &&
                                    <DAppCard key={dapp.appId} dapp={dapp} />
                                }
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>

    )
}