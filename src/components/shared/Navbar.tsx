"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import { Check, Menu } from "lucide-react";

interface NavbarProps {
  isLightPage?: boolean;
  cartCount?: number;
}

export default function Navbar({
  isLightPage = false,
  cartCount,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname(); // ✓ Hook dipanggil di paling atas, aman!

  const [scrolled, setScrolled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);

  const isBlackText = scrolled || isLightPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loginForm = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setStatusMessage({
        text: "Logged in successfully, welcome!",
        type: "success",
      });
      loginForm.reset();
      setTimeout(() => {
        setIsLoginOpen(false);
        setStatusMessage(null);
        window.location.href = "/";
      }, 1500);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setStatusMessage({
        text: error.response?.data?.message || "Email or password is invalid",
        type: "error",
      });
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
      setStatusMessage({
        text: "Congratulations! Your Foody account was successfully registered.",
        type: "success",
      });
      registerForm.reset();
      setTimeout(() => {
        setIsRegisterOpen(false);
        setStatusMessage(null);
        window.location.href = "/";
      }, 1500);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setStatusMessage({
        text:
          error.response?.data?.message ||
          "Registration failed. Email already exists.",
        type: "error",
      });
    },
  });

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

  const totalCartItems =
    cartCount !== undefined
      ? cartCount
      : cartResponse?.data?.summary?.totalItems || 0;

  //
  //  if (pathname === "/login" || pathname === "/register") {
  //     return null;
  //   }

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${isBlackText ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"}`}
    >
      <div className="custom-container h-16 md:h-20 flex items-center justify-between  ">
        {/* ================= SISI KIRI: LOGO DINAMIS ================= */}
        <Link href="/" className="flex items-center gap-3 select-none">
          <Image
            src={isBlackText ? "/images/logo.svg" : "/images/logo-white.svg"}
            alt="logo"
            width={42}
            height={42}
            unoptimized
          />
          <span
            className={`text-2xl font-bold tracking-tight hidden md:block ${isBlackText ? "text-gray-900" : "text-white"}`}
          >
            Foody
          </span>
        </Link>

        {/* ================= SISI KANAN: NAVIGATION AREA ================= */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            // ================= KONDISI 1: USER SUDAH LOGIN =================
            <div className="flex items-center gap-4 select-none">
              {/* TAS KERANJANG */}
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
                <Image
                  src="/icons/icon-bag-black.svg"
                  alt="Black bag"
                  width={32}
                  height={32}
                  className={isBlackText ? "block" : "hidden"}
                />
                <span className="absolute -top-1 -right-1 bg-[#C12116] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalCartItems}
                </span>
              </Link>

              {/* AVATAR BUNDAR DAN SHEET PROFILE (SIDE TOP) */}
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex items-center gap-2 group cursor-pointer select-none">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-700 border-2 border-amber-500 flex-shrink-0">
                      <Image
                        src={endUser.avatar || "/images/avatar-placeholder.png"}
                        alt={endUser.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span
                      className={`text-sm font-bold tracking-tight hidden md:block ${isBlackText ? "text-gray-800" : "text-white"}`}
                    >
                      {endUser.name}
                    </span>
                  </div>
                </SheetTrigger>
                <SheetContent
                  side="top"
                  className="w-full max-w-60 md:max-w-159.5 lg:max-w-180 bg-white border-b border-gray-100 p-6 flex flex-col items-center justify-center shadow-lg rounded-2xl"
                >
                  <SheetTitle className="hidden">
                    User Profile Navigation
                  </SheetTitle>
                  <SheetDescription className="hidden">
                    Quick links for user configuration
                  </SheetDescription>
                  <div className="w-full max-w-xs bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={
                            endUser.avatar || "/images/avatar-placeholder.png"
                          }
                          alt={endUser.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-extrabold text-gray-900 text-sm">
                        {endUser.name}
                      </span>
                    </div>
                    <Link
                      href="/address"
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 font-bold text-xs py-1 transition-colors"
                    >
                      <Image
                        src="/icons/icon-delivery-address.svg"
                        alt="address"
                        width={16}
                        height={16}
                        className="text-gray-400"
                      />{" "}
                      Delivery Address
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 text-gray-600 hover:text-gray-900 font-bold text-xs py-1 transition-colors"
                    >
                      <Image
                        src="/icons/icon-bag-black.svg"
                        alt="bag"
                        width={16}
                        height={16}
                        className="text-gray-400"
                      />{" "}
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        useAuthStore.setState({ token: null });
                        setIsLoginOpen(false);
                        setIsRegisterOpen(false);
                        window.location.href = "/";
                      }}
                      className="flex items-center gap-3 text-red-600 hover:text-red-700 font-bold text-xs py-1 w-full text-left cursor-pointer transition-colors"
                    >
                      <Image
                        src="/icons/icon-logout.svg"
                        alt="logout"
                        width={16}
                        height={16}
                        className="text-red-400"
                      />{" "}
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            // ================= KONDISI 2: USER BELUM LOGIN =================
            <div className="flex items-center gap-4">
              {/* DESKTOP VIEW */}
              <div className="hidden md:flex items-center gap-4">
                {/* SHEET LOGIN DESKTOP */}
                <Sheet
                  open={isLoginOpen}
                  onOpenChange={(open) => {
                    setIsLoginOpen(open);
                    if (!open) setStatusMessage(null);
                  }}
                >
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
                      {statusMessage && (
                        <div
                          className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${statusMessage.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-600"}`}
                        >
                          <Check size={16} />
                          {statusMessage.text}
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
                          {...loginForm.register("email")}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm"
                        />
                        <div className="relative w-full">
                          <input
                            id="current-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...loginForm.register("password")}
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                          >
                            <Image
                              src={
                                showPassword
                                  ? "/icons/icon-eye-off.svg"
                                  : "/icons/icon-eye.svg"
                              }
                              alt="eye"
                              width={24}
                              height={24}
                            />
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

                {/* SHEET REGISTER DESKTOP */}
                <Sheet
                  open={isRegisterOpen}
                  onOpenChange={(open) => {
                    setIsRegisterOpen(open);
                    if (!open) setStatusMessage(null);
                  }}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className={`font-bold text-sm rounded-xl py-2.25 px-[52.5px] cursor-pointer ${isBlackText ? "bg-[#C12116] text-white hover:bg-[#961818]" : "bg-white text-black hover:bg-gray-100"}`}
                    >
                      Sign Up
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
                      {statusMessage && (
                        <div
                          className={`mb-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${statusMessage.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-600"}`}
                        >
                          <Check size={16} />
                          {statusMessage.text}
                        </div>
                      )}
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
                          {...registerForm.register("name")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                        />
                        <input
                          id="email"
                          type="email"
                          placeholder="Email"
                          {...registerForm.register("email")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                        />
                        <input
                          id="phone"
                          type="text"
                          placeholder="Phone Number"
                          {...registerForm.register("phone")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                        />
                        <div className="relative w-full">
                          <input
                            id="nav-new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...registerForm.register("password")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                          >
                            <Image
                              src={
                                showPassword
                                  ? "/icons/icon-eye-off.svg"
                                  : "/icons/icon-eye.svg"
                              }
                              alt="eye"
                              width={24}
                              height={24}
                            />
                          </button>
                        </div>
                        <div className="relative w-full">
                          <input
                            id="nav-confirm-new-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...registerForm.register("confirmPassword")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                          >
                            <Image
                              src={
                                showConfirmPassword
                                  ? "/icons/icon-eye-off.svg"
                                  : "/icons/icon-eye.svg"
                              }
                              alt="eye"
                              width={24}
                              height={24}
                            />
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#C12116] text-white font-bold py-3 rounded-full mt-2"
                        >
                          Sign Up
                        </button>
                      </form>
                    </AuthCard>
                  </SheetContent>
                </Sheet>
              </div>

              {/* MOBILE VIEW */}
              <div className="md:hidden">
                <Sheet
                  open={isLoginOpen || isRegisterOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsLoginOpen(false);
                      setIsRegisterOpen(false);
                      setStatusMessage(null);
                    }
                  }}
                >
                  <SheetTrigger asChild>
                    <button
                      onClick={() => setIsLoginOpen(true)}
                      className={`p-2 cursor-pointer focus:outline-hidden ${isBlackText ? "text-gray-900" : "text-white"}`}
                    >
                      <Menu size={24} />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:max-w-md bg-white p-8 flex flex-col items-center justify-center border-l border-gray-100 overflow-y-auto"
                  >
                    <SheetTitle className="text-xl font-extrabold text-gray-900 mb-2">
                      Foody Portal Access
                    </SheetTitle>
                    <SheetDescription className="text-gray-400 text-xs text-center mb-6">
                      Please login or register to explore our best delicacies.
                    </SheetDescription>

                    {isLoginOpen ? (
                      <AuthCard
                        title="Welcome Back"
                        subtitle="Good to see you again! Let's eat"
                        activeTab="login"
                      >
                        {statusMessage && (
                          <div
                            className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${statusMessage.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-600"}`}
                          >
                            <Check size={16} />
                            {statusMessage.text}
                          </div>
                        )}
                        <form
                          onSubmit={loginForm.handleSubmit((data) =>
                            loginMutation.mutate(data),
                          )}
                          className="space-y-4 w-full max-w-xs mx-auto"
                        >
                          <input
                            id="email-mobile"
                            type="email"
                            placeholder="Email"
                            {...loginForm.register("email")}
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm"
                          />
                          <div className="relative w-full">
                            <input
                              id="password-mobile"
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              {...loginForm.register("password")}
                              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                            >
                              <Image
                                src={
                                  showPassword
                                    ? "/icons/icon-eye-off.svg"
                                    : "/icons/icon-eye.svg"
                                }
                                alt="toggle"
                                width={24}
                                height={24}
                              />
                            </button>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-[#C12116] text-white font-bold py-3 rounded-full"
                          >
                            Login
                          </button>
                          <p className="text-xs text-center mt-4 text-gray-500">
                            Don&apos;t have an account?{" "}
                            <span
                              onClick={() => {
                                setIsLoginOpen(false);
                                setIsRegisterOpen(true);
                                setStatusMessage(null);
                              }}
                              className="text-[#C12116] font-bold cursor-pointer hover:underline"
                            >
                              Sign Up
                            </span>
                          </p>
                        </form>
                      </AuthCard>
                    ) : (
                      <AuthCard
                        title="Welcome to Foody"
                        subtitle="Glad you're here! Let's get started"
                        activeTab="register"
                      >
                        {statusMessage && (
                          <div
                            className={`mb-4 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${statusMessage.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-600"}`}
                          >
                            <Check size={16} />
                            {statusMessage.text}
                          </div>
                        )}
                        <form
                          onSubmit={registerForm.handleSubmit((data) => {
                            const { confirmPassword: _, ...payload } = data;
                            registerMutation.mutate(payload);
                          })}
                          className="space-y-3 w-full max-w-xs mx-auto"
                        >
                          <input
                            id="name-mobile"
                            type="text"
                            placeholder="Name"
                            {...registerForm.register("name")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                          />
                          <input
                            id="email-mobile"
                            type="email"
                            placeholder="Email"
                            {...registerForm.register("email")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                          />
                          <input
                            id="phone-mobile"
                            type="text"
                            placeholder="Phone Number"
                            {...registerForm.register("phone")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                          />
                          <div className="relative w-full">
                            <input
                              id="pass-mobile"
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              {...registerForm.register("password")}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                            >
                              <Image
                                src={
                                  showPassword
                                    ? "/icons/icon-eye-off.svg"
                                    : "/icons/icon-eye.svg"
                                }
                                alt="eye"
                                width={24}
                                height={24}
                              />
                            </button>
                          </div>
                          <div className="relative w-full">
                            <input
                              id="conf-pass-mobile"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm Password"
                              {...registerForm.register("confirmPassword")}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black text-sm"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                            >
                              <Image
                                src={
                                  showConfirmPassword
                                    ? "/icons/icon-eye-off.svg"
                                    : "/icons/icon-eye.svg"
                                }
                                alt="eye"
                                width={24}
                                height={24}
                              />
                            </button>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-[#C12116] text-white font-bold py-3 rounded-full mt-2"
                          >
                            Sign Up
                          </button>
                          <p className="text-xs text-center mt-4 text-gray-500">
                            Already have an account?{" "}
                            <span
                              onClick={() => {
                                setIsRegisterOpen(false);
                                setIsLoginOpen(true);
                                setStatusMessage(null);
                              }}
                              className="text-[#C12116] font-bold cursor-pointer hover:underline"
                            >
                              Sign In
                            </span>
                          </p>
                        </form>
                      </AuthCard>
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
