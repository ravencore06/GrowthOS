"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export type GlassDockItem = {
  title: string;
  icon: LucideIcon;
  href: string;
};

type GlassDockProps = {
  items: GlassDockItem[];
  className?: string;
  magnification?: number;
  distance?: number;
};

function DockIcon({
  item,
  mouseX,
  magnification,
  distance,
  isActive,
}: {
  item: GlassDockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  magnification: number;
  distance: number;
  isActive: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = item.icon;

  const distanceCalc = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

    const widthSync = useTransform(
      distanceCalc,
      [-distance, 0, distance],
      [36, magnification, 36]
    );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link
      ref={ref}
      href={item.href}
      aria-label={item.title}
      className="flex w-[5rem] shrink-0 flex-col items-center justify-end gap-1.5"
    >
      <motion.div
        style={{ width, height: width }}
        className="flex items-center justify-center"
      >
        <motion.div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-2xl transition-colors",
            isActive
              ? "bg-white/20 text-white shadow-sm shadow-violet-500/20"
              : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          )}
        >
          <Icon
            className="h-4 w-4 sm:h-5 sm:w-5"
            strokeWidth={1.75}
          />
        </motion.div>
      </motion.div>
        <span
          className={cn(
            "w-full text-center text-xs font-medium leading-none tracking-tight transition-colors sm:text-sm",
            isActive ? "text-violet-300" : "text-zinc-500"
          )}
        >
          {item.title}
        </span>
    </Link>
  );
}

export function GlassDock({
  items,
  className,
  magnification = 56,
  distance = 150,
}: GlassDockProps) {
  const mouseX = useMotionValue(Infinity);
  const pathname = usePathname();

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "inline-flex w-fit items-end justify-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/50 px-4 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl sm:gap-2 sm:px-6 sm:py-2.5",
        className
      )}
    >
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <DockIcon
            key={item.title}
            item={item}
            mouseX={mouseX}
            magnification={magnification}
            distance={distance}
            isActive={isActive}
          />
        );
      })}
    </motion.div>
  );
}
