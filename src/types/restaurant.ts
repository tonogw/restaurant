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
  default: 1;
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
  Enum: [];
}

export interface Review {
  id: number;
  user_id: number;
  resto_id: number;
  transaction_id: string;
  star: number;
  minimum: 1;
  maximum: 5;
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
  data: {};
}
