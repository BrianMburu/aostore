import { AirdropService } from '@/services/ao/airdropService';
import { AirdropHeader } from '../ui/AirDrops/AirdropHeader';
import { AirdropsList } from '../ui/AirDrops/AirdropsList';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AirdropsSkeleton } from '../ui/AirDrops/skeletons/AirdropsSkeleton';

export default async function AirdropsPage({ searchParams }: { searchParams: Record<string, string> }) {
    const filters = await searchParams;

    const { data: airdrops, total } = await AirdropService.fetchAirdrops(filters, true);

    if (!airdrops) notFound()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AirdropHeader />

            <Suspense fallback={<AirdropsSkeleton n={6} />}>
                <AirdropsList airdrops={airdrops} totalItems={total} />

            </Suspense>
        </div>
    );
}