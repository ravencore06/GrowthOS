"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Wand2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PLATFORMS } from "@/lib/platforms";
import type { CaptionOptimization, PlatformId } from "@/lib/types";

export default function CaptionsPage() {
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [goal, setGoal] = useState<"engagement" | "reach" | "clicks">("engagement");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaptionOptimization | null>(null);

  async function handleOptimize() {
    if (!caption.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/captions/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, platform, goal }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header
        title="Caption Optimizer"
        description="Improve captions for engagement, reach, or clicks per platform"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">Your caption</label>
              <Textarea
                placeholder="Paste your draft caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">Platform</label>
                <Select value={platform} onChange={(e) => setPlatform(e.target.value as PlatformId)}>
                  {PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">Goal</label>
                <Select value={goal} onChange={(e) => setGoal(e.target.value as typeof goal)}>
                  <option value="engagement">Engagement</option>
                  <option value="reach">Reach</option>
                  <option value="clicks">Clicks</option>
                </Select>
              </div>
            </div>
            <Button onClick={handleOptimize} disabled={loading || !caption.trim()} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              Optimize caption
            </Button>
          </div>
        </Card>
        <Card className="p-6">
          {!result ? (
            <p className="text-sm text-zinc-500">Optimized caption and score will appear here.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Optimization score</span>
                <span className="text-2xl font-bold text-violet-400">{result.score}/100</span>
              </div>
              <div>
                <p className="text-xs uppercase text-zinc-500">Optimized</p>
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-white/5 p-4 text-sm text-white">
                  {result.optimized}
                </p>
                <p className="mt-2 text-xs text-zinc-500">{result.characterCount} characters</p>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase text-zinc-500">Improvements</p>
                <ul className="space-y-1">
                  {result.improvements.map((imp) => (
                    <li key={imp} className="flex items-center gap-2 text-sm text-emerald-400">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
              {result.hashtags.length > 0 && (
                <p className="text-sm text-blue-400">{result.hashtags.join(" ")}</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
