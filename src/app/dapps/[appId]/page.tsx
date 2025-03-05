'use client';

import { DappInfo } from '@/app/ui/Dapps/DappInfo';
import { AppDataContext, AppLoadingContext } from './layout';
import { useContext } from 'react';
import { ContentSkeleton } from '@/app/ui/Dapps/Skeletons/ContentSkeleton';


export default function AppDetailsPage() {
    const appData = useContext(AppDataContext);
    const fetching = useContext(AppLoadingContext);

    if (!appData || fetching) {
        return <ContentSkeleton />;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <DappInfo appData={appData} />
        </div>
    );
}