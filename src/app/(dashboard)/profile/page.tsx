"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Link2, Loader2, LogOut, Unlink, User } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const connectedCount = connected.length;

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

  return (
    <>
      <Header
        title="Profile"
        description="Your account and connected social platforms"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {user?.name ?? "GrowthOS User"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">{user?.email ?? "—"}</p>
              <Badge className="mt-4 bg-violet-500/20 text-violet-300">
                {connectedCount} of {PLATFORMS.length} connected
              </Badge>
              <Button
                variant="outline"
                className="mt-6 w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Sign out
              </Button>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Social connections</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Connect accounts to publish and pull analytics
                </p>
              </div>
              <Link2 className="h-5 w-5 text-zinc-500" />
            </div>

            <ul className="space-y-3">
              {PLATFORMS.map((platform) => {
                const isConnected = connected.includes(platform.id);
                const isBusy = connecting === platform.id;

                return (
                  <li
                    key={platform.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <PlatformIcon platform={platform.id} size="lg" />
                      <div>
                        <p className="font-medium text-white">{platform.name}</p>
                        <p className="text-xs text-zinc-500">
                          {isConnected
                            ? `Connected as @${user?.name?.toLowerCase().replace(/\s/g, "") ?? "you"}`
                            : "Not connected"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={isConnected ? "outline" : "default"}
                      size="sm"
                      disabled={isBusy}
                      onClick={() => toggleConnection(platform.id)}
                    >
                      {isBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isConnected ? (
                        <>
                          <Unlink className="h-4 w-4" />
                          Disconnect
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Connect
                        </>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-xs text-zinc-600">
              Demo mode: connections are saved locally. Production uses OAuth per platform.
            </p>
          </Card>
        </div>
      )}
    </>
  );
}
