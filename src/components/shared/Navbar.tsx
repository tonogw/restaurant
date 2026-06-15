"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { authService } from "@/services/authService";
import { cartService } from "@/services/cartService";
import { useAuthStore } from "@/store/useAuthStore";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isLightPage?: boolean;
  cartCount?: number;
}

export default function Navbar({
  isLightPage = false,
  cartCount,
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);

  const isBlackText = scrolled || isLightPage;

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken && !token) {
      setToken(localToken);
    }
  }, [token, setToken]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const cleanPath = pathname?.trim().toLowerCase();
  if (
    cleanPath === "/login" ||
    cleanPath === "/register" ||
    cleanPath?.startsWith("/login") ||
    cleanPath?.startsWith("/register")
  ) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${isBlackText ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"}`}
    >
      <div className="custom-container h-16 md:h-20 flex items-center justify-between px-4 md:px-6">
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

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 md:gap-4 select-none">
              <Link
                href="/cart"
                className="relative p-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/icons/icon-bag-white.svg"
                  alt="White bag"
                  width={24}
                  height={24}
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

              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex items-center gap-2 group cursor-pointer select-none">
                    {/* ✓ SOLUSI FOTO TERPOTONG: object-center object-cover memastikan muka bini simetris di tengah */}
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-700 border-2 border-amber-500 flex-shrink-0">
                      <Image
                        src={endUser.avatar || "/images/avatar-placeholder.png"}
                        alt={endUser.name}
                        fill
                        unoptimized
                        className="object-cover object-center"
                      />
                    </div>
                    <span
                      className={`text-sm font-bold tracking-tight hidden md:block ${isBlackText ? "text-gray-800" : "text-white"}`}
                    >
                      {endUser.name}
                    </span>
                  </div>
                </SheetTrigger>

                {/* ✓ MATCH DESIGN DROPDOWN: Muncul tepat di bawah avatar sebelah kanan sesuai visual Menu (1).png */}
                <SheetContent
                  side="top"
                  className="absolute top-16 md:top-20 right-4 md:right-6 left-auto w-72 bg-white border border-gray-100 p-4 shadow-xl rounded-2xl flex flex-col gap-3 z-50 transform translate-x-0"
                >
                  <SheetTitle className="hidden">
                    User Profile Navigation
                  </SheetTitle>
                  <SheetDescription className="hidden">
                    Quick links
                  </SheetDescription>

                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={endUser.avatar || "/images/avatar-placeholder.png"}
                        alt={endUser.name}
                        fill
                        unoptimized
                        className="object-cover object-center"
                      />
                    </div>
                    <span className="font-extrabold text-gray-900 text-sm truncate">
                      {endUser.name}
                    </span>
                  </div>

                  {/* NAVIGASI 1: DETAIL PROFIL */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 text-gray-600 hover:text-[#C12116] font-bold text-xs py-2 px-1 rounded-xl hover:bg-gray-50/50 transition-all"
                  >
                    <Image
                      src="/icons/icon-delivery-address.svg"
                      alt="address"
                      width={16}
                      height={16}
                    />
                    Profile / Delivery Address
                  </Link>

                  {/* ✓ TARGET UTAMA NAVIGASI JEMBATAN USER: Menyambungkan Link ke halaman My Orders */}
                  <Link
                    href="/orders"
                    className="flex items-center gap-3 text-gray-600 hover:text-[#C12116] font-bold text-xs py-2 px-1 rounded-xl hover:bg-gray-50/50 transition-all"
                  >
                    <span className="text-sm">📄</span>
                    My Orders / Transactions
                  </Link>

                  {/* NAVIGASI 3: LOGOUT AKSES */}
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      useAuthStore.setState({ token: null });
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 font-bold text-xs py-2 px-1 rounded-xl w-full text-left cursor-pointer transition-all"
                  >
                    <Image
                      src="/icons/icon-logout.svg"
                      alt="logout"
                      width={16}
                      height={16}
                    />
                    Logout Account
                  </button>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className={`font-bold text-sm rounded-xl border border-gray-400 px-14 py-2.25 cursor-pointer ${isBlackText ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className={`font-bold text-sm rounded-xl py-2.25 px-[52.5px] cursor-pointer ${isBlackText ? "bg-[#C12116] text-white hover:bg-[#961818]" : "bg-white text-black hover:bg-gray-100"}`}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
              <div className="md:hidden">
                <Link
                  href="/login"
                  className={`p-2 cursor-pointer focus:outline-hidden ${isBlackText ? "text-gray-900" : "text-white"}`}
                >
                  <Menu size={24} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
