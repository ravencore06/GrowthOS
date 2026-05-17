import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LoginShell } from "./login-shell";

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-zinc-500">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginShell />
    </Suspense>
  );
}
