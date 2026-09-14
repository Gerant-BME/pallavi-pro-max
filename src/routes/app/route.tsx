import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav } from "@/components/lpg/AppChrome";
import { DeviceFrame } from "@/routes/index";
import { useStore } from "@/lib/lpg-store";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const emergency = useStore((s) => s.emergency);
  return (
    <DeviceFrame>
      <div className={`relative flex min-h-0 flex-1 flex-col overflow-hidden ${emergency ? "bg-[radial-gradient(circle_at_top,oklch(0.35_0.18_27_/_0.4),transparent_60%)]" : ""}`}>
        <Outlet />
        <BottomNav />
        <Toaster theme="dark" position="top-center" />
      </div>
    </DeviceFrame>
  );
}