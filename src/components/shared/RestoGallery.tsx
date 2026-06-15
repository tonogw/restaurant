"use client";

import Image from "next/image";

interface RestoGalleryProps {
  images?: string[];
  logoUrl?: string;
}

export default function RestoGallery({
  images = [],
  logoUrl,
}: RestoGalleryProps) {
  // Fallback fetch resto logo
  const fallbackImage = logoUrl || "/images/logo.svg";

  // 4 slot images
  const displayImages = [
    images[0] || fallbackImage,
    images[1] || fallbackImage,
    images[2] || fallbackImage,
    images[3] || fallbackImage,
  ];

  return (
    <section className="w-full bg-white pt-24 pb-6 px-4 md:px-6">
      <div className="custom-container">
        {/* MOBILE VIEW: Horizontal Scroll (md:hidden) */}
        <div className="flex md:hidden gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none">
          {images.length > 0 ? (
            images.map((img, idx) => (
              <div
                key={idx}
                className="min-w-[85vw] h-48 relative rounded-2xl overflow-hidden snap-center shadow-xs shrink-0 bg-gray-50 border border-gray-100"
              >
                <Image
                  src={img}
                  alt={`Resto gallery ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))
          ) : (
            // Display resto logo if fetch images gallery failed
            <div className="min-w-[85vw] h-48 relative rounded-2xl overflow-hidden snap-center shadow-xs shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center p-8">
              <div className="relative w-24 h-24">
                <Image
                  src={fallbackImage}
                  alt="Resto fallback logo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP & TABLET VIEW  (hidden md:grid) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Main image LEFT side */}
          <div className="lg:col-span-1 h-105 relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-12">
            <Image
              src={displayImages[0]}
              alt="Resto main gallery"
              fill
              className={
                images[0] ? "object-cover" : "object-contain p-20 opacity-80"
              }
              unoptimized
            />
          </div>

          {/* RIGHT side images: dekstop: 1 on top, 2 below */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top image full width */}
            <div className="sm:col-span-2 h-50 relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-6">
              <Image
                src={displayImages[1]}
                alt="Resto gallery top"
                fill
                className={
                  images[1] ? "object-cover" : "object-contain p-10 opacity-60"
                }
                unoptimized
              />
            </div>

            {/* 2 images inline row */}
            <div className="sm:col-span-1 h-51 relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-6">
              <Image
                src={displayImages[2]}
                alt="Resto gallery bottom left"
                fill
                className={
                  images[2] ? "object-cover" : "object-contain p-10 opacity-60"
                }
                unoptimized
              />
            </div>
            <div className="sm:col-span-1 h-50.25 relative rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-6">
              <Image
                src={displayImages[3]}
                alt="Resto gallery bottom right"
                fill
                className={
                  images[3] ? "object-cover" : "object-contain p-10 opacity-60"
                }
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
