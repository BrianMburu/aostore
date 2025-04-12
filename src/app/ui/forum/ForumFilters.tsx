'use client'
import useDebounce from "@/hooks/useDebounce";
import { updateOptions } from "@/types/forum";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export function ForumFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

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
        const params = new URLSearchParams(searchParams)
        if (value) params.set(name, value)
        else params.delete(name)
        router.replace(`${pathname}?${params.toString()}`)
    }
    return (
        <div className="flex flex-col md:flex-row  justify-end gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
                <input
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onChange={(e) => setFilterInput(e.target.value)}
                    value={filterInput}
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />
            </div>

            <select
                className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                onChange={(e) => handleFilter('topic', e.target.value)}
                defaultValue={searchParams.get('topic')?.toString()}
            >
                <option value="">All Topics</option>
                {updateOptions.map(opt => (
                    <option key={opt.key} value={opt.value}>
                        {opt.value}
                    </option>
                ))}
            </select>

            <select
                className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                onChange={(e) => handleFilter('sort', e.target.value)}
                defaultValue={searchParams.get('sort')?.toString()}
            >
                <option value="latest">Latest</option>
                <option value="top">Top Posts</option>
            </select>
        </div>
    )
}