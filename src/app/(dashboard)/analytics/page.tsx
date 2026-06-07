"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Download, Heart, MessageCircle, MoreHorizontal, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { PLATFORMS } from "@/lib/platforms";
import { formatNumber, cn } from "@/lib/utils";
import type { AnalyticsMetrics } from "@/lib/types";

function aggregate(analytics: AnalyticsMetrics[]) {
  return analytics.reduce(
    (a, b) => ({
      followers: a.followers + b.followers,
      reach: a.reach + b.reach,
      shares: a.shares + b.shares,
    }),
    { followers: 0, reach: 0, shares: 0 }
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics[]>([]);
  const [summary, setSummary] = useState<{
    totalFollowers: number;
    weeklyGrowth: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setAnalytics(d.analytics ?? []);
        setSummary(d.summary ?? null);
      });
  }, []);

  const kpis = analytics.length > 0 ? aggregate(analytics) : null;
  const avgEngagement = kpis
    ? Number((analytics.reduce((s, a) => s + a.engagementRate, 0) / analytics.length).toFixed(2))
    : 0;
  const totalShares = kpis?.shares ?? 0;
  const totalFollowers = summary?.totalFollowers ?? kpis?.followers ?? 0;
  const totalReach = kpis?.reach ?? 0;

  const history = analytics[0]?.history ?? [];

  const topContent = [
    {
      title: "The Future of AI Content Strategy",
      platform: "linkedin",
      days: "2 days ago",
      likes: 1200,
      comments: 428,
      shares: 156,
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=160&h=160&fit=crop&crop=center",
    },
    {
      title: "Micro-Scaling: The Unseen Trend",
      platform: "twitter",
      days: "5 days ago",
      likes: 2800,
      comments: 1100,
      shares: 840,
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=160&h=160&fit=crop&crop=center",
    },
  ];

  const platforms = ["twitter", "linkedin", "instagram"] as const;
  const platformMeta = {
    twitter: { icon: "X", followers: 42_500, growth: 18.2 },
    linkedin: { icon: "In", followers: 64_100, growth: 9.4 },
    instagram: { icon: "IG", followers: 21_800, growth: 31.0 },
  };

  function getPlatformWidth(id: string) {
    if (id === "instagram") return "92%";
    if (id === "twitter") return "85%";
    return "65%";
  }

  const svgPoints = history.length > 0
    ? history.map((h, i) => ({
        x: (i / Math.max(history.length - 1, 1)) * 1000,
        y: 200 - (Math.log10(h.views + 1) / Math.log10(Math.max(...history.map((x) => x.views)))) * 180,
      }))
    : [];

  const pathD =
    svgPoints.length > 0
      ? svgPoints
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
          .join(" ")
      : "";

  const areaD =
    svgPoints.length > 0
      ? pathD + ` L 1000 200 L 0 200 Z`
      : "";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-zinc-100 via-violet-400 to-zinc-100 bg-[length:200%_auto] bg-clip-text text-4xl font-bold tracking-tight text-transparent animate-[shine_6s_linear_infinite]">
            Growth Analytics
          </h1>
          <p className="mt-1 text-zinc-500">
            Real-time performance metrics across all integrated platforms.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-5 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800">
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Followers",
            value: formatNumber(totalFollowers),
            change: summary?.weeklyGrowth ?? 12.4,
            up: true,
          },
          {
            label: "Avg. Engagement",
            value: `${avgEngagement}%`,
            change: 0.5,
            up: true,
          },
          {
            label: "Total Reach",
            value: formatNumber(totalReach),
            change: null,
            up: null,
          },
          {
            label: "Content Shares",
            value: formatNumber(totalShares),
            change: 24.1,
            up: true,
          },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="group rounded-xl border border-white/5 bg-zinc-900 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium tracking-wide text-zinc-500">
                {kpi.label}
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              {kpi.change !== null && (
                <p
                  className={cn(
                    "mt-1 flex items-center gap-1 text-xs",
                    kpi.up ? "text-violet-400" : "text-zinc-500"
                  )}
                >
                  {kpi.up ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {kpi.change > 0 ? "+" : ""}
                  {kpi.change}% vs last mo.
                </p>
              )}
              {kpi.change === null && (
                <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                  Steady performance
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Follower Growth Trajectory */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Follower Growth Trajectory
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Aggregated data across LinkedIn, Twitter, and Instagram
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-zinc-800/50 px-3 py-1 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8B5CF6]" />
            Total Growth
          </span>
        </div>
        <div className="relative h-80 w-full">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 1000 200">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(139,92,246,0.2)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {areaD && (
              <path
                d={areaD}
                fill="url(#chartGrad)"
                className="opacity-30"
              />
            )}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
                className="[stroke-dasharray:1200] [stroke-dashoffset:1200] animate-[drawPath_3s_ease-out_forwards]"
              />
            )}
            {svgPoints.length > 0 && (
              <>
                {svgPoints.slice(1, -1).map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#D8B4FE"
                    className="animate-[pulseGlow_2s_ease-in-out_infinite]"
                  />
                ))}
                <circle
                  cx={svgPoints[svgPoints.length - 1].x}
                  cy={svgPoints[svgPoints.length - 1].y}
                  r="6"
                  fill="#8B5CF6"
                  className="animate-pulse"
                />
              </>
            )}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between opacity-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-px w-full border-b border-white" />
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-between text-xs text-zinc-500">
          {history.length > 0
            ? history.map((h, i) => (
                <span key={i}>{h.date}</span>
              ))
            : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((w) => (
                <span key={w}>{w}</span>
              ))}
        </div>
      </div>

      {/* Platform Performance */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900 p-8">
        <h2 className="mb-8 text-xl font-semibold text-white">
          Platform Performance Distribution
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {platforms.map((id) => {
            const meta = platformMeta[id];
            const platform = PLATFORMS.find((p) => p.id === id);
            const width = getPlatformWidth(id);
            return (
              <div key={id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-zinc-800/50">
                      <span className="text-sm text-zinc-300">{meta.icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{platform?.name ?? id}</p>
                      <p className="text-xs text-zinc-500">
                        {formatNumber(meta.followers)} Followers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-violet-400">+{meta.growth}%</p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                      Growth
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-1000 ease-out"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Performing Content */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Top Performing Content
            </h2>
            <button className="text-zinc-500 transition-colors hover:text-white">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-6">
            {topContent.map((item) => (
              <div
                key={item.title}
                className="group flex gap-4 rounded-xl p-3 transition-all hover:bg-zinc-800/30"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <img
                    src={item.img}
                    alt=""
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white transition-colors group-hover:text-violet-400">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500">
                    Published {item.days} •{" "}
                    {PLATFORMS.find((p) => p.id === item.platform)?.name ??
                      item.platform}
                  </p>
                  <div className="mt-3 flex gap-4 text-xs text-zinc-300">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {formatNumber(item.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> {formatNumber(item.comments)}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5" /> {formatNumber(item.shares)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth AI Prediction */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-8">
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
          <h2 className="mb-2 text-xl font-semibold text-white">
            Growth AI Prediction
          </h2>
          <p className="mb-8 text-xs text-zinc-500">
            Next month performance forecast
          </p>
          <div className="relative z-10 rounded-xl border border-white/5 bg-zinc-800/30 p-6 transition-all hover:border-violet-500/40">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500 text-white shadow-[0_0_15px_#8B5CF6]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-violet-400">
                  Projected Growth: +14.2%
                </p>
                <p className="text-xs text-zinc-500">
                  Confidence Level: 92%
                </p>
              </div>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Based on current velocity and engagement patterns, your LinkedIn
              profile is expected to reach the 75k follower milestone within the
              next 22 days. Increasing video content frequency by 15% could
              boost this trajectory by an additional 3.2%.
            </p>
            <button className="mt-8 w-full rounded-lg border border-white/10 py-3 text-sm text-zinc-300 transition-all hover:bg-white hover:text-black">
              View Detailed Forecast
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes pulseGlow {
          0%,
          100% {
            filter: drop-shadow(0 0 2px #8b5cf6);
          }
          50% {
            filter: drop-shadow(0 0 8px #8b5cf6);
          }
        }
      `}</style>
    </div>
  );
}
