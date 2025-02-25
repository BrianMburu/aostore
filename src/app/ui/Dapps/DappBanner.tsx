import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';

export default function DappBanner({ mainBannerImageUrls }: { mainBannerImageUrls: string[] }) {
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
                                className="w-full h-96 object-cover"
                            />
                        </SwiperSlide>
                        {url}
                    </div>

                ))}
            </Swiper>
        </div>
    )
}