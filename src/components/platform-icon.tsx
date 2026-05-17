import { cn } from "@/lib/utils";
import type { PlatformId } from "@/lib/types";
import { getPlatform } from "@/lib/platforms";

const LABELS: Record<PlatformId, string> = {
  instagram: "IG",
  twitter: "X",
  whatsapp: "WA",
  linkedin: "in",
  pinterest: "P",
  youtube: "YT",
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
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-8 w-8 text-xs", lg: "h-10 w-10 text-sm" };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-bold text-white",
        sizes[size],
        className
      )}
      style={{ backgroundColor: p.color }}
      title={p.name}
    >
      {LABELS[platform]}
    </span>
  );
}
