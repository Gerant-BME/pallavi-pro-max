import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Chip, GlassCard, Screen, StatTile } from "@/components/lpg/AppChrome";
import { Cylinder } from "@/components/lpg/Cylinder";
import { actions, useStore } from "@/lib/lpg-store";
import { Battery, Wifi, Bluetooth, Activity, Calendar, Package, ShieldAlert, Settings2, Sparkles, ChevronRight, RefreshCw, Home as HomeIcon, Users, Cpu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard · Pallavi" }, { name: "description", content: "Live LPG cylinder status, quick actions, and smart insights." }] }),
});

function Dashboard() {
  const cylinders = useStore((s) => s.cylinders);
  const user = useStore((s) => s.user);
  const primary = cylinders[0];
  const [refreshing, setRefreshing] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate = useNavigate();

  const pullRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    actions.simulateUsage();
    setRefreshing(false);
    toast.success("Synced with all sensors");
  };

  return (
    <>
       <AppHeader title="Hello, Pallavi" subtitle="Home · Malkajgiri" right={
        <button onClick={pullRefresh} className="grid h-9 w-9 place-items-center rounded-full glass">
          <RefreshCw className={`h-4 w-4 text-white/80 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      } />
      <Screen className="px-5 pt-4 space-y-4">
        <div className="glass-strong rounded-[32px] p-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-40 blur-3xl" style={{ background: "var(--primary)" }} />
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider">Primary</div>
              <div className="text-lg font-semibold text-white">{primary.name}</div>
            </div>
            <Chip tone={primary.percent > 50 ? "success" : primary.percent > 20 ? "warn" : "danger"}>
              {primary.percent > 20 ? "Healthy" : "Refill soon"}
            </Chip>
          </div>
          <button onClick={() => setDetailOpen(true)} className="flex items-center gap-5 w-full text-left">
            <Cylinder percent={primary.percent} size="md" showLabel={false} />
            <div className="flex-1 min-w-0">
              <div className="text-5xl font-semibold tracking-tighter text-white">
                {primary.percent.toFixed(0)}<span className="text-2xl text-white/40">%</span>
              </div>
              <div className="text-sm text-white/60 mt-1">{primary.weightKg.toFixed(1)} kg remaining</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/50"><Calendar className="h-3.5 w-3.5" /> ~{primary.daysLeft} days left</div>
              <div className="mt-1 flex items-center gap-2 text-xs text-white/50"><Activity className="h-3.5 w-3.5" /> Last sync {primary.lastSync}</div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <StatTile icon={<Battery className="h-3.5 w-3.5" />} label="Battery" value={`${primary.battery}%`} tone="success" />
          <StatTile icon={<Wifi className="h-3.5 w-3.5" />} label="Wi-Fi" value={primary.wifi ? "On" : "Off"} tone="primary" />
          <StatTile icon={<Bluetooth className="h-3.5 w-3.5" />} label="BT" value={primary.bluetooth ? "On" : "Off"} tone="primary" />
          <StatTile icon={<Activity className="h-3.5 w-3.5" />} label="Health" value="98" tone="success" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <QuickAction icon={<Package className="h-5 w-5" />} label="Book refill" to="/app/refill" tone="primary" />
          <QuickAction icon={<ShieldAlert className="h-5 w-5" />} label="Emergency" onClick={() => navigate({ to: "/app/emergency" })} tone="danger" />
          <QuickAction icon={<Settings2 className="h-5 w-5" />} label="Device" to="/app/settings" tone="default" />
        </div>

        <Link to="/app/ai">
          <div className="glass rounded-3xl p-4 flex items-center gap-3 relative overflow-hidden">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[color:var(--primary)]/20 text-[color:var(--primary)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">Usage is 12% lower than last week</div>
              <div className="text-xs text-white/50 truncate">Tap for AI insights and recommendations</div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40" />
          </div>
        </Link>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm font-medium text-white">Your cylinders</div>
          <Link to="/app/devices" className="text-xs text-[color:var(--primary)]">See all</Link>
        </div>
        <div className="space-y-2">
          {cylinders.slice(1).map((c) => (
            <Link key={c.id} to="/app/devices/$id" params={{ id: c.id }}>
              <GlassCard>
                <div className="flex items-center gap-3">
                  <Cylinder percent={c.percent} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{c.name}</div>
                    <div className="text-xs text-white/50 truncate">{c.location}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Chip tone={c.percent > 50 ? "success" : c.percent > 20 ? "warn" : "danger"}>{c.percent.toFixed(0)}%</Chip>
                      <Chip>{c.daysLeft}d left</Chip>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <ShortcutCard icon={<HomeIcon className="h-4 w-4" />} label="Smart Home" to="/app/smart-home" />
          <ShortcutCard icon={<Users className="h-4 w-4" />} label="Family" to="/app/family" />
          <ShortcutCard icon={<Cpu className="h-4 w-4" />} label="AI" to="/app/ai" />
        </div>
      </Screen>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="bottom" className="bg-[oklch(0.18_0.005_250)] border-white/10 rounded-t-[32px] max-h-[85vh]">
          <SheetHeader><SheetTitle className="text-white">{primary.name}</SheetTitle></SheetHeader>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MetricRow label="Level" value={`${primary.percent.toFixed(0)}%`} />
            <MetricRow label="Weight" value={`${primary.weightKg.toFixed(1)} kg`} />
            <MetricRow label="Capacity" value={`${primary.capacityKg} kg`} />
            <MetricRow label="Days left" value={`${primary.daysLeft}`} />
            <MetricRow label="Distributor" value={primary.distributor} />
            <MetricRow label="Firmware" value={primary.firmware} />
          </div>
          <div className="mt-4 flex gap-2">
            <Link to="/app/devices/$id" params={{ id: primary.id }} className="flex-1 rounded-2xl bg-[color:var(--primary)] py-3 text-center text-sm font-semibold text-white">Open device</Link>
            <Link to="/app/refill" className="flex-1 rounded-2xl glass py-3 text-center text-sm font-semibold text-white">Book refill</Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
      <div className="text-base font-semibold text-white">{value}</div>
    </div>
  );
}

function QuickAction({ icon, label, to, onClick, tone }: { icon: React.ReactNode; label: string; to?: string; onClick?: () => void; tone: "primary" | "danger" | "default" }) {
  const bg = tone === "primary"
    ? "bg-gradient-to-br from-[oklch(0.62_0.19_256)] to-[oklch(0.5_0.15_265)] text-white shadow-lg shadow-[oklch(0.62_0.19_256_/_0.35)]"
    : tone === "danger"
    ? "bg-gradient-to-br from-[oklch(0.6_0.22_27)] to-[oklch(0.5_0.2_20)] text-white shadow-lg shadow-[oklch(0.6_0.22_27_/_0.35)]"
    : "glass text-white";
  const inner = (
    <div className={`rounded-3xl p-4 flex flex-col items-start gap-2 active:scale-[0.97] transition ${bg}`}>
      {icon}<div className="text-xs font-medium">{label}</div>
    </div>
  );
  return to ? <Link to={to as any}>{inner}</Link> : <button onClick={onClick} className="text-left w-full">{inner}</button>;
}

function ShortcutCard({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <Link to={to as any}>
      <div className="glass rounded-2xl p-3 flex flex-col items-start gap-2">
        <div className="text-[color:var(--primary)]">{icon}</div>
        <div className="text-xs text-white">{label}</div>
      </div>
    </Link>
  );
}