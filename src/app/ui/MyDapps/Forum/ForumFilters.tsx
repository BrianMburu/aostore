// app/mydapps/[appId]/forum/ForumFilters.tsx
'use client'

import { updateOptions } from '@/types/forum'
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export function ForumFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleFilter = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(name, value)
        else params.delete(name)
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 w-full md:max-w-sm">
                <input
                    type="text"
                    placeholder="Search questions..."
                    className="pl-10 w-full pr-4 border rounded-lg bg-white dark:bg-gray-800 dark:text-white rounded p-2 text-sm"
                    onChange={(e) => handleFilter('search', e.target.value)}
                    defaultValue={searchParams.get('search')?.toString()}
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />

            </div>

            <select
                className="border rounded-lg bg-white dark:bg-gray-800 dark:text-white rounded p-2 text-sm"
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
        </div>
    )
}