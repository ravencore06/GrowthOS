"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORMS } from "@/lib/platforms";
import type { PlatformId, ScheduledPost } from "@/lib/types";

export default function SchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(["instagram"]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function togglePlatform(id: PlatformId) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !scheduledAt || !selectedPlatforms.length) return;
    setLoading(true);
    try {
      await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          platforms: selectedPlatforms,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });
      setTitle("");
      setContent("");
      setScheduledAt("");
      load();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <Header
        title="Post Scheduler"
        description="Schedule posts across Instagram, X, WhatsApp, LinkedIn, Pinterest, and YouTube"
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Plus className="h-4 w-4" /> New scheduled post
          </h2>
          <form onSubmit={handleSchedule} className="space-y-4">
            <Input placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea
              placeholder="Post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <div>
              <p className="mb-2 text-sm text-zinc-400">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`rounded-lg border px-2 py-1 transition-colors ${
                      selectedPlatforms.includes(p.id)
                        ? "border-violet-500 bg-violet-500/20"
                        : "border-white/10 opacity-50"
                    }`}
                  >
                    <PlatformIcon platform={p.id} size="sm" />
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <Calendar className="h-4 w-4" />
              Schedule post
            </Button>
          </form>
        </Card>
        <Card className="p-6 lg:col-span-3">
          <h2 className="mb-4 font-semibold text-white">Scheduled queue</h2>
          {posts.length === 0 ? (
            <p className="text-sm text-zinc-500">No posts scheduled yet.</p>
          ) : (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-white/5 p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{post.title}</p>
                      <Badge
                        className={
                          post.status === "published"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{post.content}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {format(new Date(post.scheduledAt), "MMM d, yyyy · h:mm a")}
                    </p>
                    <div className="mt-2 flex gap-1">
                      {post.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p} size="sm" />
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
