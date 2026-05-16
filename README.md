# GrowthOS

All-in-one social media growth platform: content generation, trend detection, caption optimization, scheduling, and analytics.

## Platforms

Instagram, Twitter/X, WhatsApp, LinkedIn, Pinterest, YouTube

## Features

- **Content Generator** — Platform-specific posts with tone, format, and hashtags
- **Trend Detector** — Trending topics and hashtags by platform
- **Caption Optimizer** — Score and improve captions for engagement, reach, or clicks
- **Scheduler** — Queue posts across multiple platforms
- **Analytics** — Likes, shares, views, reach, followers, and charts

Navigation uses a **Glass Dock** (macOS-style) at the bottom of the screen.

## Getting started

```bash
npm install
npm run dev
```



## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (dock magnification)
- Recharts

## API routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/content/generate` | POST | Generate post content |
| `/api/trends` | GET | List trending topics |
| `/api/captions/optimize` | POST | Optimize a caption |
| `/api/schedule` | GET, POST, DELETE | Manage scheduled posts |
| `/api/analytics` | GET | Analytics metrics |
