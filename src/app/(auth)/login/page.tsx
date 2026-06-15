"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginSchema, type LoginInputs } from "@/lib/validations/auth";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
import LBurger from "../../../../public/images/Image-landscape-burger.png";
import AuthCard from "@/components/shared/AuthCard";
import AuthInput from "@/components/shared/AuthInput";

interface ApiErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const token = response.data.token;
      localStorage.setItem("token", token);

      // To trigger isLoggedIn for Navbar
      setToken(token);

      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-cart"] });

      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrorMessage(msg);
    },
  });

  const onSubmit = (data: LoginInputs) => {
    setErrorMessage(null);
    mutation.mutate(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white font-nunito">
      <div className="relative hidden lg:block w-full h-full bg-zinc-900">
        <Image
          src={LBurger}
          alt="Chicken cheese burger"
          fill
          priority
          sizes="(max-width:1024px) 1px, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <AuthCard
          title="Welcome Back"
          subtitle="Good to see you again! Let's eat"
          activeTab="login"
        >
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              {errorMessage}
            </div>
          )}
          <form
            id="login-page"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <AuthInput
              id="email"
              type="email"
              placeholder="Email"
              register={register("email")}
              error={errors.email}
              autoComplete="email"
            />

            <AuthInput
              id="login-current-password"
              type="password"
              placeholder="Password"
              register={register("password")}
              error={errors.password}
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#B81E1E] hover:bg-[#961818] text-white font-bold py-4 rounded-xl text-sm tracking-wide transition-all mt-4 shadow-sm cursor-pointer disabled:bg-gray-200"
            >
              {mutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
