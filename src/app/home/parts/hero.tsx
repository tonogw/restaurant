"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Axios } from "axios";
import { restoService } from "@/services/restoService";
import Image from "next/image";
// import { Divide } from "lucide-react";

const Hero = () => {
  // Fetch recommended resto use @tanstack
  const { data, isLoading } = useQuery({
    queryKey: ["recommended"],
    queryFn: () => restoService.getRecommendations,
  });

  //   get all images from array data
  const recommendations = data?.data.recommendations || [];

  const backdropImages = recommendations
    .flatMap((item) => item.images)
    .filter(Boolean);

  // State to track the active backdrop images
  const [currentIdx, setCurrentIdx] = useState(0);

  //   5 secs interval carousel if image > 1
  useEffect(() => {
    if (backdropImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % backdropImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backdropImages.length]);
  if (isLoading) {
    return (
      <div className="w-full h-206.75 bg-white rounded-3xl flex items-center justify-center text-gray-400">
        No background images available
      </div>
    );
  }

  return (
    <div className="relative w-full h-206.75 overflow-hidden rounded 3xl bg-white shadow-md">
      {/* Backdrop image */}
      <Image
        src={backdropImages[currentIdx]}
        alt="Recommended Resto"
        unoptimized
        priority
        sizes="(max-width:1024 1px, 50vw"
        className="object-cover transition-all duration-1000 ease-in-out scale-105"
      ></Image>
    </div>
  );
};

export default Hero;
