import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
// import { error } from "console";

const api = axios.create({
  // TODO: Configure baseURL from environment variable
  // TODO: Add default headers (API key, content-type)
  baseURL: process.env.NEXT_PUBLIC_FOODY_BASE_URL,
  timeout: 10000,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_FOODY_ACCESS_TOKEN}`,
  },
});

// REQUEST INTERCEPTOR token insertion
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Fetch TOKEN from localStorage /
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && config.headers) {
      // Placed bearer token each request to railway
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR handling global - 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // IF response 401 due to invalid TOKEN/ expired
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear invalid TOKEN / expired
        localStorage.removeItem("token");
        // Route to login
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
