"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import { cartService } from "@/services/cartService";
import Navbar from "@/app/home/parts/navbar";
import Footer from "@/components/shared/Footer";
import MenuCard from "@/components/shared/MenuCard"; // ✓ Memanggil komponen shared
import { Share2, Star } from "lucide-react";
import type { RestoDetailResponse } from "@/types/resto";

interface RestoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RestoDetailPage({ params }: RestoDetailPageProps) {
  const queryClient = useQueryClient();
  const { id } = React.use(params);

  // State Filter Kategori Internal Menu
  const [activeMenuTab, setActiveMenuTab] = useState<"All" | "Food" | "Drink">(
    "All",
  );

  // 1. FETCH DATA REAL-TIME DARI BACKEND RAILWAY
  const {
    data: restoResponse,
    isLoading,
    error,
  } = useQuery<RestoDetailResponse>({
    queryKey: ["restaurant-detail", id],
    queryFn: () => restoApi.getRestoDetail(id),
  });

  // Fetch data isi keranjang untuk mendeteksi apakah menu sudah pernah di-add
  const { data: cartResponse } = useQuery({
    queryKey: ["user-cart"],
    queryFn: cartService.getCart,
  });

  const resto = restoResponse?.data;
  const cartGroups = cartResponse?.data?.cart || [];

