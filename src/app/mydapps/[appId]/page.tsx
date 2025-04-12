import SettingsComponent from '@/app/ui/MyDapps/Settings/SettingsComponent';
import SettingsSkeleton from '@/app/ui/MyDapps/skeletons/SettingsSkeleton';
import { Suspense } from 'react';

export default function DAppManagementPage() {
    return (
        <Suspense fallback={<SettingsSkeleton />}>
            <SettingsComponent />
        </Suspense>
    );
}