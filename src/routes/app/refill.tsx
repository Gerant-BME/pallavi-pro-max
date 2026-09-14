import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { actions, useStore } from "@/lib/lpg-store";
import { useState } from "react";
import { Check, Truck, Package, MapPin, CalendarCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/refill")({
  component: Refill,
  head: () => ({ meta: [{ title: "Book Refill · Pallavi" }, { name: "description", content: "Book LPG refills from Indane, HP Gas, and Bharat Gas." }] }),
});

const distributors = [
  { id: "Indane" as const, price: 1105, eta: "Today · 4–6 PM", color: "oklch(0.72 0.18 150)" },
  { id: "HP Gas" as const, price: 1088, eta: "Tomorrow · 10 AM–12 PM", color: "oklch(0.62 0.19 256)" },
  { id: "Bharat Gas" as const, price: 1112, eta: "Nov 26 · 3–5 PM", color: "oklch(0.78 0.16 75)" },
];

function Refill() {
  const bookings = useStore((s) => s.bookings);
  const [dist, setDist] = useState<(typeof distributors)[number]["id"]>("Indane");
  const [slot, setSlot] = useState("Today · 4–6 PM");
  const [pay, setPay] = useState<"upi" | "card" | "cod">("upi");
  const [step, setStep] = useState<"choose" | "confirmed">("choose");
  const navigate = useNavigate();

  const confirm = () => {
    const d = distributors.find((x) => x.id === dist)!;
    actions.addBooking({ distributor: dist, slot, address: "12A Malkajgiri, Secunderabad", price: d.price });
    setStep("confirmed");
    toast.success("Refill booked");
  };

  if (step === "confirmed") {
    return (
      <>
        <AppHeader title="Booked" back="/app" />
        <Screen className="px-5 pt-3 space-y-4">
          <div className="glass-strong rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--success)]/20 text-[color:var(--success)] animate-pulse-ring"><Check className="h-8 w-8" /></div>
            <div className="text-xl font-semibold text-white mt-4">Order confirmed</div>
            <div className="text-sm text-white/60 mt-1">{dist} · {slot}</div>
          </div>
          <GlassCard>
            <div className="text-sm font-medium text-white mb-3">Delivery status</div>
            {["Confirmed","Dispatched from depot","Out for delivery","Delivered"].map((s,i) => (
              <div key={s} className="flex gap-3 items-start py-2">
                <div className={`mt-1 h-3 w-3 rounded-full ${i <= 1 ? "bg-[color:var(--primary)]" : "bg-white/15"}`} />
                <div className="flex-1"><div className={`text-sm ${i <= 1 ? "text-white" : "text-white/50"}`}>{s}</div>{i === 0 && <div className="text-xs text-white/50">Just now</div>}</div>
              </div>
            ))}
          </GlassCard>
          <button onClick={() => navigate({ to: "/app" })} className="w-full rounded-2xl bg-[color:var(--primary)] py-4 text-sm font-semibold text-white">Back to dashboard</button>
        </Screen>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Book refill" back="/app" />
      <Screen className="px-5 pt-3 space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Distributor</div>
          <div className="space-y-2">
            {distributors.map((d) => (
              <button key={d.id} onClick={() => { setDist(d.id); setSlot(d.eta); }} className={`w-full glass rounded-3xl p-4 flex items-center gap-3 border transition ${dist === d.id ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10" : "border-transparent"}`}>
                <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: `${d.color}22`, color: d.color }}><Package className="h-5 w-5" /></div>
                <div className="flex-1 text-left"><div className="text-sm font-medium text-white">{d.id}</div><div className="text-xs text-white/50">14.2 kg · {d.eta}</div></div>
                <div className="text-sm font-semibold text-white">₹{d.price}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Delivery slot</div>
          <div className="grid grid-cols-2 gap-2">
            {["Today · 4–6 PM","Tomorrow · 9–11 AM","Tomorrow · 4–6 PM","Nov 26 · 10 AM"].map((s) => (
              <button key={s} onClick={() => setSlot(s)} className={`glass rounded-2xl p-3 text-left ${slot === s ? "ring-1 ring-[color:var(--primary)]" : ""}`}>
                <CalendarCheck className="h-4 w-4 text-[color:var(--primary)] mb-1" /><div className="text-xs text-white">{s}</div>
              </button>
            ))}
          </div>
        </div>
        <GlassCard>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-[color:var(--primary)]" />
            <div className="flex-1"><div className="text-sm text-white">Home · Malkajgiri</div><div className="text-xs text-white/50">12A Malkajgiri, Secunderabad 500047</div></div>
            <Link to="/app/profile" className="text-xs text-[color:var(--primary)]">Change</Link>
          </div>
        </GlassCard>
        <div>
          <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Payment</div>
          <div className="grid grid-cols-3 gap-2">
            {(["upi","card","cod"] as const).map((p) => (
              <button key={p} onClick={() => setPay(p)} className={`glass rounded-2xl py-3 text-xs uppercase tracking-wider ${pay === p ? "bg-[color:var(--primary)]/20 text-white" : "text-white/60"}`}>{p}</button>
            ))}
          </div>
        </div>
        <div className="glass-strong rounded-3xl p-4 space-y-1.5">
          <div className="flex justify-between text-sm"><span className="text-white/50">Cylinder</span><span className="text-white">14.2 kg</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/50">Distributor</span><span className="text-white">{dist}</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/50">Delivery</span><span className="text-white">{slot}</span></div>
          <div className="flex justify-between text-sm"><span className="text-white/50">Payment</span><span className="text-white">{pay.toUpperCase()}</span></div>
          <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-white font-semibold"><span>Total</span><span>₹{distributors.find(d => d.id === dist)!.price}</span></div>
        </div>
        <button onClick={confirm} className="w-full rounded-2xl bg-gradient-to-r from-[oklch(0.62_0.19_256)] to-[oklch(0.55_0.19_270)] py-4 text-sm font-semibold text-white shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
          <CreditCard className="h-4 w-4" /> Confirm & pay
        </button>
        {bookings.length > 0 && (
          <>
            <div className="text-sm font-medium text-white pt-2">Recent bookings</div>
            {bookings.map((b) => (
              <div key={b.id} className="glass rounded-2xl p-3 flex items-center gap-3">
                <Truck className="h-5 w-5 text-[color:var(--primary)]" />
                <div className="flex-1 min-w-0"><div className="text-sm text-white">{b.distributor}</div><div className="text-xs text-white/50 truncate">{b.slot}</div></div>
                <Chip tone={b.status === "delivered" ? "success" : "primary"}>{b.status}</Chip>
              </div>
            ))}
          </>
        )}
      </Screen>
    </>
  );
}