  // 2. MUTASI TAMBAH ITEM (POST /api/cart)
  const addToCartMutation = useMutation({
    mutationFn: (menuId: number) =>
      cartService.addToCart(menuId, Number(id), 1),
    onSuccess: () => {
      // ✓ FIXED: Parameter 'res: any' dihapus untuk menghilangkan eror merah TypeScript
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
    onError: () => alert("Gagal menambah item. Pastikan Anda sudah login."),
  });

  // 3. MUTASI UBAH JUMLAH PORSI (PUT /api/cart)
  const updateQtyMutation = useMutation({
    mutationFn: ({ cartItemId, qty }: { cartItemId: number; qty: number }) =>
      cartService.updateQuantity(cartItemId, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
  });

  // Helper untuk mendeteksi status quantity item di dalam database keranjang
  const getCartItemState = (menuId: number) => {
    for (const group of cartGroups) {
      const match = group.items.find((item) => item.menu.id === menuId);
      if (match) return { cartItemId: match.id, quantity: match.quantity };
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold animate-pulse text-gray-400 font-nunito">
        Loading Resto Detail...
      </div>
    );
  }

  if (error || !resto) {
    return (
      <div className="p-20 text-center font-bold text-red-600 font-nunito">
        ⚠ Restoran tidak ditemukan.
      </div>
    );
  }

  // Filter menu lokal berdasarkan tombol tab yang aktif
  const filteredMenus =
    resto.menus?.filter((menu) => {
      if (activeMenuTab === "All") return true;
      return menu.type.toLowerCase() === activeMenuTab.toLowerCase();
    }) || [];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />

      {/* CONTAINER BANNER/BACKDROP (1200px x 622px) */}
      <div className="max-w-[1200px] w-full mx-auto px-6 mt-4 flex flex-col gap-[32px]">
        {/* BARIS ATAS: MOSAIC IMAGES GRID */}
        <div className="w-full flex gap-[20px] h-[470px]">
          {/* Foto Kiri Besar (651px x 470px) */}
          <div className="w-[651px] h-[470px] relative rounded-[32px] overflow-hidden bg-gray-100 shadow-xs">
            <Image
              src={resto.images?.[0] || resto.logo}
              alt="Main Banner"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Kanan: Susunan Bertingkat */}
          <div className="flex-1 flex flex-col gap-[20px]">
            {/* Atas (529px x 302px) */}
            <div className="w-full h-[302px] relative rounded-[32px] overflow-hidden bg-gray-100 shadow-xs">
              <Image
                src={resto.images?.[1] || resto.images?.[0] || resto.logo}
                alt="Banner 2"
                fill
                className="object-cover"
              />
            </div>
            {/* Bawah (2 Foto Sejajar: 254px x 148px) */}
            <div className="flex gap-[20px] h-[148px]">
              <div className="flex-1 relative rounded-[24px] overflow-hidden bg-gray-100 shadow-xs">
                <Image
                  src={resto.images?.[2] || resto.logo}
                  alt="Banner 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 relative rounded-[24px] overflow-hidden bg-gray-100 shadow-xs">
                <Image
                  src={resto.images?.[3] || resto.logo}
                  alt="Banner 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BARIS BAWAH: LOGO RESTO & INFO UTAMA */}
        <div className="w-full flex items-center justify-between border-b border-gray-100 pb-[32px]">
          <div className="flex items-center gap-5">
            <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden border border-gray-100 bg-white shadow-xs">
              <Image
                src={resto.logo}
                alt={resto.name}
                fill
                className="object-cover p-1"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {resto.name}
              </h2>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                <span className="flex items-center gap-1 text-amber-500">
                  ★ {resto.averageRating || resto.star}
                </span>
                <span>•</span>
                <span>{resto.place} • 2.4 km</span>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 px-5 py-2.5 rounded-full text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 shadow-xs cursor-pointer">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* ================= BLOK MENU ================= */}
      <main className="max-w-[1200px] w-full mx-auto px-6 py-[32px] flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Menu
          </h2>
          {/* Tiga Tombol Filter Kategori */}
          <div className="flex items-center gap-2.5">
            {(["All Menu", "Food", "Drink"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveMenuTab(tab === "All Menu" ? "All" : tab)
                }
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  (tab === "All Menu" && activeMenuTab === "All") ||
                  activeMenuTab === tab
                    ? "bg-[#C12116] text-white border-transparent shadow-xs"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ✓ FIXED: GRID CONTAINER MENUCARD MEMAKAI KOMPONEN SHARED YANG PRESISI FIGMA 2 KOLOM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] mt-2">
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              cartState={getCartItemState(menu.id)}
              onAdd={(menuId) => addToCartMutation.mutate(menuId)}
              onUpdateQty={(cartItemId, qty) =>
                updateQtyMutation.mutate({ cartItemId, qty })
              }
              isAddPending={
                addToCartMutation.isPending &&
                addToCartMutation.variables === menu.id
              }
            />
          ))}
        </div>

        {/* Tombol Show More Tengah */}
        <div className="w-full flex justify-center mt-4">
          <button className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-500 hover:bg-gray-50 shadow-xs cursor-pointer">
            Show More
          </button>
        </div>
      </main>

      {/* ================= BLOK REVIEW (Gap 32px) ================= */}
      <section className="max-w-[1200px] w-full mx-auto px-6 py-[32px] flex flex-col gap-6">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
          ★ {resto.averageRating || resto.star} (
          {resto.totalReviews || resto.reviews?.length || 0} Ulasan)
        </h2>

        {/* Grid Review Card 2 Kolom (590px x 204px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          {resto.reviews?.map((review) => (
            <div
              key={review.id}
              className="w-full lg:w-[590px] h-auto min-h-[160px] bg-white border border-gray-100 p-6 rounded-[24px] shadow-xs flex flex-col gap-3"
            >
              {/* Atas: Avatar + Nama + Waktu */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={review.user.avatar || "/images/avatar-placeholder.png"}
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-gray-900">
                    {review.user.name}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {/* Bintang Rating */}
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(review.star)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-[#FFAB0D] stroke-none"
                  />
                ))}
              </div>
              {/* Teks Komentar */}
              <p className="text-xs font-medium text-gray-500 leading-relaxed line-clamp-3">
                {review.comment ||
                  "Penjual ramah, makanan hangat dan porsi pas luar biasa!"}
              </p>
            </div>
          ))}
        </div>

        {/* Tombol Show More Review */}
        <div className="w-full flex justify-center mt-4">
          <button className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-500 hover:bg-gray-50 shadow-xs cursor-pointer">
            Show More
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
