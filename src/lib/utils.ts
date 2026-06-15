import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined) {
  if (!path) {
    return "/api/resto";
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_FOODY_BASE_URL ||
    "https://be-restaurant-production.up.railway.app";

  return `${baseUrl}/${path}`;
}
