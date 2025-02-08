// app/apps/[appId]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation'

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    StarIcon, ChevronLeftIcon, ArrowUpTrayIcon, ChatBubbleLeftIcon,
    GiftIcon, LightBulbIcon, BugAntIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';
import 'swiper/css';

import { AppData, Review } from '@/types/dapp';
import DAppCard from '@/app/ui/Dapps/DappCard';
import DappReviewForm from '@/app/ui/Dapps/DappReviewForm';
import DappReviews from '@/app/ui/Dapps/DappReviews';
import { DappDetailsSkeleton } from '@/app/ui/Dapps/DappDetailsSkeleton';
import { AppAirdropData } from '@/types/airDrop';
import DappSupport from '@/app/ui/Dapps/DappSupport';

const dummyAppData: AppData = {
    appName: "AO Social",
    companyName: "AO Foundation",
    websiteUrl: "#",
    projectType: "Social",
    appIconUrl: "https://picsum.photos/200",
    coverUrl: "https://picsum.photos/1600/900",
    description: "A decentralized social platform built on AO Computer protocol...".repeat(5),
    ratings: 4.5,
    appId: "ao-social",
    bannerUrls: {
        main: ["https://picsum.photos/1200/600", "https://picsum.photos/1200/601", "https://picsum.photos/1200/602", "https://picsum.photos/1200/603"],
    },
    createdTime: Date.now() - 86400000 * 30,
    protocol: "aocomputer",
    totalRatings: 245

    // ... other fields
};

const dummyReviews: Review[] = Array.from({ length: 10 }, (_, i) => ({
    reviewId: `rev-${i}`,
    username: `user${i}`,
    comment: "This is an amazing decentralized social platform!".repeat(2),
    rating: Math.floor(Math.random() * 5) + 1,
    timestamp: Date.now() - 86400000 * i,
    upvotes: Math.floor(Math.random() * 100),
    downvotes: Math.floor(Math.random() * 20),
    helpfulVotes: Math.floor(Math.random() * 50),
    replies: [],
    // ... other fields
}));

const dummyAirdrops: AppAirdropData[] = Array.from({ length: 4 }, (_, i) => ({
    airdropId: `airdrop-${i}`,
    title: `Social Airdrop #${i + 1}`,
    appname: `AO Social - ${i}`,
    amount: 1000 * (i + 1),
    publishTime: Date.now() - 86400000 * 3,
    expiryTime: Date.now() + 86400000 * (i + 7),
    status: ['active', 'expired', 'claimed'][i % 3] as 'active' | 'expired' | 'claimed'
}));

// Simulated API calls
const fetchAppDetails = async (appId: string): Promise<AppData> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { ...dummyAppData, appId };
};

const fetchReviews = async (appId: string, page: number): Promise<{ data: Review[], hasMore: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const start = (page - 1) * 5;
    return {
        data: dummyReviews.slice(start, start + 5),
        hasMore: start + 5 < dummyReviews.length
    };
};

const fetchAirDrops = async (appId: string, page: number): Promise<{ data: AppAirdropData[], hasMore: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const start = (page - 1) * 5;
    return {
        data: dummyAirdrops.slice(start, start + 5),
        hasMore: start + 5 < dummyReviews.length
    };
};

const developerInfo = {
    name: "AO Dev Team",
    contact: "dev@aosocial.com",
    website: "https://ao.dev",
    forum: "https://forum.ao.dev"
};

const dummySimilarDApps: AppData[] = Array.from({ length: 4 }, (_, i) => ({
    appName: `AO sim app ${i}`,
    companyName: "AO Foundation",
    websiteUrl: "#",
    projectType: "Social",
    appIconUrl: `https://picsum.photos/2${i}0`,
    coverUrl: "https://picsum.photos/1600/900",
    description: "A decentralized social platform built on AO Computer protocol...".repeat(5),
    ratings: 4.5,
    appId: `ao-social_${i}`,
    bannerUrls: {
        main: ["https://picsum.photos/1200/600", "https://picsum.photos/1200/601", "https://picsum.photos/1200/602", "https://picsum.photos/1200/603"],
    },
    createdTime: Date.now() - 86400000 * 30,
    protocol: "aocomputer",
    totalRatings: 245
}));

const dummyDApps = Array.from({ length: 4 }, (_, i) => ({
    appName: `AO sim app ${i}`,
    companyName: "AO Foundation",
    websiteUrl: "#",
    projectType: "Social",
    appIconUrl: `https://picsum.photos/2${i}0`,
    coverUrl: "https://picsum.photos/1600/900",
    description: "A decentralized social platform built on AO Computer protocol...".repeat(5),
    ratings: 4.5,
    appId: `ao-social_${i}`,
    bannerUrls: {
        main: ["https://picsum.photos/1200/600", "https://picsum.photos/1200/601"],
    },
    createdTime: Date.now() - 86400000 * 30,
    protocol: "aocomputer",
    totalRatings: 245
}));

