// app/mydapps/page.tsx
import { Suspense } from 'react';
import { DAppFilter } from '../ui/MyDapps/DappFilter';
import { DAppsList } from '../ui/MyDapps/DappsList';
import DappCardsSkeleton from '../ui/MyDapps/skeletons/DappsCardsSkeleton';

export default function MyDAppsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Filters */}
            <Suspense fallback={<></>}>
                <DAppFilter />
            </Suspense>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* DApps List */}
                <Suspense fallback={<DappCardsSkeleton />}>
                    <DAppsList />
                </Suspense>
            </main>
        </div>
    );
}