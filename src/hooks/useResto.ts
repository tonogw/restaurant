import { useQuery } from "@tanstack/react-query";
import { restoService } from "@/services/restoService";
import type { RestoResponse } from "@/types/resto";

// Hook to fetch resto id
export const useResto = () => {
  return useQuery<RestoResponse>({
    queryKey: ["get/api/resto"],
    queryFn: () => restoService.getRestaurants(),
  });
};
