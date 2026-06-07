"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Link2,
  Loader2,
  LogOut,
  Plug,
  PlugZap,
  User,
  Settings,
} from "lucide-react";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORMS } from "@/lib/platforms";
import type { PlatformId } from "@/lib/types";

const STORAGE_KEY = "growthos-connections";

type UserProfile = {
  email: string;
  name: string;
};

function loadConnections(): PlatformId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ["instagram", "twitter", "linkedin"];
    return JSON.parse(raw) as PlatformId[];
  } catch {
    return [];
  }
}

function saveConnections(connected: PlatformId[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connected));
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [connected, setConnected] = useState<PlatformId[]>([]);
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setConnected(loadConnections());
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleConnection = useCallback(async (platformId: PlatformId) => {
    setConnecting(platformId);
    await new Promise((r) => setTimeout(r, 600));
    setConnected((prev) => {
      const next = prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId];
      saveConnections(next);
      return next;
    });
    setConnecting(null);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-zinc-100 via-violet-400 to-zinc-100 bg-[length:200%_auto] bg-clip-text text-4xl font-bold tracking-tight text-transparent animate-[shine_6s_linear_infinite]">
            Profile
          </h1>
          <p className="mt-1 text-zinc-500">
            Your account and connected social platforms
          </p>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-2 rounded-lg border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Sign out
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* User Card */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-8 lg:col-span-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <User className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {user?.name ?? "GrowthOS User"}
            </h2>
            <p className="mt-1 text-zinc-500">{user?.email ?? "—"}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              {connected.length} of {PLATFORMS.length} connected
            </span>
          </div>

          <div className="mt-8 space-y-4 border-t border-white/5 pt-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Plan</span>
              <span className="font-medium text-white">GrowthOS Pro</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Posts this month</span>
              <span className="font-medium text-white">47 / 200</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Member since</span>
              <span className="font-medium text-white">Jan 2024</span>
            </div>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm text-zinc-300 transition-all hover:bg-white hover:text-black">
              <Settings className="h-4 w-4" />
              Account Settings
            </button>
          </div>
        </div>

        {/* Connections */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-8 lg:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Social Connections
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Connect accounts to publish and pull analytics
              </p>
            </div>
            <Link2 className="h-5 w-5 text-zinc-500" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PLATFORMS.map((platform) => {
              const isConnected = connected.includes(platform.id);
              const isBusy = connecting === platform.id;

              return (
                <div
                  key={platform.id}
                  className={`group rounded-xl border p-5 transition-all duration-300 ${
                    isConnected
                      ? "border-violet-500/30 bg-violet-500/5 hover:border-violet-500/60"
                      : "border-white/5 bg-zinc-800/30 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={platform.id} size="lg" />
                      <div>
                        <p className="font-semibold text-white">
                          {platform.name}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {isConnected
                            ? `@${user?.name?.toLowerCase().replace(/\s/g, "") ?? "you"}`
                            : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <button
                      disabled={isBusy}
                      onClick={() => toggleConnection(platform.id)}
                      className={`rounded-lg p-2 transition-all ${
                        isConnected
                          ? "text-violet-400 hover:bg-violet-500/20"
                          : "text-zinc-500 hover:bg-zinc-800"
                      }`}
                    >
                      {isBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isConnected ? (
                        <PlugZap className="h-4 w-4" />
                      ) : (
                        <Plug className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        isConnected
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isConnected ? "bg-emerald-400" : "bg-zinc-600"
                        }`}
                      />
                      {isConnected ? "Active" : "Disconnected"}
                    </span>
                    {isConnected && (
                      <button
                        onClick={() => toggleConnection(platform.id)}
                        className="text-xs text-zinc-500 underline underline-offset-2 transition-colors hover:text-red-400"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-zinc-600">
            Demo mode: connections are saved locally. Production uses OAuth per
            platform.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
}
