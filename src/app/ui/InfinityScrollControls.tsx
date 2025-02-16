// app/mydapps/PaginationControls.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function InfinityScrollControls({
    totalPages,
}: {
    totalPages: number
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const router = useRouter();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);

        if (pageNumber) {
            params.set('page', pageNumber.toString());
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } else {
            params.delete('page');
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    return (
        <div className="mt-8 flex justify-center">
            <button
                onClick={() => createPageURL(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                aria-label="Next page"
            >
                Load More
            </button>
        </div>
    )
}
