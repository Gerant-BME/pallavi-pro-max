import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { alertMeta, useStore } from "@/lib/lpg-store";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/alerts/$id")({
  component: AlertDetail,
  head: () => ({ meta: [{ title: "Alert · Pallavi" }, { name: "description", content: "Alert details and recommended actions." }] }),
  notFoundComponent: () => <div className="p-10 text-white/70">Alert not found.</div>,
  errorComponent: () => <div className="p-10 text-white/70">Failed to load.</div>,
});

function AlertDetail() {
  const { id } = Route.useParams();
  const alert = useStore((s) => s.alerts.find((a) => a.id === id));
  if (!alert) throw notFound();
  const meta = alertMeta[alert.kind];
  const acts: { label: string; to?: string; primary?: boolean; onClick?: () => void }[] =
    alert.kind === "leak" ? [{ label: "Open Emergency Mode", to: "/app/emergency", primary: true }, { label: "Call Distributor", onClick: () => { toast.success("Calling Indane distributor…"); window.location.href = "tel:1906"; } }]
    : alert.kind === "low" || alert.kind === "critical" ? [{ label: "Book Refill Now", to: "/app/refill", primary: true }, { label: "View Cylinder", to: "/app/devices" }]
    : [{ label: "View cylinder", to: "/app/devices", primary: true }];
  return (
    <>
      <AppHeader title={meta.label} back="/app/alerts" />
      <Screen className="px-5 pt-3 space-y-4">
        <div className="glass-strong rounded-3xl p-5">
          <Chip tone={meta.color as any}>{meta.label} · {alert.time}</Chip>
          <div className="text-xl font-semibold text-white mt-3">{alert.title}</div>
          <div className="text-sm text-white/60 mt-2">{alert.message}</div>
        </div>
        <GlassCard>
          <div className="text-sm font-medium text-white mb-2">Recommended actions</div>
          <div className="space-y-2">
            {acts.map((a, i) => {
              const cls = a.primary ? "bg-[color:var(--primary)] text-white" : "glass text-white";
              const inner = (<div className={`rounded-2xl px-4 py-3 flex items-center justify-between ${cls}`}><span className="text-sm font-medium">{a.label}</span><ArrowRight className="h-4 w-4" /></div>);
              return a.to ? <Link key={i} to={a.to as any}>{inner}</Link> : <button key={i} onClick={a.onClick} className="w-full">{inner}</button>;
            })}
          </div>
        </GlassCard>
      </Screen>
    </>
  );
}