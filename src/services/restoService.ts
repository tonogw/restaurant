import api from "@/lib/api/axios";

import type { RestoResponse, RecommendationResponse } from "@/types/resto";

export const restoService = {
  getRestaurants: async (page = 1, limit = 20): Promise<RestoResponse> => {
    const response = await api.get<RestoResponse>(
      `/api/resto?page=${page}&limit=${limit}`,
    );

    return response.data;
  },

  getRestoRecommendation: async (
    page = 1,
    limit = 20,
  ): Promise<RestoResponse> => {
    const response = await api.get<RestoResponse>(
      `/api/resto?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getRecommendations: async (): Promise<RecommendationResponse> => {
    const response = await api.get<RecommendationResponse>(
      "/api/resto/recommended",
    );
    return response.data;
  },
};
