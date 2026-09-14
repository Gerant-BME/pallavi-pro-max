import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Fingerprint, Mail, Lock, ArrowRight, Flame } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: SplashLogin,
  head: () => ({
    meta: [
      { title: "Pallavi — Smart LPG Monitoring" },
      { name: "description", content: "Real-time LPG cylinder tracking, refill booking, gas leak safety, and AI insights for homes and businesses." },
      { property: "og:title", content: "Pallavi — Smart LPG Monitoring" },
      { property: "og:description", content: "Real-time LPG cylinder tracking, refill booking, gas leak safety, and AI insights." },
    ],
  }),
});

function SplashLogin() {
  const [stage, setStage] = useState<"splash" | "login">("splash");
  const [email, setEmail] = useState("pallavi@pallavi.app");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setStage("login"), 1600);
    return () => clearTimeout(t);
  }, []);

  const signIn = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    navigate({ to: "/app" });
  };

  const faceId = async () => {
    toast("Scanning Face ID…");
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Welcome back, Pallavi");
    navigate({ to: "/app" });
  };

  return (
    <DeviceFrame>
      {stage === "splash" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-70" style={{ background: "radial-gradient(circle, oklch(0.62 0.19 256), transparent 60%)" }} />
            <div className="grid h-24 w-24 place-items-center rounded-[28px] bg-gradient-to-br from-[oklch(0.62_0.19_256)] to-[oklch(0.5_0.15_260)] shadow-2xl animate-pulse-ring">
              <Flame className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-semibold tracking-tight text-white">Pallavi</div>
            <div className="mt-2 text-sm text-white/50">Smart LPG intelligence</div>
          </div>
          <div className="mt-6 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between p-6 animate-fade-in">
          <div className="pt-6">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.62_0.19_256)] to-[oklch(0.5_0.15_260)] shadow-lg mb-6">
              <Flame className="h-7 w-7 text-white" strokeWidth={1.6} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Hey Pallavi 💘, Still Hate Me?</h1>
            <p className="mt-1.5 text-sm text-white/50">Sign in to monitor your cylinders</p>

            <div className="mt-8 space-y-3">
              <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3.5">
                <Mail className="h-4 w-4 text-white/50" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none" placeholder="Email" />
              </div>
              <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3.5">
                <Lock className="h-4 w-4 text-white/50" />
                <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none" />
              </div>
              <button onClick={() => toast.success("Reset link sent to " + email)} className="text-xs text-[color:var(--primary)] ml-1">Forgot password?</button>
            </div>
          </div>

          <div className="space-y-3 pb-4">
            <button
              onClick={signIn}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[oklch(0.62_0.19_256)] to-[oklch(0.55_0.19_270)] py-4 text-sm font-semibold text-white shadow-lg shadow-[oklch(0.62_0.19_256_/_0.4)] flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              {loading ? "Signing in…" : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
            </button>
            <button onClick={faceId} className="w-full rounded-2xl glass py-4 text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition">
              <Fingerprint className="h-4 w-4" /> Continue with Face ID
            </button>
            <div className="text-center text-xs text-white/40 pt-2">
              New to Pallavi? <button onClick={() => toast("Account creation opens after device pairing")} className="text-[color:var(--primary)]">Create account</button>
            </div>
          </div>
        </div>
      )}
      <Toaster theme="dark" position="top-center" />
    </DeviceFrame>
  );
}

export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center md:p-8">
      <div className="relative w-full md:w-[420px] md:h-[calc(100dvh-4rem)] md:max-h-[860px] md:rounded-[48px] md:border md:border-white/10 md:shadow-[0_60px_120px_-30px_rgba(59,130,246,0.35)] overflow-hidden bg-background flex flex-col min-h-screen md:min-h-0">
        {children}
      </div>
    </div>
  );
}