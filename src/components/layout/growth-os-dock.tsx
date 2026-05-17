"use client";

import { GlassDock } from "@/components/ui/glass-dock";
import {
  BarChart3,
  Calendar,
  Hash,
  Home,
  PenLine,
  User,
  Zap,
} from "lucide-react";

export function GrowthOSDock() {
  const items = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Content", icon: PenLine, href: "/content" },
    { title: "Trends", icon: Zap, href: "/trends" },
    { title: "Captions", icon: Hash, href: "/captions" },
    { title: "Schedule", icon: Calendar, href: "/scheduler" },
    { title: "Analytics", icon: BarChart3, href: "/analytics" },
    { title: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-3 sm:pt-4"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto w-[55%] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex justify-center px-2">
          <GlassDock items={items} />
        </div>
      </div>
    </div>
  );
}
