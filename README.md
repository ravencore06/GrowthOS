# 🚀 GrowthOS

GrowthOS is an all-in-one social media growth platform designed to help content creators, marketing teams, and brands streamline content generation, detect trends, optimize captions, schedule posts, and view real-time analytics across multiple platforms.

Featuring a premium dark-mode interface, glassmorphism aesthetics, dynamic animations (powered by Framer Motion), and a custom macOS-style Glass Dock navigation, GrowthOS offers a state-of-the-art dashboard and editing experience.

---

## 📱 Supported Platforms

- **Instagram**
- **Twitter / X**
- **WhatsApp**
- **LinkedIn**
- **Pinterest**
- **YouTube**
- **Facebook**

---

## ✨ Core Features

*   **✍️ Content Generator:** Automatically generate platform-specific posts based on target topics, tones (Professional, Casual, Witty, Inspirational), and formats (Post, Story, Reel, Thread, Video) complete with automated hashtag suggestions.
*   **📈 Trend Detector:** Track volume and growth of trending topics, categories, and hashtags across all connected platforms in real time.
*   **🎯 Caption Optimizer:** Grade and improve draft captions using performance goals (Engagement, Reach, Clicks). The optimizer automatically trims character limits, inserts visual hooks, and appends optimized CTAs.
*   **📅 Cross-Platform Scheduler:** Compose and queue posts for multiple platforms simultaneously. Maintain complete control over scheduling times and publication statuses.
*   **📊 Real-Time Analytics:** Analyze reach, followers, views, likes, and shares across all platforms. Visualized with interactive custom-themed charts.
*   **🛸 Glass Dock Navigation:** A fluid, macOS-inspired bottom dock that provides rapid navigation between features with smooth hover magnification.

---

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) for optimized server rendering and directory routing.
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for static typing and modular architecture.
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for fluid responsive design, integrated with a customized modern dark-theme palette.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) for micro-interactions, spring animations, and the macOS-style dock magnification.
*   **Data Visualization:** [Recharts](https://recharts.org/) for beautiful, responsive, SVG-based analytics charts.
*   **Database & Auth:** [Supabase](https://supabase.com/) client integration for persistent storing of profiles, connected accounts, and scheduled posts.
*   **API Integrations:** [Zernio API](https://zernio.com/) for robust cross-posting, profile management, profile connections, and cross-platform publishing.

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router structure
│   ├── (dashboard)/      # Authenticated routes & dashboard layouts
│   │   ├── analytics/    # Analytics view & charts
│   │   ├── captions/     # Caption optimizer tool
│   │   ├── content/      # AI content generator
│   │   ├── profile/      # Connected profiles & account setup
│   │   ├── scheduler/    # Queue management & scheduler calendar
│   │   └── trends/       # Trending topics dashboard
│   ├── api/              # API endpoints for content, trends, schedules, & analytics
│   ├── globals.css       # Tailwind entry and global CSS custom properties
│   └── layout.tsx        # Base HTML layout
├── components/           # Reusable UI & Layout components
│   ├── layout/           # Shared navigation (Glass Dock, Header, Splash screen)
│   └── ui/               # Modular premium components (Glow Card, Liquid Metal, Spotlight)
├── lib/                  # Core library functions
│   ├── db.ts             # Supabase database interface with local in-memory fallback
│   ├── services.ts       # Caption optimization and generation helpers
│   ├── zernio.ts         # Zernio API wrapper (posts, accounts, profiles, analytics)
│   └── utils.ts          # Tailwind CSS merge and utility functions
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository & Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory based on the `.env.example` file:

```env
# Zernio API Configuration
ZERNIO_API_KEY=sk_your_zernio_api_key_here
ZERNIO_BASE_URL=https://zernio.com/api/v1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App URL Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** GrowthOS includes a built-in memory fallback for all database operations if Supabase environment variables are omitted, allowing zero-config local development out of the box.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### 4. Code Quality & Formatting

```bash
npm run lint
```

---

## 🔗 Zernio API Integration

GrowthOS integrates with the **Zernio API** to perform cross-platform posting and account management. The API integrations (found in [zernio.ts](file:///C:/Users/srini/Documents/projects/socialpulse/src/lib/zernio.ts)) support:

*   **Profiles:** Creating and listing unified Zernio profiles for team or client spaces.
*   **Connections:** Retrieving unique platform-specific OAuth URLs (`/connect/{platform}`) for connecting accounts safely.
*   **Posts:** Creating drafts, scheduling publications, and triggering cross-posting (`/posts/cross-post`) to publish content instantly across LinkedIn, Twitter, Instagram, and more.
*   **Analytics:** Pulling impressions, engagement, reach, and follower details directly from multiple channels simultaneously.

---

## 🎨 Premium UI Components

GrowthOS utilizes a set of design-forward custom UI components to achieve a premium user experience:

*   **`GlowBorderCard`**: Draws smooth, animated gradients around component card borders using CSS/Framer Motion.
*   **`GlassDock`**: Provides macOS-style physical dock magnification on hover.
*   **`LiquidMetal`**: Uses WebGL or SVG filters to create an animated liquid metallic background effect.
*   **`HalfArcGridBg` / `StaggeredGridBg`**: Rich, mathematically plotted grid backgrounds with soft radial gradients.
*   **`SpotlightNavbar`**: Navbar component containing highlight tracking on hover.
