// app/dapps/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Project, Protocol, ProjectType, projectTypes } from '@/types/dapp';
import DAppCard from '@/app/ui/Dapps/DappCard';
import Loader from '../ui/Loader';

const dummyDApps: Project[] = Array.from({ length: 50 }, (_, i) => ({
    projectName: `DApp ${i + 1}`,
    companyName: `Company ${i % 10}`,
    projectType: projectTypes[i % projectTypes.length],
    ratings: Math.floor(Math.random() * 5) + 1,
    appId: `app-${i}`,
    appIconUrl: `https://picsum.photos/80?random=${i}`,
    websiteUrl: '#',
    protocol: i % 2 === 0 ? 'aocomputer' : 'arweave'
}));

const fetchDApps = async (
    protocol: Protocol,
    category: ProjectType | 'All',
    search: string,
    page: number,
    pageSize: number = 8
): Promise<{ data: Project[]; hasMore: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const filtered = dummyDApps
        .filter(dapp => dapp.protocol === protocol)
        .filter(dapp => category === 'All' || dapp.projectType === category)
        .filter(dapp =>
            dapp.projectName.toLowerCase().includes(search.toLowerCase()) ||
            dapp.companyName.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => b.ratings - a.ratings);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        data: filtered.slice(0, end),
        hasMore: end < filtered.length
    };
};

export default function DAppsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProtocol, setSelectedProtocol] = useState<Protocol>('aocomputer');
    const [selectedCategory, setSelectedCategory] = useState<ProjectType | 'All'>('All');

    const [page, setPage] = useState(1);
    const [dapps, setDapps] = useState<Project[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDApps = async () => {
            setIsLoading(true);
            try {
                const { data, hasMore } = await fetchDApps(
                    selectedProtocol,
                    selectedCategory,
                    searchQuery,
                    1
                );
                setDapps(data);
                setHasMore(hasMore);
                setPage(1);
            } catch (error) {
                console.error('Failed to load DApps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDApps();
    }, [selectedProtocol, selectedCategory, searchQuery]);

    const loadMore = async () => {
        setIsLoading(true);
        try {
            const { data, hasMore } = await fetchDApps(
                selectedProtocol,
                selectedCategory,
                searchQuery,
                page + 1
            );
            setDapps(data);
            setHasMore(hasMore);
            setPage(p => p + 1);
        } catch (error) {
            console.error('Failed to load more DApps:', error);
        } finally {
            setIsLoading(false);
        }
    }; const filteredDApps = dummyDApps
        .filter(dapp => dapp.protocol === selectedProtocol)
        .filter(dapp => selectedCategory === 'All' || dapp.projectType === selectedCategory)
        .filter(dapp =>
            dapp.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dapp.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.ratings - a.ratings);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {/* Protocol Switch */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedProtocol('aocomputer')}
                                className={`px-4 py-2 rounded-full ${selectedProtocol === 'aocomputer'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                AO Computer
                            </button>
                            <button
                                onClick={() => setSelectedProtocol('arweave')}
                                className={`px-4 py-2 rounded-full ${selectedProtocol === 'arweave'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }`}
                            >
                                Arweave
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-xl">
                            <input
                                type="text"
                                placeholder="Search DApps..."
                                className="w-full pl-10 pr-4 py-2 border rounded-full bg-white dark:bg-gray-700 text-gray-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as ProjectType | 'All')}
                                className="pl-10 pr-4 py-2 border rounded-full bg-white dark:bg-gray-700 text-gray-300"
                            >
                                <option value="All">All Categories</option>
                                {projectTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Favorites Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Favorites</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredDApps
                            .filter(dapp => dapp.ratings === 5)
                            .slice(0, 4)
                            .map(dapp => (
                                <DAppCard key={dapp.appId} dapp={dapp} />
                            ))}
                    </div>
                </section>

                {/* Top DApps Section */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Top DApps</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dapps.map(dapp => (
                            <DAppCard key={dapp.appId} dapp={dapp} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={loadMore}
                                disabled={isLoading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}