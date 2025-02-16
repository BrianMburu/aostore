'use client'

// import { useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export function TypeToggle() {
    // const [type, setType] = useState<'feature' | 'bug'>('feature')

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleToggle = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) params.set(name, value)
        else params.delete(name)
        router.replace(`${pathname}?${params.toString()}`)
    }

    // useEffect(() => {
    //     handleToggle('type', 'feature')
    // }, [])
    return (
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
                onClick={() => handleToggle('type', 'feature')}
                className={`px-4 py-2 rounded-md text-sm ${searchParams.get('type') === 'feature'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
            >
                Feature Requests
            </button>
            <button
                onClick={() => handleToggle('type', 'bug')}
                className={`px-4 py-2 rounded-md text-sm ${searchParams.get('type') === 'bug'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}
            >
                Bug Reports
            </button>
        </div>
    )
}