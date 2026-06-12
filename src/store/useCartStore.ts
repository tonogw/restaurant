import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (newItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id,
      );
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return { cartItems: [...state.cartItems, { ...newItem, quantity: 1 }] };
    }),
  clearCart: () => set({ cartItems: [] }),
}));
