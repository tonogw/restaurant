import api from "./axios";

export interface CreateOrderPayload {
  payment_method: string;
  delivery_fee: number;
  service_fee: number;
  total_price: number;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    transaction_id: string;
    status: string;
    total_price: number;
  };
}

export const orderApi = {
  // Fungsi mengirimkan data checkout ke server untuk menjadi Invoice resmi
  createOrder: async (
    payload: CreateOrderPayload,
  ): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>(
      "/api/transaction",
      payload,
    );
    return response.data;
  },
};
