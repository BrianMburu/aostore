import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { useAppContext } from '@/context/DappContexts';
import { BannerSkeleton } from './Skeletons/BannerSkeleton';

export default function DappBanner() {
    const { loading, appData } = useAppContext();

    if (loading) {
        return <BannerSkeleton />
    }

    if (!appData) return null;

    const mainBannerImageUrls = Object.values(appData.bannerUrls);

    return (
        <div className="mb-8">
            <Swiper
                navigation={true}
                modules={[Navigation]}
                // spaceBetween={20}
                // slidesPerView={1}
                // freeMode={true}
                // pagination={{
                //     clickable: true,
                // }}
                className="rounded-2xl overflow-hidden mySwiper"
            >
                {mainBannerImageUrls.map((url: string, i: number) => (
                    <div key={i}>
                        <SwiperSlide key={i} >
                            <Image
                                src={url}
                                alt={`Banner ${i + 1}`}
                                width={1200}
                                height={800}
                                className="w-full max-h-96 object-fill"
                            />
                        </SwiperSlide>
                        {url}
                    </div>

                ))}
            </Swiper>
        </div>
    )
}