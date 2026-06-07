import type { Platform } from "./types";

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    maxCaption: 2200,
    hashtagLimit: 30,
  },
  {
    id: "twitter",
    name: "Twitter / X",
    color: "#1DA1F2",
    maxCaption: 280,
    hashtagLimit: 5,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    maxCaption: 1024,
    hashtagLimit: 0,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    maxCaption: 3000,
    hashtagLimit: 5,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    color: "#E60023",
    maxCaption: 500,
    hashtagLimit: 20,
  },
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    maxCaption: 5000,
    hashtagLimit: 15,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    maxCaption: 63206,
    hashtagLimit: 30,
  },
];

export function getPlatform(id: string) {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}
