"use client";
import Navbar from "@/app/home/parts/navbar";
import Footer from "@/app/home/parts/footer";

import React from "react";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-nunito pt-28 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto bg-white rounded-3xl p-8 shadow-xs border border-gray-100">
        <Navbar />
        <h1 className="text-2xl font-bold text-gray-900">My Shopping Cart</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review your food items before checkout.
        </p>

        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl mt-6">
          <span className="text-4xl">🛒</span>
          <p className="text-gray-400 text-sm font-semibold mt-3">
            Your cart is currently empty.
          </p>
          <Link
            href="/"
            className="text-sm font-bold text-[#B81E1E] hover:underline mt-2"
          >
            Back to Explore Restaurants
          </Link>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
