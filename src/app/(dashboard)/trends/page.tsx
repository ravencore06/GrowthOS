"use client";

import { useEffect, useMemo, useState } from "react";
import { Database, Download, Sparkles, TrendingUp, Zap } from "lucide-react";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/platform-icon";
import { formatNumber, cn } from "@/lib/utils";
import type { Trend } from "@/lib/types";

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trends")
      .then((r) => r.json())
      .then((d) => setTrends(d.trends ?? []))
      .finally(() => setLoading(false));
  }, []);

  const topTrends = useMemo(
    () => [...trends].sort((a, b) => b.growth - a.growth).slice(0, 3),
    [trends]
  );

  const heatmap = useMemo(() => {
    return Array.from({ length: 24 * 7 }, () => {
      const val = Math.random();
      if (val < 0.3) return { bg: "rgba(255,255,255,0.05)", glow: false };
      if (val < 0.55) return { bg: "rgba(139,92,246,0.15)", glow: false };
      if (val < 0.75) return { bg: "rgba(139,92,246,0.35)", glow: false };
      if (val < 0.9) return { bg: "rgba(139,92,246,0.6)", glow: false };
      return { bg: "rgba(139,92,246,0.85)", glow: true };
    });
  }, []);

  const stream = useMemo(
    () =>
      trends.slice(0, 4).map((t, i) => ({
        ...t,
        sentiment: (["BULLISH", "NEUTRAL", "CAUTIOUS", "BULLISH"] as const)[i],
        reach: Math.floor(t.volume * (1.5 + Math.random() * 2)),
      })),
    [trends]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-zinc-100 via-violet-400 to-zinc-100 bg-[length:200%_auto] bg-clip-text text-5xl font-bold tracking-tight text-transparent animate-[shine_8s_linear_infinite]">
            Trend Intelligence
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-zinc-500">
            Real-time predictive analysis of emerging market shifts and creator
            velocity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span className="text-sm text-zinc-300">Refreshed 2m ago</span>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-violet-500 px-8 py-2.5 font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02]">
            <Download className="h-4 w-4" />
            Export Analysis
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Heatmap */}
        <section className="group relative col-span-12 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-8 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:-translate-y-1">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.25) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                <Zap className="h-6 w-6 text-violet-400" />
                Creator Velocity Heatmap
              </h2>
              <div className="flex gap-2">
                <span className="rounded-full border border-white/10 bg-zinc-900 px-4 py-1.5 text-xs font-bold text-zinc-500">
                  Global
                </span>
                <span className="rounded-full border border-violet-500/40 px-4 py-1.5 text-xs font-bold text-violet-400">
                  24h Delta
                </span>
              </div>
            </div>
            <div className="grid h-64 grid-cols-24 gap-1.5">
              {heatmap.map((cell, i) => (
                <div
                  key={i}
                  className="rounded-sm transition-all duration-300"
                  style={{
                    backgroundColor: cell.bg,
                    boxShadow: cell.glow
                      ? "0 0 10px rgba(139,92,246,0.4)"
                      : "none",
                  }}
                />
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between text-xs font-bold text-zinc-500">
              <div className="flex gap-8">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  Low Volume
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500/40" />
                  Moderate
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-[0_0_10px_#8B5CF6]" />
                  Peak Saturation
                </span>
              </div>
              <span className="tracking-widest">UTC-08:00 TIMELINE</span>
            </div>
          </div>
        </section>

        {/* Emerging Signal Clusters */}
        <section className="group relative col-span-12 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-8 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:-translate-y-1 lg:col-span-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.25) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10">
            <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
              <Database className="h-6 w-6 text-violet-400" />
              Emerging Signal Clusters
            </h2>
            {loading ? (
              <p className="text-zinc-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                {topTrends.map((t, i) => (
                  <div
                    key={t.id}
                    className="group/item flex cursor-pointer items-center justify-between rounded-xl border border-white/5 p-5 transition-all duration-300 hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-xs font-bold text-zinc-500/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-lg font-bold text-white transition-colors group-hover/item:text-violet-400">
                          {t.topic}
                        </p>
                        <p className="mt-0.5 text-sm text-zinc-500">
                          {t.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TrendingUp className="h-4 w-4 text-violet-400" />
                        <span className="text-lg font-bold text-violet-400">
                          +{t.growth}%
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 w-32 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full bg-violet-500 shadow-[0_0_8px_#8B5CF6] transition-all duration-500 group-hover/item:bg-white"
                          style={{ width: `${Math.min(t.growth * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Viral Probability Meter */}
        <section className="group relative col-span-12 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-8 text-center transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:-translate-y-1 lg:col-span-4">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.25) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 flex flex-col items-center">
            <div className="group/ring relative mb-8 h-48 w-48 cursor-pointer">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 192 192">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="10"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeDasharray="552.92"
                  strokeDashoffset={552.92 * 0.25}
                  strokeLinecap="round"
                  strokeWidth="10"
                  className="drop-shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-1000"
                  style={{ strokeDashoffset: 552.92 * 0.25 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 group-hover/ring:scale-110">
                <span className="text-5xl font-bold text-white">75%</span>
                <span className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Confidence
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">
              High Impact Forecast
            </h3>
            <p className="mt-2 px-4 leading-relaxed text-zinc-500">
              Signals indicate a 75% probability of global breakout for
              &ldquo;Motion&rdquo; themes.
            </p>
            <button className="mt-8 rounded-full border border-violet-500/40 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-violet-400 transition-all duration-300 hover:bg-violet-500 hover:text-white">
              View Methodology
            </button>
          </div>
        </section>

        {/* Global Intelligence Stream */}
        {stream.length > 0 && (
          <section className="group relative col-span-12 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-8 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:-translate-y-1">
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.25) 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <div className="mb-10 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                  <Sparkles className="h-6 w-6 text-violet-400" />
                  Global Intelligence Stream
                </h2>
                <span className="text-[10px] font-bold tracking-[0.3em] text-violet-400/40">
                  SYSTEM LOG 0XF2A
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Signal Source
                      </th>
                      <th className="pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Sentiment
                      </th>
                      <th className="pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Reach Potential
                      </th>
                      <th className="pb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stream.map((item) => (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="py-8">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/5 bg-violet-500/10 transition-transform group-hover:scale-105">
                              <PlatformIcon
                                platform={item.platform}
                                size="sm"
                              />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-white">
                                {item.topic}
                              </p>
                              <p className="text-sm font-medium text-zinc-500">
                                {PLATFORMS.find(
                                  (p) => p.id === item.platform
                                )?.name ?? item.platform}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-8">
                          <span
                            className={cn(
                              "rounded-full px-4 py-1.5 text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]",
                              item.sentiment === "BULLISH"
                                ? "bg-violet-500 text-white"
                                : "bg-zinc-800 text-zinc-400"
                            )}
                          >
                            {item.sentiment}
                          </span>
                        </td>
                        <td className="py-8">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2.5">
                              <div className="h-7 w-7 rounded-full border-2 border-black bg-violet-500/40" />
                              <div className="h-7 w-7 rounded-full border-2 border-black bg-violet-500/70" />
                              <div className="h-7 w-7 rounded-full border-2 border-black bg-violet-500" />
                            </div>
                            <span className="text-base font-bold text-white">
                              {formatNumber(item.reach)}
                            </span>
                          </div>
                        </td>
                        <td className="py-8">
                          <button className="group/btn flex items-center gap-2 text-sm font-bold text-violet-400 transition-colors hover:text-white">
                            Capitalize
                            <span className="transition-transform group-hover/btn:translate-x-1">
                              →
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        .grid-cols-24 {
          grid-template-columns: repeat(24, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
}
