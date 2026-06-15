"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/order";
import { X, Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  transactionId,
}: ReviewModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);

  const reviewMutation = useMutation({
    mutationFn: async () => {
      return await orderApi.postReview({
        transaction_id: transactionId,
        star: rating,
        comment: comment,
      });
    },
    onSuccess: () => {
      // Refresh
      queryClient.invalidateQueries({ queryKey: ["user-orders-history"] });
      // Reset state local
      setRating(0);
      setComment("");
      setLocalError(null);
      onClose();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setLocalError(
          error.message || "Failed to submit your review. Please try again.",
        );
      } else {
        setLocalError("An unexpected error occurred.");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* X exit button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <X size={20} className="stroke-[2.5]" />
        </button>

        <h2 className="text-lg font-black text-center text-gray-900 mb-6">
          Give Review
        </h2>

        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider">
            Give Rating
          </p>

          {/* Rating score */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = (hoverRating || rating) >= star;
              return (
                <Star
                  key={star}
                  size={34}
                  className={`cursor-pointer transition-all duration-150 ${
                    isFilled
                      ? "fill-amber-400 text-amber-400 scale-110"
                      : "text-gray-300 hover:scale-105"
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              );
            })}
          </div>

          {localError && (
            <p className="text-[11px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg w-full text-center">
              ⚠ {localError}
            </p>
          )}

          {/* Testimonial field */}
          <textarea
            className="w-full h-36 border border-gray-200 rounded-2xl p-3.5 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#C12116] focus:ring-1 focus:ring-[#C12116] transition-all resize-none bg-gray-50/30"
            placeholder="Please share your thoughts about our service!"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* Submit button */}
          <button
            onClick={() => reviewMutation.mutate()}
            disabled={rating === 0 || reviewMutation.isPending}
            className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-black py-3.5 rounded-2xl text-center text-sm transition-all shadow-md cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
          >
            {reviewMutation.isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
