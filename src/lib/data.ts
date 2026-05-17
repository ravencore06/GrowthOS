import { addDays, format, subDays } from "date-fns";
import type {
  AnalyticsMetrics,
  DashboardSummary,
  PlatformId,
  ScheduledPost,
  Trend,
} from "./types";

const TREND_TOPICS = [
  "AI productivity tools",
  "Sustainable living",
  "Remote work culture",
  "Short-form video",
  "Personal branding",
  "Mental wellness",
  "Creator economy",
  "No-code startups",
];

const HASHTAG_POOL = [
  "#trending",
  "#viral",
  "#contentcreator",
  "#socialmedia",
  "#marketing",
  "#growth",
  "#digital",
  "#innovation",
  "#startup",
  "#motivation",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateTrends(platform?: PlatformId): Trend[] {
  const platforms: PlatformId[] = platform
    ? [platform]
    : ["instagram", "twitter", "linkedin", "youtube", "pinterest", "whatsapp"];

  return TREND_TOPICS.flatMap((topic, i) => {
    const p = platforms[i % platforms.length];
    const seed = topic.length + i;
    return {
      id: `trend-${i}-${p}`,
      topic,
      platform: p,
      volume: Math.floor(seededRandom(seed) * 500000) + 10000,
      growth: Math.floor(seededRandom(seed + 1) * 80) + 5,
      category: ["Tech", "Lifestyle", "Business", "Health"][i % 4],
      relatedHashtags: HASHTAG_POOL.slice(i % 3, (i % 3) + 4),
    };
  }).sort((a, b) => b.growth - a.growth);
}

export function generateAnalytics(platform?: PlatformId): AnalyticsMetrics[] {
  const platforms: PlatformId[] = platform
    ? [platform]
    : ["instagram", "twitter", "whatsapp", "linkedin", "pinterest", "youtube"];

  return platforms.map((p, idx) => {
    const base = (idx + 1) * 12000;
    const likes = Math.floor(base * (1.2 + seededRandom(idx) * 2));
    const views = Math.floor(likes * (8 + seededRandom(idx + 10) * 12));
    const reach = Math.floor(views * 0.65);
    const shares = Math.floor(likes * 0.15);
    const followers = Math.floor(base * 45 + seededRandom(idx + 5) * 50000);
    const history = Array.from({ length: 14 }, (_, d) => {
      const date = format(subDays(new Date(), 13 - d), "MMM d");
      const factor = 0.7 + seededRandom(idx * 100 + d) * 0.6;
      return {
        date,
        likes: Math.floor((likes / 14) * factor),
        views: Math.floor((views / 14) * factor),
        reach: Math.floor((reach / 14) * factor),
      };
    });
    return {
      platform: p,
      likes,
      shares,
      views,
      reach,
      followers,
      engagementRate: Number((((likes + shares) / reach) * 100).toFixed(2)),
      history,
    };
  });
}

export function getDashboardSummary(
  analytics: AnalyticsMetrics[],
  scheduled: ScheduledPost[]
): DashboardSummary {
  const totalFollowers = analytics.reduce((s, a) => s + a.followers, 0);
  const totalReach = analytics.reduce((s, a) => s + a.reach, 0);
  const totalEngagement = analytics.reduce(
    (s, a) => s + a.likes + a.shares,
    0
  );
  const top = [...analytics].sort((a, b) => b.engagementRate - a.engagementRate)[0];
  return {
    totalFollowers,
    totalReach,
    totalEngagement,
    scheduledCount: scheduled.filter((p) => p.status === "scheduled").length,
    topPlatform: top?.platform ?? "instagram",
    weeklyGrowth: 12.4,
  };
}

// In-memory store for scheduled posts (demo)
let scheduledPosts: ScheduledPost[] = [
  {
    id: "1",
    title: "Product launch teaser",
    content: "Something big is coming. Stay tuned! 🚀",
    platforms: ["instagram", "twitter", "linkedin"],
    scheduledAt: addDays(new Date(), 1).toISOString(),
    status: "scheduled",
    mediaType: "image",
  },
  {
    id: "2",
    title: "Weekly tips thread",
    content: "5 ways to grow your audience this week...",
    platforms: ["twitter", "linkedin"],
    scheduledAt: addDays(new Date(), 3).toISOString(),
    status: "scheduled",
  },
  {
    id: "3",
    title: "Behind the scenes reel",
    content: "A day in the life at our studio ✨",
    platforms: ["instagram", "youtube"],
    scheduledAt: subDays(new Date(), 2).toISOString(),
    status: "published",
    mediaType: "video",
  },
];

export function getScheduledPosts(): ScheduledPost[] {
  return [...scheduledPosts].sort(
    (a, b) =>
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
}

export function addScheduledPost(
  post: Omit<ScheduledPost, "id" | "status">
): ScheduledPost {
  const newPost: ScheduledPost = {
    ...post,
    id: crypto.randomUUID(),
    status: "scheduled",
  };
  scheduledPosts = [...scheduledPosts, newPost];
  return newPost;
}

export function deleteScheduledPost(id: string): boolean {
  const before = scheduledPosts.length;
  scheduledPosts = scheduledPosts.filter((p) => p.id !== id);
  return scheduledPosts.length < before;
}
