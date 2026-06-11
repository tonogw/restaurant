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
  food_name: string;
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
        reviewCount: number;
        menuCount: number;
        priceRange: {
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
      totalPage: number;
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
  menuCount: number;
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
  images: string[]; // Ini yang akan kita pakai untuk backdrop
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

export interface MyOrder {}
