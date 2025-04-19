import { DappInfo } from '@/app/ui/Dapps/DappInfo';
import { fetchAllPages } from '@/helpers/idsPaginator';
import { DAppService } from '@/services/ao/dappService';

export async function generateStaticParams() {
    try {
        const appIds = await fetchAllPages((page) => DAppService.getAllDappIds(page));
        return appIds;
    } catch (error) {
        console.error('Error generating static params:', error);
        return [{ appId: "TX1" }];
    }
}

export default function AppDetailsPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <DappInfo />
        </div>
    );
}