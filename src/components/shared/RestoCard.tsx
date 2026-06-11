import Image from "next/image";
import type { RestaurantItem } from "@/types/resto";
import { Star } from "lucide-react";

interface RestoCardProps {
  resto: RestaurantItem;
  onClick?: () => void;
}

export default function RestoCard({ resto, onClick }: RestoCardProps) {
  return (
    <div
      onClick={onClick}
      className="
      w-full lg:max-w-92.5 h-auto lg:max-h-38 
      border border-gray-100 rounded-2xl 
        p-4 flex flex-row gap-3 items-center select-none
        hover:shadow-md transition-all duration-300 cursor-pointer bg-white group
        "
    >
      {/* RESTO LOGO Container */}

      <div
        className="relative w-30 h-30 rounded-xl overflow-hidden
    bg-gray-50 flex shrink-0 shadow-[#CBCACA40] shadow-[203,202,202,0.25]
    "
      >
        <Image
          src={resto.logo}
          alt={resto.name}
          fill
          // width={120}
          // height={120}
          unoptimized
          className="object-cover group-hover:scale-103 
        transition-all duration-300
        "
        />
      </div>

      {/* RIGHT SIDE Resto info */}
      <div className="flex flex-col justify-center flex-1 min-w-0 h-full gap-1">
        <h3
          className="font-extrabold text-lg text-gray-900 truncate group-hover:text-[#B81E1E]
          transition-colors
          "
        >
          {resto.name}
        </h3>
        <div
          className="flex items-center gap-1 text-xs text-gray-500
          font-medium 
          "
        >
          <Star
            width={17.12}
            height={16.35}
            stroke="[#FFAB0D]"
            className="fill-[#FFAB0D] "
          />

          <span className="text-[#0A0D12] font-medium ">
            {resto.star.toFixed(1)}
          </span>
        </div>
        <div className="flex">
          <p className="truncate text-[#0A0D12] font-regular text-base">
            {resto.place}
          </p>
          <span className="text-[#0A0D12] font-regular">•</span>

          <span
            className=" text-[#0A0D12] font-regular
          px-2 py-0.5 rounded-md w-max mt-1 text-base items-center justify-center"
          >
            {resto.distance} km
          </span>
        </div>
      </div>
    </div>
  );
}
