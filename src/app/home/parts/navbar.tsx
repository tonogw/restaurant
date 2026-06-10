import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="flex-between custom-container h-16 md:h-20">
        {/* Image Logo */}
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={42}
          height={42}
          className="max-w-10 max-h-10"
        />
      </div>
    </header>
  );
}
