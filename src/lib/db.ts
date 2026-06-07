import { getSupabaseAdmin } from "./supabase";
import type { PlatformId } from "./types";

/* ------------------------------------------------------------------ */
/*  In-memory fallback (for dev without Supabase)                      */
/* ------------------------------------------------------------------ */

interface StoredProfile {
  id: string;
  email: string;
  zernioProfileId: string | null;
  createdAt: string;
}

interface StoredAccount {
  id: string;
  email: string;
  platform: string;
  zernioAccountId: string;
  name: string;
  username: string | null;
  avatar: string | null;
  status: string;
  connectedAt: string;
}

interface StoredPost {
  id: string;
  email: string;
  zernioPostId: string | null;
  title: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: "scheduled" | "published" | "failed" | "partial";
  createdAt: string;
}

const memProfiles: StoredProfile[] = [];
const memAccounts: StoredAccount[] = [];
const memPosts: StoredPost[] = [];

/* ------------------------------------------------------------------ */
/*  Profiles                                                            */
/* ------------------------------------------------------------------ */

export async function ensureProfile(email: string, zernioProfileId: string) {
  const existing = memProfiles.find((p) => p.email === email);
  if (existing) {
    existing.zernioProfileId = zernioProfileId;
    return existing;
  }
  const profile: StoredProfile = {
    id: crypto.randomUUID(),
    email,
    zernioProfileId,
    createdAt: new Date().toISOString(),
  };
  memProfiles.push(profile);
  return profile;
}

export async function getProfile(email: string) {
  return memProfiles.find((p) => p.email === email) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Connected Accounts                                                  */
/* ------------------------------------------------------------------ */

export async function storeConnectedAccount(params: {
  email: string;
  platform: string;
  zernioAccountId: string;
  name: string;
  username?: string;
  avatar?: string;
}) {
  const existing = memAccounts.find(
    (a) => a.email === params.email && a.zernioAccountId === params.zernioAccountId
  );
  if (existing) {
    existing.status = "connected";
    return existing;
  }
  const account: StoredAccount = {
    id: crypto.randomUUID(),
    email: params.email,
    platform: params.platform,
    zernioAccountId: params.zernioAccountId,
    name: params.name,
    username: params.username ?? null,
    avatar: params.avatar ?? null,
    status: "connected",
    connectedAt: new Date().toISOString(),
  };
  memAccounts.push(account);
  return account;
}

export async function getConnectedAccounts(email: string) {
  return memAccounts.filter((a) => a.email === email);
}

export async function removeConnectedAccount(email: string, accountId: string) {
  const idx = memAccounts.findIndex(
    (a) => a.email === email && a.id === accountId
  );
  if (idx !== -1) memAccounts.splice(idx, 1);
}

export async function getConnectedAccountByZernioId(zernioAccountId: string) {
  return memAccounts.find((a) => a.zernioAccountId === zernioAccountId) ?? null;
}

/* ------------------------------------------------------------------ */
/*  Scheduled Posts                                                     */
/* ------------------------------------------------------------------ */

export async function storeScheduledPost(params: {
  email: string;
  zernioPostId?: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledAt: string;
  status: "scheduled" | "published" | "failed" | "partial";
}) {
  const post: StoredPost = {
    id: crypto.randomUUID(),
    email: params.email,
    zernioPostId: params.zernioPostId ?? null,
    title: params.title,
    content: params.content,
    platforms: params.platforms,
    scheduledAt: params.scheduledAt,
    status: params.status,
    createdAt: new Date().toISOString(),
  };
  memPosts.push(post);
  return post;
}

export async function getUserPosts(email: string) {
  return memPosts.filter((p) => p.email === email);
}

export async function updatePostStatus(
  postId: string,
  status: StoredPost["status"]
) {
  const post = memPosts.find((p) => p.id === postId);
  if (post) post.status = status;
  return post;
}
