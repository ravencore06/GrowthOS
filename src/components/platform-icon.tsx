import { cn } from "@/lib/utils";
import type { PlatformId } from "@/lib/types";
import { getPlatform } from "@/lib/platforms";

const ICONS: Record<PlatformId, { bg: string; label: string }> = {
  instagram: { bg: "#E4405F", label: "IG" },
  twitter: { bg: "#1DA1F2", label: "X" },
  whatsapp: { bg: "#25D366", label: "WA" },
  linkedin: { bg: "#0A66C2", label: "In" },
  pinterest: { bg: "#E60023", label: "P" },
  youtube: { bg: "#FF0000", label: "YT" },
  facebook: { bg: "#1877F2", label: "FB" },
};

export function PlatformIcon({
  platform,
  size = "md",
  className,
}: {
  platform: PlatformId;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const p = getPlatform(platform);
  const icon = ICONS[platform];
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-bold text-white",
        sizes[size],
        className
      )}
      style={{ backgroundColor: icon.bg }}
      title={p.name}
    >
      {icon.label}
    </span>
  );
}
