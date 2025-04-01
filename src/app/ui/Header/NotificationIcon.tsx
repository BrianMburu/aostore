// app/components/ui/NotificationIcon.tsx
'use client'

import { useEffect, useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { aoMessageService } from '@/services/ao/messageService'

export function NotificationIcon() {
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true)
                // Replace with your actual API endpoint
                const messageTotal = await aoMessageService.getTotalUnreadMessages();
                setUnreadCount(messageTotal)
            } catch (error) {
                console.error('Error fetching notifications:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
        const interval = setInterval(fetchNotifications, 300000) // Refresh every 300 seconds
        return () => clearInterval(interval)
    }, [])

    if (loading) return <NotificationIconSkeleton />

    return (
        <div className="relative">
            <BellIcon className="h-6 w-6 text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors" />
            {unreadCount > 0 && (
                <span
                    className={clsx(
                        "absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full",
                        "bg-red-500 text-xs text-white font-medium",
                        "animate-ping-once"
                    )}
                    aria-label={`${unreadCount} unread notifications`}
                >
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </div>
    )
}

export function NotificationIconSkeleton() {
    return (
        <div className="relative animate-pulse">
            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
    )
}
