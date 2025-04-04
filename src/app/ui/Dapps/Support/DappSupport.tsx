// components/DappSupport.tsx
import React, { useTransition } from 'react';
import DappSupportTabs from './DappSupportTabs';
import { Dapp } from '@/types/dapp';
import { capitalizeFirstLetter } from '@/utils/message';
import { ArrowTopRightOnSquareIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { DiscordIcon, TwitterIcon } from '../../SocialIcons';
import { AnimatedButton } from '../../animations/AnimatedButton';
import { DAppService } from '@/services/ao/dappService';
import { FlagIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface DappSupportProps {
    appData: Dapp;
}

const DappSupport: React.FC<DappSupportProps> = ({ appData }) => {
    const [isFlagging, startTransition] = useTransition();
    const flagDapp = async () => {
        startTransition(async () => {
            try {
                await DAppService.flagDappAsInappropriate(appData.appId)
                toast.success('Dapp flagged successfully');
            } catch (error) {
                console.error(error);
            }
        })

    };

    return (
        <section className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm'>
            <div className='flex flex-col md:flex-row gap-8'>
                {/* Developer Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Developer Support</h2>
                    <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-bold">Maintainer:</span> {capitalizeFirstLetter(appData?.username || '')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-bold">Company:</span> {appData?.companyName}
                        </p>
                        <p className="flex flex-wrap gap-2 items-center text-gray-600 dark:text-gray-300">
                            <GlobeAltIcon className='h-5 w-5' />
                            {appData?.websiteUrl && (
                                <a
                                    href={appData.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center"
                                >
                                    {appData.appName || new URL(appData.websiteUrl).hostname}
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                                </a>
                            )}
                        </p>
                        <p className="flex flex-wrap gap-2 items-center text-gray-600 dark:text-gray-300">
                            <TwitterIcon className='h-5 w-5' />
                            <a href={appData?.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                                {appData?.twitterUrl}
                            </a>
                        </p>
                        <p className="flex flex-wrap gap-2 items-center text-gray-600 dark:text-gray-300">
                            <DiscordIcon className='h-5 w-5' />
                            <a href={appData?.discordUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                                {appData?.discordUrl}
                            </a>
                        </p>
                        <p className="flex flex-wrap gap-2 items-center text-gray-600 dark:text-gray-300">
                            <FlagIcon className='h-5 w-5' />
                            <AnimatedButton onClick={flagDapp} disabled={isFlagging}>
                                Flag Dapp as Inappropriate
                            </AnimatedButton>
                        </p>
                    </div>
                </div>

                {/* Support Actions */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Support Actions
                        </h3>
                    </div>

                    {/* Report Bug and Feature Request Forms */}
                    <DappSupportTabs />
                </div>
            </div>
        </section>

    );
};

export default DappSupport;
