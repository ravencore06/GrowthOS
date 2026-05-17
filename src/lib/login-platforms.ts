export type LoginPlatformId =
  | "instagram"
  | "twitter"
  | "snapchat"
  | "youtube"
  | "pinterest"
  | "whatsapp";

export type LoginPlatform = {
  id: LoginPlatformId;
  name: string;
  color: string;
  subtitle: string;
  description: string;
  gradient: string;
};

export const LOGIN_PLATFORMS: LoginPlatform[] = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    subtitle: "Visual storytelling",
    description: "Reels, stories, and feed growth in one place.",
    gradient: "from-[#E4405F]/80 via-[#833AB4]/60 to-[#FD1D1D]/40",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    color: "#1DA1F2",
    subtitle: "Real-time buzz",
    description: "Threads, trends, and viral conversations.",
    gradient: "from-[#1DA1F2]/70 via-zinc-800/80 to-black/60",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    color: "#FFFC00",
    subtitle: "Ephemeral stories",
    description: "Snap streaks, lenses, and Gen-Z reach.",
    gradient: "from-[#FFFC00]/80 via-[#FFE600]/60 to-[#FFAA00]/40",
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    subtitle: "Long-form video",
    description: "Shorts and videos that compound views.",
    gradient: "from-[#FF0000]/80 via-[#cc0000]/60 to-zinc-900/50",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "#E60023",
    subtitle: "Discovery pins",
    description: "Drive traffic with visual search intent.",
    gradient: "from-[#E60023]/80 via-[#bd081c]/60 to-[#ff6b6b]/40",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    subtitle: "Direct messaging",
    description: "Reach customers where they reply fastest.",
    gradient: "from-[#25D366]/80 via-[#128C7E]/60 to-[#DCF8C6]/30",
  },
];

export function platformInitial(name: string) {
  return name.charAt(0).toUpperCase();
}
