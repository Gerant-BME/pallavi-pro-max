import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader, Chip, GlassCard, Screen } from "@/components/lpg/AppChrome";
import { useStore } from "@/lib/lpg-store";
import { MapPin, Truck, Users, Bell, ShieldCheck, LifeBuoy, Lock, Settings2, Sparkles, Home as HomeIcon, ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  component: Profile,
  head: () => ({
    meta: [
      { title: "Profile · Pallavi" },
      { name: "description", content: "Account details, addresses, family sharing, and support for your Pallavi account." },
      { property: "og:title", content: "Profile · Pallavi" },
      { property: "og:description", content: "Account details, addresses, family sharing, and support." },
    ],
  }),
});

function Profile() {
  const user = useStore((s) => s.user);
  const bookings = useStore((s) => s.bookings);

  return (
    <>
      <AppHeader title="Profile" subtitle={user?.email} />
      <Screen className="px-5 pt-4 space-y-4">
        <div className="glass-strong rounded-[32px] p-5 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[oklch(0.62_0.19_256)] to-[oklch(0.5_0.15_265)] text-xl font-semibold text-white">
            {user?.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold text-white truncate">{user?.name}</div>
            <div className="text-xs text-white/50 truncate">{user?.phone}</div>
            <div className="mt-2 flex gap-1.5"><Chip tone="success">Verified</Chip><Chip tone="primary">Premium</Chip></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat label="Cylinders" value="3" />
          <Stat label="Refills" value={String(bookings.length)} />
          <Stat label="Saved" value="₹2.1k" />
        </div>

        <Section title="Account">
          <Row icon={<MapPin className="h-4 w-4" />} label="Addresses" value="Somewhere In Malkajgiri, Secunderabad" onClick={() => toast("Home · Malkajgiri is your default address")} />
          <Row icon={<Truck className="h-4 w-4" />} label="Preferred distributor" value="Indane" onClick={() => toast("Indane set as preferred distributor")} />
          <RowLink icon={<Users className="h-4 w-4" />} label="Family sharing" value="3 + (Pune Dad) Members" to="/app/family" />
        </Section>

        <Section title="Device & home">
          <RowLink icon={<Settings2 className="h-4 w-4" />} label="Device settings" to="/app/settings" />
          <RowLink icon={<HomeIcon className="h-4 w-4" />} label="Smart home" to="/app/smart-home" />
          <RowLink icon={<Sparkles className="h-4 w-4" />} label="AI insights" to="/app/ai" />
          <RowLink icon={<Bell className="h-4 w-4" />} label="Notifications" to="/app/alerts" />
        </Section>

        <Section title="Support">
          <Row icon={<ShieldCheck className="h-4 w-4" />} label="Warranty" value="Valid till 2028" onClick={() => toast.success("Warranty active until Mar 2028")} />
          <Row icon={<LifeBuoy className="h-4 w-4" />} label="Help & support" onClick={() => toast("Support will call you within 15 minutes")} />
          <Row icon={<Lock className="h-4 w-4" />} label="Privacy & data" onClick={() => toast("Your data is encrypted end-to-end")} />
        </Section>

        <Link to="/" className="block">
          <div className="glass rounded-3xl p-4 flex items-center justify-center gap-2 text-sm font-semibold text-[color:var(--danger)]">
            <LogOut className="h-4 w-4" /> Sign out
          </div>
        </Link>
        <div className="pt-1 text-center text-[10px] text-white/30">Gasaware v2.4.1 · Made For Safer Kitchens And Exploding Girlfriends</div>
      </Screen>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-3">
      <div className="text-lg font-semibold text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wider text-white/40 pl-1">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function RowBody({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[color:var(--primary)]/15 text-[color:var(--primary)]">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-white truncate">{label}</div>
        {value && <div className="text-xs text-white/50 truncate">{value}</div>}
      </div>
      <ChevronRight className="h-4 w-4 text-white/40" />
    </div>
  );
}

function Row({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: string; onClick: () => void }) {
  return <GlassCard onClick={onClick}><RowBody icon={icon} label={label} value={value} /></GlassCard>;
}

function RowLink({ icon, label, value, to }: { icon: React.ReactNode; label: string; value?: string; to: string }) {
  return (
    <Link to={to as any}>
      <GlassCard><RowBody icon={icon} label={label} value={value} /></GlassCard>
    </Link>
  );
}