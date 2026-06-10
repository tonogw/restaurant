import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { queryKeys } from "@/lib/query/keys";

export const useAddToCart = () => {
  const QueryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { menu_id: number; quantity: number }) => {
      const response = await api.post("/api/cart", payload);
      return response.data;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
};
