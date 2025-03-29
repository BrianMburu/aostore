import { AidropsFilterParams } from '@/services/ao/airdropService';
import { AirdropHeader } from '../ui/AirDrops/AirdropHeader';
import { AirdropsList } from '../ui/AirDrops/AirdropsList';
import { Suspense } from 'react';
import { AirdropsSkeleton } from '../ui/AirDrops/skeletons/AirdropsSkeleton';

interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<AidropsFilterParams>;
}
export default async function AirdropsPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId as string;
    const searchParams = await props.searchParams;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AirdropHeader />

            <Suspense fallback={<AirdropsSkeleton n={6} />}>
                <AirdropsList appId={appId} searchParams={searchParams} />
            </Suspense>
        </div>
    );
}