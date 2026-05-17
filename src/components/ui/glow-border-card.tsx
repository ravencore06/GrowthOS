"use client";

import { cn } from "@/lib/utils";

type ColorPreset = "aurora" | "neon" | "sunset" | "ocean" | "ember";

interface GlowBorderCardProps {
  width?: string;
  aspectRatio?: string;
  colorPreset?: ColorPreset;
  animationDuration?: number;
  className?: string;
  children?: React.ReactNode;
  fullPage?: boolean;
}

const colorPresets: Record<ColorPreset, string> = {
  aurora: "#ffffff, #ffffff, #ffffff, #ffffff, #ffffff",
  neon: "#ffffff, #ffffff, #ffffff, #ffffff, #ffffff",
  sunset: "#ffffff, #ffffff, #ffffff, #ffffff, #ffffff",
  ocean: "#ffffff, #ffffff, #ffffff, #ffffff, #ffffff",
  ember: "#ffffff, #ffffff, #ffffff, #ffffff, #ffffff",
};

export function GlowBorderCard({
  width = "280px",
  aspectRatio = "1",
  colorPreset = "aurora",
  animationDuration = 8,
  className,
  children,
  fullPage = false,
}: GlowBorderCardProps) {
  const colors = colorPresets[colorPreset];
  const height = fullPage ? undefined : `calc(${width} * ${aspectRatio})`;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        fullPage ? "fixed inset-0" : "rounded-2xl",
        className
      )}
      style={{
        width: fullPage ? undefined : width,
        height,
      }}
    >
      {/* Rotating glow border */}
      <div
        className={cn(
          "absolute -inset-[20px] blur-[30px] opacity-60",
          fullPage ? "rounded-none" : "rounded-2xl"
        )}
        style={{
          background: `conic-gradient(from 0deg, ${colors})`,
          animation: `glow-spin ${animationDuration}s linear infinite`,
        }}
      />

      {/* Inner dark overlay to create border effect */}
      <div
        className={cn(
          "absolute inset-0",
          fullPage ? "rounded-none" : "rounded-2xl"
        )}
        style={{
          background: "rgb(3, 7, 18)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>

      <style jsx global>{`
        @keyframes glow-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
