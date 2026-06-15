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
