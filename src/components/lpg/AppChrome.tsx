import { Link, useLocation } from "@tanstack/react-router";
import { Bell, ChevronLeft } from "lucide-react";
import { useStore } from "@/lib/lpg-store";
import type { ReactNode } from "react";

export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex flex-1 flex-col overflow-y-auto overscroll-contain pb-28 ${className}`}>
      {children}
    </div>
  );
}

export function AppHeader({
  title,
  subtitle,
  back,
  right,
  large = false,
}: {
  title: string;
  subtitle?: string;
  back?: string | boolean;
  right?: ReactNode;
  large?: boolean;
}) {
  const unread = useStore((s) => s.alerts.filter((a) => !a.read).length);
  return (
    <div className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-white/5">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {back ? (
            <Link
              to={typeof back === "string" ? back : "/app"}
              className="grid h-9 w-9 place-items-center rounded-full glass shrink-0"
            >
              <ChevronLeft className="h-4 w-4 text-white/80" />
            </Link>
          ) : null}
          <div className="min-w-0">
            <div className={`font-semibold text-white tracking-tight truncate ${large ? "text-2xl" : "text-lg"}`}>{title}</div>
            {subtitle && <div className="text-xs text-white/50 truncate">{subtitle}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {right}
          {!back && (
            <Link to="/app/alerts" className="relative grid h-9 w-9 place-items-center rounded-full glass">
              <Bell className="h-4 w-4 text-white/80" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[color:var(--danger)] ring-2 ring-background" />
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function BottomNav() {
  const { pathname } = useLocation();
  const items = [
    { to: "/app", label: "Home", icon: "M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2V11z" },
    { to: "/app/analytics", label: "Analytics", icon: "M4 20V10m6 10V4m6 16v-8m6 8V8" },
    { to: "/app/devices", label: "Devices", icon: "M4 6h16v10H4zM2 20h20" },
    { to: "/app/alerts", label: "Alerts", icon: "M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8zM10 21h4" },
    { to: "/app/profile", label: "Profile", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 1 1 16 0" },
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center pb-3 px-3">
      <nav className="pointer-events-auto flex w-full max-w-md items-center justify-around rounded-3xl glass-strong px-1.5 py-1.5 shadow-2xl">
        {items.map((it) => {
          const active = it.to === "/app" ? pathname === "/app" : pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 transition-all ${
                active ? "bg-[color:var(--primary)]/20" : "active:bg-white/5"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${active ? "text-[color:var(--primary)]" : "text-white/60"}`}>
                <path d={it.icon} />
              </svg>
              <span className={`text-[10px] font-medium ${active ? "text-white" : "text-white/50"}`}>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warn" | "danger" | "primary" }) {
  const tones = {
    default: "bg-white/5 text-white/70 border-white/10",
    success: "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30",
    warn: "bg-[color:var(--warning)]/15 text-[color:var(--warning)] border-[color:var(--warning)]/30",
    danger: "bg-[color:var(--danger)]/15 text-[color:var(--danger)] border-[color:var(--danger)]/30",
    primary: "bg-[color:var(--primary)]/15 text-[color:var(--primary)] border-[color:var(--primary)]/30",
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${tones[tone]}`}>{children}</span>;
}

export function GlassCard({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const Comp: any = onClick ? "button" : "div";
  return (
    <Comp onClick={onClick} className={`glass rounded-3xl p-4 text-left w-full transition active:scale-[0.98] ${className}`}>
      {children}
    </Comp>
  );
}

export function StatTile({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone?: "primary" | "success" | "warn" | "danger" }) {
  const color = tone === "success" ? "text-[color:var(--success)]" : tone === "warn" ? "text-[color:var(--warning)]" : tone === "danger" ? "text-[color:var(--danger)]" : "text-[color:var(--primary)]";
  return (
    <div className="glass rounded-2xl p-3 flex flex-col gap-1.5">
      <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50`}>
        <span className={color}>{icon}</span>
        {label}
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}