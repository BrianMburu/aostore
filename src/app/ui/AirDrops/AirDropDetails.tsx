'use client'

import { useAuth } from "@/context/AuthContext";
import { AirdropService } from "@/services/ao/airdropService";
import { Airdrop } from "@/types/airDrop";
import { CheckBadgeIcon, ClockIcon, CurrencyDollarIcon, DocumentTextIcon, FingerPrintIcon, UserGroupIcon, UserIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import AirdropDetailsSkeleton from "./AirdropsDetailsSkeleton";
import toast from "react-hot-toast";
import ProfileImage from "../ProfilePic";
import { applyPrecision } from "@/utils/ao";

export default function AirdropDetails({ appId, airdropId }: { appId: string, airdropId: string }) {
    const [showAllReceivers, setShowAllReceivers] = useState(false);
    const [airdrop, setAirdrop] = useState<Airdrop | null>(null);
    const [fetching, setIsFetching] = useState<boolean>(true);

    const { isConnected } = useAuth()
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const [walletInput, setWalletInput] = useState('');
    const [isEligible, setIsEligible] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const airdrop = await AirdropService.fetchAirdrop(appId, airdropId);
                if (!airdrop) notFound();

                setAirdrop(airdrop);

            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false)
            }
        };
        fetchData();
    }, [appId, airdropId, isConnected]);


    if (fetching) {
        return (<AirdropDetailsSkeleton />)
    }
    if (!airdrop) {
        return notFound()
    }
    const checkEligibility = () => {
        const isValid = walletInput !== "" && airdrop?.airdropsReceivers.includes(walletInput);
        setIsEligible(isValid);

        if (isValid) {
            toast.success('This wallet is eligible for the airdrop!');
        } else {
            toast.error('Wallet not found in eligible addresses');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            >
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
                        <ProfileImage imgUrl={airdrop.appIconUrl} alt={airdrop.title} className={"h-8 w-8"} />
                        {/* <RocketLaunchIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" /> */}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {airdrop.title}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${airdrop.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : airdrop.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            }`}>
                            {airdrop.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={airdrop.status !== 'pending'}
                    className={`px-6 py-3 rounded-lg font-medium ${airdrop.status === 'pending'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {airdrop.status === 'completed' ? 'Already Claimed' :
                        airdrop.status === 'expired' ? 'Airdrop Expired' :
                            'Claim Your Tokens 🎉'}
                </motion.button> */}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Description Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <DocumentTextIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Description</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {airdrop.description}
                    </p>
                </motion.div>

                {/* Details Grid */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">Token Amount</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {applyPrecision(airdrop.amount, airdrop.tokenDenomination || 1)} Tokens
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ClockIcon className="h-6 w-6 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">Expires</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {timeFormatter.format(airdrop.endTime)}
                                    </p>
                                </div>
                            </div>
                            {/* New User ID Field */}
                            <div className="flex items-center gap-3">
                                <UserIcon className="h-6 w-6 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">User ID</p>
                                    <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                                        {airdrop.owner}
                                    </p>
                                </div>
                            </div>

                            {/* New Token ID Field */}
                            <div className="flex items-center gap-3">
                                <FingerPrintIcon className="h-6 w-6 text-purple-500" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">Token ID</p>
                                    <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                                        {airdrop.tokenId}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    {/* Eligibility Check Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Eligibility Checker
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter wallet address"
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-400"
                                value={walletInput}
                                onChange={(e) => setWalletInput(e.target.value)}
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={checkEligibility}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg w-full hover:bg-indigo-700"
                            >
                                Check Eligibility
                            </motion.button>

                            {isEligible !== null && (
                                <div className={`flex items-center gap-2 p-3 rounded-lg ${isEligible
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                                    }`}>
                                    {isEligible ? (
                                        <CheckBadgeIcon className="h-5 w-5" />
                                    ) : (
                                        <XCircleIcon className="h-5 w-5" />
                                    )}
                                    <span>
                                        {isEligible
                                            ? 'This wallet is eligible! 🎉'
                                            : 'Wallet not eligible for this airdrop'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Receivers Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <UserGroupIcon className="h-6 w-6 text-blue-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Eligible Wallets ({Object.values(airdrop.verifiedParticipants).length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                            {Object.keys(airdrop.verifiedParticipants)
                                .slice(0, showAllReceivers ? undefined : 4)
                                .map((receiver, index) => (
                                    <div
                                        key={index}
                                        className="p-2 bg-gray-50 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-md text-sm font-mono truncate"
                                    >
                                        {receiver}
                                    </div>
                                ))}
                        </div>
                        {airdrop.airdropsReceivers.length > 4 && (
                            <button
                                onClick={() => setShowAllReceivers(!showAllReceivers)}
                                className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
                            >
                                {showAllReceivers ? 'Show Less' : 'Show All...'}
                            </button>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Timeline Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 border-t pt-8"
            >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Airdrop Timeline</h2>
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full" />
                            <p className="text-sm text-gray-500 dark:text-gray-300">Published</p>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {timeFormatter.format(airdrop.startTime)}
                        </p>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-2 w-2 bg-purple-500 rounded-full" />
                            <p className="text-sm text-gray-500 dark:text-gray-300">Expiry Date</p>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {timeFormatter.format(airdrop?.endTime)}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div >
    )
}