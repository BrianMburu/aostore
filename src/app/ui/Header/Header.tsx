'use client'

// components/Header.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// import  {Bars3Icon} from '@heroicons/react/24/outline';

interface NavLink {
    href: string;
    label: string;
}

const Header: React.FC = () => {
    const pathname = usePathname();

    const { user, isConnected, login, logout } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [isConnected, setIsConnected] = useState(user ? true : false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    // console.log(isConnected);
    const navigation: NavLink[] = [
        // { href: '/games', label: 'Games' },
        { href: '/dapps', label: 'Dapps' },
        { href: '/airdrops', label: 'Airdrops' },
        { href: '/about', label: 'About' },
        // { href: '/decentralized', label: 'Decentralized' },
        // { href: '/dao', label: 'DAO Verified' },
    ];


    const handleConnectWallet = async () => {
        setIsLoading(true);
        try {
            // Replace with actual wallet connection logic
            await login();

            toast.success('Wallet connected successfully');
        } catch (error) {
            toast.error('Wallet connection failed');
            console.error('Connection error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setIsDisconnecting(true);
        try {
            logout();

            toast.success('Wallet disconnected successfully');
        } catch (error) {
            toast.error('Error disconnecting wallet');
            console.error('Disconnection error:', error);
        } finally {
            setIsDisconnecting(false);
        }
    };


    return (
        <header className="border-b sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Left Section - Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex-shrink-0">
                            <span className="text-2xl font-bold text-indigo-600">AOStore</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-6">
                            {navigation.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx("px-2 py-1 rounded-md transition-colors duration-200 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400",
                                        pathname.includes(link.href) ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700",
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Wallet and Connect */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <ProfileDropdown
                                address={user!.walletAddress}
                                onDisconnect={handleDisconnect}
                                isDisconnecting={isDisconnecting}
                            />
                        ) : (
                            <button
                                onClick={handleConnectWallet}
                                disabled={isLoading}
                                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="pt-4 space-y-1">
                            {navigation.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-3 py-2 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <button
                                onClick={isConnected ? handleDisconnect : handleConnectWallet}
                                disabled={isLoading || isDisconnecting}
                                className="w-full mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isConnected
                                    ? isDisconnecting
                                        ? 'Signing out...'
                                        : 'Sign out'
                                    : isLoading
                                        ? 'Signing in...'
                                        : 'Sign in'}
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>

    );
}
export default Header;