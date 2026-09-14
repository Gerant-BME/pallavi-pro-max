import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { useStore } from "@/lib/lpg-store";
import { Sparkles, TrendingDown, CalendarClock, Wallet, ShieldCheck, Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/ai")({
  component: AiInsights,
  head: () => ({
    meta: [
      { title: "AI Insights · Pallavi" },
      { name: "description", content: "AI-driven LPG usage predictions, savings tips, and safety recommendations." },
      { property: "og:title", content: "AI Insights · Pallavi" },
      { property: "og:description", content: "Usage predictions, savings tips, and safety recommendations." },
    ],
  }),
});

const suggestions = [
  "When should I book my next refill?",
  "How can I cut my gas cost?",
  "Is my cafe cylinder safe?",
];

function AiInsights() {
  const cylinders = useStore((s) => s.cylinders);
  const primary = cylinders[0];
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `Your kitchen cylinder is at ${primary.percent.toFixed(0)}% and should last about ${primary.daysLeft} days at your current pace.` },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const ask = async (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    await new Promise((r) => setTimeout(r, 900));
    setThinking(false);
    setMessages((m) => [...m, { role: "ai", text: answerFor(q, primary.daysLeft) }]);
  };

  return (
    <>
      <AppHeader title="AI insights" subtitle="Powered by Pallavi Intelligence" back="/app" />
      <Screen className="px-5 pt-4 space-y-3">
        <div className="glass-strong rounded-[32px] p-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full opacity-40 blur-3xl" style={{ background: "var(--primary)" }} />
          <div className="flex items-center gap-2 text-[color:var(--primary)]"><Sparkles className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">This week</span></div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">Usage down 12%</div>
          <div className="mt-1 text-sm text-white/60">You saved roughly ₹142 compared to last week. Keep burners on medium to hold this trend.</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Insight icon={<TrendingDown className="h-4 w-4" />} title="Avg daily use" value="0.71 kg" note="−0.09 kg vs last week" />
          <Insight icon={<CalendarClock className="h-4 w-4" />} title="Refill by" value="Dec 4" note={`${primary.daysLeft} days of gas left`} />
          <Insight icon={<Wallet className="h-4 w-4" />} title="Monthly cost" value="₹1,105" note="On track for budget" />
          <Insight icon={<ShieldCheck className="h-4 w-4" />} title="Safety score" value="98/100" note="No anomalies detected" />
        </div>

        <div className="text-xs uppercase tracking-wider text-white/40 pl-1 pt-1">Recommendations</div>
        <GlassCard>
          <div className="text-sm text-white">Shift cooking to off-peak hours</div>
          <div className="text-xs text-white/50 mt-1">Your 7–9 PM peak burns 34% of daily gas. Spreading it out could add 2 days per cylinder.</div>
          <div className="mt-2 flex gap-1.5"><Chip tone="success">Save ₹90/mo</Chip><Chip>Low effort</Chip></div>
        </GlassCard>
        <Link to="/app/refill">
          <GlassCard>
            <div className="text-sm text-white">Pre-book your Indane refill</div>
            <div className="text-xs text-white/50 mt-1">Slots fill up around the 1st. Booking now locks today's price.</div>
            <div className="mt-2 flex gap-1.5"><Chip tone="primary">Tap to book</Chip></div>
          </GlassCard>
        </Link>

        <div className="text-xs uppercase tracking-wider text-white/40 pl-1 pt-1">ASK PALLAVI (YOU)</div>
        <div className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm ${m.role === "user" ? "ml-auto bg-[color:var(--primary)] text-white" : "glass text-white/85"}`}>
              {m.text}
            </div>
          ))}
          {thinking && (
            <div className="glass max-w-[60%] rounded-3xl px-4 py-3 text-sm text-white/60 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {suggestions.map((s) => (
            <button key={s} onClick={() => ask(s)} className="shrink-0 rounded-full glass px-3 py-2 text-xs text-white/70">{s}</button>
          ))}
        </div>

        <div className="glass rounded-3xl flex items-center gap-2 px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask about your gas usage…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          <button onClick={() => ask(input)} className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--primary)] text-white active:scale-95 transition">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </Screen>
    </>
  );
}

function answerFor(q: string, days: number) {
  const s = q.toLowerCase();
  if (s.includes("refill") || s.includes("book")) return `Book within the next ${Math.max(1, days - 3)} days — that keeps a 3-day safety buffer before your cylinder runs out.`;
  if (s.includes("cost") || s.includes("save") || s.includes("cut")) return "Use a pressure cooker for lentils and rice, keep flames matched to pot size, and you should trim roughly ₹120–180 a month.";
  if (s.includes("safe") || s.includes("leak")) return "No leak signatures in the last 30 days. Regulator pressure is stable and the sensor self-test passed 2 minutes ago.";
  return `Based on your last 30 days, you burn about 0.71 kg per day. At that pace you have roughly ${days} days of gas remaining.`;
}

function Insight({ icon, title, value, note }: { icon: React.ReactNode; title: string; value: string; note: string }) {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50">
        <span className="text-[color:var(--primary)]">{icon}</span>{title}
      </div>
      <div className="mt-1.5 text-xl font-semibold text-white">{value}</div>
      <div className="text-[11px] text-white/45 mt-0.5">{note}</div>
    </div>
  );
}