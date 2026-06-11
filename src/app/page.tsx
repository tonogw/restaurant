"use client";
// import RegisterPage from "./(auth)/register/page";
import Footer from "./home/parts/footer";
// import Hero from "./home/parts/hero";
import Navbar from "./home/parts/navbar";
import HeroSection from "@/app/home/parts/HeroSection";

// import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { restoApi } from "@/lib/api/resto";
import React, { useState, useEffect } from "react";
import RestoCard from "@/components/shared/RestoCard";
// import { userInfo } from "os";
import type { RestaurantItem, RestoResponse } from "@/types/resto";

const CATEGORIES = [
  { name: "All Restaurant", icon: "🍔" },
  { name: "Nearby", icon: "📍" },
  { name: "Best Seller", icon: "🏆" },
  { name: "Lunch", icon: "Rice" },
];

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "All Restaurant";
  const currentSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  // useEffect(() => {
  //   setSearchInput(currentSearch);
  // }, [currentSearch]);

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
      {/* <nav
        className="w-full bg-black text-white px-6 md:px-16 py-4 
      flex justify-between items-center
      "
      >
        <span className="text-xl font-bold ">Foody</span>
        <span className="text-sm font-semibold">userInfo</span>
      </nav> */}

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
        grid grid-cols-2 md:grid-cols-4 gap-4
        "
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => updateParams("category", cat.name)}
            className={`
            p-4 rounded-xl border flex flex-col items-center
            justify-center gap-2 transition-all cursor-pointer
            ${
              currentCategory === cat.name
                ? "border-amber-500 bg-amber-50/30 font-bold"
                : "border-gray-100 bg-white"
            }
            `}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-semibold text-gray-700">
              {cat.name}
            </span>
          </button>
        ))}
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
        <div>
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

      <Footer />
    </div>
  );
}
