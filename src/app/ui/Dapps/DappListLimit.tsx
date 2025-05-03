'use client'

import { useEffect, useState } from "react";
import { DAppService, DAppsFilterParams } from "@/services/ao/dappService"
import DAppCard from "./DappCard"

import DappCardsSkeleton from "./Skeletons/DappCardsSkeleton";
import { EmptyState } from "../EmptyState";
import { useDappsContext } from "@/context/DappsContext";
import { DappList } from "@/types/dapp";

export function DAppsListLimit({ params }: { params: DAppsFilterParams }) {
    const [dapps, setDapps] = useState<DappList[]>([]);

    const { dapps: fetchedDapps, loading } = useDappsContext()

    useEffect(() => {
        try {
            const { data, } = DAppService.getDAppsLimited(fetchedDapps, params, 4);

            if (data) {
                setDapps(data);
            }

        } catch (error) {
            console.error(error)
        }
    }, [fetchedDapps, loading, params]);

    if (loading) {
        return <DappCardsSkeleton n={4} />
    }

    if (!loading && dapps.length === 0) {
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
        </>

    )
}