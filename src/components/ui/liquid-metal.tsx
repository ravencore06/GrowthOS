"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetalConfig {
  colorBack?: string;
  colorTint?: string;
  distortion?: number;
  speed?: number;
}

interface LiquidMetalButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  borderWidth?: number;
  metalConfig?: MetalConfig;
  onClick?: () => void;
  className?: string;
}

const sizeClasses = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function LiquidMetalButton({
  children,
  icon,
  size = "md",
  borderWidth = 3,
  metalConfig = {},
  onClick,
  className,
}: LiquidMetalButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [bgPos, setBgPos] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 250 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const {
    colorBack = "#4a4a4a",
    colorTint = "#d4d4d4",
    speed = 1,
  } = metalConfig;

  useAnimationFrame((time) => {
    setBgPos((time * 0.05 * speed) % 300);
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.button
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {}}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={cn(
        "group relative overflow-hidden rounded-full font-semibold text-white",
        sizeClasses[size],
        className
      )}
    >
      {/* Metal base gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 25%, #7a7a7a 50%, #4a4a4a 75%, #1a1a1a 100%)`,
          backgroundSize: "300% 300%",
          backgroundPosition: `${bgPos}% 50%`,
        }}
      />

      {/* Animated sheen overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `linear-gradient(105deg, transparent 20%, ${colorTint} 45%, ${colorTint} 55%, transparent 80%)`,
          backgroundSize: "200% 100%",
          backgroundPosition: `${bgPos * 1.5}% 0%`,
        }}
      />

      {/* Mouse-following highlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at ${50 + (mouseX.get() || 0) * 50}% ${50 + (mouseY.get() || 0) * 50}%, rgba(255, 255, 255, 0.5) 0%, transparent 60%)`,
        }}
      />

      {/* Edge border */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `${borderWidth}px solid rgba(255, 255, 255, 0.4)`,
          boxShadow:
            "0 4px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
        }}
      />

      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2" style={{ transform: "translateZ(30px)" }}>
        {icon && <span className="flex shrink-0">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}

export default LiquidMetalButton;
