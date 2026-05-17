import { Card } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          {change !== undefined && (
            <p
              className={`mt-1 text-xs ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {formatPercent(change)} vs last week
            </p>
          )}
        </div>
        <div className="rounded-xl bg-violet-500/15 p-2.5">
          <Icon className="h-5 w-5 text-violet-400" />
        </div>
      </div>
    </Card>
  );
}
