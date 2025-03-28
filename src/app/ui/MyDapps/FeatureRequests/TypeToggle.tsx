'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export function TypeToggle() {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleToggle = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(name, value)
        else params.delete(name)
        router.replace(`${pathname}?${params.toString()}`)
    }
    return (
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
                onClick={() => handleToggle('type', 'feature')}
                className={`px-4 py-2 rounded-md text-sm ${searchParams.get('type') === 'feature' || !searchParams.get('type')
                    ? 'text-green-700 rounded-full hover:bg-green-200 dark:bg-green-900 dark:text-green-100 shadow-sm '
                    : 'text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-500'
                    }`}
            >
                Feature Requests
            </button>
            <button
                onClick={() => handleToggle('type', 'bug')}
                className={`px-4 py-2 rounded-md text-sm ${searchParams.get('type') === 'bug'
                    ? 'bg-red-100 text-red-700 rounded-full hover:bg-red-200 dark:bg-red-900 dark:text-red-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-900 dark:hover:text-red-500'
                    }`}
            >
                Bug Reports
            </button>
        </div>
    )
}