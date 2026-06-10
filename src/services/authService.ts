import api from "@/lib/api/axios";
import type { RegisterUser } from "@/lib/validations/auth";
import type { RegisterResponse } from "@/types/user";

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
};
