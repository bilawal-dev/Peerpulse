"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import Image from "next/image";
import "swiper/css";

const brandLogos = [
    "/assets/brands/01-colored.png",
    "/assets/brands/02-colored.png",
    "/assets/brands/03-colored.png",
    "/assets/brands/04-colored.png",
    "/assets/brands/05-colored.png",
    "/assets/brands/06-colored.png",
];

const BrandSlider = () => {
    return (
        <section className="w-full border-y border-gray-200 py-5 sm:py-6 lg:py-10 mt-10 sm:mt-20">
            <Swiper
                modules={[Autoplay, FreeMode]}
                autoplay={{ 
                    delay: 500, 
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true
                }}
                freeMode={true}
                loop={true}
                speed={1000}
                spaceBetween={20}
                breakpoints={{
                    0: { slidesPerView: 3 },
                    500: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                }}
            >
                {brandLogos.map((logo, index) => (
                    <SwiperSlide
                        key={index}
                        className="flex justify-center items-center grayscale hover:grayscale-0 cursor-pointer transition duration-300"
                    >
                        <div className="relative w-20 h-8 sm:w-28 sm:h-10 xl:w-36 xl:h-12">
                            <Image
                                src={logo}
                                alt={`brand-${index}`}
                                fill
                                className="object-contain select-none"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default BrandSlider;
