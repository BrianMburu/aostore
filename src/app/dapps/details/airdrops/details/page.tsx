import AirdropDetails from '@/app/ui/AirDrops/AirDropDetails';
import AirdropDetailsSkeleton from '@/app/ui/AirDrops/AirdropsDetailsSkeleton';
import { Suspense } from 'react';
// import { fetchAllPages } from '@/helpers/idsPaginator';
// import { AirdropService } from '@/services/ao/airdropService';
// import { DAppService } from '@/services/ao/dappService';

// export async function generateStaticParams() {
//     try {
//         const [appIds, airdropIds] = await Promise.all([
//             fetchAllPages((page) => DAppService.getAllDappIds(page)),
//             fetchAllPages((page) => AirdropService.getAllAirdropIds(page)),
//         ]);

//         return appIds.flatMap((appId) =>
//             airdropIds.map((airdropId) => ({ ...appId, ...airdropId }))
//         );
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [{ appId: "TX1", airdropId: "AX1" }];
//     }
// }

export default function AirdropDetailsPage() {

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<AirdropDetailsSkeleton />}>
                <AirdropDetails />
            </Suspense>
        </div >
    );
}