export interface User {
  id: number;
  name: string;
  email: string; //string($email),
  phone: string;
  avatar: string;
  latitude: number;
  longitude: number;
  createdAt: string; //($date-time)
}

// POST /api/auth/register
// Register new user, Request body required
export interface Guest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// 201
// User registered successfully
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      avatar: string;
      latitude: number;
      longitude: number;
      createdAt: string;
    };
    token: string;
  };
}

// 400
// Validation failed
export interface RegisterResponseFailed {
  success: boolean;
  message: string;
  errors: [string];
}

// 409
// User already exists
export interface RegisterResponseExist {
  success: boolean;
  message: string;
  errors: [string];
}

export interface Restaurant {
  id: number;
  name: string;
  star: number; // ($float)
  place: string;
  lat: number; //($float),
  long: number; //($float),
  logo: string;
  images: [[]];
}

export interface Menu {
  id: number;
  foodName: string;
  price: number;
  type: string;
  Enum: ["food", "drink"];
  resto_id: number;
}

export interface CartItem {
  id: number;
  user_id: number;
  resto_id: number;
  menu_id: number;
  quantity: number;
  // default: 1;
}

export interface Transaction {
  transaction_id: string;
  user_id: number;
  payment_method: string;
  price: number;
  service_fee: number;
  delivery_fee: number;
  total_price: number;
  status: string;
  // Enum: [];
}

export interface Review {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number;
  // minimum: 1;
  // maximum: 5;
  comment: string;
}

export interface Error {
  success: boolean;
  message: string;
  errors: [[]];
}

export interface Success {
  success: boolean;
  message: string;
  data: `{}`;
}

export interface DetailResponse {
  success: boolean;
  message: string;
  data: {
    restaurants: [
      {
        id: number;
        name: string;
        star: number;
        place: string;
        logo: string;
        images: [];
        category: string;
        review_count: number;
        menu_count: number;
        price_range: {
          min: number;
          max: number;
        };
      },
    ];
  };
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

export interface RecommendationItem {
  id: number;
  name: string;
  star: number;
  place: string;
  lat: number;
  long: number;
  logo: string;
  images: string[];
  category: string;
  reviewCount: number;
  isFrequentlyOrdered: boolean;
  distance: number;
  sampleMenus: {
    id: number;
    foodName: string;
    price: number;
    type: string;
    image: string;
  }[];
}

export interface RecommendationResponse {
  success: boolean;
  message: string;
  data: {
    recommendations: RecommendationItem[];
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
    total_menus: number;
    total_reviews: number;
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

export interface MenuItem {
  id: number;
  foodName: string;
  price: number;
  type: string; //"food" | "drink";
  image: string;
}

export interface Coordinates {
  lat: number;
  long: number;
}

export interface ReviewItem {
  id: number;
  star: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export interface RestaurantDetail {
  id: number;
  name: string;
  star: number;
  average_rating: number;
  place: string;
  coordinates: Coordinates;
  logo: string;
  images: string[];
  category: string;
  total_menus: number;
  total_reviews: number;
  menus: MenuItem[];
  reviews: ReviewItem[];
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
