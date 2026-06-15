"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RestoCard from "@/components/shared/RestoCard";
import type { RestaurantItem, RestoResponse } from "@/types/resto";
import Image from "next/image";

function CategoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All Restaurant";

  // ✓ FIXED: Ubah state distance dari array menjadi string tunggal atau null agar bersifat select salah satu saja
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // FETCH DATA UTAMA
  const { data, isLoading } = useQuery<RestoResponse>({
    queryKey: ["restaurants-filter", currentCategory, currentSearch],
    queryFn: () => restoApi.getRestaurants(currentSearch, currentCategory),
  });

  const restoList = data?.data?.restaurants || [];

  // ✓ FIXED: Fungsi handler jarak baru untuk sistem seleksi tunggal (toggle on / off)
  const handleDistanceToggle = (value: string) => {
    setSelectedDistance(selectedDistance === value ? null : value);
  };

  // Logika filter frontend ketat berdasarkan range terpilih
  const computedFilteredRestos = restoList.filter((resto: RestaurantItem) => {
    if (selectedRating !== null) {
      const itemRating = resto.star || 0;
      if (Math.floor(itemRating) !== selectedRating) {
        return false;
      }
    }

    // ✓ FIXED: Logika penyaringan jarak tunggal berbasis range batas ukur
    if (selectedDistance !== null) {
      const itemDistance = resto.distance || 0;
      if (selectedDistance === "Nearby" && itemDistance > 2.0) return false;
      if (selectedDistance === "Within 1km" && itemDistance > 1.0) return false;
      if (selectedDistance === "Within 3km" && itemDistance > 3.0) return false;
      if (selectedDistance === "Within 5km" && itemDistance > 5.0) return false;
    }

    const numericMin = minPrice ? parseFloat(minPrice) : null;
    const numericMax = maxPrice ? parseFloat(maxPrice) : null;

    if (resto.priceRange) {
      if (numericMin !== null && resto.priceRange.min < numericMin)
        return false;
      if (numericMax !== null && resto.priceRange.max > numericMax)
        return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 pb-20">
      <Navbar isLightPage={true} />

      <div className="max-w-300 mx-auto px-6 mt-6 flex flex-col gap-6">
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

        <div className="w-full flex flex-col lg:flex-row gap-10 items-start mt-2">
          {/* ================= SISI KIRI: BLOK FILTER ================= */}
          <aside className="w-full lg:w-[266px] h-auto lg:h-[792px] bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-gray-900 text-lg">Filter</h2>
              {(selectedDistance !== null ||
                minPrice ||
                maxPrice ||
                selectedRating !== null) && (
                <button
                  onClick={() => {
                    setSelectedDistance(null);
                    setMinPrice("");
                    setMaxPrice("");
                    setSelectedRating(null);
                  }}
                  className="text-xs font-bold text-[#C12116] hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="w-full h-px bg-gray-100 " />

            {/* 1. Kriteria Jarak (FIXED: Pilih Salah Satu Saja) */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-gray-900 tracking-tight">
                Distance
              </h3>
              <div className="flex flex-col gap-2.5 text-sm font-semibold text-gray-600">
                {["Nearby", "Within 1km", "Within 3km", "Within 5km"].map(
                  (label) => {
                    const isChecked = selectedDistance === label;
                    return (
                      <label
                        key={label}
                        className="flex items-center gap-3 cursor-pointer select-none"
                      >
                        <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleDistanceToggle(label)}
                            className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                          />
                          <Image
                            src={
                              isChecked
                                ? "/icons/icon-checkbox-checked.svg"
                                : "/icons/icon-checkbox-empty.svg"
                            }
                            alt="checkbox"
                            width={16}
                            height={16}
                          />
                        </div>
                        <span>{label}</span>
                      </label>
                    );
                  },
                )}
              </div>
            </div>

            {/* 2. Kriteria Harga */}
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

            {/* 3. Kriteria Rating */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-bold text-sm text-gray-900 tracking-tight">
                Rating
              </h3>
              <div className="flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const isRatingActive = selectedRating === rating;
                  return (
                    <label
                      key={rating}
                      className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-gray-600"
                    >
                      <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isRatingActive}
                          onChange={() =>
                            setSelectedRating(isRatingActive ? null : rating)
                          }
                          className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                        />
                        <Image
                          src={
                            isRatingActive
                              ? "/icons/icon-checkbox-checked.svg"
                              : "/icons/icon-checkbox-empty.svg"
                          }
                          alt="checkbox"
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="flex flex-row items-center gap-1.5">
                        <Image
                          src="/icons/icon-star.svg"
                          alt="star"
                          width={16}
                          height={16}
                          unoptimized
                        />
                        <span className="text-sm font-bold text-gray-700">
                          {rating}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ================= SISI KANAN: GRID LIST RESTO ================= */}
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
            ) : computedFilteredRestos.length === 0 ? (
              <div className="w-full py-28 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl text-center shadow-xs">
                <span className="text-4xl">🍽️</span>
                <p className="text-gray-400 text-sm font-bold mt-4">
                  No restaurants match your active criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {computedFilteredRestos.map((resto: RestaurantItem) => {
                  const finalResto = {
                    ...resto,
                    distance: resto.distance || 2.4,
                  };
                  return (
                    <div key={resto.id} className="w-full h-[152px]">
                      <RestoCard
                        resto={finalResto}
                        onClick={() => router.push(`/resto/${resto.id}`)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-bold font-nunito animate-pulse text-gray-400">
          Loading Category...
        </div>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}
