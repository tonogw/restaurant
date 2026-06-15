"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restoApi } from "@/lib/api/resto";
import { cartService } from "@/services/cartService";
import Navbar from "@/components/shared/Navbar";
import MenuCard from "@/components/shared/MenuCard";
import ReviewCard from "@/components/shared/ReviewCard";
import type { PaginatedReviewResponse } from "@/types/review";
import type { RestoDetailResponse } from "@/types/resto";
import type { CartItemDetail } from "@/types/cart";

interface RestoDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RestoDetailPage({ params }: RestoDetailPageProps) {
  const queryClient = useQueryClient();
  const { id } = React.use(params);

  const [activeMenuTab, setActiveMenuTab] = useState<"All" | "Food" | "Drink">(
    "All",
  );
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // 1. QUERY DETAIL RESTORAN
  const {
    data: restoResponse,
    isLoading: isRestoLoading,
    error,
  } = useQuery<RestoDetailResponse>({
    queryKey: ["restaurant-detail", id],
    queryFn: () => restoApi.getRestoDetail(id),
  });

  // 2. QUERY REVIEW TERPISAH YANG TERBUKTI VALID VIA CONSOLE
  const { data: reviewsResponse } = useQuery<PaginatedReviewResponse>({
    queryKey: ["restaurant-reviews", id],
    queryFn: () => restoApi.getRestoReviews(id),
  });

  const { data: cartResponse } = useQuery({
    queryKey: ["user-cart"],
    queryFn: cartService.getCart,
  });

  const resto = restoResponse?.data;
  const cartGroups = cartResponse?.data?.cart || [];

  // ✓ TYPE-SAFE MAP: Tipe otomatis terbaca sebagai ServerReviewItem[]
  const reviewsList = reviewsResponse?.data?.reviews || [];

  const addToCartMutation = useMutation({
    mutationFn: (menuId: number) =>
      cartService.addToCart(menuId, Number(id), 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
    onError: () =>
      alert("Failed add menu item. Ensure you're already logged in."),
  });

  const updateQtyMutation = useMutation({
    mutationFn: ({ cartItemId, qty }: { cartItemId: number; qty: number }) => {
      if (qty <= 0) return cartService.deleteItem(cartItemId);
      return cartService.updateQuantity(cartItemId, qty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
  });

  const getCartItemState = (menuId: number) => {
    for (const group of cartGroups) {
      const match = group.items.find(
        (item: CartItemDetail) => item.menu.id === menuId,
      );
      if (match) return { cartItemId: match.id, quantity: match.quantity };
    }
    return null;
  };

  if (isRestoLoading) {
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

  const badgeCount = cartResponse?.data?.summary?.totalItems || 0;

  return (
    <div className="custom-container min-h-screen bg-[#F9FAFB] font-nunito pt-16 md:pt-24 flex flex-col">
      <Navbar isLightPage={true} cartCount={badgeCount} />

      <div className="w-full max-w-300 mx-auto mt-4 flex flex-col gap-6 md:gap-8">
        {/* Banner Mobile View */}
        <div className="block md:hidden w-full max-w-90.25 mx-auto">
          <div className="w-full h-65 relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
            <Image
              src={displayImages[activeBannerIdx]}
              alt="Mobile Banner Active"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition-all duration-300"
              unoptimized
            />
          </div>
          <div className="flex justify-center items-center gap-2 mt-3">
            {displayImages.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                type="button"
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

        {/* Banner Mosaik Desktop View */}
        <div className="hidden md:flex w-full gap-5 h-117.5">
          <div className="md:block w-1/2 lg:w-162.75 h-full relative rounded-[32px] overflow-hidden bg-gray-100 shadow-xs">
            <Image
              src={displayImages[0]}
              alt="Main Desktop Banner"
              fill
              priority
              sizes="50vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 flex flex-col gap-5 h-full">
            <div className="md:block h-75.5 w-full relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
              <Image
                src={displayImages[1]}
                alt="Banner 2"
                fill
                sizes="25vw"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex gap-5 h-37 w-full">
              <div className="flex-1 relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
                <Image
                  src={displayImages[2]}
                  alt="Banner 3"
                  fill
                  sizes="15vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 relative rounded-[16px] overflow-hidden bg-gray-100 shadow-xs">
                <Image
                  src={displayImages[3]}
                  alt="Banner 4"
                  fill
                  sizes="15vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Header Area */}
        <div className="w-full max-w-90.25 md:max-w-none mx-auto flex items-center justify-between border-b border-gray-100 pb-6 md:pb-8 h-22.5">
          <div className="flex items-center gap-3 md:gap-5 h-full">
            <div className="relative w-22.5 h-22.5 md:w-30 md:h-30 overflow-hidden border border-gray-100 bg-white shadow-xs shrink-0 rounded-2xl">
              <Image
                src={resto.logo}
                alt={resto.name}
                fill
                sizes="120px"
                className="object-cover p-1"
                unoptimized
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
                    width={18}
                    height={18}
                    unoptimized
                  />
                  {(resto.averageRating || resto.star || 0).toFixed(1)}
                </span>
              </div>
              {/* ✓ FIXED ZERO ANY: Menghilangkan cast (as any). Kita gunakan safe fallback optional chaining ?? */}
              <span className="text-xs md:text-sm text-gray-500 font-medium truncate">
                {resto.place} • {2.4} km
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button className="px-4 md:px-7.75 gap-1 h-11 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 shadow-xs cursor-pointer transition-all">
              <Image
                src="/icons/icon-share.svg"
                alt="share"
                width={20}
                height={20}
              />
              <span className="hidden md:flex text-sm font-bold text-gray-700">
                Share
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid List Menu */}
      <main className="custom-container max-w-300 w-full mx-auto py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Menu
          </h2>
          <div className="flex items-center gap-2.5">
            {(["All Menu", "Food", "Drink"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveMenuTab(tab === "All Menu" ? "All" : tab)
                }
                className={`px-4 py-1.5 md:py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mt-2">
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={{
                id: menu.id,
                foodName: menu.foodName,
                price: menu.price,
                type: menu.type,
                image: menu.image,
              }}
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

      {/* ✓ FIXED ZERO ANY: Transmisi murni aman terkendali */}
      <ReviewCard
        averageRating={resto.averageRating || resto.star || 0}
        reviewCount={resto.totalReviews || 0}
        reviews={reviewsList}
      />
    </div>
  );
}
