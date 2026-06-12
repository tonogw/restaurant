"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import Navbar from "@/app/home/parts/navbar";
import Footer from "@/app/home/parts/footer";
import RestoCard from "@/components/shared/RestoCard";
import type { RestaurantItem, RestoResponse } from "@/types/resto";

export default function CategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil state filter langsung dari URL Search Params (Sesuai Poin 9)
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All Restaurant";

  // State filter lokal sebelum di-apply (opsional, untuk interaksi side-panel)
  const [selectedDistance, setSelectedDistance] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("all");

  // Fetch data restoran secara dinamis berdasarkan parameter filter dari URL
  const { data, isLoading } = useQuery<RestoResponse>({
    queryKey: [
      "restaurants-filter",
      currentCategory,
      currentSearch,
      selectedDistance,
      selectedPrice,
    ],
    queryFn: () => restoApi.getRestaurants(currentSearch, currentCategory), // Hubungkan ke backend Railway kamu
  });

  const restoList = data?.data?.restaurants || [];

  // Fungsi pembantu untuk mengubah parameter kategori di URL tanpa merusak pencarian teks
  const updateCategoryParam = (categoryName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", categoryName);
    router.push(`/category?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-28 pb-20 px-6 md:px-16">
      <Navbar isLightPage={true} />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* ================= SISI KIRI: PANEL FILTER INTERAKTIF ================= */}
        <aside className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-6">
          <div>
            <h2 className="font-extrabold text-gray-900 text-lg mb-4">
              Filter
            </h2>
            <div className="w-full h-px bg-gray-100" />
          </div>

          {/* Kriteria 1: Jarak Jauh (Distance) */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-800">Distance</h3>
            <div className="flex flex-col gap-2 text-sm font-semibold text-gray-600">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="distance"
                  checked={selectedDistance === "all"}
                  onChange={() => setSelectedDistance("all")}
                  className="accent-[#C12116]"
                />
                <span>Nearby ({"< 5 km"})</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="distance"
                  checked={selectedDistance === "far"}
                  onChange={() => setSelectedDistance("far")}
                  className="accent-[#C12116]"
                />
                <span>Far ({"> 5 km"})</span>
              </label>
            </div>
          </div>

          {/* Kriteria 2: Harga (Price) */}
          <div className="space-y-3 border-t border-gray-50 pt-4">
            <h3 className="font-bold text-sm text-gray-800">Price</h3>
            <div className="flex flex-col gap-2 text-sm font-semibold text-gray-600">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "all"}
                  onChange={() => setSelectedPrice("all")}
                  className="accent-[#C12116]"
                />
                <span>All Price</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "cheap"}
                  onChange={() => setSelectedPrice("cheap")}
                  className="accent-[#C12116]"
                />
                <span>$ (Economy)</span>
              </label>
            </div>
          </div>
        </aside>

        {/* ================= SISI KANAN: AREA CONTAINER LIST GRID RESTORAN ================= */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          {/* Header info status pencarian */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {currentCategory} {currentSearch && `for "${currentSearch}"`}
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              We found{" "}
              <span className="text-gray-900 font-bold">
                {restoList.length}
              </span>{" "}
              spaces match your criteria.
            </p>
          </div>

          {/* Skeleton Loading State bawaan TanStack Query */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, id) => (
                <div
                  key={id}
                  className="h-[152px] w-full bg-gray-100 rounded-2xl animate-pulse border border-gray-50"
                />
              ))}
            </div>
          ) : restoList.length === 0 ? (
            // Empty State jika resto tidak ditemukan
            <div className="py-20 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-3xl text-center p-6">
              <span className="text-4xl">🍽️</span>
              <p className="text-gray-400 text-sm font-bold mt-4">
                No restaurants found matching this filter.
              </p>
            </div>
          ) : (
            // Grid Listing RestoCard Horizontal Sesuai Ukuran Figma
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restoList.map((resto: RestaurantItem) => (
                <RestoCard
                  key={resto.id}
                  resto={resto}
                  onClick={() => router.push(`/resto/${resto.id}`)} // ✓ Navigasi mulus masuk ke detail resto brackets siku
                />
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
