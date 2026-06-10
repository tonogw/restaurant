import { StaticImageData } from "next/image";
import FacebookIcon from "../../public/icons/icon-fb.svg";
import InstagramIcon from "../../public/icons/icon-ig.svg";
import LinkedinIcon from "../../public/icons/icon-in.svg";
import TiktokIcon from "../../public/icons/icon-ttok.svg";

type FollowSosmedImageProps = {
  src: StaticImageData;
  href: string;
  alt: string;
  hoverBg: string;
};

export const followSosmedImage: FollowSosmedImageProps[] = [
  {
    src: FacebookIcon,
    href: "https://web.facebook.com/",
    alt: "Facebook",
    // Color brand: blue
    hoverBg: "hover:bg-[#1877F2] hover:text-white",
  },

  {
    src: InstagramIcon,
    href: "https://www.instagram.com/",
    alt: "Instagram",
    hoverBg:
      "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white",
  },
  {
    src: LinkedinIcon,
    href: "https://www.linkedin.com/",
    alt: "Linkedin",
    hoverBg: "hover:bg-[#0a66c2] hover:text-white",
  },
  {
    src: TiktokIcon,
    href: "https://www.tiktok.com/",
    alt: "Tiktok",
    hoverBg: "hover:bg-[#000000] hover:text-white",
  },
];
