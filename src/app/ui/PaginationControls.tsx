// app/mydapps/PaginationControls.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function PaginationControls({
    totalPages,
    paramName
}: {
    paramName?: string
    totalPages: number
}) {

    const pathname = usePathname();
    const pageName = paramName ? paramName : 'page'

    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get(pageName)) || 1;
    const { replace } = useRouter()

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);

        if (pageNumber) {
            params.set(pageName, pageNumber.toString());
            replace(`${pathname}?${params.toString()}`);
        } else {
            params.delete(pageName)
        }
    };

    return (
        <div className="flex items-center justify-between mt-8">
            <button
                onClick={() => createPageURL(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                aria-label="Previous page"
            >
                Previous
            </button>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                </span>
                <select
                    value={currentPage}
                    onChange={(e) => createPageURL(Number(e.target.value))}
                    className="dark:bg-gray-800 dark:text-white rounded py-2 pl-2 pr-7 flex justify between text-xs"
                    aria-label="Select page"
                >
                    {Array.from({ length: totalPages }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={() => createPageURL(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    )
}

{/* <div className="flex justify-center items-center gap-4">
    <button
        onClick={() => updateURLParams({ page: Math.max(1, currentPage - 1).toString() })}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 disabled:opacity-50"
    >
        <ChevronLeftIcon className="h-6 w-6" />
    </button>

    <span className="text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
    </span>

    <button
        onClick={() => updateURLParams({ page: Math.min(totalPages, currentPage + 1).toString() })}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 disabled:opacity-50"
    >
        <ChevronRightIcon className="h-6 w-6" />
    </button>
</div> */}