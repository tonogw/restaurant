import { footerExplore, footerHelp } from "@/constant/footer-data";
import { followSosmedImage } from "@/constant/sosmed-data";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    // Footer main container
    <footer className="relative custom-container bg-gray-400 bottom-0 dark:bg-black z-50 w-full">
      <div className="mx-auto   flex-between h-122.5 pt-20 justify-between items-start ">
        {/* Left-blok: logo, description, sosmed */}
        <div className="flex flex-col w-95 ">
          {/* Image logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={42}
              height={42}
              className="max-w-10.5 max-h-10.5"
            />
            <h2 className="text-black text-[32px] tracking-tight font-bold ">
              Foody
            </h2>
          </div>

          {/* Description gap-40 from logo botton */}
          <p
            className="text-gray-600 text-base pt-10 leading-relaxed
                "
          >
            Enjoy homemade flavors & chef’s signature dishes, freshly prepared
            every day. Order online or visit our nearest branch.
          </p>

          {/* The sosmed title */}
          <span className="text-gray-900 font-medium text-sm pt-10 block">
            Follow on social media
          </span>

          {/* Icon sosmed gap-20 from title */}
          <div className="flex  items-center gap-4 pt-5 ">
            {followSosmedImage.map((icon) => (
              <Link
                href={icon.href}
                key={icon.alt}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                    w-10 h-10 flex items-center justify-center rounded-full
                    bg-transparent  text-gray-700 dark:text-[#fdfdfd]
                    shadow-xs transition-all duration-300
                    ${icon.hoverBg}
                  
                    `}
              >
                <Image
                  alt={icon.alt}
                  src={icon.src}
                  //   width={20}
                  //   height={20}
                  className="transition-all duration-300 object-contain"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Center Blok - explore list */}
        <div className="w-50 ">
          <ul className="flex flex-col gap-3">
            {footerExplore.map((data, index) => (
              <li key={data.label}>
                <Link
                  // First index font-bold
                  className={`
                    text-black text-base hover:text-primary-200 transition-colors
                    ${index === 0 ? "font-bold text-base mb-2 block" : "font-normal"}`}
                  href={data.href}
                >
                  {data.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Blok - help list */}
        <div className="w-50 ">
          <ul className="flex flex-col gap-3">
            {footerHelp.map((data, index) => (
              <li key={data.label}>
                <Link
                  className={`
                    text-black text-base hover:text-primary-200 transition-colors
                    ${index === 0 ? "font-bold text-lg mb-2 block" : "font-normal"} 
                    `}
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
