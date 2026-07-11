import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { title: "Chat", href: "/chat", icon: MessageSquare },
  { title: "Settings", href: "/settings", icon: Settings },
];
