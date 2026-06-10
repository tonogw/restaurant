"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginInputs } from "@/lib/validations/auth";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";
import LBurger from "../../../../public/images/Image-landscape-burger.png";
import AuthCard from "@/components/shared/AuthCard";
import Link from "next/link";
import { Span } from "next/dist/trace";
import { Eye, EyeClosed } from "lucide-react";

// type Inputs = {
//   example: string;
//   exampleRequired: string;
// };

interface ApiErrorResponse {
  message?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      // Save token into browser
      localStorage.setItem("token", response.data.token);
      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const msg =
        error.response?.data?.message ||
        "Login failed. Please check your credential.";
      setErrorMessage(msg);
    },
  });

  const onSubmit = (data: LoginInputs) => {
    setErrorMessage(null);
    mutation.mutate(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white font-nunito">
      {/* Left keep use same backdrop to be consistent */}
      <div className="relative hidden lg:block w-full h-full bg-zinc-900">
        <Image
          src={LBurger}
          alt="Chicken cheese burger"
          fill
          priority
          sizes="(max-width:1024 1px, 50vw"
          className="object-cover"
        />
      </div>

      {/* Right blok with AuthCard */}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Input email */}
            <div className="flex flex-col gap-1">
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm focus:outline-hidden focus:border-gray-400 transition-all placeholder:text-gray-400"
              />
              {errors.email && (
                <span
                  className="
          text-red-600 text-xs font-semibold pl-1
          "
                >
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Input Password */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                autoComplete="current-password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl 
            border border-gray-200 text-black text-sm 
            focus:outline-hidden focus:border-gray-400 transition-all
            placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600
            text-xs font-semibold select-none cursor-pointer
            "
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#B81E1E] hover:bg-[#961818]
          text-white font-bold py-4 rounded-xl text-sm
          tracking-wide transition-all mt-4 shadow-sm cursor-pointer
          "
            >
              {mutation.isPending ? "signing in..." : "Sign in"}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
