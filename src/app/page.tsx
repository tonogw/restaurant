"use client";
// import RegisterPage from "./(auth)/register/page";
import React, { useState, Suspense } from "react";
import Image from "next/image";
// import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/app/home/parts/HeroSection";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { restoApi } from "@/lib/api/resto";
import RestoCard from "@/components/shared/RestoCard";
import type { RestaurantItem, RestoResponse } from "@/types/resto";
import { categoryData } from "@/constant/category-data";

function HomePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "All Restaurant";
  const currentSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All Restaurant") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams("search", searchInput);
  };

  // @tanstack to sync data with railway
  const { data, isLoading } = useQuery<RestoResponse>({
    queryKey: ["restaurants", currentCategory, currentSearch],
    queryFn: () => restoApi.getRestaurants(currentSearch, currentCategory),
  });

  const restoList = data?.data?.restaurants || [];

  return (
    <div
      className="min-h-screen bg-white text-gray-900 flex flex-col
     font-nunito"
    >
      {/* NAVBAR */}
      <Navbar />

      {/* HERO COMPONENT */}
      <HeroSection
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* SELECTION CATEGORY */}
      <section
        id="category"
        className="max-w-300 w-full mx-auto px-6 py-10
     z-20 -mt-32 
        
        "
      >
        <div
          className="bg-white p-6 rounded-3xl shadow-xl 
        grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4
        
        "
        >
          {categoryData.map((cat) => {
            const isActive = currentCategory === cat.category;
            return (
              <button
                key={cat.category}
                onClick={() => updateParams("category", cat.category)}
                className={`
                p-4 rounded-xl border flex flex-col items-center
                justify-center gap-2 transition-all cursor-pointer
                 shadow-gray-400
                ${
                  isActive
                    ? cat.hoverBg + "scale-102 border-amber-500 bg-amber-50/30"
                    : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/50"
                }
                `}
              >
                {/* FETCH CATEGORY ICON */}
                <span>
                  <Image
                    src={cat.src}
                    alt={cat.alt}
                    width={65}
                    height={65}
                    className="object-contain"
                  />
                </span>
                <span
                  className={`
                    text-xs font-bold tracking-tight text-center ${
                      isActive
                        ? "text-amber-600 hover:zoom-in-50"
                        : "text-gray-600"
                    }
                    `}
                >
                  {cat.category}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* MAIN RESTO LIST */}
      <main className="max-w-300 w-full mx-auto px-6 pb-20 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Recommended
          </h2>
          <span className="text-xs font-bold text-red-700 hover:underline cursor-pointer">
            See All
          </span>
        </div>

        {/* LOADING  */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, id) => (
              <div
                key={id}
                className="h-38 bg-gray-100 rounded-2xl animate-pulse "
              />
            ))}
          </div>
        )}

        {/* RESTO CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restoList.map((resto: RestaurantItem) => (
            <RestoCard
              key={resto.id}
              resto={resto}
              onClick={() => router.push(`/resto/${resto.id}`)}
            />
          ))}
        </div>
      </main>

      {/* FOOTER */}

      {/* <Footer /> */}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center font-bold font-nunito animate-pulse text-gray-400">
          Loading Home...
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
