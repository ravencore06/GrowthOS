const BASE_URL = process.env.ZERNIO_BASE_URL ?? "https://zernio.com/api/v1";

function apiKey() {
  const key = process.env.ZERNIO_API_KEY;
  if (!key) throw new Error("ZERNIO_API_KEY environment variable is not set");
  return key;
}

async function request<T>(
  method: string,
  path: string,
  body?: Record<string, unknown>
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Zernio API error (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  Profile                                                            */
/* ------------------------------------------------------------------ */

export interface ZernioProfile {
  id: string;
  name: string;
  createdAt: string;
}

export function createProfile(name: string): Promise<ZernioProfile> {
  return request<ZernioProfile>("POST", "/profiles", { name });
}

export function listProfiles(): Promise<ZernioProfile[]> {
  return request<ZernioProfile[]>("GET", "/profiles");
}

/* ------------------------------------------------------------------ */
/*  Connect / Accounts                                                  */
/* ------------------------------------------------------------------ */

export type ZernioPlatform =
  | "twitter"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "pinterest"
  | "reddit"
  | "bluesky"
  | "threads"
  | "googlebusiness"
  | "telegram"
  | "snapchat"
  | "discord";

export interface ConnectResponse {
  authUrl: string;
}

export function getConnectUrl(
  platform: ZernioPlatform,
  profileId: string,
  redirectUrl: string
): Promise<ConnectResponse> {
  const params = new URLSearchParams({
    profileId,
    redirect_url: redirectUrl,
  });
  return request<ConnectResponse>("GET", `/connect/${platform}?${params}`);
}

export interface ZernioAccount {
  id: string;
  platform: ZernioPlatform;
  profileId: string;
  name: string;
  avatar?: string;
  username?: string;
  status: "connected" | "expired" | "disconnected";
  connectedAt: string;
}

export function listAccounts(profileId: string): Promise<ZernioAccount[]> {
  return request<ZernioAccount[]>("GET", `/accounts?profileId=${profileId}`);
}

export function getAccount(accountId: string): Promise<ZernioAccount> {
  return request<ZernioAccount>("GET", `/accounts/${accountId}`);
}

export function disconnectAccount(accountId: string): Promise<void> {
  return request<void>("DELETE", `/accounts/${accountId}`);
}

/* ------------------------------------------------------------------ */
/*  Posts                                                               */
/* ------------------------------------------------------------------ */

export interface ZernioPost {
  id: string;
  profileId: string;
  content: string;
  platforms: { platform: ZernioPlatform; accountId: string }[];
  status: "draft" | "scheduled" | "published" | "failed" | "partial";
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  mediaUrls?: string[];
  title?: string;
}

export interface CreatePostParams {
  content: string;
  platform: string;
  account_id?: string;
  profile_id?: string;
  is_draft?: boolean;
  publish_now?: boolean;
  schedule_minutes?: number;
  media_urls?: string;
  title?: string;
}

export function createPost(params: CreatePostParams): Promise<ZernioPost> {
  const body: Record<string, unknown> = {};
  if (params.content) body.content = params.content;
  if (params.platform) body.platform = params.platform;
  if (params.account_id) body.account_id = params.account_id;
  if (params.profile_id) body.profile_id = params.profile_id;
  if (params.is_draft !== undefined) body.is_draft = params.is_draft;
  if (params.publish_now !== undefined) body.publish_now = params.publish_now;
  if (params.schedule_minutes !== undefined)
    body.schedule_minutes = params.schedule_minutes;
  if (params.media_urls) body.media_urls = params.media_urls;
  if (params.title) body.title = params.title;
  return request<ZernioPost>("POST", "/posts", body);
}

export function crossPost(params: {
  content: string;
  platforms: string;
  account_ids?: string;
  profile_id?: string;
  is_draft?: boolean;
  publish_now?: boolean;
  media_urls?: string;
}): Promise<ZernioPost> {
  return request<ZernioPost>("POST", "/posts/cross-post", params as Record<string, unknown>);
}

export function listPosts(profileId: string): Promise<ZernioPost[]> {
  return request<ZernioPost[]>("GET", `/posts?profileId=${profileId}`);
}

/* ------------------------------------------------------------------ */
/*  Analytics                                                           */
/* ------------------------------------------------------------------ */

export interface ZernioAnalytics {
  accountId: string;
  platform: ZernioPlatform;
  period: { start: string; end: string };
  followers?: number;
  engagement?: number;
  impressions?: number;
  reach?: number;
  likes?: number;
  shares?: number;
  comments?: number;
}

export function getAnalytics(
  accountId: string,
  start: string,
  end: string
): Promise<ZernioAnalytics> {
  const params = new URLSearchParams({ accountId, start, end });
  return request<ZernioAnalytics>("GET", `/analytics?${params}`);
}
