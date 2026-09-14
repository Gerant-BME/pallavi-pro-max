import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { UserPlus, Shield, Bell, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/family")({
  component: Family,
  head: () => ({
    meta: [
      { title: "Family Sharing · Pallavi" },
      { name: "description", content: "Invite family members, set permissions, and share LPG alerts across your household." },
      { property: "og:title", content: "Family Sharing · Pallavi" },
      { property: "og:description", content: "Invite members, set permissions, and share LPG alerts." },
    ],
  }),
});

type Member = { id: string; name: string; role: "Owner" | "Adult" | "Guest"; phone: string; alerts: boolean; initials: string };

const initial: Member[] = [
  { id: "m1", name: "Pallavi Sharma", role: "Owner", phone: "+91 98220 41290", alerts: true, initials: "PS" },
  { id: "m2", name: "Rohit Sharma", role: "Adult", phone: "+91 98450 11223", alerts: true, initials: "RS" },
  { id: "m3", name: "Meera Rao", role: "Guest", phone: "+91 90000 77441", alerts: false, initials: "MR" },
];

function Family() {
  const [members, setMembers] = useState(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const invite = async () => {
    if (!name.trim() || !phone.trim()) { toast.error("Add a name and phone number"); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setMembers((m) => [...m, {
      id: `m${Date.now()}`, name, role: "Guest", phone, alerts: true,
      initials: name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
    }]);
    setSending(false);
    setOpen(false);
    setName(""); setPhone("");
    toast.success("Invite sent");
  };

  return (
    <>
      <AppHeader title="Family sharing" subtitle={`${members.length} members · Malkajgiri`} back="/app/profile" />
      <Screen className="px-5 pt-4 space-y-3">
        <div className="glass-strong rounded-[32px] p-5">
          <div className="text-sm text-white">Everyone stays informed</div>
          <div className="text-xs text-white/55 mt-1">Members receive low-gas warnings and leak alarms instantly. Owners can book refills and change device settings.</div>
        </div>

        {members.map((m) => (
          <GlassCard key={m.id}>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.62_0.19_256)] to-[oklch(0.5_0.15_265)] text-sm font-semibold text-white">{m.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white truncate">{m.name}</div>
                <div className="text-xs text-white/50 truncate">{m.phone}</div>
                <div className="mt-2 flex gap-1.5">
                  <Chip tone={m.role === "Owner" ? "primary" : "default"}>{m.role}</Chip>
                  {m.alerts && <Chip tone="success">Alerts on</Chip>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={m.alerts}
                  onCheckedChange={(v) => {
                    setMembers((list) => list.map((x) => x.id === m.id ? { ...x, alerts: v } : x));
                    toast(`${m.name} alerts ${v ? "enabled" : "muted"}`);
                  }}
                />
                {m.role !== "Owner" && (
                  <button
                    onClick={() => { setMembers((l) => l.filter((x) => x.id !== m.id)); toast.success(`${m.name} removed`); }}
                    className="text-[color:var(--danger)]"
                    aria-label={`Remove ${m.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}

        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Shield className="h-4 w-4" /></div>
            <div className="flex-1 text-sm text-white">Only owners can factory reset</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]"><Bell className="h-4 w-4" /></div>
            <div className="flex-1 text-sm text-white">Leak alarms always reach every member</div>
          </div>
        </GlassCard>

        <button onClick={() => setOpen(true)} className="w-full rounded-3xl bg-[color:var(--primary)] py-4 text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition">
          <UserPlus className="h-4 w-4" /> Invite a member
        </button>
      </Screen>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="bg-[oklch(0.18_0.005_250)] border-white/10 rounded-t-[32px]">
          <SheetHeader><SheetTitle className="text-white">Invite a member</SheetTitle></SheetHeader>
          <div className="mt-4 space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full glass rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full glass rounded-2xl px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none" />
            <button onClick={invite} disabled={sending} className="w-full rounded-2xl bg-[color:var(--primary)] py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60">
              {sending ? (<><Loader2 className="h-4 w-4 animate-spin" /> Sending invite…</>) : "Send invite"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}