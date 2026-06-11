import { StaticImageData } from "next/image";
import iconDisc from "../../public/icons/icon-discount.svg";
import iconDlvery from "../../public/icons/icon-delivery.svg";
import iconRice from "../../public/icons/icon-rice.svg";
import iconNearby from "../../public/icons/icon-nearby.svg";
import iconBestSeller from "../../public/icons/icon-best-seller.svg";
import iconCategory from "../../public/icons/icon-category.svg";

type CategoryData = {
  category: string;
  src: StaticImageData;
  href: string;
  alt: string;
  hoverBg: string;
};

export const categoryData: CategoryData[] = [
  {
    category: "All Restaurant",
    src: iconCategory,
    href: "/", //get.api/resto
    alt: "all-restaurant",
    hoverBg: "border-amber-500 bg-amber-50/30 font-bold",
  },

  {
    category: "Nearby",
    src: iconNearby,
    href: "/", //get.api/location
    alt: "nearby",
    hoverBg: "border-amber-500 bg-amber-50/30 font-bold",
  },
  {
    category: "Discount",
    src: iconDisc,
    href: "/", //get.api/resto/discount
    alt: "discount",
    hoverBg: "border-amber-500 bg-amber-50/30 font-bold",
  },
  {
    category: "Best Seller",
    src: iconBestSeller,
    href: "/", //get.api/resto/best-seller
    alt: "best-seller",
    hoverBg: "border-amber-500 bg-amber-50/30 font-bold",
  },
  {
    category: "Delivery",
    src: iconDlvery,
    href: "/", //get.api/resto/delivery
    alt: "delivery",
    hoverBg: "border-amber-500 bg-amber-50/30 font-bold",
  },
  {
    category: "Lunch",
    src: iconRice,
    href: "/", //get.api/resto/lunch
    alt: "lunch",
    hoverBg: "border-amber-500 bg-amber-50/30 font-bold",
  },
];
