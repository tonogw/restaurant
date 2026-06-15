"use client";

import React from "react";
import Image from "next/image";
import type { ServerReviewItem } from "@/types/review";

interface ReviewCardProps {
  averageRating: number;
  reviewCount: number;
  reviews: ServerReviewItem[]; // Menggunakan tipe data ketat dari types.ts
}

export default function ReviewCard({
  averageRating,
  reviewCount,
  reviews = [],
}: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) +
        `, ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
      );
    } catch {
      return "Recent Review";
    }
  };

  return (
    <section className="w-full max-w-300 mx-auto px-4 md:px-0 py-8 border-t border-gray-100 mt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
          Review
        </h2>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <span className="flex items-center gap-1 text-[#0A0D12]">
            <Image
              src="/icons/icon-star.svg"
              alt="star"
              width={18}
              height={18}
              unoptimized
            />
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-400 font-medium">
            • ({reviewCount} Ulasan)
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="w-full py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-bold text-sm">
          🍽️ Belum ada ulasan tertulis untuk restoran ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="w-full bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={
                      rev.user?.avatar || "/icons/icon-pic-profile-dummy.svg"
                    }
                    alt={rev.user?.name || "User"}
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-900 text-sm">
                    {rev.user?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, idx) => (
                  <Image
                    key={idx}
                    src={
                      idx < rev.star
                        ? "/icons/icon-star.svg"
                        : "/icons/icon-star-empty.svg"
                    }
                    alt="star"
                    width={14}
                    height={14}
                    unoptimized
                  />
                ))}
              </div>

              <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                {rev.comment || "Penilaian tanpa ulasan tekstual."}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
