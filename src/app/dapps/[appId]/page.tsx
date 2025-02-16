'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams, useSearchParams } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

import { AppData } from '@/types/dapp';
import { Review } from '@/types/review';
import { DappDetailsSkeleton } from '@/app/ui/Dapps/Skeletons/DappDetailsSkeleton';
import DappBanner from '@/app/ui/Dapps/DappBanner';
import DappHeader from '@/app/ui/Dapps/DappHeader';
import { DAppService } from '@/services/ao/dappService';
import { InfoTab, ReviewsTab } from '@/app/ui/Dapps/Tabs';
import { ReviewService, ReviewSortParams } from '@/services/ao/reviewService';


export default function AppDetailsPage() {
    const [appData, setAppData] = useState<AppData | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState(0)
    const params = useParams();
    const searchParams = useSearchParams();

    const appId = params.appId as string;

    useEffect(() => {
        const loadData = async () => {
            const appDetails = await DAppService.getDApp(appId)

            if (!appDetails) {
                notFound()
            }
            setAppData(appDetails);
        };
        loadData();
    }, [appId]);

    useEffect(() => {
        const loadData = async () => {
            const filterParams: ReviewSortParams = {
                search: searchParams.get('search') || "",
                sort: searchParams.get('sort') || "",
                page: searchParams.get('page') || "",
                rating: searchParams.get('rating') || ""
            }
            const { data: reviews, total } = await ReviewService.getReviews(appId, filterParams, true)

            setTotalReviews(total)
            setReviews(reviews);
        };
        loadData();
    }, [appId, searchParams]);

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
                    <DappHeader appData={appData} />

                    {/* Banner Carousel */}
                    <DappBanner mainBannerImageUrls={appData.bannerUrls.main} />

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
                                Reviews ({totalReviews})
                            </button>
                        </div>
                    </div>

                    {activeTab === 'details' ? (
                        <InfoTab appData={appData} />
                    ) : (
                        /* Reviews Section */
                        <ReviewsTab reviews={reviews} setReviews={setReviews} totalReviews={totalReviews} />
                    )}
                </main> : (
                    <DappDetailsSkeleton />
                )
            }
        </div>
    );
}