export default function AppDetailsPage() {
    const [appData, setAppData] = useState<AppData | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

    const [reviews, setReviews] = useState<Review[]>([]);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);

    const [airdrops, setAirdrops] = useState<AppAirdropData[] | []>([]);

    const params = useParams();
    const appId = params.appId as string;
    console.log(appId);

    useEffect(() => {
        const loadData = async () => {
            const [appDetails, initialReviews, initialAirdrops] = await Promise.all([
                fetchAppDetails(appId),
                fetchReviews(appId, 1),
                fetchAirDrops(appId, 1)
            ]);

            setAppData(appDetails);
            setReviews(initialReviews.data);
            setAirdrops(initialAirdrops.data);
            setHasMoreReviews(initialReviews.hasMore);
        };
        loadData();
    }, [appId]);

    const statusColors = {
        active: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
        claimed: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
        expired: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/dapps" className="flex items-center text-indigo-600 dark:text-indigo-400">
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to DApps
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            {appData ?
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* App Header */}
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        <Image
                            src={appData.appIconUrl}
                            alt={appData.appName}
                            width={160}
                            height={160}
                            className="w-32 h-32 rounded-2xl"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {appData.appName}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                {appData.companyName}
                            </p>
                            <div className="flex items-center gap-4 mb-4">
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
                            <a
                                href={appData.websiteUrl}
                                className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                            >
                                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                                Visit Website
                            </a>
                        </div>
                    </div>

                    {/* Banner Carousel */}
                    <div className="mb-8">
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            freeMode={true}
                            pagination={{
                                clickable: true,
                            }}
                            className="rounded-2xl overflow-hidden mySwiper"
                        >
                            {appData.bannerUrls.main.map((url, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        src={url}
                                        alt={`Banner ${i + 1}`}
                                        width={1600}
                                        height={900}
                                        className="w-full h-96 object-cover"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`pb-4 ${activeTab === 'details' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}
                            >
                                Details
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-4 ${activeTab === 'reviews' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}
                            >
                                Reviews ({dummyReviews.length})
                            </button>
                        </div>
                    </div>

                    {activeTab === 'details' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Description & Details */}
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                                <p className={`text-gray-600 dark:text-gray-300 mb-4 ${!showFullDescription ? 'line-clamp-5' : ''}`}>
                                    {appData.description}
                                </p>
                                <button
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                >
                                    {showFullDescription ? 'Show Less' : 'Read More'}
                                </button>

                                {/* Metadata */}
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Protocol</p>
                                        <p className="text-gray-900 dark:text-white">{appData.protocol}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Released</p>
                                        <p className="text-gray-900 dark:text-white">
                                            {new Date(appData.createdTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {/* // Add new sections in the Details tab */}
                                <div className="mt-12 space-y-12">
                                    {/* Support Section */}
                                    <DappSupport developerInfo={developerInfo} />

                                    {/* Similar DApps Section */}
                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Similar DApps</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {dummySimilarDApps
                                                ?.slice(0, 4)
                                                .map(dapp => (
                                                    <DAppCard key={dapp.appId} dapp={dapp} />
                                                ))}
                                        </div>
                                    </section>

                                    {/* More from Company Section */}
                                    <section>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More from {appData.companyName}</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {dummyDApps
                                                .filter(dapp => dapp.companyName === appData.companyName)
                                                .slice(0, 4)
                                                .map(dapp => (
                                                    <DAppCard key={dapp.appId} dapp={dapp} />
                                                ))}
                                        </div>
                                    </section>

                                </div>
                            </div>

                            {/* Events & Offers */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events & Offers</h2>
                                {airdrops.map(airdrop => (
                                    // <AirdropCard key={airdrop.id} airdrop={airdrop} timeFormatter={timeFormatter} />
                                    <motion.div
                                        key={airdrop.airdropId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <GiftIcon className="h-6 w-6 text-purple-500" />
                                            <h3 className="text-lg font-semibold dark:text-white">{airdrop.title}</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">Amount</span>
                                                <span className="font-medium dark:text-gray-200">{airdrop.amount.toLocaleString()} Tokens</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">Published</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {timeFormatter.format(airdrop.publishTime)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">Expires</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {timeFormatter.format(airdrop.expiryTime)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[airdrop.status]}`}>
                                                {airdrop.status.toUpperCase()}
                                            </span>
                                            <Link
                                                href={`/airdrops/${airdrop.airdropId}`}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center"
                                            >
                                                Details <ChevronRightIcon className="h-4 w-4 ml-1" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Reviews Section */
                        <div className="space-y-8">
                            <DappReviewForm setReviews={setReviews} />

                            <DappReviews appId={appId} reviews={reviews} setReviews={setReviews} hasMore={hasMoreReviews} setHasMore={setHasMoreReviews} />
                        </div>
                    )}
                </main> : (
                    <DappDetailsSkeleton />
                )
            }
        </div>
    );
}