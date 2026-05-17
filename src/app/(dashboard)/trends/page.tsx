"use client";

import { useEffect, useState } from "react";
import { Flame, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORMS } from "@/lib/platforms";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { PlatformId, Trend } from "@/lib/types";

export default function TrendsPage() {
  const [platform, setPlatform] = useState<string>("all");
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = platform === "all" ? "" : `?platform=${platform}`;
    fetch(`/api/trends${q}`)
      .then((r) => r.json())
      .then((d) => setTrends(d.trends ?? []))
      .finally(() => setLoading(false));
  }, [platform]);

  return (
    <>
      <Header
        title="Trend Detector"
        description="Discover trending topics and hashtags across platforms"
      />
      <Card className="mb-6 p-4">
        <label className="mb-2 block text-sm text-zinc-400">Filter by platform</label>
        <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="max-w-xs">
          <option value="all">All platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </Card>
      {loading ? (
        <p className="text-zinc-500">Loading trends...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trends.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={t.platform} />
                  <div>
                    <h3 className="font-semibold text-white">{t.topic}</h3>
                    <Badge className="mt-1 bg-zinc-800 text-zinc-300">{t.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{formatPercent(t.growth)}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-6 text-sm text-zinc-400">
                <span>
                  <Flame className="mr-1 inline h-4 w-4 text-orange-400" />
                  {formatNumber(t.volume)} mentions
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.relatedHashtags.map((h) => (
                  <span key={h} className="text-xs text-violet-400">
                    {h}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
