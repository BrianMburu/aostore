'use client'

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AirDropsFilter() {
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="relative flex-1 max-w-xl">
                <input
                    type="text"
                    placeholder="Search airdrops..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-300"
                    defaultValue={searchParams.get('search')?.toString()}
                    onChange={(e) => handleFilter('search', e.target.value)}
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <select
                className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-300"
                defaultValue={searchParams.get('sort')?.toString()}
                onChange={(e) => handleFilter('sort', e.target.value)}
            >
                <option value="publishTime">Sort by Publish Date</option>
                <option value="expiryTime">Sort by Expiry Date</option>
            </select>
        </div>
    )
}