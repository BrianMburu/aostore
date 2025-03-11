'use client'

import { messageTypes } from '@/types/message'
import { capitalizeFirstLetter } from '@/utils/message'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export function MessageFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleFilter = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(name, value)
        else params.delete(name)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 w-full md:max-w-sm">
                <input
                    type="text"
                    placeholder="Search messages..."
                    className="pl-10 w-full pr-4 border rounded-lg bg-white dark:bg-gray-800 dark:text-white rounded p-2 text-sm"
                    onChange={(e) => handleFilter('search', e.target.value)}
                    defaultValue={searchParams.get('search')?.toString()}
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />

            </div>

            <select
                className="border rounded-lg bg-white dark:bg-gray-800 dark:text-white rounded p-2 text-sm"
                onChange={(e) => handleFilter('type', e.target.value)}
                defaultValue={searchParams.get('type')?.toString()}
            >
                <option value="">All Types</option>
                {messageTypes.map(opt => (
                    <option key={opt.key} value={opt.value}>
                        {capitalizeFirstLetter(opt.value)}
                    </option>
                ))}
            </select>

        </div>
    )
}