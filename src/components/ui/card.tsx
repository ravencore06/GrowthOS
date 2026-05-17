import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-zinc-900/60 backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}
