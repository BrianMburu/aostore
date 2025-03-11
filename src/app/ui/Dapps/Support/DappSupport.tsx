// components/DappSupport.tsx
import React from 'react';
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
                    </div>

                    {/* Report Bug and Feature Request Forms */}
                    <DappSupportTabs />
                </div>
            </div>
        </section>

    );
};

export default DappSupport;
