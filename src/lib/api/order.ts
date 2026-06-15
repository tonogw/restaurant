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

export type TransactionStatus =
  | "preparing"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: number;
  menu: {
    id: number;
    foodName: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export interface TransactionItem {
  transaction_id: string;
  payment_method: string;
  price: number;
  service_fee: number;
  delivery_fee: number;
  total_price: number;
  status: TransactionStatus;
  restaurant_name?: string; // Fallback visual nama resto di Figma
  items: OrderItem[];
}

export interface OrderHistoryResponse {
  success: boolean;
  data: TransactionItem[];
}

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
};
