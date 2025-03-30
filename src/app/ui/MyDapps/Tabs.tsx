// components/Tabs.tsx
'use client';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import { Menu, MenuItems, MenuButton, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const tabs = [
    { name: 'Settings', href: '' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Forum', href: '/forum' },
    { name: 'Feature Requests', href: '/feature-requests' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Messages', href: '/messages' },
    { name: 'Airdrops', href: '/airdrops' },
    { name: 'Tasks', href: '/tasks' },
];

export function DesktopTabs() {
    const pathname = usePathname();
    const params = useParams();
    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={`/mydapps/${params.appId}${tab.href}`}
                        className={`px-1 py-4 border-b-2 font-medium text-sm ${pathname === `/mydapps/${params.appId}${tab.href}`
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export function MobileTabs() {
    const pathname = usePathname();
    const params = useParams();

    const currentTab = tabs.find(tab => tab.href === pathname) || tabs[0];

    return (
        <Menu as="div" className="relative w-full">
            <div>
                <MenuButton className="flex w-full items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 dark:text-white">
                    <span className="font-medium dark:text-white">{currentTab.name}</span>
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                </MenuButton>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {tabs.map((tab) => (
                            <MenuItems key={tab.name}>
                                {({ }) => (
                                    <Link
                                        href={`/mydapps/${params.appId}${tab.href}`}
                                        className={`block px-4 py-2 text-sm ${pathname === `/mydapps/${params.appId}${tab.href}`
                                            ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200'
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {tab.name}
                                    </Link>
                                )}
                            </MenuItems>
                        ))}
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
}