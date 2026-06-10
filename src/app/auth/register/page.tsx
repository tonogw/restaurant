"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, type RegisterUser } from "@/lib/validations/auth";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import LBurger from "../../../../public/images/Image-landscape-burger.png";
import Image from "next/image";
import Logo from "../../../../public/images/logo.svg";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  success?: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      alert("Registrasi sukses! Mengalihkan ke halaman utama...");
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
    <></>
    // <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-zinc-50 font-sans ">
    //   {/* Desktop: Left side backdrop image */}
    //   <div className="relative hidden lg:block w-full min-h-screen  bg-white p-8  border-gray-100 shadow-xs">
    //     <Image
    //       src={LBurger}
    //       alt="Chicken cheese burger"
    //       fill
    //       priority
    //       className="object-cover"
    //     ></Image>
    //   </div>

    //   {/* Right side Form input */}
    //   <div className="flex items-center justify-center p-8 lg:p-16 xl:p-24 text-center overflow-y-auto">
    //     <div className="w-full max-w-93.5 space-y-8">
    //       {/* Header brand */}
    //       <div className="flex items-center gap-3">
    //         <div className="relative w-8 h-8">
    //           <Image src={Logo} alt="Foody logo" className="object-contain" />
    //         </div>
    //         <span className="text-2xl font-bold text-black">Foody</span>
    //       </div>

    //       {/* Welcome Text */}
    //       <div className="space-y-1">
    //         <h1 className="text-display-3xl font-bold text-gray-900 tracking-tight">
    //           Welcome Back
    //         </h1>
    //         <p className="text-gray-500 text-sm mt-1 font-medium">
    //           Good to see you again! Let&apos;s eat
    //         </p>
    //       </div>
    //       {/* Toggle capsule navigation Sign in/up */}
    //       <div className="p-1 bg-gray-100 rounded-xl flex w-full">
    //         <Link
    //           href="/auth/login"
    //           className="w-1/2 text-center py-2 text-sm font-semibold text-gray-500 rounded-lg hover:text-gray-900 transition-all"
    //         >
    //           Sing in
    //         </Link>
    //         <div className="w-1/2 text-center py-2 text-sm font-semibold text-gray-900 bg-white rounded-lg shadow-xs">
    //           Sign up
    //         </div>
    //       </div>
    //       {/* Error banner global */}
    //       {errorMessage && (
    //         <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
    //           {errorMessage}
    //         </div>
    //       )}

    //       {/* Form content */}
    //       <form
    //         onSubmit={handleSubmit(onSubmit)}
    //         action="
    //       submit
    //       "
    //         className="space-y-5"
    //       ></form>
    //     </div>
    //   </div>

    //   {/* Notifikasi Global Error (Misal: User Already Exists / 409) */}
    //   {errorMessage && (
    //     <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
    //       ⚠ {errorMessage}
    //     </div>
    //   )}

    //   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    //     {/* INPUT NAME */}
    //     <div className="flex flex-col gap-1.5">
    //       <label className="text-gray-700 font-medium text-sm">Full Name</label>
    //       <input
    //         type="text"
    //         placeholder="John Doe"
    //         {...register("name")}
    //         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-black text-sm transition-all"
    //       />
    //       {errors.name && (
    //         <span className="text-red-500 text-xs font-medium">
    //           {errors.name.message}
    //         </span>
    //       )}
    //     </div>

    //     {/* INPUT EMAIL */}
    //     <div className="flex flex-col gap-1.5">
    //       <label className="text-gray-700 font-medium text-sm">
    //         Email Address
    //       </label>
    //       <input
    //         type="email"
    //         placeholder="john@example.com"
    //         {...register("email")}
    //         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-black text-sm transition-all"
    //       />
    //       {errors.email && (
    //         <span className="text-red-500 text-xs font-medium">
    //           {errors.email.message}
    //         </span>
    //       )}
    //     </div>

    //     {/* INPUT PHONE */}
    //     <div className="flex flex-col gap-1.5">
    //       <label className="text-gray-700 font-medium text-sm">
    //         Phone Number
    //       </label>
    //       <input
    //         type="text"
    //         placeholder="081234567890"
    //         {...register("phone")}
    //         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-black text-sm transition-all"
    //       />
    //       {errors.phone && (
    //         <span className="text-red-500 text-xs font-medium">
    //           {errors.phone.message}
    //         </span>
    //       )}
    //     </div>

    //     {/* INPUT PASSWORD */}
    //     <div className="flex flex-col gap-1.5">
    //       <label className="text-gray-700 font-medium text-sm">Password</label>
    //       <input
    //         type="password"
    //         placeholder="••••••••"
    //         {...register("password")}
    //         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-black text-sm transition-all"
    //       />
    //       {errors.password && (
    //         <span className="text-red-500 text-xs font-medium">
    //           {errors.password.message}
    //         </span>
    //       )}
    //     </div>

    //     {/* TOMBOL SUBMIT */}
    //     <button
    //       type="submit"
    //       disabled={mutation.isPending}
    //       className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-black font-semibold py-3 rounded-xl shadow-xs transition-all duration-200 mt-2 text-sm"
    //     >
    //       {mutation.isPending ? "Registering account..." : "Sign Up"}
    //     </button>
    //   </form>

    //   <div className="text-center text-sm text-gray-500 pt-2">
    //     Already have an account?{" "}
    //     <Link
    //       href="/auth/login"
    //       className="text-amber-600 font-semibold hover:underline"
    //     >
    //       Sign In
    //     </Link>
    //   </div>
    // </div>
  );
}
