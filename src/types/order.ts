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
