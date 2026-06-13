"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RestoCard from "@/components/shared/RestoCard";
import type { RestaurantItem, RestoResponse } from "@/types/resto";
import { Star } from "lucide-react";

export default function CategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  import { authService } from "@/services/authService";
  import { cartService } from "@/services/cartService";

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All Restaurant";

  // State Filter Sesuai Spesifikasi Figma
  const [distanceFilters, setDistanceFilters] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const { data, isLoading } = useQuery<RestoResponse>({
    queryKey: [
      "restaurants-filter",
      currentCategory,
      currentSearch,
      distanceFilters,
      minPrice,
      maxPrice,
      selectedRating,
    ],
    queryFn: () => restoApi.getRestaurants(currentSearch, currentCategory),
  });

  const restoList = data?.data?.restaurants || [];

  const handleDistanceChange = (value: string) => {
    setDistanceFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 pb-20">
      {/* Navbar dikunci warna hitam sejati sejak awal terbuka */}
      <Navbar isLightPage={true} />

      {/* CONTAINER UTAMA: Lebar maksimal dikunci 1200px agar simetris tengah monitor */}
      <div className="max-w-[1200px] mx-auto px-6 mt-6 flex flex-col gap-6">
        {/* HEADER JUDUL: Berdiri mandiri tepat di pojok kiri bawah garis lurus wilayah Logo */}
        <div className="flex flex-col gap-1 w-full text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {currentCategory}
          </h1>
          {currentSearch && (
            <p className="text-sm font-semibold text-gray-400">
              Showing search results for &ldquo;{currentSearch}&rdquo;
            </p>
          )}
        </div>

        {/* AREA KONTEN: Memisahkan Filter (266px) dan Grid Area Restoran (894px) */}
        <div className="w-full flex flex-col lg:flex-row gap-10 items-start mt-2">
          {/* ================= SISI KIRI: BLOK FILTER (266px x 792px) ================= */}
          <aside className="w-full lg:w-[266px] h-auto lg:h-[792px] bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-6 flex-shrink-0">
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg mb-4">
                Filter
              </h2>
              <div className="w-full h-px bg-gray-100" />
            </div>

            {/* 1. Kriteria Jarak (Checkboxes) */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-900 tracking-tight">
                Distance
              </h3>
              <div className="flex flex-col gap-2.5 text-sm font-semibold text-gray-600">
                {["Nearby", "Within 1km", "Within 3km", "Within 5km"].map(
                  (label) => (
                    <label
                      key={label}
                      className="flex items-center gap-3 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={distanceFilters.includes(label)}
                        onChange={() => handleDistanceChange(label)}
                        className="w-4 h-4 rounded-md accent-[#C12116] border-gray-300 cursor-pointer"
                      />
                      <span>{label}</span>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* 2. Kriteria Harga (2 Baris Input Eksplisit) */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-bold text-sm text-gray-900 tracking-tight">
                Price
              </h3>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-[#C12116]"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-[#C12116]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Kriteria Rating (5 Tingkat Bintang Turun ke Bawah) */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-bold text-sm text-gray-900 tracking-tight">
                Rating
              </h3>
              <div className="flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-gray-600"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      className="w-4 h-4 accent-[#C12116] cursor-pointer"
                    />
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          stroke="none"
                          className="fill-[#FFAB0D]"
                        />
                      ))}
                      {[...Array(5 - rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          stroke="none"
                          className="fill-gray-200"
                        />
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ================= SISI KANAN: BLOK GRID RESTORAN (894px x 668px) ================= */}
          <main className="w-full lg:w-[894px] min-h-[668px] flex flex-col gap-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, id) => (
                  <div
                    key={id}
                    className="h-[152px] w-full bg-white rounded-2xl border border-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : restoList.length === 0 ? (
              <div className="w-full py-28 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl text-center">
                <span className="text-4xl">🍽️</span>
                <p className="text-gray-400 text-sm font-bold mt-4">
                  No restaurants match your active criteria.
                </p>
              </div>
            ) : (
              // Grid Responsif 2 Kolom Sejati (Lebar Card mengembang maksimal sesuai porsi kolom)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {restoList.map((resto: RestaurantItem) => (
                  <div key={resto.id} className="w-full lg:w-[437px] h-[152px]">
                    <RestoCard
                      resto={resto}
                      onClick={() => router.push(`/resto/${resto.id}`)}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
