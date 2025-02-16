'use client'

import { useOptimistic, Suspense, useState } from 'react'

import { AppData } from '@/types/dapp'
import { DAppCard } from './DappCard'
import PaginationControls from '../PaginationControls'
import { AddDAppModal } from './AddAppModal'

import { DEFAULT_PAGE_SIZE } from '@/config'
import DappCardsSkeleton from './skeletons/DappsCardsSkeleton'

export function DAppsList({ initialDApps, totalItems }: { initialDApps: AppData[], totalItems: number }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dapps, setDapps] = useState(initialDApps);

    const [optimisticDApps, addOptimisticDApp] = useOptimistic(
        initialDApps,
        (state, newDApp: AppData) => [newDApp, ...state]
    );

    return (
        <div>
            {/* Add DApp Form Modal */}
            <AddDAppModal addOptimisticDApp={addOptimisticDApp} setDapps={setDapps} />

            <Suspense fallback={<DappCardsSkeleton />}>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {optimisticDApps.map(dapp => (
                            <DAppCard key={dapp.appId} dapp={dapp} isOptimistic={dapp.appId.startsWith('temp')} />
                        ))}
                    </div>

                    {optimisticDApps &&
                        <PaginationControls
                            totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                        />}
                </div>
            </Suspense>
        </div>

    )
}