// app/mydapps/page.tsx
import { DAppService } from '@/services/ao/dappService';
import { DAppFilter } from '../ui/MyDapps/DappFilter';
import { DAppsList } from '../ui/MyDapps/DappsList';

export default async function MyDAppsPage({ searchParams }: { searchParams: Record<string, string> }) {

    const filters = await searchParams;

    const { data: initialDApps, total } = await DAppService.getDApps(filters);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Filters */}
            <DAppFilter />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* DApps List */}
                <DAppsList
                    initialDApps={initialDApps}
                    totalItems={total}
                />
            </main>
        </div>
    );
}