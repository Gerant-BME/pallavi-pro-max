import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { useStore } from "@/lib/lpg-store";
import { Bluetooth, Wifi, Download, Gauge, Bell, Sun, RotateCcw, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/settings")({
  component: DeviceSettings,
  head: () => ({
    meta: [
      { title: "Device Settings · Pallavi" },
      { name: "description", content: "Pair Bluetooth, configure Wi-Fi, update firmware, calibrate sensors, and tune notifications." },
      { property: "og:title", content: "Device Settings · Pallavi" },
      { property: "og:description", content: "Bluetooth, Wi-Fi, firmware, calibration, and notification preferences." },
    ],
  }),
});

function DeviceSettings() {
  const cylinders = useStore((s) => s.cylinders);
  const device = cylinders[0];
  const [bt, setBt] = useState(device.bluetooth);
  const [wifi, setWifi] = useState(device.wifi);
  const [pairing, setPairing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [calibrating, setCalibrating] = useState(false);
  const [brightness, setBrightness] = useState([60]);
  const [prefs, setPrefs] = useState({ low: true, leak: true, delivery: true, battery: false });
  const [resetOpen, setResetOpen] = useState(false);

  const pair = async () => {
    setPairing(true);
    await new Promise((r) => setTimeout(r, 1400));
    setPairing(false);
    setBt(true);
    toast.success("Paired with Pallavi Sensor Pro");
  };

  const update = async () => {
    setUpdating(true);
    await new Promise((r) => setTimeout(r, 1800));
    setUpdating(false);
    setUpdated(true);
    toast.success("Firmware updated to 2.5.0");
  };

  const calibrate = async () => {
    setCalibrating(true);
    await new Promise((r) => setTimeout(r, 1600));
    setCalibrating(false);
    toast.success("Sensor calibrated — accuracy 99.2%");
  };

  return (
    <>
      <AppHeader title="Device settings" subtitle={device.name} back="/app" />
      <Screen className="px-5 pt-4 space-y-3">
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Bluetooth className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="text-sm text-white">Bluetooth</div>
              <div className="text-xs text-white/50">{bt ? "Connected · Sensor Pro" : "Not connected"}</div>
            </div>
            <Switch checked={bt} onCheckedChange={(v) => { setBt(v); toast(v ? "Bluetooth on" : "Bluetooth off"); }} />
          </div>
          <button onClick={pair} disabled={pairing} className="mt-3 w-full rounded-2xl bg-[color:var(--primary)] py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-60">
            {pairing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Searching for devices…</>) : "Pair a new sensor"}
          </button>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Wifi className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="text-sm text-white">Wi-Fi</div>
              <div className="text-xs text-white/50">{wifi ? "Pallavi_Home_5G · Strong" : "Disconnected"}</div>
            </div>
            <Switch checked={wifi} onCheckedChange={(v) => { setWifi(v); toast(v ? "Wi-Fi connected" : "Wi-Fi disabled"); }} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Download className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="text-sm text-white">Firmware</div>
              <div className="text-xs text-white/50">Current {updated ? "2.5.0" : device.firmware}</div>
            </div>
            {updated ? <Chip tone="success">Up to date</Chip> : <Chip tone="warn">2.5.0 available</Chip>}
          </div>
          {!updated && (
            <button onClick={update} disabled={updating} className="mt-3 w-full rounded-2xl glass py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60">
              {updating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Installing update…</>) : "Update now"}
            </button>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Gauge className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="text-sm text-white">Sensor calibration</div>
              <div className="text-xs text-white/50">Last calibrated 12 days ago</div>
            </div>
          </div>
          <button onClick={calibrate} disabled={calibrating} className="mt-3 w-full rounded-2xl glass py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60">
            {calibrating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Calibrating…</>) : (<><Check className="h-4 w-4" /> Calibrate sensor</>)}
          </button>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Bell className="h-5 w-5" /></div>
            <div className="text-sm text-white">Notification preferences</div>
          </div>
          <div className="space-y-2.5">
            {([
              ["low", "Low LPG warnings"],
              ["leak", "Gas leak alarms"],
              ["delivery", "Delivery updates"],
              ["battery", "Battery reminders"],
            ] as const).map(([k, label]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-xs text-white/70">{label}</span>
                <Switch checked={prefs[k]} onCheckedChange={(v) => { setPrefs((p) => ({ ...p, [k]: v })); toast(`${label} ${v ? "enabled" : "disabled"}`); }} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Sun className="h-5 w-5" /></div>
            <div className="flex-1 text-sm text-white">LED brightness</div>
            <span className="text-xs text-white/50">{brightness[0]}%</span>
          </div>
          <Slider value={brightness} onValueChange={setBrightness} max={100} step={5} />
        </GlassCard>

        <button onClick={() => setResetOpen(true)} className="w-full rounded-3xl glass p-4 flex items-center justify-center gap-2 text-sm font-semibold text-[color:var(--danger)]">
          <RotateCcw className="h-4 w-4" /> Factory reset
        </button>
      </Screen>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent className="bg-[oklch(0.18_0.005_250)] border-white/10 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Factory reset this sensor?</AlertDialogTitle>
            <AlertDialogDescription>All pairing, calibration and history stored on the device will be erased.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => toast.success("Sensor reset to factory defaults")}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}