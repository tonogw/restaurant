// Buka file: src/app/checkout/page.tsx
"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />
      <main className="max-w-300 w-full mx-auto px-6 py-12 flex-1">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Checkout Order
          </h1>
          <p className="text-sm font-semibold text-gray-400 mt-2">
            Halaman checkout sedang disiapkan...
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
