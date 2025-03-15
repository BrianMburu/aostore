'use client';

import React, { useState } from 'react';
import DappSupportForm from './DappSupportForm';
import { BugAntIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const DappSupportTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'bug' | 'feature'>('bug');

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            {/* Tab Headers */}
            <div className="grid grid-cols-2 border-b border-gray-300 dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab('bug')}
                    className={`flex text-xs items-center px-4 py-2 focus:outline-none transition-colors duration-200 ${activeTab === 'bug'
                        ? 'border-b-2 border-red-600 text-indigo-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}
                >
                    <BugAntIcon className="h-5 w-5 mr-2" />
                    Report Bug
                </button>
                <button
                    onClick={() => setActiveTab('feature')}
                    className={`flex text-xs items-center px-4 py-2 focus:outline-none transition-colors duration-200 ${activeTab === 'feature'
                        ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                        }`}
                >
                    <LightBulbIcon className="h-5 w-5 mr-2" />
                    Request Feature
                </button>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'bug' ? (
                    <DappSupportForm
                        requestType="bug"
                        icon={<BugAntIcon className="h-5 w-5" />}
                        title="Report a Bug"
                        placeholder="Describe the issue you're experiencing..."
                        submitText="Submit Bug Report"
                        submitButtonClasses="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 dark:bg-red-900 dark:text-red-100"
                    />
                ) : (
                    <DappSupportForm
                        requestType="feature"
                        icon={<LightBulbIcon className="h-5 w-5" />}
                        title="Request Feature"
                        placeholder="Describe your feature request..."
                        submitText="Submit Feature Request"
                        submitButtonClasses="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 dark:bg-green-900 dark:text-green-100"
                    />
                )}
            </div>
        </div>
    );
};

export default DappSupportTabs;
