import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Calendar, TrendingDown, Wallet } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics · Pallavi" }, { name: "description", content: "LPG consumption trends, refill history, and cost analytics." }] }),
});

const dataSets = {
  Daily: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((n,i) => ({ name: n, usage: [0.9,1.1,0.7,1.4,1.6,2.0,1.2][i], cost: [58,72,45,90,105,132,78][i] })),
  Weekly: Array.from({ length: 8 }, (_, i) => ({ name: `W${i+1}`, usage: 6 + Math.sin(i)*2 + i*0.2, cost: 380 + i*15 })),
  Monthly: ["Jun","Jul","Aug","Sep","Oct","Nov"].map((m,i) => ({ name: m, usage: 28 + i*1.4, cost: 1750 + i*40 })),
  Yearly: ["2021","2022","2023","2024","2025"].map((y,i) => ({ name: y, usage: 320 + i*10, cost: 21000 + i*900 })),
};

function Analytics() {
  const [range, setRange] = useState<keyof typeof dataSets>("Weekly");
  const data = dataSets[range];
  const avg = (data.reduce((s,d) => s + d.usage, 0) / data.length).toFixed(1);
  const totalCost = data.reduce((s,d) => s + d.cost, 0);
  return (
    <>
      <AppHeader title="Analytics" subtitle="Consumption & cost trends" large />
      <Screen className="px-5 pt-3 space-y-4">
        <div className="flex gap-1.5 glass rounded-full p-1">
          {(Object.keys(dataSets) as (keyof typeof dataSets)[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`flex-1 rounded-full py-2 text-xs font-medium transition ${range === r ? "bg-[color:var(--primary)] text-white" : "text-white/60"}`}>{r}</button>
          ))}
        </div>
        <div className="glass-strong rounded-3xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-white/50">LPG consumption</div>
              <div className="text-2xl font-semibold text-white tracking-tight">{avg} <span className="text-sm text-white/50">kg avg</span></div>
            </div>
            <Chip tone="success"><TrendingDown className="h-3 w-3" /> 12% vs last</Chip>
          </div>
          <div className="h-48">
            <ResponsiveContainer>
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.19 256)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.62 0.19 256)" stopOpacity={0} />
                </linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.005 250)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="usage" stroke="oklch(0.62 0.19 256)" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <GlassCard>
            <div className="flex items-center gap-2 text-white/50 text-xs"><Wallet className="h-3.5 w-3.5" /> Total cost</div>
            <div className="text-2xl font-semibold text-white mt-1">₹{totalCost.toLocaleString()}</div>
            <div className="text-[10px] text-[color:var(--success)] mt-0.5">Under budget</div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-2 text-white/50 text-xs"><Calendar className="h-3.5 w-3.5" /> Next refill</div>
            <div className="text-2xl font-semibold text-white mt-1">Nov 24</div>
            <div className="text-[10px] text-white/50 mt-0.5">Predicted</div>
          </GlassCard>
        </div>
        <div className="glass-strong rounded-3xl p-4">
          <div className="text-sm font-medium text-white mb-3">Monthly cost</div>
          <div className="h-40">
            <ResponsiveContainer>
              <BarChart data={dataSets.Monthly} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.2 0.005 250)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="cost" fill="oklch(0.72 0.18 150)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-strong rounded-3xl p-4">
          <div className="text-sm font-medium text-white mb-3">Refill history</div>
          <div className="space-y-2">
            {[{d:"Nov 12",n:"HP Gas",p:"₹1,088"},{d:"Oct 04",n:"Indane",p:"₹1,105"},{d:"Sep 01",n:"Indane",p:"₹1,090"}].map((r) => (
              <div key={r.d} className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-3">
                <div><div className="text-sm text-white">{r.n}</div><div className="text-xs text-white/50">{r.d} · 14.2 kg</div></div>
                <div className="text-sm font-medium text-white">{r.p}</div>
              </div>
            ))}
          </div>
        </div>
      </Screen>
    </>
  );
}