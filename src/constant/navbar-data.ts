import IconUser from "/icons/icon-john-due.svg";
import IconAddress from "/icons/icon-delivery-address.svg";
import IconMyOrder from "/icons/icon-my-order.svg";

export interface NavLink {
  label: string;
  href: string;
}

export const profileDropdownLinks = [
  {
    label: "My Profile",
    href: "/profile",
    iconName: IconUser,
  },
  {
    label: "Delivery Address",
    href: "/address",
    iconName: IconAddress,
  },
  {
    label: "My Orders",
    href: "/orders",
    iconName: IconMyOrder,
  },
];
