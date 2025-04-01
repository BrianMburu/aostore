"use client";

// components/Header.tsx
import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProfileDropdown } from "./ProfileDropdown";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import { AnimatedButton } from "../animations/AnimatedButton";
import Loader from "../Loader";
import { ProfileIconSkeleton } from "./skeletons/ProfileIconSkeleton";
// import { NotificationIconSkeleton } from "./NotificationIcon";

// import  {Bars3Icon} from '@heroicons/react/24/outline';

interface NavLink {
    href: string;
    label: string;
}

const Header: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();

    const { user, isLoading: verifyingSession, isConnected, login, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const navigation: NavLink[] = [
        // { href: '/games', label: 'Games' },
        { href: "/dapps", label: "Dapps" },
        // { href: "/airdrops", label: "Airdrops" },
        { href: "/about", label: "About" },
        // { href: '/decentralized', label: 'Decentralized' },
        // { href: '/dao', label: 'DAO Verified' },
    ];

    const handleConnectWallet = async () => {
        setIsLoading(true);
        try {
            // Replace with actual wallet connection logic
            await login();

            toast.success("Wallet connected successfully");
        } catch (error) {
            toast.error("Wallet connection failed");
            console.error("Connection error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setIsDisconnecting(true);
        try {
            logout();

            toast.success("Wallet disconnected successfully");
        } catch (error) {
            toast.error("Error disconnecting wallet");
            console.error("Disconnection error:", error);
        } finally {
            setIsDisconnecting(false);
        }
    };

    return (
        <header className="border-b sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Left Section - Logo and Navigation */}
                    <div className="flex items-center space-x-10">
                        <AnimatedButton
                            onClick={() => router.push("/")}
                            className="flex-shrink-0"
                        >
                            <Image
                                className="dark:invert"
                                src="/AO.svg"
                                alt="AOStore logo"
                                width={35}
                                height={35}
                                priority
                            />
                            {/* <span className="text-2xl font-bold text-indigo-600">AOStore</span> */}
                        </AnimatedButton>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-6">
                            {navigation.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                        "px-2 py-1 rounded-md transition-colors duration-200 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400",
                                        pathname.includes(link.href)
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-700"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Wallet and Connect */}
                    <div className="flex items-center space-x-4">
                        {/* <NotificationIconSkeleton /> */}
                        {
                            verifyingSession ?
                                <ProfileIconSkeleton />
                                : user ? (
                                    <ProfileDropdown
                                        address={user!.walletAddress}
                                        onDisconnect={handleDisconnect}
                                        isDisconnecting={isDisconnecting}
                                    />
                                ) : (
                                    <AnimatedButton
                                        onClick={handleConnectWallet}
                                        disabled={isLoading}
                                        className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader />
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign in"
                                        )}
                                    </AnimatedButton>
                                )}

                        {/* Mobile Menu Button */}
                        <AnimatedButton
                            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </AnimatedButton>
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

                            <AnimatedButton
                                onClick={
                                    isConnected
                                        ? handleDisconnect
                                        : handleConnectWallet
                                }
                                disabled={isLoading || isDisconnecting}
                                className="w-full mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isConnected
                                    ? isDisconnecting
                                        ? "Signing out..."
                                        : "Sign out"
                                    : isLoading
                                        ? "Signing in..."
                                        : "Sign in"}
                            </AnimatedButton>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};
export default Header;
