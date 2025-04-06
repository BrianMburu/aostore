import React from "react"
import { Dapp } from "@/types/dapp"
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { AnimatedButton } from "../animations/AnimatedButton"
import { BookHeartIcon } from "lucide-react"
import { RatingStars } from "./RatingStars"
import { DAppService } from "@/services/ao/dappService"
import toast from "react-hot-toast"
import { capitalizeFirstLetter } from "@/utils/message"
import Link from "next/link"

export function DappHeader({ appData }: { appData: Dapp }) {
    const addToFavorites = async () => {

        try {
            await DAppService.addDappToFavorites(appData.appId);
            toast.success("Dapp successfully added to Favorites.")
        } catch (error) {
            console.error(error);
            toast.error("Failed to add App to favorites!")

        }

    }

    return (
        <div className="flex flex-col md:flex-row gap-8 mb-8">
            <Image
                src={appData.appIconUrl}
                alt={appData.appName}
                width={160}
                height={160}
                className="w-32 h-32 rounded-2xl"
            />
            <div className="flex-1">
                <div className="flex space-x-4 items-center mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white ">
                        {capitalizeFirstLetter(appData.appName)}
                    </h1>
                    <AnimatedButton className="p-1" onClick={addToFavorites}>
                        <BookHeartIcon
                            className={`h-7 w-7 text-gray-300 dark:text-gray-600`}
                        />
                    </AnimatedButton>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {appData.companyName}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <RatingStars appId={appData.appId} />
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm ">
                        {appData.projectType}
                    </span>
                </div>
                <div className="flex space-x-8">
                    <Link
                        href={appData.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                    >
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        Visit Website
                    </Link>
                </div>

            </div>
        </div>
    )
}
export default React.memo(DappHeader);