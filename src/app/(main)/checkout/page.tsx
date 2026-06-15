"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // State untuk UI feedback (Ganti alert)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ["user-cart"],
    queryFn: cartService.getCart,
  });

  const cartGroups = cartResponse?.data?.cart || [];
  const summary = cartResponse?.data?.summary;

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      return await cartService.clearAllCart();
    },
    onSuccess: () => {
      setSuccessMessage("Order placed successfully!");
      setErrorMessage(null);
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });
      // Redirect setelah 1.5 detik agar user sempat baca success message
      setTimeout(() => router.push("/"), 1500);
    },
    onError: () => {
      setErrorMessage("Checkout failed. Please try again.");
      setSuccessMessage(null);
    },
  });

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold font-nunito animate-pulse text-gray-400">
        Loading Checkout data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />
      <main className="max-w-300 w-full mx-auto px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Review Your Order
          </h1>

          {/* ERROR / SUCCESS BANNER (Consistent with your Login/Register pages) */}
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

          {cartGroups.map((group) => (
            <div
              key={group.restaurant.id}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
            >
              <div className="font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
                <span className="text-red-600">📍</span> {group.restaurant.name}
              </div>
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm py-1"
                >
                  <div className="text-gray-800 font-semibold">
                    {item.menu.foodName}{" "}
                    <span className="text-gray-400 text-xs">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="text-gray-900 font-bold">
                    Rp{" "}
                    {(item.menu.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-4">
          <h2 className="font-extrabold text-gray-900 text-lg">
            Payment Summary
          </h2>
          <div className="w-full h-px bg-gray-100" />

          <div className="flex justify-between text-sm font-semibold text-gray-500">
            <span>Total Cost</span>
            <span className="text-gray-900 font-bold">
              Rp {(summary?.totalPrice || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm font-semibold text-gray-500 border-t border-gray-100 pt-3">
            <span>Grand Total</span>
            <span className="text-xl font-extrabold text-[#C12116]">
              Rp {(summary?.totalPrice || 0).toLocaleString("id-ID")}
            </span>
          </div>

          <button
            disabled={cartGroups.length === 0 || checkoutMutation.isPending}
            onClick={() => checkoutMutation.mutate()}
            className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-bold py-3.5 rounded-full text-center text-sm transition-colors mt-4 shadow-sm cursor-pointer disabled:bg-gray-200"
          >
            {checkoutMutation.isPending ? "Processing..." : "Place Order & Pay"}
          </button>
        </div>
      </main>
      <div className="bg-black">
        <Footer />
      </div>
    </div>
  );
}
