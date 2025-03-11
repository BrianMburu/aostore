'use client'

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TypeToggle } from "./TypeToggle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FeatureRequestFilter() {
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
        <div className="flex flex-col md:flex-row items-center gap-4">
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
            <TypeToggle />
        </div>
    )
}