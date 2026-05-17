import { getPlatform } from "./platforms";
import type {
  CaptionOptimization,
  ContentFormat,
  ContentTone,
  GeneratedContent,
  PlatformId,
} from "./types";

const TONE_PHRASES: Record<ContentTone, string[]> = {
  professional: [
    "We're excited to share",
    "Discover how",
    "Learn more about",
  ],
  casual: ["Hey everyone!", "Quick update:", "Just dropped"],
  witty: ["Plot twist:", "Hot take:", "No cap —"],
  inspirational: [
    "Your journey starts today.",
    "Believe in the process.",
    "Small steps, big wins.",
  ],
};

const CTAS = [
  "Link in bio for details.",
  "Drop a comment below!",
  "Save this for later.",
  "Share with someone who needs this.",
  "Follow for more tips.",
];

export function generateContent(params: {
  topic: string;
  platform: PlatformId;
  tone: ContentTone;
  format: ContentFormat;
  includeHashtags: boolean;
}): GeneratedContent {
  const platform = getPlatform(params.platform);
  const opener =
    TONE_PHRASES[params.tone][params.topic.length % TONE_PHRASES[params.tone].length];
  const headline =
    params.format === "thread"
      ? `🧵 ${params.topic}`
      : params.format === "reel"
        ? `${params.topic} — in 60 seconds`
        : params.topic;

  const bodyParts = [
    `${opener} ${params.topic.toLowerCase()}.`,
    params.platform === "linkedin"
      ? "Here's what we've learned and why it matters for your growth strategy."
      : "Here's what you need to know 👇",
    params.tone === "professional"
      ? "Built for teams who want measurable results."
      : "Let us know what you think!",
  ];

  const body = bodyParts.join("\n\n").slice(0, platform.maxCaption - 100);
  const hashtagCount = Math.min(platform.hashtagLimit, 8);
  const hashtags = params.includeHashtags
    ? Array.from({ length: hashtagCount }, (_, i) => {
        const tag = params.topic
          .split(/\s+/)
          .slice(0, 2)
          .join("")
          .replace(/[^a-zA-Z0-9]/g, "");
        return `#${tag || "growthos"}${i > 0 ? i : ""}`;
      })
    : [];

  return {
    headline,
    body,
    hashtags,
    callToAction: CTAS[params.topic.length % CTAS.length],
    platform: params.platform,
    format: params.format,
  };
}

export function optimizeCaption(params: {
  caption: string;
  platform: PlatformId;
  goal: "engagement" | "reach" | "clicks";
}): CaptionOptimization {
  const platform = getPlatform(params.platform);
  let optimized = params.caption.trim();

  const improvements: string[] = [];

  if (!optimized.match(/[!?🎯✨🚀]/)) {
    optimized += " ✨";
    improvements.push("Added visual hook emoji");
  }

  if (params.goal === "engagement" && !optimized.toLowerCase().includes("comment")) {
    optimized += "\n\nWhat do you think? Comment below 👇";
    improvements.push("Added engagement CTA");
  }

  if (params.goal === "clicks" && !optimized.toLowerCase().includes("link")) {
    optimized += "\n\n🔗 Tap the link in bio.";
    improvements.push("Added click-through CTA");
  }

  if (optimized.length > platform.maxCaption) {
    optimized = optimized.slice(0, platform.maxCaption - 3) + "...";
    improvements.push(`Trimmed to ${platform.name} character limit`);
  }

  const words = params.caption.split(/\s+/).filter(Boolean);
  const hashtags = words
    .filter((w) => w.startsWith("#"))
    .concat(
      params.goal === "reach"
        ? ["#trending", "#fyp", `#${platform.id}`]
        : [`#${platform.id}tips`]
    )
    .slice(0, platform.hashtagLimit);

  const lengthScore = Math.max(
    0,
    100 - Math.abs(optimized.length - platform.maxCaption * 0.4) / 10
  );
  const hookScore = optimized.length > 40 ? 85 : 60;
  const ctaScore = improvements.length > 0 ? 90 : 70;
  const score = Math.min(
    99,
    Math.round((lengthScore + hookScore + ctaScore) / 3)
  );

  return {
    original: params.caption,
    optimized,
    score,
    improvements:
      improvements.length > 0
        ? improvements
        : ["Strong opening — minor tweaks applied"],
    hashtags,
    characterCount: optimized.length,
    platform: params.platform,
  };
}
