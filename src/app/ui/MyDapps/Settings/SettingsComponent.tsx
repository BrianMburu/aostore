'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';

import { DAppEditForm } from '@/app/ui/MyDapps/DappEditForm';
import { VerificationSection, VerificationStatus } from '@/app/ui/MyDapps/VerificationStatus';
import { DAppService } from '@/services/ao/dappService';
import DeleteDAppButton from '@/app/ui/MyDapps/DeleteDAppButton';
import { ChangeDappOwnershipForm } from '@/app/ui/MyDapps/ChangeDappOwnershipForm';
import { TokenCard } from '@/app/ui/MyDapps/TokenCard';
import { AddModeratorsForm } from '@/app/ui/MyDapps/AddModeratorsForm';
import { Dapp } from '@/types/dapp';
import { useAuth } from '@/context/AuthContext';
import SettingsSkeleton from '../skeletons/SettingsSkeleton';
import React from 'react';

function SettingsComponent({ appId }: { appId: string }) {
    const [dapp, setDapp] = useState<Dapp | null>(null);
    const [isPending, setIsPending] = useState<boolean>(true)
    const { isConnected } = useAuth();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await DAppService.getDApp(appId);
                setDapp(data);
            } catch (error) {
                console.error('Error fetching dapp:', error);
                // Optionally, you might trigger notFound() or show an error component here.
            } finally {
                setIsPending(false);
            }
        };

        fetchData();

    }, [appId, isConnected]);

    if (isPending) {
        return <SettingsSkeleton />;
    }

    if (!dapp) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-4">
                        <h1 className="text-2xl font-bold dark:text-white">{dapp.appName}</h1>
                        <VerificationStatus dapp={dapp} />
                    </div>
                    <VerificationSection isVerified={dapp.verified === 'verified'} />
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Manage your DApp settings and information
                    </p>
                </div>
                <DeleteDAppButton appId={dapp.appId} appName={dapp.appName} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <DAppEditForm initialDapp={dapp} />
            </div>

            <TokenCard appId={appId} />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <AddModeratorsForm appId={appId} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <ChangeDappOwnershipForm appId={appId} />
            </div>
        </div>
    );
}

export default React.memo(SettingsComponent)