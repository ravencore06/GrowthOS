export type PlatformId =
  | "instagram"
  | "twitter"
  | "whatsapp"
  | "linkedin"
  | "pinterest"
  | "youtube";

export type ContentTone = "professional" | "casual" | "witty" | "inspirational";
export type ContentFormat = "post" | "story" | "reel" | "thread" | "video";

export interface Platform {
  id: PlatformId;
  name: string;
  color: string;
  maxCaption: number;
  hashtagLimit: number;
}

export interface Trend {
  id: string;
  topic: string;
  platform: PlatformId;
  volume: number;
  growth: number;
  category: string;
  relatedHashtags: string[];
}

export interface GeneratedContent {
  headline: string;
  body: string;
  hashtags: string[];
  callToAction: string;
  platform: PlatformId;
  format: ContentFormat;
}

export interface CaptionOptimization {
  original: string;
  optimized: string;
  score: number;
  improvements: string[];
  hashtags: string[];
  characterCount: number;
  platform: PlatformId;
}

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platforms: PlatformId[];
  scheduledAt: string;
  status: "scheduled" | "published" | "failed";
  mediaType?: "image" | "video" | "carousel";
}

export interface AnalyticsMetrics {
  platform: PlatformId;
  likes: number;
  shares: number;
  views: number;
  reach: number;
  followers: number;
  engagementRate: number;
  history: { date: string; likes: number; views: number; reach: number }[];
}

export interface DashboardSummary {
  totalFollowers: number;
  totalReach: number;
  totalEngagement: number;
  scheduledCount: number;
  topPlatform: PlatformId;
  weeklyGrowth: number;
}
