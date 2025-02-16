// app/mydapps/layout.tsx
import { Suspense } from 'react';
import { MobileTabs, DesktopTabs } from '@/app/ui/MyDapps/Tabs';
import Link from 'next/link';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
// import { LoadingSkeleton } from '@/app/ui/MyDapps/LoadingSkeleton';

export default function MyDAppsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/mydapps" className="flex items-center text-indigo-600 dark:text-indigo-400">
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to my DApps
                    </Link>
                </div>
            </header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                {/* Mobile Tabs */}
                <div className="sm:hidden">
                    <MobileTabs />
                </div>

                {/* Desktop Tabs */}
                <div className="hidden sm:block">
                    <DesktopTabs />
                </div>

                {/* Main Content with Loading State */}
                <div className="py-8">
                    <Suspense fallback={<LayoutSkeleton />}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

function LayoutSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                ))}
            </div>
        </div>
    )
}