"use client";

// import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// import { Trash2, Plus, Minus } from "lucide-react";
// import IconPlus from "/icons/icon-icon-plus.svg";
// import IconMinus from "/icon/icon-minus.svg";

import type {
  // MenuItem,
  CartItemDetail,
  CartGroup,
  // CartSummary,
  CartResponse,
} from "@/types/resto";

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 1. FETCH DATA KERANJANG REAL-TIME DARI SERVER RAILWAY
  const { data: cartResponse, isLoading } = useQuery<CartResponse>({
    queryKey: ["user-cart"],
    queryFn: cartService.getCart,
  });

  const cartGroups = cartResponse?.data?.cart || [];
  const summary = cartResponse?.data?.summary;

  // 2. MUTASI PIPELINE UBAH JUMLAH PORSI (PUT /api/cart)
  const updateQtyMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartService.updateQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
  });

  // 3. MUTASI PIPELINE HAPUS SATU MAKANAN (DELETE /api/cart/{id})
  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => cartService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold animate-pulse text-gray-400 font-nunito">
        Loading your shopping cart items...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />

      <main className="max-w-300 w-full mx-auto px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* SISI KIRI: DAFTAR MAKANAN DI KERANJANG (2 KOLOM) */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>

          {cartGroups.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center">
              <span className="text-4xl">🛒</span>
              <p className="text-gray-400 font-bold mt-4 text-sm">
                Your cart is currently empty.
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-6 text-sm font-bold text-[#C12116] hover:underline cursor-pointer"
              >
                Discover Restaurants
              </button>
            </div>
          ) : (
            // Loop Kelompok Restoran sesuai skema Swagger Grouping
            cartGroups.map((group: CartGroup) => (
              <div
                key={group.restaurant.id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
              >
                {/* Header Sub-Restoran */}
                <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-50">
                    <Image
                      src={group.restaurant.logo}
                      alt="resto logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="font-extrabold text-gray-900 text-base">
                    {group.restaurant.name}
                  </h2>
                </div>

                {/* List Makanan di dalam Restoran ini */}
                <div className="divide-y divide-gray-50">
                  {group.items.map((item: CartItemDetail) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image
                          src={item.menu.image}
                          alt={item.menu.foodName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Menu Name */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">
                          {item.menu.foodName}
                        </h3>
                        <p className="text-xs font-extrabold text-gray-400 mt-1">
                          Rp {item.menu.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Tombol Pengatur Jumlah Kuantitas Porsi */}
                      <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 flex-shrink-0">
                        <button
                          disabled={
                            item.quantity <= 1 || updateQtyMutation.isPending
                          }
                          onClick={() =>
                            updateQtyMutation.mutate({
                              id: item.id,
                              quantity: item.quantity - 1,
                            })
                          }
                          className="text-gray-500 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                        >
                          {/* <Minus size={14} /> */}
                          <Image
                            src="/icons/icon-minus.svg"
                            alt="minus"
                            width={14}
                            height={14}
                          />
                        </button>
                        <span className="text-xs font-bold text-gray-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          disabled={updateQtyMutation.isPending}
                          onClick={() =>
                            updateQtyMutation.mutate({
                              id: item.id,
                              quantity: item.quantity + 1,
                            })
                          }
                          className="text-gray-500 hover:text-gray-900 cursor-pointer"
                        >
                          {/* <Plus size={14} /> */}
                          <Image
                            src="/icons/icon-plus.svg"
                            alt="plus"
                            width={14}
                            height={14}
                          />
                        </button>
                      </div>

                      {/* Tombol Aksi Hapus Item */}
                      <button
                        onClick={() => {
                          if (confirm("Remove item?"))
                            deleteItemMutation.mutate(item.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
                      >
                        {/* <Trash2 size={16} /> */}
                        <Image
                          src="/icons/icon-trash-white.svg"
                          alt="trash"
                          width={14}
                          height={14}
                          className="bg-gray-400"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* SISI KANAN: RINGKASAN PEMBAYARAN & BUTTON CHECKOUT (1 KOLOM) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-4">
          <h2 className="font-extrabold text-gray-900 text-lg">
            Order Summary
          </h2>
          <div className="w-full h-px bg-gray-100" />

          <div className="flex justify-between text-sm font-semibold text-gray-500">
            <span>Total Items</span>
            <span className="text-gray-900 font-bold">
              {summary?.totalItems || 0} items
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-semibold text-gray-500 border-t border-gray-50 pt-3 mt-1">
            <span>Total Price</span>
            <span className="text-xl font-extrabold text-[#C12116]">
              Rp {summary?.totalPrice || 0}
            </span>
          </div>

          <button
            disabled={cartGroups.length === 0}
            onClick={() => router.push("/checkout")} // ✓ Alur otomatis mengalir masuk ke halaman Checkout besok pagi
            className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-bold py-3.5 rounded-full text-center text-sm transition-colors mt-4 shadow-sm cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </main>
      <div className="bg-black">
        <Footer />
      </div>
    </div>
  );
}
