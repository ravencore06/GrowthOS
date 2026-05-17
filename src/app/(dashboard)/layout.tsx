import { GrowthOSDock } from "@/components/layout/growth-os-dock";
import { SplashWrapper } from "@/components/layout/splash-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SplashWrapper>
      <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-white/8 bg-zinc-950/80 px-8 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <div className="flex flex-col items-start gap-0">
              <span className="text-xl font-bold tracking-tight text-white">GrowthOS</span>
              <span className="text-[9px] font-medium tracking-wider text-zinc-500 uppercase">Content Creator Platform</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gradient-to-br from-zinc-950 via-zinc-950 to-violet-950/20 px-8 pt-20 sm:pt-24">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
        <GrowthOSDock />
      </div>
    </SplashWrapper>
  );
}
