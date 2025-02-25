import { AppData } from "@/types/dapp"
import { ArrowUpTrayIcon, StarIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { AnimatedButton } from "../animations/AnimatedButton"
import { BookHeartIcon } from "lucide-react"

export default function DappHeader({ appData }: { appData: AppData }) {
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
                        {appData.appName}
                    </h1>
                    <AnimatedButton className="p-1">
                        <BookHeartIcon
                            className={`h-7 w-7 text-gray-300 dark:text-gray-600`}
                        />
                    </AnimatedButton>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {appData.companyName}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                className={`h-5 w-5 ${i < appData.ratings ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            />
                        ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300">
                        {appData.totalRatings} reviews
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm ">
                        {appData.projectType}
                    </span>
                </div>
                <div className="flex space-x-8">

                    <a
                        href={appData.websiteUrl}
                        className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                    >
                        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                        Visit Website
                    </a>
                </div>

            </div>
        </div>
    )
}