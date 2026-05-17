"use client";

import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { StaggeredGridBg } from "@/components/ui/staggered-grid-bg";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";
import { LoginForm } from "./login-form";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function LoginShell() {
  const [showForm, setShowForm] = useState(false);

  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-black">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md">
          <div className="flex flex-col items-start gap-0">
            <span className="text-2xl font-bold tracking-tight text-white">GrowthOS</span>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Content Creator Platform</span>
          </div>
          <LiquidMetalButton
            icon={<ArrowRight className="h-4 w-4" />}
            size="lg"
            borderWidth={3}
            metalConfig={{
              colorBack: "#888888",
              colorTint: "#ffffff",
              distortion: 0.15,
              speed: 0.4,
            }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Back" : "Get Started"}
          </LiquidMetalButton>
        </div>

        {/* Dark staggered grid background */}
        <StaggeredGridBg />

        {/* Center connect card */}
        {!showForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4 pointer-events-none">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-8 backdrop-blur-xl pointer-events-auto w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-pink-500/20" />
              <div className="absolute inset-0 bg-black/50" />

              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold tracking-tight text-white">GrowthOS</span>
                    <p className="mt-1 text-xs font-medium tracking-wider text-zinc-400 uppercase">Content Creator Platform</p>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white">Connect</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    Unify your social platforms and grow faster
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
                  >
                    Sign in or Sign up
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login form overlay */}
        {showForm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/90 p-8 backdrop-blur-xl w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-pink-500/20" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10">
                <LoginForm />
              </div>
            </div>
          </div>
        )}
      </main>
    </SmoothScroll>
  );
}
