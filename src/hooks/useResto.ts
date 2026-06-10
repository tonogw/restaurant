import { useQuery } from "@tanstack/react-query";
import { restoService } from "@/services/restoService";
import { DetailResponse } from "@/types/resto";

// Hook to fetch resto id
export const useRestoList = () => {
  return useQuery<DetailResponse>({
    queryKey: ["get/api/resto"],
    queryFn: () => restoService.getRestaurants(),
  });
};
