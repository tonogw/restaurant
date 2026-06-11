import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import AuthCard from "@/components/shared/AuthCard";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    // MAIN CONTAINER w-full device screen
    <header
      className={`
      fixed top-0 left-0 z-50 w-full transition-all duration-300
      ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b bprder-gray-100"
          : "bg-transparent"
      }
      `}
    >
      {/* NAVBAR CONTAINER w-max 1200px */}
      <div
        // className={`
        // flex-between custom-container h-16 md:h-20
        // ${scrolled ? "bg-white backdrop-blur-md text-black" : "bg-tranparent"}
        // `}
        className="
        custom-container h-16 md:h-20 flex items-center justify-between
        "
      >
        {/* Image Logo */}
        <div className="flex items-center select-none gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={42}
              height={42}
              unoptimized
              className="object-contain"
            />
          </div>
          {/* WHEN SCROLLED change color */}
          <span
            className={`
            font-bold text-3xl tracking-tight transition-colors
            ${scrolled ? "text-gray-900" : "text-white"}
            `}
          >
            Foody
          </span>
        </div>

        {/* RIGHT BLOK: AuthButton shadcn sheet slide-left */}
        <div className="flex items-center gap-4">
          {/* LOGIN BUTTON */}
          <Sheet>
            {/* BUTTON TRIGGER for sign in */}
            <SheetTitle title="Sheet Login" />
            <SheetDescription aria-description="Sheet Login" />
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={`
                font-bold text-sm rounded-xl cursor-pointer transition-colors
                hover:bg-gray-300
                ${
                  scrolled
                    ? "text-gray-700 hover:text-black hover:bg-gray-100"
                    : "text-white hover:text-gray-200 hover:bg-white/10"
                }
                `}
              >
                Sign In
              </Button>
            </SheetTrigger>

            {/* SLIDE IN PANEL from right to left */}
            <SheetContent
              side="right"
              className="w-full sm:max-w-md lg:max-w-180 bg-white p-8 flex items-center justify-center border-l border-gray-100"
            >
              <div className="w-full flex justify-center">
                {/* CALLBACK AuthCard */}
                <AuthCard
                  title="Welcome Back"
                  subtitle="Good to see you again! Let's eat"
                  activeTab="login"
                >
                  <form
                    className="
                  space-y-4 mt-2
                  "
                  >
                    <input
                      type="text"
                      placeholder="Email"
                      autoComplete="email"
                      className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm
                    "
                    />
                    <input
                      type="text"
                      placeholder="Password"
                      autoComplete="current-password"
                      className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm 
                    "
                    />
                    <button
                      type="submit"
                      className="
                    w-full bg-[##C12116] text-neutral-25 font-bold py-2.25 rounded-full px-[152.5px] lg:px-41.75 
                    hover:bg-[#fdfdfd]
                    "
                    >
                      Login
                    </button>
                  </form>
                </AuthCard>
              </div>
            </SheetContent>
          </Sheet>

          {/* REGISTER */}
          <Sheet>
            {/* BUTTON TRIGGER for sign in */}
            <SheetTitle title="Sheet Login" />
            <SheetDescription aria-description="Sheet Login" />
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={`
                font-bold text-sm rounded-xl cursor-pointer transition-colors
                hover:bg-[#fdfdfd]
                ${
                  scrolled
                    ? "text-gray-700 hover:text-black hover:bg-gray-100"
                    : "text-white hover:text-gray-200 hover:bg-white/10"
                }
                `}
              >
                Register
              </Button>
            </SheetTrigger>

            {/* SLIDE IN PANEL from right to left */}
            <SheetContent
              side="right"
              className="w-full sm:max-w-md lg:max-w-180 bg-white p-8 flex items-center justify-center border-l border-gray-100"
            >
              <div className="w-full flex justify-center">
                {/* CALLBACK AuthCard */}
                <AuthCard
                  title="Welcome to Foody"
                  subtitle="Glad you're here! Let's get started"
                  activeTab="register"
                >
                  <form
                    className="
                  space-y-4 mt-2
                  "
                  >
                    <input
                      type="text"
                      placeholder="Name"
                      autoComplete="name"
                      className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm 
                    "
                    />

                    <input
                      type="text"
                      placeholder="Email"
                      autoComplete="email"
                      className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm
                    "
                    />

                    <input
                      type="text"
                      placeholder="Phone Number"
                      autoComplete="tel"
                      className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm 
                    "
                    />

                    <input
                      type="text"
                      placeholder="Password"
                      autoComplete="new-password"
                      className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm 
                    "
                    />

                    <input
                      type="text"
                      placeholder="Confirm Password"
                      autoComplete="confirm-new-password"
                      className="
                    w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm 
                    "
                    />
                    <button
                      type="submit"
                      className="
                    w-full bg-[##C12116] text-neutral-25 font-bold py-2.25 rounded-full px-[152.5px] lg:px-41.75 
                    "
                    >
                      Register
                    </button>
                  </form>
                </AuthCard>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
