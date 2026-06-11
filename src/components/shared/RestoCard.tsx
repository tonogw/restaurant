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
      className="
      w-full lg:max-w-92.5 h-auto lg:max-h-38 
      border border-gray-100 rounded-2xl 
        p-4 flex flex-col gap-3
        hover:shadow-md transition-all duration-300 cursor-pointer bg-white group
        "
    >
      {/* Container */}
      <div
        className="relative w-30 h-30 rounded-xl overflow-hidden
    bg-gray-50 flex shrink-0
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

        {/* RIGHT SIDE Resto info */}
        <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
          <h3
            className="font-bold text-base text-gray-900 truncate group-hover:text-[#B81E1E]
          transition-colors
          "
          >
            {resto.name}
          </h3>

          <div
            className="flex flex-col items-center gap-1 text-xs text-gray-500
          font-medium 
          "
          >
            <span className="text-amber-500 font-bold fill-[#FFAB0D]">
              ⭐ {resto.star.toFixed(1)}
            </span>
            <span className="text-gray-300">•</span>
            <p className="truncate text-gray-400">{resto.place}</p>
            <span className="text-gray-300">•</span>
            <span
              className="bg-gray-100 text-gray-600 font-semibold
             px-2 py-0.5 rounded-md w-max mt-1 text-xs"
            >
              {resto.distance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
