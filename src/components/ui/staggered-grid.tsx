"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { LOGIN_PLATFORMS, platformInitial, type LoginPlatform } from "@/lib/login-platforms";

export type BentoItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  platformId?: string;
};

type StaggeredGridProps = {
  images?: string[];
  bentoItems?: BentoItem[];
  centerText?: string;
  platforms?: LoginPlatform[];
};

function PlatformTile({
  platform,
  className,
  style,
}: {
  platform: LoginPlatform;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 shadow-lg",
        className
      )}
      style={style}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          platform.gradient
        )}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative flex h-full flex-col justify-end p-4">
        <span
          className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: platform.color }}
        >
          {platformInitial(platform.name)}
        </span>
        <p className="text-sm font-semibold text-white">{platform.name}</p>
      </div>
    </div>
  );
}

export function StaggeredGrid({
  bentoItems = [],
  centerText = "GrowthOS",
  platforms = LOGIN_PLATFORMS,
}: StaggeredGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeBento, setActiveBento] = useState<number | null>(bentoItems[0]?.id ?? null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const col1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const col2Y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const col3Y = useTransform(scrollYProgress, [0, 1], [0, -160]);

  const col1 = platforms.filter((_, i) => i % 3 === 0);
  const col2 = platforms.filter((_, i) => i % 3 === 1);
  const col3 = platforms.filter((_, i) => i % 3 === 2);

  const heights = ["h-48", "h-56", "h-44", "h-52"];

  return (
    <div ref={containerRef} className="relative min-h-[140vh] w-full">
      <div className="pointer-events-none sticky top-0 z-20 flex h-screen items-center justify-center">
        {centerText && (
          <h1 className="select-none bg-gradient-to-b from-white via-white/90 to-white/20 bg-clip-text text-center text-6xl font-bold tracking-tighter text-transparent sm:text-7xl lg:text-8xl">
            {centerText}
          </h1>
        )}
      </div>

      <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-3 gap-3 px-4 pb-32 pt-[40vh] sm:gap-4 sm:px-6">
        <motion.div style={{ y: col1Y }} className="flex flex-col gap-3 sm:gap-4">
          {col1.map((platform, i) => (
            <PlatformTile
              key={platform.id}
              platform={platform}
              className={heights[i % heights.length]}
            />
          ))}
        </motion.div>

        <motion.div style={{ y: col2Y }} className="flex flex-col gap-3 pt-12 sm:gap-4 sm:pt-20">
          {col2.map((platform, i) => (
            <PlatformTile
              key={platform.id}
              platform={platform}
              className={heights[(i + 1) % heights.length]}
            />
          ))}
        </motion.div>

        <motion.div style={{ y: col3Y }} className="flex flex-col gap-3 pt-6 sm:gap-4 sm:pt-10">
          {col3.map((platform, i) => (
            <PlatformTile
              key={platform.id}
              platform={platform}
              className={heights[(i + 2) % heights.length]}
            />
          ))}
        </motion.div>
      </div>

      {bentoItems.length > 0 && (
        <div className="relative z-30 mx-auto mt-8 max-w-lg px-4 pb-24">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5 backdrop-blur-xl">
            {bentoItems.map((item) => {
              const isActive = activeBento === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveBento(isActive ? null : item.id)}
                  className={cn(
                    "mb-2 w-full rounded-xl border p-4 text-left transition-all last:mb-0",
                    isActive
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-white/5 bg-white/5 hover:border-white/15"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        {item.subtitle}
                      </p>
                      <p className="font-semibold text-white">{item.title}</p>
                      {isActive && (
                        <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
