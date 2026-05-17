import Link from "next/link";
import { Eye, Heart, TrendingUp, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/platform-icon";
import { GlowBorderCard } from "@/components/ui/glow-border-card";
import {
  generateAnalytics,
  getDashboardSummary,
  getScheduledPosts,
} from "@/lib/data";
import { PLATFORMS } from "@/lib/platforms";
import { formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const analytics = generateAnalytics();
  const summary = getDashboardSummary(analytics, getScheduledPosts());
  const upcoming = getScheduledPosts()
    .filter((p) => p.status === "scheduled")
    .slice(0, 3);

  return (
    <GlowBorderCard fullPage colorPreset="aurora" animationDuration={4}>
      <div className="relative z-10 p-6 space-y-6">
        <Header
          title="Dashboard"
          description="Overview across all your connected social platforms"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Followers"
            value={summary.totalFollowers}
            change={summary.weeklyGrowth}
            icon={Users}
          />
          <StatCard label="Total Reach" value={summary.totalReach} change={8.2} icon={Eye} />
          <StatCard
            label="Engagement"
            value={summary.totalEngagement}
            change={15.3}
            icon={Heart}
          />
          <StatCard label="Scheduled Posts" value={summary.scheduledCount} icon={TrendingUp} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Platform Performance</h2>
            <div className="space-y-4">
              {analytics.map((a) => {
                const platform = PLATFORMS.find((p) => p.id === a.platform)!;
                return (
                  <div key={a.platform} className="flex items-center gap-4">
                    <PlatformIcon platform={a.platform} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{platform.name}</span>
                        <span className="text-zinc-400">{a.engagementRate}% engagement</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(a.engagementRate * 5, 100)}%`,
                            backgroundColor: platform.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right text-xs text-zinc-500">
                      <p>{formatNumber(a.followers)} followers</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Upcoming Posts</h2>
              <Link href="/scheduler">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm text-zinc-500">No scheduled posts yet.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((post) => (
                  <li
                    key={post.id}
                    className="rounded-xl border border-white/5 bg-white/5 p-4"
                  >
                    <p className="font-medium text-white">{post.title}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-400">{post.content}</p>
                    <div className="mt-2 flex gap-1">
                      {post.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p} size="sm" />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/content">
              <Button>Generate Content</Button>
            </Link>
            <Link href="/trends">
              <Button variant="secondary">Detect Trends</Button>
            </Link>
            <Link href="/captions">
              <Button variant="secondary">Optimize Caption</Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline">View Analytics</Button>
            </Link>
          </div>
        </Card>
      </div>
    </GlowBorderCard>
  );
}
