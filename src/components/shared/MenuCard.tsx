"use client";

import React from "react";
import Image from "next/image";
// import { Plus, Minus } from "lucide-react";
import type { MenuCardProps } from "@/types/menu";

export default function MenuCard({
  menu,
  cartState,
  onAdd,
  onUpdateQty,
  isAddPending,
}: MenuCardProps) {
  return (
    // Menu container
    <div className="w-43 h-76.5 md:w-71.25 md:h-94.75 bg-white rounded-[24px] border border-gray-100 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all">
      {/* Foto Menu Kotak Presisi (285px x 285px) */}
      <div className="w-43 h-43  md:w-71.25 md:h-71.25 relative bg-gray-50 overflow-hidden flex-shrink-0">
        <Image
          src={menu.image}
          alt={menu.foodName}
          fill
          sizes="(max-width: 768px) 172px, 285px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info & Aksi Bawah */}
      <div className="w-full h-23.5 p-4 flex-1 md:flex  justify-between min-w-0 bg-white">
        <div className="flex flex-col item-start min-w-0 pr-2">
          <h3 className="font-bold text-gray-900 text-sm truncate">
            {menu.foodName}
          </h3>
          <p className="text-xs font-extrabold text-gray-400 mt-0.5">
            Rp {menu.price.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex shrink-0  mt-2">
          {cartState ? (
            /* Mode 1: Quantity Mode jika barang sudah ada di keranjang server */
            <div className="w-30.75 h-10 flex items-center justify-between bg-gray-50 rounded-full border border-gray-100 p-1">
              <button
                onClick={() =>
                  onUpdateQty(cartState.cartItemId, cartState.quantity - 1)
                }
                className="w-10 h-10 mr-5   border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer shadow-xs"
              >
                {/* <Minus size={12} /> */}
                <Image
                  src="/icons/icon-minus.svg"
                  alt="minus"
                  width={40}
                  height={40}
                />
              </button>
              <span className="text-xs font-extrabold text-gray-900">
                {cartState.quantity}
              </span>
              <button
                onClick={() =>
                  onUpdateQty(cartState.cartItemId, cartState.quantity + 1)
                }
                className="w-10 h-10 ml-5  border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer shadow-xs"
              >
                {/* <Plus size={12} /> */}
                <Image
                  src="/icons/icon-plus.svg"
                  alt="plus"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          ) : (
            /* Mode 2: Tombol Add Merah Standar Figma */
            <button
              disabled={isAddPending}
              onClick={() => onAdd(menu.id)}
              className="w-19.75 h-10 bg-[#C12116] hover:bg-[#961818] text-white text-xs font-bold py-2.5 rounded-full transition-colors shadow-xs cursor-pointer text-center disabled:bg-gray-100 disabled:text-gray-400"
            >
              {isAddPending ? "Adding..." : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
