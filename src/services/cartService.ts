import api from "@/lib/api/axios";
import type { CartResponse } from "@/types/cart";

export const cartService = {
  // Ambil isi keranjang belanja
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get<CartResponse>("/api/cart");
    return response.data;
  },

  // Tambah item makanan ke dalam database keranjang
  addToCart: async (
    menuId: number,
    restaurantId: number,
    quantity: number = 1,
  ) => {
    const response = await api.post("/api/cart", {
      restaurantId: Number(restaurantId),
      menuId: Number(menuId),
      quantity: Number(quantity),
    });
    return response.data;
  },

  // Ubah jumlah pesanan makanan (PUT /api/cart)
  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await api.put(`/api/cart/${cartItemId}`, {
      // id: cartItemId,
      quantity: Number(quantity),
    });
    return response.data;
  },

  // Hapus satu item makanan spesifik dari laci keranjang
  deleteItem: async (id: number) => {
    const response = await api.delete(`/api/cart/${id}`);
    return response.data;
  },

  // Bersihkan seluruh isi keranjang belanja
  clearAllCart: async () => {
    const response = await api.delete("/api/cart");
    return response.data;
  },
};

// debug!
// if (typeof window !== "undefined") {
//   (window as any).cartService = cartService;
// }
