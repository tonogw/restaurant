export interface MenuItem {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface CartItemDetail {
  id: number;
  menu: MenuItem;
  quantity: number;
  item_total: number;
}

export interface CartGroup {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: CartItemDetail[];
  id: number;
  subtotal: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  restaurant_count: number;
}

export interface CartResponse {
  success: boolean;
  data: {
    cart: CartGroup[];
    summary: CartSummary;
  };
}
