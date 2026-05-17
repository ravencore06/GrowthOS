"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsMetrics } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function EngagementChart({ data }: { data: AnalyticsMetrics["history"] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
        <YAxis stroke="#71717a" fontSize={12} tickFormatter={formatNumber} />
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke="#8b5cf6"
          fill="url(#viewsGrad)"
          name="Views"
        />
        <Area
          type="monotone"
          dataKey="reach"
          stroke="#ec4899"
          fill="transparent"
          name="Reach"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PlatformBarChart({
  data,
}: {
  data: { name: string; likes: number; shares: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
        <YAxis stroke="#71717a" fontSize={12} tickFormatter={formatNumber} />
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="likes" fill="#8b5cf6" name="Likes" radius={[4, 4, 0, 0]} />
        <Bar dataKey="shares" fill="#ec4899" name="Shares" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
