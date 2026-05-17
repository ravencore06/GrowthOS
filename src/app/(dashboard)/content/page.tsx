"use client";

import { useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PLATFORMS } from "@/lib/platforms";
import type { ContentFormat, ContentTone, GeneratedContent, PlatformId } from "@/lib/types";

export default function ContentPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [tone, setTone] = useState<ContentTone>("casual");
  const [format, setFormat] = useState<ContentFormat>("post");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone, format, includeHashtags }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    if (!result) return;
    const text = [result.headline, result.body, result.callToAction, result.hashtags.join(" ")]
      .filter(Boolean)
      .join("\n\n");
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      <Header
        title="Content Generator"
        description="AI-powered posts tailored for each platform and format"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-zinc-400">Topic / idea</label>
              <Input
                placeholder="e.g. Launching our new productivity app"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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
                <label className="mb-1.5 block text-sm text-zinc-400">Format</label>
                <Select value={format} onChange={(e) => setFormat(e.target.value as ContentFormat)}>
                  <option value="post">Post</option>
                  <option value="story">Story</option>
                  <option value="reel">Reel</option>
                  <option value="thread">Thread</option>
                  <option value="video">Video</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm text-zinc-400">Tone</label>
                <Select value={tone} onChange={(e) => setTone(e.target.value as ContentTone)}>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="witty">Witty</option>
                  <option value="inspirational">Inspirational</option>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="rounded border-zinc-600"
                  />
                  Include hashtags
                </label>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading || !topic.trim()} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate content
            </Button>
          </div>
        </Card>
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Generated content</h2>
            {result && (
              <Button variant="ghost" size="sm" onClick={copyAll}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
            )}
          </div>
          {!result ? (
            <p className="text-sm text-zinc-500">Enter a topic and generate platform-optimized content.</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase text-zinc-500">Headline</p>
                <p className="mt-1 font-medium text-white">{result.headline}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-zinc-500">Body</p>
                <p className="mt-1 whitespace-pre-wrap text-zinc-300">{result.body}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-zinc-500">CTA</p>
                <p className="mt-1 text-violet-300">{result.callToAction}</p>
              </div>
              {result.hashtags.length > 0 && (
                <div>
                  <p className="text-xs uppercase text-zinc-500">Hashtags</p>
                  <p className="mt-1 text-blue-400">{result.hashtags.join(" ")}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
