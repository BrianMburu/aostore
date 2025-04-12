// app/mydapps/page.tsx
import { MyDappsAirDropFilter } from '@/app/ui/MyDapps/Airdrops/MyDappsAirDropsFilter';
import { Suspense } from 'react';
import { AirdropsSkeleton } from '@/app/ui/AirDrops/skeletons/AirdropsSkeleton';
import { AirdropsList } from '@/app/ui/AirDrops/AirdropsList';

export default function DAppsAirdropsPage() {

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Airdrops</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Filters */}
                    <MyDappsAirDropFilter />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* AirDrops List */}
                <Suspense fallback={<AirdropsSkeleton n={6} />}>
                    <AirdropsList />
                </Suspense>
            </main>
        </div>
    );
}