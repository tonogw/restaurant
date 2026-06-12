"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import { cartService } from "@/services/cartService";
import Navbar from "@/app/home/parts/navbar";
import Footer from "@/app/home/parts/footer";
import type { RestoDetailResponse } from "@/types/resto";

interface RestoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RestoDetailPage({ params }: RestoDetailPageProps) {
  const queryClient = useQueryClient();
  const { id } = React.use(params);

  // 1. FETCH RESTO DETAIL
  const {
    data: restoResponse,
    isLoading,
    error,
  } = useQuery<RestoDetailResponse>({
    queryKey: ["restaurant-detail", id],
    queryFn: () => restoApi.getRestoDetail(id),
  });

  const resto = restoResponse?.data;

  // 2. MUTASI PIPELINE TAMBAH KE KERANJANG (POST /api/cart)
  const cartMutation = useMutation({
    mutationFn: (menuId: number) => cartService.addToCart(menuId, 1),
    onSuccess: (res: { success: boolean; message: string }) => {
      alert(res.message || "Item added to cart successfully!");

      // SYNC TOTAL ORDERS
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
    onError: () => {
      alert("Failed to add item to cart. Please check your session.");
    },
  });

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold animate-pulse text-gray-400 font-nunito">
        Fetching restaurant data from Railway...
      </div>
    );
  }

  if (error || !resto) {
    return (
      <div className="p-20 text-center font-bold text-red-600 font-nunito">
        ⚠ Restaurant data not found or server error.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />

      {/* BANNER UTAMA RESTORAN */}
      <div className="relative w-full h-[280px] bg-zinc-950 flex-shrink-0 flex items-center justify-center">
        <Image
          src={resto.images?.[0] || resto.logo}
          alt={resto.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 max-w-[1200px] mx-auto px-6 flex flex-col justify-end pb-8 text-white z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {resto.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-semibold text-gray-200">
            <span className="flex items-center gap-1 text-amber-400">
              ⭐ {resto.averageRating || resto.star}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {resto.place}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> Nearby
            </span>
          </div>
        </div>
      </div>

      {/* GRID DAFTAR MENU MAKANAN (100% BEBAS DARI ANY) */}
      <main className="max-w-[1200px] w-full mx-auto px-6 py-12 flex-1">
        <h2 className="text-xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Available Menus
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resto.menus?.map((menu) => (
            <div
              key={menu.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-row gap-4 items-center justify-between group hover:shadow-md transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base group-hover:text-[#C12116] transition-colors">
                  {menu.foodName}{" "}
                  {/* ✓ FIXED: Memakai foodName sesuai jenis objek asli dari API */}
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">
                  {menu.type}
                </p>
                <p className="text-sm font-extrabold text-gray-900 mt-3">
                  Rp {menu.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  <Image
                    src={menu.image}
                    alt={menu.foodName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <button
                  disabled={
                    cartMutation.isPending && cartMutation.variables === menu.id
                  }
                  className="bg-[#C12116] hover:bg-[#961818] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400"
                  onClick={() => cartMutation.mutate(menu.id)} // Tembak ID makanan ke database server
                >
                  {cartMutation.isPending && cartMutation.variables === menu.id
                    ? "Adding..."
                    : "Add +"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
