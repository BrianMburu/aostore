
import DAppCard from './DappCard'
import { DEFAULT_PAGE_SIZE } from '@/config/page'
import InfinityScrollControls from '../InfinityScrollControls'
import { DAppService, DAppsFilterParams } from '@/services/ao/dappService'

export async function DAppsList({ params }: { params: DAppsFilterParams }) {
    const { data: dapps, total: totalItems } = await DAppService.getDApps(params, true)

    return (
        <>
            {/* Add DApp Form Modal */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dapps.map(dapp => (
                        <DAppCard key={dapp.appId} dapp={dapp} />
                    ))}
                </div>

                {totalItems > DEFAULT_PAGE_SIZE && dapps &&
                    <InfinityScrollControls
                        totalPages={Math.ceil(totalItems / DEFAULT_PAGE_SIZE)}
                    />}
            </div>
        </>

    )
}