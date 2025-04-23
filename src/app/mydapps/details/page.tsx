import SettingsComponent from '@/app/ui/MyDapps/Settings/SettingsComponent';
import SettingsSkeleton from '@/app/ui/MyDapps/skeletons/SettingsSkeleton';
import { Suspense } from 'react';
// import { fetchAllPages } from '@/helpers/idsPaginator';
// import { DAppService } from '@/services/ao/dappService';

// export async function generateStaticParams() {
//     try {
//         const appIds = await fetchAllPages((page) => DAppService.getAllMyDappIds(page));
//         return appIds;
//     } catch (error) {
//         console.error('Error generating static params:', error);
//         return [{ appId: "TX1" }];
//     }
// }

export default function DAppManagementPage() {
    return (
        <Suspense fallback={<SettingsSkeleton />}>
            <SettingsComponent />
        </Suspense>
    );
}