// components/Web3ProfileDropdown.tsx
import { Fragment } from 'react';
import { Menu, Transition, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Link from 'next/link';
import {
    DocumentDuplicateIcon,
    Cog6ToothIcon,
    InboxArrowDownIcon,
    ArrowLeftStartOnRectangleIcon,
    CubeIcon,
    // UserCircleIcon
} from '@heroicons/react/24/outline';
import { Wallet } from 'lucide-react';

import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import ProfileImage from '../ProfilePic';

interface ProfileDropdownProps {
    address: string;
    onDisconnect: () => void;
    isDisconnecting: boolean;
}

export function ProfileDropdown({ address, onDisconnect, isDisconnecting }: ProfileDropdownProps) {
    const { user } = useAuth();
    const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(address);
            toast.success('Address copied to clipboard!');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error('Failed to copy address');
        }
    };

    const handleDisconnect = async () => {
        try {
            await onDisconnect();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error('Error disconnecting wallet');
        }
    };

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <MenuButton className="relative flex rounded-full bg-gray-100 dark:bg-gray-700 p-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <ProfileImage imgUrl={user?.avatar || ''} alt={user?.username || ""} className={'h-8 w-8'} />
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
                <MenuItems className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {/* Wallet Address Section */}
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Connected Wallet</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{shortenedAddress}</span>
                            <button
                                onClick={copyToClipboard}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title="Copy address"
                            >
                                <DocumentDuplicateIcon className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="px-2">
                        <MenuItem as={Fragment}>
                            {({ active }) => (
                                <Link
                                    href="/wallet"
                                    className={`flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${active
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : 'bg-transparent'
                                        } text-gray-700 dark:text-gray-200`}
                                >
                                    <Wallet className="h-5 w-5 mr-2" />
                                    My Wallet
                                </Link>
                            )}
                        </MenuItem>

                        <MenuItem as={Fragment}>
                            {({ active }) => (
                                <Link
                                    href="/messages"
                                    className={`flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${active
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : 'bg-transparent'
                                        } text-gray-700 dark:text-gray-200`}
                                >
                                    <InboxArrowDownIcon className="h-5 w-5 mr-2" />
                                    Messages
                                </Link>
                            )}
                        </MenuItem>

                        <MenuItem as={Fragment}>
                            {({ active }) => (
                                <Link
                                    href="/settings"
                                    className={`flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${active
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : 'bg-transparent'
                                        } text-gray-700 dark:text-gray-200`}
                                >
                                    <Cog6ToothIcon className="h-5 w-5 mr-2" />
                                    Settings
                                </Link>
                            )}
                        </MenuItem>

                        <MenuItem as={Fragment}>
                            {({ active }) => (
                                <Link
                                    href="/mydapps"
                                    className={`flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${active
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : 'bg-transparent'
                                        } text-gray-700 dark:text-gray-200`}
                                >
                                    <CubeIcon className="h-5 w-5 mr-2" />
                                    My DApps
                                </Link>
                            )}
                        </MenuItem>

                        <MenuItem as={Fragment}>
                            {({ active }) => (
                                <button
                                    onClick={handleDisconnect}
                                    disabled={isDisconnecting}
                                    className={`flex w-full items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${active
                                        ? 'bg-gray-100 dark:bg-gray-700'
                                        : 'bg-transparent'
                                        } text-red-600 dark:text-red-500`}
                                >
                                    <ArrowLeftStartOnRectangleIcon className="h-5 w-5 mr-2" />
                                    {isDisconnecting ? 'Signing out...' : 'Sign out'}
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
}