// app/airdrops/[airdropId]/page.tsx
import AirdropDetails from '@/app/ui/AirDrops/AirDropDetails';
import { AidropsFilterParams } from '@/services/ao/airdropService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Props {
    params: Promise<{ appId: string, airdropId: string }>;
    searchParams: Promise<AidropsFilterParams>;
}

export default async function AirdropDetailsPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId as string;
    const airdropId = currParams.airdropId as string;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <Link
                    href={`/mydapps/${appId}/airdrops`}
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Airdrops
                </Link>
            </div>

            <AirdropDetails appId={appId} airdropId={airdropId} />
        </div >
    );
}