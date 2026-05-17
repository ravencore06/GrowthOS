"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, Share2, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { StatCard } from "@/components/stat-card";
import { PlatformIcon } from "@/components/platform-icon";
import { EngagementChart, PlatformBarChart } from "@/components/analytics-charts";
import { PLATFORMS } from "@/lib/platforms";
import { formatNumber } from "@/lib/utils";
import type { AnalyticsMetrics } from "@/lib/types";

export default function AnalyticsPage() {
  const [platform, setPlatform] = useState<string>("all");
  const [analytics, setAnalytics] = useState<AnalyticsMetrics[]>([]);

  useEffect(() => {
    const q = platform === "all" ? "" : `?platform=${platform}`;
    fetch(`/api/analytics${q}`)
      .then((r) => r.json())
      .then((d) => setAnalytics(d.analytics ?? []));
  }, [platform]);

  const totals = analytics.reduce(
    (acc, a) => ({
      likes: acc.likes + a.likes,
      shares: acc.shares + a.shares,
      views: acc.views + a.views,
      reach: acc.reach + a.reach,
      followers: acc.followers + a.followers,
    }),
    { likes: 0, shares: 0, views: 0, reach: 0, followers: 0 }
  );

  const chartData = analytics.map((a) => ({
    name: PLATFORMS.find((p) => p.id === a.platform)?.name ?? a.platform,
    likes: a.likes,
    shares: a.shares,
  }));

  const history = analytics[0]?.history ?? [];

  return (
    <>
      <Header
        title="Analytics Dashboard"
        description="Track likes, shares, views, reach, and followers across platforms"
      />
      <Card className="mb-6 p-4">
        <label className="mb-2 block text-sm text-zinc-400">Platform</label>
        <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="max-w-xs">
          <option value="all">All platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Likes" value={totals.likes} change={12} icon={Heart} />
        <StatCard label="Shares" value={totals.shares} change={8} icon={Share2} />
        <StatCard label="Views" value={totals.views} change={22} icon={Eye} />
        <StatCard label="Reach" value={totals.reach} change={18} icon={Eye} />
        <StatCard label="Followers" value={totals.followers} change={5} icon={Users} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-white">Views & reach (14 days)</h2>
          <EngagementChart data={history} />
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-white">Likes & shares by platform</h2>
          <PlatformBarChart data={chartData} />
        </Card>
      </div>
      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-semibold text-white">Per-platform breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-zinc-500">
                <th className="pb-3 pr-4">Platform</th>
                <th className="pb-3 pr-4">Likes</th>
                <th className="pb-3 pr-4">Shares</th>
                <th className="pb-3 pr-4">Views</th>
                <th className="pb-3 pr-4">Reach</th>
                <th className="pb-3 pr-4">Followers</th>
                <th className="pb-3">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((a) => (
                <tr key={a.platform} className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={a.platform} size="sm" />
                      <span className="text-white">
                        {PLATFORMS.find((p) => p.id === a.platform)?.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-zinc-300">{formatNumber(a.likes)}</td>
                  <td className="py-3 text-zinc-300">{formatNumber(a.shares)}</td>
                  <td className="py-3 text-zinc-300">{formatNumber(a.views)}</td>
                  <td className="py-3 text-zinc-300">{formatNumber(a.reach)}</td>
                  <td className="py-3 text-zinc-300">{formatNumber(a.followers)}</td>
                  <td className="py-3 text-violet-400">{a.engagementRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
