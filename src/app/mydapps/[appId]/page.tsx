import { notFound } from 'next/navigation'

import { DAppEditForm } from '@/app/ui/MyDapps/DappEditForm';
import { VerificationSection, VerificationStatus } from '@/app/ui/MyDapps/VerificationStatus';
import { DAppService } from '@/services/ao/dappService';
import DeleteDAppButton from '@/app/ui/MyDapps/DeleteDAppButton';

export default async function DAppManagementPage({ params, }: {
    params: { appId: string }
}) {

    const currParams = await params;
    const appId = currParams.appId;
    const dapp = await DAppService.getDApp(appId);

    if (!dapp) return notFound()

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
        </div>
    );
}