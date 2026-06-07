"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Clock, Plus, Sparkles, Trash2, X } from "lucide-react";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformIcon } from "@/components/platform-icon";

import type { PlatformId, ScheduledPost } from "@/lib/types";

export default function SchedulerPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(["instagram"]);

  const load = useCallback(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []));
  }, []);

  useEffect(() => { load(); }, [load]);

  function togglePlatform(id: PlatformId) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !scheduledAt || !selectedPlatforms.length) return;
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
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
    load();
  }

  const daysInMonth = 31;
  const firstDayOfWeek = 1; // Oct 2024 starts on Tuesday

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-zinc-100 via-violet-400 to-zinc-100 bg-[length:200%_auto] bg-clip-text text-4xl font-bold tracking-tight text-transparent animate-[shine_6s_linear_infinite]">
            Content Scheduler
          </h1>
          <p className="mt-1 text-zinc-500">
            Optimize your posting frequency with AI-driven temporal insights.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-500 px-8 py-3 font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          New Post
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Calendar */}
        <section className="rounded-2xl border border-white/5 bg-zinc-900 p-8 lg:col-span-8">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-semibold text-white">
                October 2024
              </h2>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-colors hover:bg-zinc-800">
                  <span className="text-zinc-400">←</span>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 transition-colors hover:bg-zinc-800">
                  <span className="text-zinc-400">→</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
              <button className="rounded-md bg-zinc-800 px-4 py-1.5 text-xs font-medium text-white">
                Month
              </button>
              <button className="rounded-md px-4 py-1.5 text-xs text-zinc-500 hover:text-zinc-300">
                Week
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <div className="grid grid-cols-7 bg-zinc-900">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className="border-b border-zinc-800 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-zinc-500"
                >
                  {d}
                </div>
              ))}
              {Array.from({ length: firstDayOfWeek - 1 }, (_, i) => (
                <div key={`empty-${i}`} className="border border-zinc-800/30 bg-black p-3" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = day === 24;
                const hasPost = day === 12 || day === 24 || day === 28;
                return (
                  <div
                    key={day}
                    className="min-h-[140px] cursor-pointer border border-zinc-800/30 bg-black p-3 transition-all hover:bg-zinc-800/50"
                  >
                    <span
                      className={`text-[12px] font-bold ${
                        isToday
                          ? "flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]"
                          : "text-zinc-500"
                      }`}
                    >
                      {day}
                    </span>
                    {hasPost && (
                      <div className="mt-4 space-y-2">
                        <div className="rounded-r-md border-l-2 border-violet-500 bg-violet-500/10 p-2">
                          <p className="truncate text-[10px] font-bold leading-tight text-zinc-200">
                            Scheduled Campaign
                          </p>
                          <span className="text-[9px] uppercase text-zinc-500">
                            09:00 AM
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 lg:col-span-4">
          {/* AI Optimal Slots */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900 p-6">
            <div className="mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              <h3 className="text-xl font-semibold text-white">
                AI Optimal Slots
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex cursor-pointer items-center justify-between rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 transition-all hover:bg-violet-500/10">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Tomorrow, Oct 25
                  </p>
                  <p className="text-xl font-semibold text-white transition-colors group-hover:text-violet-400">
                    11:45 AM
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-violet-400">
                    High Engagement
                  </p>
                  <p className="text-[11px] text-zinc-500">94% Forecast</p>
                </div>
              </div>
              <div className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-800 bg-black p-5 transition-all hover:border-violet-500/30">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Saturday, Oct 26
                  </p>
                  <p className="text-xl font-semibold text-white transition-colors group-hover:text-violet-400">
                    06:20 PM
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-violet-400">
                    Peak Traffic
                  </p>
                  <p className="text-[11px] text-zinc-500">88% Forecast</p>
                </div>
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="flex flex-1 flex-col rounded-2xl border border-white/5 bg-zinc-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Queue</h3>
              <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-zinc-500 transition-colors hover:text-violet-400">
                View All
                <span>→</span>
              </button>
            </div>
            <div className="flex-1 space-y-6">
              {posts.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No posts scheduled yet.
                </p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="group flex cursor-pointer items-start gap-4"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-black">
                      <CalendarDays className="h-6 w-6 text-zinc-600" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="text-sm font-bold text-zinc-200 transition-colors group-hover:text-violet-400">
                        {post.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[14px] text-violet-400">
                          <Clock className="h-3.5 w-3.5 text-violet-400" />
                        </span>
                        <span className="text-[11px] font-bold uppercase text-zinc-500">
                          {format(
                            new Date(post.scheduledAt),
                            "MMM d, h:mm a"
                          )}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-1">
                        {post.platforms.map((p) => (
                          <PlatformIcon key={p} platform={p} size="sm" />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-zinc-600 transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* New Post Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Schedule New Post
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 transition-colors hover:bg-zinc-800"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleSchedule} className="space-y-5">
              <input
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
              />
              <textarea
                placeholder="Post content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
              />
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black px-4 py-2.5 text-sm text-white focus:border-violet-500 focus:outline-none [color-scheme:dark]"
              />
              <div>
                <p className="mb-2 text-sm text-zinc-500">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`rounded-lg border px-2.5 py-1.5 transition-colors ${
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
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 py-3 font-bold text-white transition-all hover:bg-violet-400"
              >
                <CalendarDays className="h-4 w-4" />
                Schedule post
              </button>
            </form>
          </div>
        </div>
      )}

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
