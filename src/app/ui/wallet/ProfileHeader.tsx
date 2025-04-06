'use client'

import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import ProfileImage from "../ProfilePic";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRank } from "@/context/RankContext";
import { capitalizeFirstLetter } from "@/utils/message";

export function ProfileHeader() {
    const { user } = useAuth();
    const { rank } = useRank();

    const shortenedAddress = `${user?.walletAddress.slice(0, 6)}...${user?.walletAddress.slice(-4)}`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(user?.walletAddress || "")
            toast.success('Address copied to clipboard!')
        } catch {
            toast.error('Failed to copy address')
        }
    }
    return (
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex justify-center items-center gap-4'>
                <ProfileImage
                    imgUrl={user?.avatar || ""}
                    alt={user?.username || ""}
                    className='h-16 w-16 rounded-lg border-2 border-indigo-100 dark:border-gray-700'
                />

                <div className='space-y-1'>
                    <h1 className='text-xl font-semibold dark:text-white'>{capitalizeFirstLetter(user?.username || "")}</h1>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm bg-indigo-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded-md'>
                            {rank.rank}: {rank.points} pts
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
                <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                    {shortenedAddress}
                </span>
                <button
                    onClick={copyToClipboard}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                    title="Copy address"
                >
                    <DocumentDuplicateIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
            </div>
        </div>
    )
}