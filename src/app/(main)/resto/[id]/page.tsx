"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import { cartService } from "@/services/cartService";
import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
import MenuCard from "@/components/shared/MenuCard";
// import { Star } from "lucide-react";
import type { RestoDetailResponse } from "@/types/resto";
// import { Menu } from "@/constant/menu-data";

interface RestoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RestoDetailPage({ params }: RestoDetailPageProps) {
  const queryClient = useQueryClient();
  const { id } = React.use(params);

  // State Filter Kategori Menu
  const [activeMenuTab, setActiveMenuTab] = useState<"All" | "Food" | "Drink">(
    "All",
  );

  // State Sederhana untuk mengontrol display gambar aktif di Mobile (0, 1, 2, atau 3)
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // 1. FETCH DATA REAL-TIME
  const {
    data: restoResponse,
    isLoading,
    error,
  } = useQuery<RestoDetailResponse>({
    queryKey: ["restaurant-detail", id],
    queryFn: () => restoApi.getRestoDetail(id),
  });

  const { data: cartResponse } = useQuery({
    queryKey: ["user-cart"],
    queryFn: cartService.getCart,
  });

  const resto = restoResponse?.data;
  const cartGroups = cartResponse?.data?.cart || [];

  // 2. MUTASI TAMBAH ITEM
  const addToCartMutation = useMutation({
    mutationFn: (menuId: number) =>
      cartService.addToCart(menuId, Number(id), 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
    onError: () => alert("Failed add menu item. Ensure you're already login."),
  });

  // 3. MUTASI UBAH JUMLAH PORSI
  const updateQtyMutation = useMutation({
    mutationFn: ({ cartItemId, qty }: { cartItemId: number; qty: number }) => {
      if (qty <= 0) {
        // If it's become 0 then delete
        return cartService.deleteItem(cartItemId);
      }
      // Otherwise update perusal
      return cartService.updateQuantity(cartItemId, qty);

      // cartService.updateQuantity(cartItemId, qty),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
  });

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

  const filteredMenus =
    resto.menus?.filter((menu) => {
      if (activeMenuTab === "All") return true;
      return menu.type.toLowerCase() === activeMenuTab.toLowerCase();
    }) || [];

  const displayImages = [
    resto.images?.[0] || resto.logo,
    resto.images?.[1] || resto.logo,
    resto.images?.[2] || resto.logo,
    resto.images?.[3] || resto.logo,
  ];

  // const totalCartItems = cartGroups.reduce((total, group) => {
  //   return total + group.items.reduce((sum, item) => sum + item.quantity, 0);
  // }, 0);

  const badgeCount = cartResponse?.data?.summary?.totalItems || 0;

  return (
    <div className="custom-container min-h-screen bg-[#F9FAFB] font-nunito pt-16 md:pt-24 flex flex-col">
      <Navbar isLightPage={true} cartCount={badgeCount} />

      {/* WRAPPER UTAMA RESPONSIF */}
      <div className="max-w-300 w-full mx-auto mt-4 flex flex-col gap-6 md:gap-8  ">
        {/* ==================================================== */}
        {/* 1. AREA BANNER BARIS ATAS */}
        {/* ==================================================== */}

        {/* VIEW MOBILE (w-393): Hanya 1 gambar tampil 361x260, sisanya sembunyi & bisa di-scrollX */}
        <div className="block md:hidden w-full max-w-90.25 mx-auto">
          <div className="w-full h-65 relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs scrollbar">
            <Image
              src={displayImages[activeBannerIdx]}
              alt="Mobile Banner Active"
              fill
              className="object-cover transition-all duration-300"
            />
          </div>
          {/* Indikator 3 Titik Figma di bawah Gambar Mobile (Merah = Aktif, Gray = Hidden) */}
          <div className="flex justify-center items-center gap-2 mt-3">
            {displayImages.slice(0, 3).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeBannerIdx === idx
                    ? "w-6 bg-[#C12116]"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* VIEW DESKTOP: Mosaik Grid Mewah */}
        <div className="hidden md:flex w-full gap-5 h-117.5">
          {/* Foto Kiri Besar */}
          <div className="hidden lg:w-162.75 h-117.5 relative rounded-[32px] overflow-hidden bg-gray-100 shadow-xs">
            <Image
              src={displayImages[0]}
              alt="Main Desktop Banner"
              fill
              priority
              className="object-cover"
            />
          </div>
          {/* Kanan: Susunan Bertingkat */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="hidden h-75.5 relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
              <Image
                src={displayImages[1]}
                alt="Banner 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-5 h-37">
              <div className="flex-1 relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
                <Image
                  src={displayImages[2]}
                  alt="Banner 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
                <Image
                  src={displayImages[3]}
                  alt="Banner 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 2. BLOK RESTO INFO (Mobile: 361x90, 2 Kolom) */}
        {/* ==================================================== */}
        <div className="w-full max-w-90.25 md:max-w-none mx-auto flex items-center justify-between border-b border-gray-100 pb-6 md:pb-8 h-22.5">
          {/* KOLOM 1: Logo Resto (90x90 di Mobile) + Info Resto (148x90 di Mobile) */}
          <div className="flex items-center gap-3 md:gap-5 h-full">
            <div className="relative w-22.5 h-22.5 md:w-30 md:h-30  overflow-hidden border border-gray-100 bg-white shadow-xs shrink-0">
              <Image
                src={resto.logo}
                alt={resto.name}
                fill
                className="object-cover p-1"
              />
            </div>
            <div className="flex flex-col justify-center h-22.5 w-37 md:w-auto space-y-0.5">
              <h2 className="text-base md:text-2xl font-extrabold text-gray-900 tracking-tight truncate w-full">
                {resto.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-gray-500">
                <span className="flex items-center gap-0.5 text-[#0A0D12]">
                  <Image
                    src="/icons/icon-star.svg"
                    alt="star"
                    width={24}
                    height={24}
                    unoptimized
                  />
                  {resto.averageRating || resto.star}
                </span>
              </div>
              <span className="truncate">{resto.place} • 2.4 km</span>
            </div>
          </div>

          {/* KOLOM 2: Icon Share Bulat (44x44), Rata Kanan Tengah / Middle */}
          <div className="flex items-center   justify-end">
            <button className="w-full px-4 md:px-7.75 gap-1 h-11 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 shadow-xs cursor-pointer transition-all">
              <Image
                src="/icons/icon-share.svg"
                alt="share"
                width={20}
                height={20}
                className="object-contain "
              />
              <span className="hidden md:flex ">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. BLOK GRID MENU (Mobile: grid-cols-2 dengan gap-4) */}
      {/* ==================================================== */}
      <main className="custom-container max-w-300 w-full mx-auto   py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Menu
          </h2>
          <div className="flex items-center gap-2.5">
            {(["All Menu", "Food", "Drink"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveMenuTab(tab === "All Menu" ? "All" : tab)
                }
                className={`px-4 py-1.5  md:py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
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

        {/* GRID CONTAINER MENUCARD: Mobile 2 Kolom menyamping, Desktop tetap 4 Kolom */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mt-2">
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
      </main>

      {/* <div className="bg-black mt-auto">
        <Footer />
      </div> */}
    </div>
  );
}
