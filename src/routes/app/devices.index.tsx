import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { Cylinder } from "@/components/lpg/Cylinder";
import { useStore } from "@/lib/lpg-store";
import { Plus, Search, ChevronRight, Wifi, Battery, PackageSearch } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/devices/")({
  component: Devices,
  head: () => ({ meta: [{ title: "Devices · Pallavi" }, { name: "description", content: "Manage every LPG cylinder across your home and business." }] }),
});

function Devices() {
  const cylinders = useStore((s) => s.cylinders);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const filtered = cylinders
    .filter((c) => (c.name + c.location).toLowerCase().includes(q.toLowerCase()))
    .filter((c) =>
      filter === "All" ? true :
      filter === "Home" ? c.location.startsWith("Home") :
      filter === "Business" ? !c.location.startsWith("Home") :
      !c.online
    );
  return (
    <>
      <AppHeader title="Devices" subtitle={`${cylinders.length} connected`} large right={
        <button onClick={() => navigate({ to: "/app/settings" })} aria-label="Pair a new sensor" className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--primary)] text-white active:scale-95 transition"><Plus className="h-4 w-4" /></button>
      } />
      <Screen className="px-5 pt-3 space-y-3">
        <div className="glass rounded-2xl flex items-center gap-3 px-4 py-3">
          <Search className="h-4 w-4 text-white/50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cylinders" className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["All","Home","Business","Offline"].map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs border transition ${filter === t ? "bg-white/10 text-white border-white/20" : "text-white/60 border-white/10"}`}>{t}</button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="glass rounded-3xl p-8 flex flex-col items-center gap-2 text-center">
            <PackageSearch className="h-6 w-6 text-white/40" />
            <div className="text-sm text-white">No cylinders match</div>
            <div className="text-xs text-white/50">Try a different search or filter.</div>
            <button onClick={() => { setQ(""); setFilter("All"); }} className="mt-2 rounded-full bg-[color:var(--primary)] px-4 py-2 text-xs font-semibold text-white">Reset filters</button>
          </div>
        )}
        {filtered.map((c) => (
          <Link key={c.id} to="/app/devices/$id" params={{ id: c.id }}>
            <GlassCard>
              <div className="flex items-center gap-4">
                <Cylinder percent={c.percent} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white truncate">{c.name}</div>
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </div>
                  <div className="text-xs text-white/50 truncate">{c.location}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Chip tone={c.percent > 50 ? "success" : c.percent > 20 ? "warn" : "danger"}>{c.percent.toFixed(0)}% · {c.weightKg.toFixed(1)}kg</Chip>
                    <Chip>{c.daysLeft}d</Chip>
                    <Chip tone={c.online ? "success" : "default"}>{c.online ? "Online" : "Offline"}</Chip>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-white/50">
                    <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> {c.wifi ? "Wi-Fi" : "—"}</span>
                    <span className="flex items-center gap-1"><Battery className="h-3 w-3" /> {c.battery}%</span>
                    <span>{c.distributor}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
        <button onClick={() => navigate({ to: "/app/settings" })} className="w-full rounded-3xl border-2 border-dashed border-white/10 py-6 text-sm text-white/60 flex flex-col items-center gap-2 active:bg-white/5 transition">
          <Plus className="h-5 w-5" /> Pair a new Pallavi sensor
        </button>
      </Screen>
    </>
  );
}