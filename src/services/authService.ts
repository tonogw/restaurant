import api from "@/lib/api/axios";
import type { LoginInputs, RegisterUser } from "@/lib/validations/auth";
import type {
  EndUserProfile,
  EndUserProfileResponse,
  RegisterResponse,
} from "@/types/user";

export const authService = {
  register: async (
    payload: Omit<RegisterUser, "confirmPassword">,
  ): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      "/api/auth/register",
      payload,
    );
    return response.data;
  },

  login: async (payload: LoginInputs): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      "/api/auth/login",
      payload,
    );
    return response.data;
  },

  profile: async (): Promise<EndUserProfileResponse> => {
    const response = await api.get<EndUserProfileResponse>("api/auth/profile");
    return response.data;
  },
};
