'use client'

import React from 'react';
import { AnalyticsData } from '@/types/analytics';
import UserAcquisitionChart from './UserAcquisitionChart';
import LikesGrowthChart from './LikesGrowthChart';
import FeatureBugChart from './FeatureBugChart';

interface AnalyticsDashboardProps {
    data: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
    return (
        <div className="w-full p-6 space-y-8">
            <div className="w-full h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    User Acquisition
                </h3>
                <UserAcquisitionChart data={data.userAcquisition} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">
                        Likes Growth
                    </h3>
                    <LikesGrowthChart data={data.popularity} />
                </div>

                <div className="h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">
                        Feature/Bug Ratio
                    </h3>
                    <FeatureBugChart data={data.stability} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;