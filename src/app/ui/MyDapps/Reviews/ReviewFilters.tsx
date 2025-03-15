// app/mydapps/[appId]/reviews/ReviewsFilters.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from "react"

export default function ReviewsFilters() {
    const [selectedRating, setSelectedRating] = useState('')
    const [sortBy, setSortBy] = useState('latest')
    const router = useRouter()
    const pathname = usePathname()

    const handleFilter = (type: string, value: string) => {
        const params = new URLSearchParams(window.location.search)
        if (value) params.set(type, value)
        else params.delete(type)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="flex items-center gap-4">
            <select
                value={sortBy}
                onChange={(e) => {
                    setSortBy(e.target.value)
                    handleFilter('sort', e.target.value)
                }}
                className="dark:bg-gray-800 dark:text-white rounded p-2 text-sm"
            >
                <option value="latest">Newest First</option>
                <option value="mostHelpful">Most Helpful</option>
            </select>

            <select
                value={selectedRating}
                onChange={(e) => {
                    setSelectedRating(e.target.value)
                    handleFilter('rating', e.target.value)
                }}
                className="dark:bg-gray-800 dark:text-white rounded p-2 text-sm"
            >
                <option value="">All Ratings</option>
                <option value="5">★★★★★</option>
                <option value="4">★★★★☆</option>
                <option value="3">★★★☆☆</option>
                <option value="2">★★☆☆☆</option>
                <option value="1">★☆☆☆☆</option>
            </select>
        </div>
    )
}