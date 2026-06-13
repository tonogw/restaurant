"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import AuthCard from "@/components/shared/AuthCard";
import { authService } from "@/services/authService";
import { cartService } from "@/services/cartService";
import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import { LoginInputs, loginSchema } from "@/lib/validations/auth";
import { registerSchema, type RegisterUser } from "@/lib/validations/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { navbarLinks } from "@/constant/navbar-data";

export default function Navbar({
  isLightPage = false,
}: {
  isLightPage?: boolean;
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  // const logout = useAuthStore((state) => state.logout);

  const isBlackText = scrolled || isLightPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loginForm = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  // MUTATION PIPELINE API @tanstack query
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setErrorMessage(null);
      loginForm.reset();
      alert("Login successful!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setErrorMessage(error.response?.data?.message || "Invalid credentials.");
      // IF ERROR ROUTE TO /login
      router.push("/login");
    },
  });

  const registerForm = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (response) => {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setErrorMessage(null);
      registerForm.reset();
      alert("Registration successful!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setErrorMessage(error.response?.data?.message || "Registration failed.");
      router.push("/register");
    },
  });

  // @tanstack query auto callback profile data
  const { data: profileData, isSuccess } = useQuery({
    queryKey: ["user-profile", token],
    queryFn: () => authService.profile(),
    enabled: !!token,
  });

  const endUser = profileData?.data;
  const isLoggedIn = !!token && isSuccess && endUser;

  const { data: cartResponse } = useQuery({
    queryKey: ["user-cart"],
    queryFn: cartService.getCart,
    enabled: !!token,
  });

  const totalCartItems = cartResponse?.data?.summary?.total_items || 0;

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${isBlackText ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"}`}
    >
      <div className="custom-container h-16 md:h-20 flex items-center justify-between">
        {/* SISI KIRI: LOGO */}
        <Link href="/" className="flex items-center gap-3 select-none">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={42}
            height={42}
            unoptimized
          />
          <span
            className={`text-2xl font-bold tracking-tight ${isBlackText ? "text-gray-900" : "text-white"}`}
          >
            Foody
          </span>
        </Link>

        {/* RIGHT BLOK */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            // ================= SCREEN: AFTER LOGIN =================
            <div className="flex items-center gap-4 select-none">
              <Link
                href="/cart"
                className="relative p-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons/icon-bag-white.svg"
                  alt="White bag"
                  width="24"
                  height="24"
                  className={isBlackText ? "hidden" : "block"}
                />

                {totalCartItems > 0 && (
                  <Image
                    src="/icons/icon-bag-black.svg"
                    alt="Black bag"
                    width={32}
                    height={32}
                    className={isBlackText ? "block" : "hidden"}
                  />
                )}
                <span className="absolute -top-1 -right-1 bg-[#C12116] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                  {totalCartItems}
                </span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 group cursor-pointer"
              >
                {/* ROUTE TO PROFILE PAGE */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-700 border-2 border-amber-500">
                  <Image
                    src={endUser.avatar || "/images/avatar-placeholder.png"}
                    alt={endUser.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <span
                  className={`text-sm font-bold tracking-tight ${isBlackText ? "text-gray-800" : "text-white"}`}
                >
                  {endUser.name}
                </span>
              </Link>
            </div>
          ) : (
            // ================= SCREEN: BEFORE LOGIN =================
            <div className="flex items-center gap-4">
              {/* ===  SHEET LOGIN === */}
              <Sheet>
                <SheetTitle className="hidden">Login Panel</SheetTitle>
                <SheetDescription className="hidden">
                  Enter credentials
                </SheetDescription>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`font-bold text-sm rounded-xl border border-gray-400 px-14 py-2.25 cursor-pointer ${isBlackText ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                  >
                    Sign In
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md lg:max-w-180 bg-white p-8 flex items-center justify-center border-l border-gray-100"
                >
                  <AuthCard
                    title="Welcome Back"
                    subtitle="Good to see you again! Let's eat"
                    activeTab="login"
                  >
                    {errorMessage && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                        ⚠ {errorMessage}
                      </div>
                    )}
                    <form
                      onSubmit={loginForm.handleSubmit((data) =>
                        loginMutation.mutate(data),
                      )}
                      className="space-y-4 mt-2"
                    >
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...loginForm.register("email")}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm"
                      />
                      <div className="relative w-full">
                        <input
                          id="current-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          autoComplete="current-password"
                          {...loginForm.register("password")}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm"
                        />
                        {/* TOGGLE SHOW PASSWORD */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer p-1"
                        >
                          {showPassword ? (
                            <Image
                              src="/icons/icon-eye-off.svg"
                              alt="icon sebuah mata menutup"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <Image
                              src="/icons/icon-eye.svg"
                              alt="icon sebuat mata"
                              width={24}
                              height={24}
                            />
                          )}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#C12116] text-white font-bold py-3 rounded-full"
                      >
                        Login
                      </button>
                    </form>
                  </AuthCard>
                </SheetContent>
              </Sheet>

              {/* === SHEET REGISTER === */}
              <Sheet>
                <SheetTitle className="hidden">Register Panel</SheetTitle>
                <SheetDescription className="hidden">
                  Create an account
                </SheetDescription>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className={`font-bold text-sm rounded-xl py-2.25 px-[52.5px] cursor-pointer ${isBlackText ? "bg-[#C12116] text-white hover:bg-[#961818]" : "bg-white text-black hover:bg-gray-100"}`}
                  >
                    Register
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md lg:max-w-180 bg-white p-8 flex items-center justify-center border-l border-gray-100"
                >
                  <AuthCard
                    title="Welcome to Foody"
                    subtitle="Glad you're here! Let's get started"
                    activeTab="register"
                  >
                    <form
                      onSubmit={registerForm.handleSubmit((data) => {
                        const { confirmPassword: _, ...payload } = data;
                        registerMutation.mutate(payload);
                      })}
                      className="space-y-3 mt-2"
                    >
                      <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        autoComplete="name"
                        {...registerForm.register("name")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                      />
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...registerForm.register("email")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                      />
                      <input
                        id="phone"
                        type="text"
                        placeholder="Phone Number"
                        autoComplete="tel"
                        {...registerForm.register("phone")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                      />
                      <div className="relative w-full">
                        <input
                          id="nav-new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          autoComplete="new-password"
                          {...registerForm.register("password")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                        />
                        {/* TOGGLE SHOW PASSWORD */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer p-1"
                        >
                          <Image
                            src={
                              showPassword
                                ? "/icons/icon-eye.svg"
                                : "/icons/icon-eye-off.svg"
                            }
                            alt="toggle password visibility"
                            width={24}
                            height={24}
                          />
                        </button>
                      </div>
                      <div className="relative w-full ">
                        <input
                          id="nav-confirm-new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          autoComplete="new-password"
                          {...registerForm.register("confirmPassword")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                        />
                        {/* TOGGLE SHOW PASSWORD */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer p-1"
                        >
                          <Image
                            src={
                              showPassword
                                ? "/icons/icon-eye.svg"
                                : "/icons/icon-eye-off.svg"
                            }
                            alt="toggle password visibility"
                            width={24}
                            height={24}
                          />
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#C12116] text-white font-bold py-3 rounded-full mt-2"
                      >
                        Register
                      </button>
                    </form>
                  </AuthCard>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
