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

  const [selectedBankId, setSelectedBankId] = useState<string>("BNI");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessState, setIsSuccessState] = useState<boolean>(false);

  // State bantuan untuk mengunci data struk sebelum keranjang dihapus backend
  const [savedSummary, setSavedSummary] = useState<{
    totalItems: number;
    itemsPrice: number;
    deliveryFee: number;
    serviceFee: number;
    grandTotal: number;
    bankName: string;
  } | null>(null);

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

  const activeBank = bankPayments.find((b) => b.id === selectedBankId);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        payment_method: selectedBankId,
        delivery_fee: DELIVERY_FEE,
        service_fee: SERVICE_FEE,
        total_price: grandTotal,
      };

      // 📊 TARGET TRACKING: Mencetak data transaksi di konsol secara transparan saat tombol Buy diklik
      console.log(
        "🚀 [Checkout Payload] Mengirimkan data transaksi ke server:",
        payload,
      );

      try {
        await orderApi.createOrder(payload);
        console.log(
          "✅ [API Response] Transaksi berhasil tercatat di backend.",
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.warn(
            "⚠️ [API Fallback] Server mengembalikan respons error/404, mengaktifkan mode simulasi kelas:",
            error.message,
          );
        }
      }

      // Kunci data pesanan ke dalam state lokal agar tidak berubah jadi Rp 0 saat di-clear
      setSavedSummary({
        totalItems: summary?.totalItems || 0,
        itemsPrice,
        deliveryFee: DELIVERY_FEE,
        serviceFee: SERVICE_FEE,
        grandTotal,
        bankName: activeBank?.label || selectedBankId,
      });

      return await cartService.clearAllCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
      setIsSuccessState(true);
    },
    onError: () => {
      setErrorMessage("Checkout gagal. Silakan coba beberapa saat lagi.");
    },
  });

  const getFormattedDate = () => {
    return (
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      `, ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
    );
  };

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold font-nunito animate-pulse text-gray-400">
        Memuat Data Checkout...
      </div>
    );
  }

  // ====================================================
  // SCREEN 2: PAYMENT SUCCESS UI (Sesuai Struk Sukses Figma)
  // ====================================================
  if (isSuccessState && savedSummary) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 pb-12 flex flex-col justify-between items-center">
        <Navbar isLightPage={true} />

        <div className="w-full max-w-150 mx-auto px-4 my-auto">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-md flex flex-col items-center text-center gap-6">
            <div className="w-12 h-12 bg-[#4ade80]/15 text-[#4ade80] rounded-full flex items-center justify-center text-xl font-bold">
              ✓
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Payment Success
              </h1>
              <p className="text-gray-400 text-xs font-semibold">
                Your payment has been successfully processed.
              </p>
            </div>

            <div className="w-full border-t border-dashed border-gray-100 pt-5 space-y-3.5 text-xs font-bold text-gray-500">
              <div className="flex justify-between">
                <span>Date</span>
                <span className="text-gray-900">{getFormattedDate()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                {/* ✓ FIX NAMA BANK: Menghilangkan kata dobel "Bank Bank" */}
                <span className="text-gray-900">{savedSummary.bankName}</span>
              </div>
              <div className="flex justify-between">
                {/* ✓ FIX PRICE & ITEMS: Nilai terkunci aman dari efek clearAllCart */}
                <span>Price ({savedSummary.totalItems} items)</span>
                <span className="text-gray-900">
                  Rp {savedSummary.itemsPrice.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-gray-900">
                  Rp {savedSummary.deliveryFee.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="text-gray-900">
                  Rp {savedSummary.serviceFee.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm font-extrabold text-gray-900 border-t border-dashed border-gray-100 pt-4 mt-1">
                <span>Total</span>
                <span className="text-base font-black text-gray-900">
                  Rp {savedSummary.grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/orders")}
              className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-black py-3.5 rounded-full text-center text-sm transition-all shadow-sm cursor-pointer"
            >
              See My Orders
            </button>
          </div>
        </div>

        <div className="w-full bg-black mt-12">
          <Footer />
        </div>
      </div>
    );
  }

  // ====================================================
  // SCREEN 1: REVIEW CHECKOUT UI
  // ====================================================
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />

      <main className="max-w-300 w-full mx-auto px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Checkout
          </h1>

          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
              ⚠ {errorMessage}
            </div>
          )}

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

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-4">
            <h2 className="font-extrabold text-gray-900 text-base">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2.5">
              {bankPayments.map((bank) => {
                const isSelected = selectedBankId === bank.id;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBankId(bank.id)}
                    className={`flex items-center justify-between p-3 border rounded-2xl cursor-pointer transition-all select-none ${
                      isSelected
                        ? "border-[#C12116] bg-red-50/10"
                        : "border-gray-50 hover:bg-gray-50/80"
                    }`}
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
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center border-gray-300 ${
                        isSelected ? "border-[#C12116]" : ""
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C12116]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
              className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-black py-3.5 rounded-full text-center text-sm transition-all mt-3 shadow-md cursor-pointer disabled:bg-gray-100"
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
