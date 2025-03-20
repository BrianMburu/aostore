// app/mydapps/page.tsx
import { DAppsFilterParams } from '@/services/ao/dappService';
import { DAppFilter } from '../ui/MyDapps/DappFilter';
import { DAppsList } from '../ui/MyDapps/DappsList';
interface Props {
    params: Promise<{ appId: string }>;
    searchParams: Promise<DAppsFilterParams>;
}
export default async function MyDAppsPage(props: Props) {
    const filterParams = await props.searchParams;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Filters */}
            <DAppFilter />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* DApps List */}
                <DAppsList filterParams={filterParams} />
            </main>
        </div>
    );
}