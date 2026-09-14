import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { actions, useStore } from "@/lib/lpg-store";
import { Fan, Siren, Lightbulb, DoorClosed, Power, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/smart-home")({
  component: SmartHome,
  head: () => ({
    meta: [
      { title: "Smart Home · Pallavi" },
      { name: "description", content: "Connect Pallavi to your smart home: exhaust fans, sirens, smart plugs, and safety automations." },
      { property: "og:title", content: "Smart Home · Pallavi" },
      { property: "og:description", content: "Exhaust fans, sirens, smart plugs, and safety automations." },
    ],
  }),
});

function SmartHome() {
  const emergency = useStore((s) => s.emergency);
  const primary = useStore((s) => s.cylinders[0]);
  const [devices, setDevices] = useState([
    { id: "fan", name: "Kitchen exhaust fan", room: "Kitchen", icon: <Fan className="h-5 w-5" />, on: true },
    { id: "siren", name: "Safety siren", room: "Hallway", icon: <Siren className="h-5 w-5" />, on: true },
    { id: "light", name: "Kitchen lights", room: "Kitchen", icon: <Lightbulb className="h-5 w-5" />, on: false },
    { id: "valve", name: "Auto shut-off valve", room: "Gas line", icon: <DoorClosed className="h-5 w-5" />, on: true },
    { id: "plug", name: "Smart plug · Stove hood", room: "Kitchen", icon: <Power className="h-5 w-5" />, on: false },
  ]);
  const [automations, setAutomations] = useState([
    { id: "a1", name: "Leak → open windows & fan", desc: "Runs instantly on any leak signal", on: true },
    { id: "a2", name: "Below 15% → book refill", desc: "Auto-books your preferred distributor", on: false },
    { id: "a3", name: "Night mode", desc: "Mute non-critical alerts 11 PM – 6 AM", on: true },
  ]);
  const [scanning, setScanning] = useState(false);

  const scan = async () => {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 1400));
    setScanning(false);
    toast.success("No new devices found on Pallavi_Home_5G");
  };

  return (
    <>
      <AppHeader title="Smart home" subtitle="Home · Malkajgiri, Secunderabad" back="/app" />
      <Screen className="px-5 pt-4 space-y-3">
        <div className="glass-strong rounded-[32px] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/50">Home status</div>
              <div className="text-lg font-semibold text-white">{emergency ? "Emergency response active" : "All systems normal"}</div>
            </div>
            <Chip tone={emergency ? "danger" : "success"}>{emergency ? "Alarm" : "Safe"}</Chip>
          </div>
          <div className="mt-3 text-xs text-white/55">{devices.filter((d) => d.on).length} of {devices.length} devices active · Gas at {primary.percent.toFixed(0)}%</div>
          <button
            onClick={() => {
              if (emergency) { actions.clearEmergency(); toast.success("Emergency cleared — home back to normal"); }
              else { setDevices((d) => d.map((x) => ({ ...x, on: x.id !== "plug" }))); toast.success("Safe mode applied to every device"); }
            }}
            className="mt-4 w-full rounded-2xl bg-[color:var(--primary)] py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition"
          >
            <Zap className="h-4 w-4" /> {emergency ? "Clear emergency" : "Run safe mode"}
          </button>
        </div>

        <div className="text-xs uppercase tracking-wider text-white/40 pl-1">Devices</div>
        <div className="grid grid-cols-2 gap-2">
          {devices.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDevices((l) => l.map((x) => x.id === d.id ? { ...x, on: !x.on } : x));
                toast(`${d.name} ${d.on ? "off" : "on"}`);
              }}
              className={`rounded-3xl p-4 text-left transition active:scale-[0.97] ${d.on ? "bg-gradient-to-br from-[oklch(0.62_0.19_256)] to-[oklch(0.5_0.15_265)] text-white shadow-lg shadow-[oklch(0.62_0.19_256_/_0.3)]" : "glass text-white"}`}
            >
              <div className={d.on ? "text-white" : "text-white/60"}>{d.icon}</div>
              <div className="mt-3 text-sm font-medium leading-tight">{d.name}</div>
              <div className={`text-xs mt-0.5 ${d.on ? "text-white/70" : "text-white/40"}`}>{d.room} · {d.on ? "On" : "Off"}</div>
            </button>
          ))}
        </div>

        <div className="text-xs uppercase tracking-wider text-white/40 pl-1 pt-1">Automations</div>
        {automations.map((a) => (
          <GlassCard key={a.id}>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm text-white truncate">{a.name}</div>
                <div className="text-xs text-white/50 truncate">{a.desc}</div>
              </div>
              <Switch
                checked={a.on}
                onCheckedChange={(v) => {
                  setAutomations((l) => l.map((x) => x.id === a.id ? { ...x, on: v } : x));
                  toast(`${a.name} ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          </GlassCard>
        ))}

        <button onClick={scan} disabled={scanning} className="w-full rounded-3xl glass py-4 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60">
          {scanning ? (<><Loader2 className="h-4 w-4 animate-spin" /> Scanning your network…</>) : "Add a device"}
        </button>
      </Screen>
    </>
  );
}