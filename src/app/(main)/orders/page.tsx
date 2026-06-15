"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orderApi, TransactionItem, TransactionStatus } from "@/lib/api/order";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { STATUS_TABS } from "@/constant/order-status";

export default function MyOrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TransactionStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch transactional data to api server
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["user-orders-history"],
    queryFn: orderApi.getOrderHistory,
    retry: false,
  });

  // read response
  const displayOrders = ordersResponse?.data || [];

  // Filter order list
  const filteredOrders = displayOrders.filter((order) => {
    const matchesStatus = activeTab === "all" || order.status === activeTab;
    const currentRestoName = order.restaurant_name || "Restaurant Foody";
    const matchesSearch = currentRestoName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold font-nunito animate-pulse text-gray-400">
        Loading your order transactions list from server...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-24 flex flex-col">
      <Navbar isLightPage={true} />

      <main className="max-w-300 w-full mx-auto px-4 sm:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* SIDEBAR NAVIGATION (Desktop Mode) */}
        <div className="hidden lg:flex flex-col bg-white rounded-3xl border border-gray-100 p-6 gap-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <Image
                src="/assets/images/avatar.png"
                alt="User Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm">
                Tono Wibisono
              </h3>
              <p className="text-[10px] font-bold text-gray-400">
                Premium Member
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2.5 text-sm font-bold">
            <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-gray-50 text-left transition-all cursor-pointer">
              <span>📍</span> Delivery Address
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50/40 text-[#C12116] text-left transition-all cursor-pointer">
              <span>📄</span> My Orders
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-[#C12116] text-left transition-all cursor-pointer mt-4"
            >
              <span>🚪</span> Logout
            </button>
          </nav>
        </div>

        {/* MAIN CONTENTS */}
        <div className="lg:col-span-3 space-y-6 w-full">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            My Orders
          </h1>

          {/* SEARCH BAR */}
          <div className="relative w-full bg-white rounded-2xl border border-gray-100 px-4 py-2.5 flex items-center gap-2 shadow-xs">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by restaurant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* TAB FILTER STATUS  */}
          <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 pb-1">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-xs font-extrabold rounded-full border transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? "border-[#C12116] bg-white text-[#C12116] shadow-xs"
                      : "border-gray-100 bg-white text-gray-400 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* CartCard my order */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-sm font-bold text-gray-400">
                You don&apos;t have any order history under this status.
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.transaction_id}
                  className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs space-y-4 transition-all hover:border-gray-200"
                >
                  {/* Resto Name */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <div className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                      <span>🍱</span>{" "}
                      {order.restaurant_name || "Restaurant Foody"}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black capitalize tracking-wider ${
                        order.status === "delivered"
                          ? "bg-green-50 text-green-600"
                          : order.status === "cancelled"
                            ? "bg-red-50 text-red-500"
                            : "bg-orange-50 text-orange-500 animate-pulse"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Item list */}
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 text-xs font-bold"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          {item.menu.image ? (
                            <Image
                              src={item.menu.image}
                              alt={item.menu.foodName}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-lg">
                              🍔
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 text-sm truncate">
                            {item.menu.foodName}
                          </h4>
                          <p className="text-gray-400 text-[11px] mt-0.5">
                            {item.quantity} x Rp{" "}
                            {item.menu.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total orders */}
                  <div className="pt-3 border-t border-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Total Payment
                      </p>
                      <p className="text-base font-black text-gray-900 mt-0.5">
                        Rp {order.total_price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {order.status === "delivered" && (
                      <button
                        onClick={() => router.push(`/resto/1`)}
                        className="bg-[#C12116] hover:bg-[#961818] text-white font-black text-xs px-6 py-2.5 rounded-full text-center transition-all shadow-xs cursor-pointer"
                      >
                        Give Review
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
