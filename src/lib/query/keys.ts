export const queryKeys = {
  restaurants: {
    all: ["restaurants"] as const,
    list: (filters: string) => ["restaurants", "list", filters] as const,
    detail: (id: string) => ["restaurants", "detail", id] as const,
  },
  cart: {
    all: ["cart"] as const,
  },
  order: {
    all: ["orders"] as const,
    history: ["orders", "history"] as const,
  },
};
