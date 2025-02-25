'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import { projectTypes } from '@/types/dapp';
import { MagnifyingGlassIcon, AdjustmentsVerticalIcon, FunnelIcon } from '@heroicons/react/24/outline';

export function DAppFilter() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

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
        <div className='bg-white dark:bg-gray-800 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-center'>
                        <div className="relative flex flex-1 max-w-2xl">
                            <input
                                type="text"
                                placeholder="Search DApps..."
                                className="w-full pl-10 pr-4 py-2 border rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                defaultValue={searchParams.get('search')?.toString()}
                                onChange={(e) => handleFilter('search', e.target.value)}
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-2xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                defaultValue={searchParams.get('protocol')?.toString()}
                                onChange={(e) => handleFilter('protocol', e.target.value)}
                            >
                                <option value="all">All Protocols</option>
                                <option value="aocomputer">AO Computer</option>
                                <option value="arweave">Arweave</option>
                            </select>
                            <AdjustmentsVerticalIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-2xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                defaultValue={searchParams.get('category')?.toString()}
                                onChange={(e) => handleFilter('category', e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {projectTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <AdjustmentsVerticalIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>

                        <div className="relative">
                            <select
                                className="w-full pl-10 pr-4 py-2 border rounded-2xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                defaultValue={searchParams.get('verified')?.toString()} //value={filters.verified}
                                onChange={(e) => handleFilter('verified', e.target.value)} //onChange={e => setFilters({ ...filters, verified: e.target.value })}//
                            >
                                <option value="all">All Statuses</option>
                                <option value="verified">Verified</option>
                                <option value="unverified">Unverified</option>
                            </select>
                            <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}