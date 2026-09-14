import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Chip, GlassCard, Screen, StatTile } from "@/components/lpg/AppChrome";
import { Cylinder } from "@/components/lpg/Cylinder";
import { actions, useStore } from "@/lib/lpg-store";
import { Battery, Wifi, Bluetooth, Activity, Package, ShieldAlert, Settings2, ChevronRight, RotateCw, Wrench, FileClock } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/app/devices/$id")({
  component: DeviceDetail,
  head: () => ({ meta: [{ title: "Cylinder · Pallavi" }, { name: "description", content: "Live monitoring, history, and controls for this cylinder." }] }),
  notFoundComponent: () => <div className="p-10 text-white/70">Cylinder not found. <Link to="/app/devices" className="text-[color:var(--primary)]">Back</Link></div>,
  errorComponent: () => <div className="p-10 text-white/70">Something went wrong.</div>,
});

function DeviceDetail() {
  const { id } = Route.useParams();
  const c = useStore((s) => s.cylinders.find((x) => x.id === id));
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  if (!c) throw notFound();
  const spark = Array.from({ length: 20 }, (_, i) => ({ v: c.percent + Math.sin(i / 2) * 3 - i * 0.3 }));
  return (
    <>
      <AppHeader title={c.name} subtitle={c.location} back="/app/devices" />
      <Screen className="px-5 pt-3 space-y-4">
        <div className="glass-strong rounded-[32px] p-6 flex flex-col items-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full blur-3xl opacity-40" style={{ background: c.percent > 20 ? "var(--success)" : "var(--danger)" }} />
          <Cylinder percent={c.percent} size="lg" showLabel={false} />
          <div className="text-6xl font-semibold text-white tracking-tighter mt-4">{c.percent.toFixed(0)}<span className="text-2xl text-white/40">%</span></div>
          <div className="text-sm text-white/60">{c.weightKg.toFixed(1)} / {c.capacityKg} kg</div>
          <div className="mt-3 flex gap-2"><Chip tone={c.online ? "success" : "danger"}>{c.online ? "Online" : "Offline"}</Chip><Chip>{c.distributor}</Chip></div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <StatTile icon={<Battery className="h-3.5 w-3.5" />} label="Battery" value={`${c.battery}%`} tone="success" />
          <StatTile icon={<Wifi className="h-3.5 w-3.5" />} label="Wi-Fi" value={c.wifi ? "On" : "Off"} tone="primary" />
          <StatTile icon={<Bluetooth className="h-3.5 w-3.5" />} label="BT" value={c.bluetooth ? "On" : "Off"} tone="primary" />
          <StatTile icon={<Activity className="h-3.5 w-3.5" />} label="Sync" value="Live" tone="success" />
        </div>
        <div className="glass-strong rounded-3xl p-4">
          <div className="text-sm font-medium text-white mb-2">24h trend</div>
          <div className="h-24">
            <ResponsiveContainer>
              <AreaChart data={spark}>
                <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.62 0.19 256)" stopOpacity={0.6} /><stop offset="100%" stopColor="oklch(0.62 0.19 256)" stopOpacity={0} /></linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="oklch(0.62 0.19 256)" strokeWidth={2} fill="url(#dg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Link to="/app/refill"><QuickBtn icon={<Package className="h-4 w-4" />} label="Refill" /></Link>
          <button onClick={() => { actions.triggerLeak(c.id); toast.error("Gas leak simulated"); }} className="w-full"><QuickBtn icon={<ShieldAlert className="h-4 w-4" />} label="Test leak" danger /></button>
          <Link to="/app/settings"><QuickBtn icon={<Settings2 className="h-4 w-4" />} label="Settings" /></Link>
        </div>
        <div className="glass rounded-3xl divide-y divide-white/5">
          <Row icon={<Wrench className="h-4 w-4" />} label="Calibrate sensor" hint="Last: 12 days ago" onClick={() => navigate({ to: "/app/settings" })} />
          <Row icon={<RotateCw className="h-4 w-4" />} label="Firmware" hint={`v${c.firmware} · up to date`} onClick={() => navigate({ to: "/app/settings" })} />
          <Row icon={<FileClock className="h-4 w-4" />} label="Device history" hint="View events" onClick={() => setHistoryOpen(true)} />
        </div>
        <GlassCard>
          <div className="text-sm font-medium text-white mb-3">Device information</div>
          <Info k="Serial" v={`GA-${c.id.toUpperCase()}`} />
          <Info k="Model" v="Pallavi Sensor Pro" />
          <Info k="Installed" v="Aug 12, 2025" />
          <Info k="Warranty" v="24 months remaining" />
        </GlassCard>
      </Screen>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="bottom" className="bg-[oklch(0.18_0.005_250)] border-white/10 rounded-t-[32px] max-h-[70vh] overflow-y-auto">
          <SheetHeader><SheetTitle className="text-white">Device history</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-2">
            {[
              ["Just now", "Sensor sync completed"],
              ["2 h ago", "Consumption 0.31 kg recorded"],
              ["Yesterday", "Wi-Fi reconnected"],
              ["3 days ago", "Self-test passed · no leaks"],
              ["12 days ago", "Sensor calibrated"],
            ].map(([t, e]) => (
              <div key={e} className="glass rounded-2xl p-3">
                <div className="text-sm text-white">{e}</div>
                <div className="text-xs text-white/50">{t}</div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function QuickBtn({ icon, label, danger }: { icon: React.ReactNode; label: string; danger?: boolean }) {
  return <div className={`rounded-2xl p-3 flex flex-col items-start gap-1.5 active:scale-[0.97] transition ${danger ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]" : "glass text-white"}`}>{icon}<div className="text-xs font-medium">{label}</div></div>;
}
function Row({ icon, label, hint, onClick }: { icon: React.ReactNode; label: string; hint: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 p-4 active:bg-white/5 transition text-left">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-white/80">{icon}</div>
      <div className="flex-1"><div className="text-sm text-white">{label}</div><div className="text-xs text-white/50">{hint}</div></div>
      <ChevronRight className="h-4 w-4 text-white/40" />
    </button>
  );
}
function Info({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between py-1.5 text-sm"><span className="text-white/50">{k}</span><span className="text-white">{v}</span></div>;
}