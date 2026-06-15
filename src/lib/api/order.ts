import api from "./axios";
import type { CreateReviewPayload, CreateReviewResponse } from "@/types/review";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderHistoryResponse,
} from "@/types/order";

export const orderApi = {
  createOrder: async (
    payload: CreateOrderPayload,
  ): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>(
      "/api/transaction",
      payload,
    );
    return response.data;
  },

  // Ambil daftar riwayat transaksi user login
  getOrderHistory: async (): Promise<OrderHistoryResponse> => {
    const response = await api.get<OrderHistoryResponse>(
      "/api/transaction/user",
    );
    return response.data;
  },

  postReview: async (
    payload: CreateReviewPayload,
  ): Promise<CreateReviewResponse> => {
    // Jika backend kamu ternyata strict menggunakan camelCase untuk request body,
    // kamu bisa sesuaikan kuncinya menjadi: transactionId: payload.transaction_id
    const response = await api.post<CreateReviewResponse>("/api/review", {
      transaction_id: payload.transaction_id,
      star: payload.star,
      comment: payload.comment,
    });
    return response.data;
  },
};
