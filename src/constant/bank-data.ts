import logoBNI from "../../public/icons/icon-bni.svg";
import logoBCA from "../../public/icons/icon-bca.svg";
import logoMandiri from "../../public/icons/icon-mandiri.svg";
import logoBTN from "../../public/icons/icon-btn.svg";
import logoBRI from "../../public/icons/icon-bri.svg";

export type PaymentMethod = {
  id: string;
  method: string;
  label: string;
  subOptions?: string[];
};

// ✓ SINKRONISASI BARU: desc -> label, label -> id
export type BankPayment = {
  id: string; // Tempat "BNI", "BCA", dll.
  label: string; // Tempat "Bank Negara Indonesia", "Bank Central Asia", dll.
  src: string;
  href: string;
  alt: string;
  allowedMethodIds: string[];
  hoverBg: string;
};

export const paymentMethods: PaymentMethod[] = [
  { id: "qris", method: "qris", label: "QRIS Digital Ratna" },
  {
    id: "e-wallet",
    method: "e-wallet",
    label: "E-Wallet Instant",
    subOptions: ["GooPay", "OVO", "DANA", "ShopeePay"],
  },
  { id: "transfer", method: "transfer", label: "Virtual Account Transfer" },
  { id: "visa", method: "visa", label: "Visa Card Credit" },
  { id: "master", method: "master", label: "MasterCard Credit" },
];

export const bankPayments: BankPayment[] = [
  {
    id: "BNI",
    label: "Bank Negara Indonesia",
    src: logoBNI,
    href: "https://bni.co.id",
    alt: "Bank BNI",
    allowedMethodIds: ["transfer", "qris"],
    hoverBg: "hover:bg-orange-50",
  },
  {
    id: "BRI",
    label: "Bank Rakyat Indonesia",
    src: logoBRI,
    href: "https://bri.co.id",
    alt: "Bank BRI",
    allowedMethodIds: ["transfer", "qris"],
    hoverBg: "hover:bg-blue-50",
  },
  {
    id: "BCA",
    label: "Bank Central Asia",
    src: logoBCA,
    href: "https://bca.co.id",
    alt: "Bank BCA",
    allowedMethodIds: ["transfer", "qris", "visa", "master"],
    hoverBg: "hover:bg-blue-50",
  },
  {
    id: "BTN",
    label: "Bank Tabungan Negara",
    src: logoBTN,
    href: "https://btn.co.id",
    alt: "Bank BTN",
    allowedMethodIds: ["transfer"],
    hoverBg: "hover:bg-cyan-50",
  },
  {
    id: "Mandiri",
    label: "Mandiri",
    src: logoMandiri,
    href: "https://mandiri.co.id",
    alt: "Bank Mandiri",
    allowedMethodIds: ["transfer", "qris", "e-wallet"],
    hoverBg: "hover:bg-yellow-50",
  },
];
