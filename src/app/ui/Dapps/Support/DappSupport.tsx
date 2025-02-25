// components/DappSupport.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import DappSupportTabs from './DappSupportTabs';

interface DeveloperInfo {
    name?: string;
    contact?: string;
    forum?: string;
    website?: string
}

interface DappSupportProps {
    developerInfo?: DeveloperInfo;
}

const DappSupport: React.FC<DappSupportProps> = ({ developerInfo }) => {
    const params = useParams();
    const appId = params.appId;

    return (
        <section className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm'>
            <div className='flex flex-col md:flex-row gap-8'>
                {/* Developer Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Developer Support</h2>
                    <div className="space-y-2">
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Developer:</span> {developerInfo?.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Contact:</span> {developerInfo?.contact}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-medium">Website:</span>{' '}
                            <a href={developerInfo?.website} className="text-indigo-600 dark:text-indigo-400">
                                {developerInfo?.website}
                            </a>
                        </p>
                    </div>
                </div>

                {/* Support Actions */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Support Actions
                        </h3>

                        <Link
                            href={`/dapps/${appId}/feature-requests`}
                            className="inline-flex items-center px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded-full"
                        >
                            View latest Submitted Requests
                            <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2" />

                        </Link>

                        {developerInfo?.forum && (
                            <Link
                                href={`/dapps/${appId}/forum`}
                                className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                            >
                                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                                Visit Developer Forum
                            </Link>
                        )}
                    </div>

                    {/* Report Bug and Feature Request Forms */}
                    <DappSupportTabs />
                </div>
            </div>
        </section>

    );
};

export default DappSupport;
