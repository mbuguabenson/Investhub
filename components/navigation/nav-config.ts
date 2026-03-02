import { Home, Wallet, Repeat, History, Settings } from "lucide-react";

export const navItems = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Exchange", icon: Repeat, href: "/dashboard/exchange" },
  { label: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
  { label: "History", icon: History, href: "/dashboard/transactions" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];
