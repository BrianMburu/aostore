import SettingsComponent from '@/app/ui/MyDapps/Settings/SettingsComponent';
import SettingsSkeleton from '@/app/ui/MyDapps/skeletons/SettingsSkeleton';
import { Suspense } from 'react';

interface Props {
    params: Promise<{ appId: string }>;
}

export default async function DAppManagementPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId;

    return (
        <Suspense fallback={<SettingsSkeleton />}>
            <SettingsComponent appId={appId} />
        </Suspense>
    );
}