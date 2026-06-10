import Image from "next/image";
import type { RestaurantItem } from "@/types/resto";

interface RestoCardProps {
  resto: RestaurantItem;
  onClick?: () => void;
}

export default function RestoCard({ resto, onClick }: RestoCardProps) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-100 rounded-2xl 
        p-4 flex flex-col gap-3
        hover:shadow-md transition-all duration-300 cursor-pointer bg-white group
        "
    >
      {/* Container */}
      <div
        className="relative w-full h-40 rounded-xl overflow-hidden
    bg-gray-50
    "
      >
        <Image
          src={resto.logo}
          alt={resto.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-103 
        transition-all duration-300
        "
        />
      </div>

      {/* Resto info */}
      <div className="flex flex-col gap-1">
        <h3
          className="font-bold text-base text-gray-900
        group-hover:text-[#B81E1E] transition-colors
        "
        >
          {resto.name}
        </h3>

        <div
          className="flex items-center gap-1 text-xs text-gray-500
        font-medium flex-wrap
        "
        >
          <span className="text-amber-500 font-bold fill-[#FFAB0D]">
            ⭐ {resto.star.toFixed(1)}
          </span>
          <span className="text-gray-300">•</span>
          <span>{resto.place}</span>
          <span className="text-gray-300">•</span>
          <span>{resto.distance}</span>
        </div>
      </div>
    </div>
  );
}
