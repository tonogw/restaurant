export interface ServerReviewUser {
  id: number;
  name: string;
  avatar: string | null;
}

export interface ServerReviewMenu {
  menuId: number;
  menuName: string;
  price: number;
  type: string;
  image: string;
  quantity: number;
}

export interface ServerReviewItem {
  id: number;
  star: number;
  comment: string | null;
  transactionId: string;
  createdAt: string;
  user: ServerReviewUser;
  menus: ServerReviewMenu[];
}

export interface PaginatedReviewResponse {
  success: boolean;
  data: {
    reviews: ServerReviewItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateReviewPayload {
  transaction_id: string; // Jika di swagger request body menggunakan format snake_case
  star: number;
  comment: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: {
    review: {
      id: number;
      star: number;
      comment: string;
      transactionId: string;
    };
  };
}
