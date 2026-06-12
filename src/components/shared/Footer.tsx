import { footerExplore, footerHelp } from "@/constant/footer-data";
import { followSosmedImage } from "@/constant/sosmed-data";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative custom-container bg-[#0A0D12] bottom-0 z-50 w-full font-nunito border-t border-[#252B37]">
      <div className="mx-auto flex-between h-122.5 pt-20 justify-between items-start ">
        <div className="flex flex-col w-95 ">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={42}
              height={42}
              className="max-w-10.5 max-h-10.5"
            />

            <h2 className="text-white text-[32px] tracking-tight font-extrabold ">
              Foody
            </h2>
          </div>

          <p className="text-[#FDFDFD]/90 text-base pt-10 leading-[30px] font-normal letter-spacing-[-0.02em]">
            Enjoy homemade flavors & chef&apos;s signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </p>

          <span className="text-[#FDFDFD] font-extrabold text-sm pt-10 block">
            Follow on Social Media
          </span>

          <div className="flex items-center gap-4 pt-5">
            {followSosmedImage.map((icon) => (
              <Link
                href={icon.href}
                key={icon.alt}
                target="_blank"
                rel="noopener noreferrer"
                className={`
          w-10 h-10 flex items-center justify-center rounded-full
          bg-transparent text-gray-700 dark:text-[#fdfdfd]
          shadow-xs transition-all duration-300
          ${icon.hoverBg}
          `}
              >
                <Image
                  alt={icon.alt}
                  src={icon.src}
                  className="transition-all duration-300 object-contain"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="w-50 ">
          <ul className="flex flex-col gap-3">
            {footerExplore.map((data, index) => (
              <li key={data.label}>
                <Link
                  className={`
                    transition-colors text-sm md:text-base
                    ${
                      index === 0
                        ? "text-[#FDFDFD] font-extrabold text-base mb-2 block"
                        : "text-gray-400 font-normal hover:text-white"
                    }`}
                  href={data.href}
                >
                  {data.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-50 ">
          <ul className="flex flex-col gap-3">
            {footerHelp.map((data, index) => (
              <li key={data.label}>
                <Link
                  className={`
                    transition-colors text-sm md:text-base
                    ${
                      index === 0
                        ? "text-[#FDFDFD] font-extrabold text-base mb-2 block"
                        : "text-gray-400 font-normal hover:text-white"
                    }`}
                  href={data.href}
                >
                  {data.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
