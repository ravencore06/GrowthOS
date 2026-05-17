export const SESSION_COOKIE = "growthos-session";

export function isValidCredentials(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.length > 0 && password.length >= 6;
}
