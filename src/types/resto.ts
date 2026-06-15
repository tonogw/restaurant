export interface RestaurantItem {
  id: number;
  name: string;
  star: number;
  place: string;
  logo: string;
  image: string[];
  category: string;
  reviewCount: number;
  menu_count: number;
  priceRange: {
    min: number;
    max: number;
  };
  distance: number;
}

export interface RestoResponse {
  success: boolean;
  data: {
    restaurants: RestaurantItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_page: number;
    };
  };
}

export interface RestoDetailResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    star: number;
    averageRating: number;
    place: string;
    coordinates: {
      lat: number;
      long: number;
    };
    logo: string;
    images: string[];
    category: string;
    totalMenus: number;
    totalReviews: number;
    menus: {
      id: number;
      foodName: string;
      price: number;
      type: string;
      image: string;
    }[];
    reviews: {
      id: number;
      star: number;
      comment: string | null;
      createdAt: string;
      user: {
        id: number;
        name: string;
        avatar: string | null;
      };
    }[];
  };
}

export interface RecommendationResponse {
  success: boolean;
  data: {
    recommendations: [
      {
        id: number;
        name: string;
        start: number;
        place: string;
        lat: number;
        long: number;
        logo: string;
        images: [string];
        category: string;
        reviewCount: number;
        sampleMenus: [
          {
            id: number;
            foodName: string;
            price: number;
            type: string;
            image: string;
          },
        ];
        isFrequentlyOrdered: boolean;
        distance: number;
      },
    ];
    message: string;
  };
}
