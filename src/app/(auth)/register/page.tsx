"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, type RegisterUser } from "@/lib/validations/auth";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import type { AuthCardProps } from "@/types/user";
import AuthCard from "@/components/shared/AuthCard";
import Image from "next/image";
import Link from "next/link";
import LBurger from "../../../../public/images/Image-landscape-burger.png";
import Logo from "../../../../public/images/logo.svg";
import { error } from "console";
import { Eye, EyeClosed } from "lucide-react";

interface ApiErrorResponse {
  message?: string;
  // success?: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // 1. Setup React Hook Form terintegrasi dengan Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
  });

  // 2. Setup Mutation dari Tanstack Query untuk aksi POST Data
  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      // Jika berhasil, simpan token ke localStorage untuk otentikasi Axios kedepan
      localStorage.setItem("token", response.data.token);
      alert("Registration successfull! Routing to main page...");
      router.push("/"); // Alihkan user ke homepage resto
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      // Catch respon error 400 or 409 from backend
      const responseData = error.response?.data as { message?: string };
      const msg =
        responseData?.message || "Registration failed. Please try again.";
      setErrorMessage(msg);
    },
  });

  // 3. Fungsi eksekusi form submit
  const onSubmit = (data: RegisterUser) => {
    setErrorMessage(null);
    // clear confirm password prior sending to backend
    const { confirmPassword: _confirmPassword, ...payload } = data;
    mutation.mutate(payload);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white font-sans">
      {/* Kolom Kiri: Potret Gambar Burger (Hanya muncul di Desktop / lg keatas) */}
      <div className="relative hidden lg:block w-full h-full bg-zinc-900">
        <Image
          src={LBurger} // Pastikan foto burger figma kamu ditaruh di: public/images/auth-hero.png
          alt="Foody Culinary Promotion"
          fill
          priority // Di-load paling awal karena ini elemen LCP Hero Desktop
          sizes="(max-width:1024 1px, 50vw"
          unoptimized // Agar gambar tajam maksimal sesuai resolusi figma
          className="object-cover"
        />
      </div>

      {/* Kolom Kanan: Tempat Meletakkan Form Register Card */}
      <div className="flex items-center bg-white justify-center p-6 md:p-12 overflow-y-auto bg-white">
        <AuthCard
          title="Welcome Back"
          subtitle="Good to see you again! Let's eat"
          activeTab="register"
        >
          {/* Banner Notifikasi jika API error (misal 409: email already exist) */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100 animate-fade-in">
              ⚠ {errorMessage}
            </div>
          )}

          <form
            id="register-page"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* INPUT NAME */}
            <div className="flex flex-col gap-1">
              <input
                id="name"
                type="text"
                placeholder="Name"
                {...register("name")}
                autoComplete="name"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm focus:outline-hidden focus:border-gray-400 transition-all placeholder:text-gray-400"
              />
              {errors.name && (
                <span className="text-red-600 text-xs font-semibold pl-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* INPUT EMAIL */}
            <div className="flex flex-col gap-1">
              <input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm focus:outline-hidden focus:border-gray-400 transition-all placeholder:text-gray-400"
              />
              {errors.email && (
                <span className="text-red-600 text-xs font-semibold pl-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* INPUT PHONE */}
            <div className="flex flex-col gap-1">
              <input
                id="phone"
                type="text"
                placeholder="Number Phone"
                {...register("phone")}
                autoComplete="tel"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm focus:outline-hidden focus:border-gray-400 transition-all placeholder:text-gray-400"
              />
              {errors.phone && (
                <span className="text-red-600 text-xs font-semibold pl-1">
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* INPUT PASSWORD */}
            <div className="flex flex-col gap-1">
              <div className="relative w-full">
                <input
                  id="regiter-new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  autoComplete="new-password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 text-black text-sm focus:outline-hidden focus:border-gray-400 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold select-none cursor-pointer"
                >
                  {showPassword ? (
                    <Image
                      src="/icons/icon-eye.svg"
                      alt="Icon an eye"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/icons/icon-eye-off.svg"
                      alt="icon an eye closed"
                      width={24}
                      height={24}
                    />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-600 text-xs font-semibold pl-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* INPUT CONFIRM PASSWORD */}
            <div className="flex flex-col gap-1">
              <div className="relative w-full">
                <input
                  id="register-confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 text-black text-sm focus:outline-hidden focus:border-gray-400 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold select-none cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <Image
                      src="/icons/icon-eye.svg"
                      alt="Icon an eye"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/icons/icon-eye-off.svg"
                      alt="icon an eye closed"
                      width={24}
                      height={24}
                    />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-600 text-xs font-semibold pl-1">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* TOMBOL SUBMIT MERAH MERDU */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#B81E1E] hover:bg-[#961818] active:bg-[#751313] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl text-sm tracking-wide transition-all duration-200 mt-4 shadow-xs cursor-pointer flex items-center justify-center"
            >
              {mutation.isPending ? "Registering account..." : "Register"}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
