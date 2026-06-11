import Image from "next/image";
import { useState, useEffect } from "react";

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
    <header className="fixed top-0 z-50 w-full">
      <div
        className={`
        flex-between custom-container h-16 md:h-20
        ${scrolled ? "bg-white backdrop-blur-md text-black" : "bg-tranparent"}
        `}
      >
        {/* Image Logo */}
        <div className="flex gap-3">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={42}
            height={42}
            unoptimized
            className="max-w-10 max-h-10"
          />
          <span className="text-white font-bold text-3xl">Foody</span>
        </div>
      </div>
    </header>
  );
}
