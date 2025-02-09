// components/DappSupport.tsx
import React from 'react';
import Link from 'next/link';
import { ChatBubbleLeftIcon, BugAntIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import DappSupportForm from './DappSupportForm';
import { useParams } from 'next/navigation';

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

                    {/* Report Bug Form */}
                    <DappSupportForm
                        requestType="bug"
                        icon={<BugAntIcon className="h-5 w-5" />}
                        title="Report a Bug"
                        placeholder="Describe the issue you're experiencing..."
                        submitText="Submit Bug Report"
                        submitButtonClasses="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
                    />

                    {/* Feature Request Form */}
                    <DappSupportForm
                        requestType="feature"
                        icon={<LightBulbIcon className="h-5 w-5" />}
                        title="Request Feature"
                        placeholder="Describe your feature request..."
                        submitText="Submit Feature Request"
                        submitButtonClasses="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 dark:bg-green-900 dark:text-green-100"
                    />
                </div>
            </div>
        </section>

    );
};

export default DappSupport;
