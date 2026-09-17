import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader, Screen } from "@/components/lpg/AppChrome";
import { actions, useStore } from "@/lib/lpg-store";
import { PhoneCall, MapPin, ShieldCheck, Flame, Wind, DoorOpen, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/emergency")({
  component: Emergency,
  head: () => ({ meta: [{ title: "Emergency · Pallavi" }, { name: "description", content: "Emergency safety response for gas leaks." }] }),
});

function Emergency() {
  const emergency = useStore((s) => s.emergency);
  const navigate = useNavigate();
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  useEffect(() => { if (!emergency) actions.triggerLeak("kitchen-01"); }, [emergency]);
  const steps = [
    { id: "s1", icon: <Wind className="h-4 w-4" />, label: "Open all doors and windows" },
    { id: "s2", icon: <Zap className="h-4 w-4" />, label: "Do not switch any electrical device" },
    { id: "s3", icon: <Flame className="h-4 w-4" />, label: "Turn off the cylinder regulator" },
    { id: "s4", icon: <DoorOpen className="h-4 w-4" />, label: "Evacuate to open area" },
  ];
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_top,oklch(0.4_0.2_27_/_0.5),transparent_60%)]">
      <AppHeader title="Emergency" back="/app" />
      <Screen className="px-5 pt-2 space-y-4">
        <div className="rounded-3xl border border-[color:var(--danger)]/40 bg-[color:var(--danger)]/15 p-5 flex items-center gap-4 animate-pulse-ring">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--danger)] text-white"><Flame className="h-7 w-7" /></div>
          <div className="flex-1">
            <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--danger)]">Critical</div>
            <div className="text-lg font-semibold text-white">Gas leak detected</div>
            <div className="text-xs text-white/70">Kitchen Cylinder · just now</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href="tel:1906" className="rounded-3xl bg-[color:var(--danger)] p-4 text-white flex flex-col gap-2 shadow-lg active:scale-[0.97] transition">
            <PhoneCall className="h-6 w-6" /><div className="text-sm font-semibold">Call LPG Helpline</div><div className="text-xs opacity-80">1906 · 24/7</div>
          </a>
          <button onClick={() => toast.success("Live location shared with your emergency contacts")} className="rounded-3xl glass-strong p-4 text-white flex flex-col gap-2 items-start active:scale-[0.97] transition">
             <MapPin className="h-6 w-6 text-[color:var(--primary)]" /><div className="text-sm font-semibold">Share location&nbsp;</div><div className="text-xs text-white/60">With contacts and your BF</div>
          </button>
        </div>
        <div className="glass-strong rounded-3xl p-4">
          <div className="text-sm font-medium text-white mb-3 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--success)]" /> Safety checklist</div>
          <div className="space-y-2">
            {steps.map((s) => {
              const done = checks[s.id];
              return (
                <button key={s.id} onClick={() => setChecks((c) => ({ ...c, [s.id]: !c[s.id] }))} className={`w-full flex items-center gap-3 rounded-2xl p-3 transition ${done ? "bg-[color:var(--success)]/15" : "bg-white/[0.03]"}`}>
                  <div className={`grid h-8 w-8 place-items-center rounded-xl ${done ? "bg-[color:var(--success)] text-white" : "bg-white/10 text-white/70"}`}>{done ? <CheckCircle2 className="h-4 w-4" /> : s.icon}</div>
                  <div className={`text-sm text-left flex-1 ${done ? "text-white/60 line-through" : "text-white"}`}>{s.label}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="glass rounded-3xl p-4">
          <div className="text-sm font-medium text-white mb-2">Emergency contacts</div>
           {[{n:"Aditya (Bitch)",p:"+91 7032672929"},{n:"The GOAT 🐐",p:"+91 63094 65868"},{n:"Fire Services",p:"101"}].map((c) => (
            <a href={`tel:${c.p}`} key={c.n} className="flex items-center justify-between py-2.5 border-t border-white/5 first:border-0">
              <div><div className="text-sm text-white">{c.n}</div><div className="text-xs text-white/50">{c.p}</div></div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--success)] text-white"><PhoneCall className="h-4 w-4" /></div>
            </a>
          ))}
        </div>
        <button onClick={() => { actions.clearEmergency(); navigate({ to: "/app" }); }} className="w-full rounded-2xl glass-strong py-4 text-sm font-semibold text-white">Mark as resolved</button>
      </Screen>
    </div>
  );
}