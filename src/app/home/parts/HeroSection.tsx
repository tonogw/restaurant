"use client";

import Image from "next/image";
import React from "react";
import LBurger from "../../../../public/images/Image-landscape-beefburger.png";

interface HeroSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function HeroSection({
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: HeroSectionProps) {
  return (
    <header className="relative w-full h-[827px] bg-zinc-900 flex flex-col items-center justify-center">
      {/* Background Burger Besar */}
      <Image
        src={LBurger} // Pastikan file gambar figma ditaruh di public/images/main-hero.png
        alt="Explore Culinary Experiences"
        width={1440}
        height={827}
        priority
        sizes="100vw"
        className="object-cover opacity-40" // Opacity dikurangi agar tulisan putih di atasnya kontras & terbaca tajam
      />

      {/* Konten Teks & Search (Melayang di atas background) */}
      <div className="relative z-10 text-center space-y-6 max-w-3xl w-full -mt-20">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md -mt-20">
          Explore Culinary Experiences
        </h1>
        <p className="text-gray-200 text-xs md:text-sm font-medium tracking-wide">
          Search and refine your choice to discover the perfect restaurant.
        </p>

        {/* Input Pencarian di Tengah */}
        <form
          onSubmit={onSearchSubmit}
          className="w-full max-w-xl mx-auto relative px-2"
        >
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search restaurants, food and drink"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 rounded-full bg-white text-black text-sm border-none shadow-lg focus:outline-hidden focus:ring-2 focus:ring-[#B81E1E] transition-all placeholder:text-gray-400 font-medium"
          />
        </form>
      </div>
    </header>
  );
}
