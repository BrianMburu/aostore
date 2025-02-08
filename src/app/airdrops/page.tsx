'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { AppAirdropData } from '@/types/airDrop';
import { AirdropCard } from '../ui/AirDrops/AirDropCard';
import { AirdropSkeleton } from '../ui/AirDrops/AirdropsSkeleton';
import { aoAirdropService } from '@/services/ao/airdropService';

export default function AirdropsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [airdrops, setAirdrops] = useState<AppAirdropData[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const currentPage = Number(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('search') || '';
    const sortBy = (searchParams.get('sort') as 'publishTime' | 'expiryTime') || 'publishTime';

    useEffect(() => {
        const loadAirdrops = async () => {
            setIsLoading(true);
            try {
                const { data, total } = await aoAirdropService.fetchAirdrops({
                    search: searchQuery,
                    sort: sortBy,
                    page: currentPage.toString()
                });
                setAirdrops(data);
                setTotalPages(Math.ceil(total / 12));
            } catch (error) {
                console.error('Failed to load airdrops:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAirdrops();
    }, [searchQuery, sortBy, currentPage]);

    const updateURLParams = (params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            if (value) newParams.set(key, value);
            else newParams.delete(key);
        });
        router.replace(`?${newParams.toString()}`, { scroll: false });
    };

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                >
                    🚀 Active Airdrops
                </motion.h1>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <div className="relative flex-1 max-w-xl">
                        <input
                            type="text"
                            placeholder="Search airdrops..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-300"
                            value={searchQuery}
                            onChange={(e) => {
                                updateURLParams({ search: e.target.value, page: '1' });
                            }}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>

                    <select
                        className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-300"
                        value={sortBy}
                        onChange={(e) => updateURLParams({ sort: e.target.value })}
                    >
                        <option value="publishTime">Sort by Publish Date</option>
                        <option value="expiryTime">Sort by Expiry Date</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <AirdropSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {airdrops.map(airdrop => (
                        <AirdropCard
                            key={airdrop.airdropId}
                            airdrop={airdrop}
                            timeFormatter={timeFormatter}
                        />
                    ))}
                </div>
            )}

            <div className="flex justify-center items-center gap-4">
                <button
                    onClick={() => updateURLParams({ page: Math.max(1, currentPage - 1).toString() })}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 disabled:opacity-50"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>

                <span className="text-gray-600 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => updateURLParams({ page: Math.min(totalPages, currentPage + 1).toString() })}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 disabled:opacity-50"
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}