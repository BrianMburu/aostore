'use client'

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "lucide-react";

interface StatePaginationControlsProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function StatePaginationControls({
    totalPages,
    currentPage,
    onPageChange,
}: StatePaginationControlsProps) {
    return (
        <div className="flex items-center justify-between mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 disabled:opacity-50"
            >
                <ChevronLeftIcon className="h-6 w-6" />
            </button>

            <span className="text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 disabled:opacity-50"
            >
                <ChevronRightIcon className="h-6 w-6" />
            </button>
        </div>
    );
}
