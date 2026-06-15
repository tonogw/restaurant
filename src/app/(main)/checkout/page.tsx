"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import { orderApi } from "@/lib/api/order";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import type { CartGroup, CartItemDetail } from "@/types/cart";
import { bankPayments } from "@/constant/bank-data";
import Link from "next/link";

export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Murni menampung ID Bank terpilih (Default: BNI sesuai Figma Checkout.png)
  const [selectedBankId, setSelectedBankId] = useState<string>("BNI");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ["user-cart"],
    queryFn: cartService.getCart,
  });

  const cartGroups = cartResponse?.data?.cart || [];
  const summary = cartResponse?.data?.summary;

  const DELIVERY_FEE = cartGroups.length > 0 ? 10000 : 0;
  const SERVICE_FEE = cartGroups.length > 0 ? 1000 : 0;
  const itemsPrice = summary?.totalPrice || 0;
  const grandTotal = itemsPrice + DELIVERY_FEE + SERVICE_FEE;

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      // Kirim nama bank pilihan ke server
      await orderApi.createOrder({
        payment_method: `Transfer VA (${selectedBankId})`,
        delivery_fee: DELIVERY_FEE,
        service_fee: SERVICE_FEE,
        total_price: grandTotal,
      });
      return await cartService.clearAllCart();
    },
    onSuccess: () => {
      setSuccessMessage(
        "Pembayaran Berhasil! Mengalihkan ke riwayat transaksi...",
      );
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
      setTimeout(() => router.push("/orders"), 1500);
    },
    onError: () => {
      setErrorMessage("Checkout gagal. Silakan coba beberapa saat lagi.");
    },
  });

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold font-nunito animate-pulse text-gray-400">
        Memuat Data Checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />

      <main className="max-w-300 w-full mx-auto px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* SISI KIRI: ALAMAT DAN AREA DAFTAR KARTU RESTO */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Checkout
          </h1>

          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
              ⚠ {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100">
              ✅ {successMessage}
            </div>
          )}

          {/* ALAMAT PENGIRIMAN */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
              <span className="text-[#C12116] text-lg">📍</span> Delivery
              Address
            </div>
            <div className="text-sm font-semibold text-gray-700 pl-6 space-y-1">
              <p>Jl. Sudirman No. 25, Jakarta Pusat, 10220</p>
              <p className="text-gray-400 text-xs">0812-3456-7890</p>
            </div>
          </div>

          {/* DAFTAR KERANJANG RESTO */}
          {cartGroups.map((group: CartGroup) => (
            <div
              key={group.restaurant.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
            >
              <div className="pb-2 border-b border-gray-50 flex items-center justify-between">
                <div className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  <span>🏪</span> {group.restaurant.name}
                </div>
                <Link
                  href={`/resto/${group.restaurant.id}`}
                  className="px-4 py-1.5 border border-gray-200 text-xs font-bold rounded-full text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Add item
                </Link>
              </div>

              <div className="divide-y divide-gray-50">
                {group.items.map((item: CartItemDetail) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image
                        src={item.menu.image}
                        alt={item.menu.foodName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">
                        {item.menu.foodName}
                      </h3>
                      <p className="text-xs font-extrabold text-[#C12116] mt-0.5">
                        Rp {item.menu.price.toLocaleString("id-ID")}
                        <span className="text-gray-400 font-medium text-xs ml-2">
                          x{item.quantity}
                        </span>
                      </p>
                    </div>
                    <div className="text-sm font-extrabold text-gray-900 shrink-0">
                      Rp{" "}
                      {(item.menu.price * item.quantity).toLocaleString(
                        "id-ID",
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SISI KANAN: METODE BANK DAN RINGKASAN PEMBAYARAN */}
        <div className="space-y-6">
          {/* SELEKSI DAFTAR NAMA BANK REKANAN (Murni Ikut Sesuai Figma) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-4">
            <h2 className="font-extrabold text-gray-900 text-base">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2.5">
              {bankPayments.map((bank) => {
                const isSelected = selectedBankId === bank.id;
                return (
                  <label
                    key={bank.id}
                    onClick={() => setSelectedBankId(bank.id)}
                    className="flex items-center justify-between p-3 border border-gray-50 rounded-2xl cursor-pointer hover:bg-gray-50/80 transition-all select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-6 shrink-0 flex items-center">
                        <Image
                          src={bank.src}
                          alt={bank.alt}
                          width={40}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        {bank.label}
                      </span>
                    </div>
                    {/* Custom Radio Button Sesuai Lingkaran Merah Figma */}
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-gray-300">
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C12116]" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-3.5">
            <h2 className="font-extrabold text-gray-900 text-base">
              Payment Summary
            </h2>
            <div className="w-full h-px bg-gray-100" />

            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Price ({summary?.totalItems || 0} items)</span>
              <span className="text-gray-900">
                Rp {itemsPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Delivery Fee</span>
              <span className="text-gray-900">
                Rp {DELIVERY_FEE.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Service Fee</span>
              <span className="text-gray-900">
                Rp {SERVICE_FEE.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-extrabold text-gray-900 border-t border-dashed border-gray-100 pt-3.5 mt-1">
              <span>Total</span>
              <span className="text-lg font-black text-[#C12116]">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              disabled={cartGroups.length === 0 || checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate()}
              className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-black py-3.5 rounded-full text-center text-sm transition-all mt-3 shadow-md cursor-pointer disabled:bg-gray-100 disabled:text-gray-400"
            >
              {checkoutMutation.isPending ? "Memproses Invoice..." : "Buy"}
            </button>
          </div>
        </div>
      </main>

      <div className="bg-black">
        <Footer />
      </div>
    </div>
  );
}
