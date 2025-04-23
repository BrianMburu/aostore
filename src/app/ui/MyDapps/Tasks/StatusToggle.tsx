'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export function StatusToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentStatus = searchParams.get('status')

    const handleToggle = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(name, value)
        else params.delete(name)
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="inline-flex p-1 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-inner">
            <button
                onClick={() => handleToggle('status', 'Pending')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 
          ${currentStatus === 'Pending'
                        ? 'bg-yellow-500 text-white dark:bg-yellow-400 dark:text-gray-900 font-semibold shadow-md ring-1 ring-yellow-600 dark:ring-yellow-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-600/30'
                    }`}
            >
                Pending
            </button>
            <button
                onClick={() => handleToggle('status', 'Completed')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 
          ${currentStatus === 'Completed' || !currentStatus
                        ? 'bg-green-600 text-white dark:bg-green-500 dark:text-gray-900 font-semibold shadow-md ring-1 ring-green-700 dark:ring-green-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-600/30'
                    }`}
            >
                Completed
            </button>
        </div>
    )
}
