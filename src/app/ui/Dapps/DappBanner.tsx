import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


export default function DappBanner({ mainBannerImageUrls }: { mainBannerImageUrls: string[] }) {
    return (
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
                {mainBannerImageUrls.map((url: string, i: number) => (
                    <SwiperSlide key={i}>
                        <img //Image
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
    )
}