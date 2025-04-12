'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import { projectTypes } from '@/types/dapp';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';

export function DAppFilter() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    // Initialize filter state from URL params.
    const initialFilter = searchParams.get('search') || ''
    const [filterInput, setFilterInput] = useState(initialFilter)
    // Wait for 500ms of inactivity before applying the filter.
    const debouncedFilter = useDebounce(filterInput, 500)

    // When the debounced filter changes, update the URL params.
    useEffect(() => {
        handleFilter('search', debouncedFilter)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilter])

    const handleFilter = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set(name, value);
            //reset Page
            params.delete('page');
        } else {
            params.delete(name);
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-center">
                    {/* Protocol Switch */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleFilter('protocol', 'aocomputer')}
                            className={`px-4 py-2 rounded-full ${searchParams.get('protocol') === 'aocomputer'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                        >
                            AO Computer
                        </button>
                        <button
                            onClick={() => handleFilter('protocol', 'arweave')}
                            className={`px-4 py-2 rounded-full ${searchParams.get('protocol') === 'arweave'
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
                            value={filterInput}
                            onChange={(e) => setFilterInput(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            defaultValue={searchParams.get('category')?.toString()}
                            onChange={(e) => handleFilter('category', e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-full bg-white dark:bg-gray-700 text-gray-300"
                        >
                            <option value="all">All Categories</option>
                            {projectTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>
            </div>
        </div>

    );
}