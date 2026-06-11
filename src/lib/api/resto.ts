import api from "./axios";
import type { RestoResponse } from "@/types/resto";

export const restoApi = {
  getRestaurants: async (
    search?: string,
    category?: string,
  ): Promise<RestoResponse> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All Restaurant")
      params.append("category", category);

    const response = await api.get<RestoResponse>(
      `/api/resto?${params.toString()}`,
    );
    return response.data;
  },
};
