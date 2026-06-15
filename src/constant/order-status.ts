import type { TransactionStatus } from "@/types/order";

export interface StatusTab {
  id: TransactionStatus | "all";
  label: string;
}

export const STATUS_TABS: StatusTab[] = [
  { id: "all", label: "All Status" },
  { id: "preparing", label: "Preparing" },
  { id: "on_the_way", label: "On the Way" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Canceled" },
];
