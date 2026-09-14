import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, Chip, Screen } from "@/components/lpg/AppChrome";
import { actions, alertMeta, useStore } from "@/lib/lpg-store";
import { AlertTriangle, Battery, Wifi, Wrench, Package, Truck, Flame, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/app/alerts/")({
  component: Alerts,
  head: () => ({ meta: [{ title: "Alerts · Pallavi" }, { name: "description", content: "Real-time smart alerts and delivery updates." }] }),
});

const icons: Record<string, React.ReactNode> = {
  low: <AlertTriangle className="h-4 w-4" />, critical: <AlertTriangle className="h-4 w-4" />,
  leak: <Flame className="h-4 w-4" />, battery: <Battery className="h-4 w-4" />,
  offline: <Wifi className="h-4 w-4" />, sensor: <AlertTriangle className="h-4 w-4" />,
  calibration: <Wrench className="h-4 w-4" />, refill: <Package className="h-4 w-4" />,
  delivery: <Truck className="h-4 w-4" />,
};

function Alerts() {
  const alerts = useStore((s) => s.alerts);
  return (
    <>
      <AppHeader title="Alerts" subtitle={`${alerts.filter(a => !a.read).length} unread`} large right={
        <button onClick={() => actions.markAllRead()} className="grid h-9 w-9 place-items-center rounded-full glass"><CheckCheck className="h-4 w-4 text-white/80" /></button>
      } />
      <Screen className="px-5 pt-3 space-y-2">
        {alerts.length === 0 && <div className="glass rounded-3xl p-8 text-center text-white/60">All caught up ✨</div>}
        {alerts.map((a) => {
          const meta = alertMeta[a.kind];
          const toneBg = meta.color === "danger" ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]" : meta.color === "warn" ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" : meta.color === "success" ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-[color:var(--primary)]/15 text-[color:var(--primary)]";
          return (
            <Link key={a.id} to="/app/alerts/$id" params={{ id: a.id }} onClick={() => actions.markAlertRead(a.id)}>
              <div className="glass rounded-3xl p-4 flex gap-3 active:scale-[0.99] transition">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${toneBg}`}>{icons[a.kind]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-white truncate">{a.title}</div>
                    <span className="text-[10px] text-white/40 shrink-0">{a.time}</span>
                  </div>
                  <div className="text-xs text-white/60 line-clamp-2 mt-0.5">{a.message}</div>
                  <div className="mt-2 flex items-center gap-2"><Chip tone={meta.color as any}>{meta.label}</Chip>{!a.read && <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </Screen>
    </>
  );
}