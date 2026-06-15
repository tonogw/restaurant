"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerSchema, type RegisterUser } from "@/lib/validations/auth";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import AuthCard from "@/components/shared/AuthCard";
import AuthInput from "@/components/shared/AuthInput";
import Image from "next/image";
import LBurger from "../../../../public/images/Image-landscape-burger.png";

interface ApiErrorResponse {
  message?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      const token = response.data.token;
      localStorage.setItem("token", token);

      // To trigger isLoggedIn in navbar
      setToken(token);

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });

      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrorMessage(msg);
    },
  });

  const onSubmit = (data: RegisterUser) => {
    setErrorMessage(null);
    //   Not required in async

    // @ts-ignor
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirmPassword, ...payload } = data;
    mutation.mutate(payload);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white font-sans">
      <div className="relative hidden lg:block w-full h-full bg-zinc-900">
        <Image
          src={LBurger}
          alt="Foody Culinary Promotion"
          fill
          priority
          sizes="(max-width:1024px) 1px, 50vw"
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="flex items-center bg-white justify-center p-6 md:p-12 overflow-y-auto">
        <AuthCard
          title="Welcome Back"
          subtitle="Good to see you again! Let's eat"
          activeTab="register"
        >
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
              ⚠ {errorMessage}
            </div>
          )}

          <form
            id="register-page"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <AuthInput
              id="name"
              placeholder="Name"
              register={register("name")}
              error={errors.name}
              autoComplete="name"
            />
            <AuthInput
              id="email"
              type="email"
              placeholder="Email"
              register={register("email")}
              error={errors.email}
              autoComplete="email"
            />
            <AuthInput
              id="phone"
              placeholder="Number Phone"
              register={register("phone")}
              error={errors.phone}
              autoComplete="tel"
            />
            <AuthInput
              id="register-password"
              type="password"
              placeholder="Password"
              register={register("password")}
              error={errors.password}
              autoComplete="new-password"
            />
            <AuthInput
              id="register-confirm-password"
              type="password"
              placeholder="Confirm Password"
              register={register("confirmPassword")}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#B81E1E] hover:bg-[#961818] text-white font-bold py-4 rounded-xl text-sm tracking-wide transition-all duration-200 mt-4 shadow-xs cursor-pointer flex items-center justify-center disabled:bg-gray-200"
            >
              {mutation.isPending ? "Registering account..." : "Register"}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
