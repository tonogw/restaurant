import api from "./axios";
import type { RestoResponse, RestoDetailResponse } from "@/types/resto";
import type { PaginatedReviewResponse } from "@/types/review";

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

  getRestoDetail: async (id: string): Promise<RestoDetailResponse> => {
    const response = await api.get<RestoDetailResponse>(`/api/resto/${id}`);
    return response.data;
  },

  getRestoReviews: async (id: string): Promise<PaginatedReviewResponse> => {
    const response = await api.get<PaginatedReviewResponse>(
      `/api/review/restaurant/${id}`,
    );
    return response.data;
  },
};
