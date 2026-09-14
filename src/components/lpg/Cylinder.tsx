import { cn } from "@/lib/utils";

interface CylinderProps {
  percent: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
  showLabel?: boolean;
}

export function Cylinder({ percent, size = "md", className, glow = true, showLabel = true }: CylinderProps) {
  const dims = {
    sm: { w: 90, h: 150 },
    md: { w: 160, h: 260 },
    lg: { w: 220, h: 340 },
  }[size];

  const fillColor =
    percent > 50 ? "var(--success)" : percent > 20 ? "var(--warning)" : "var(--danger)";
  const mix = (pct: number) => `color-mix(in oklab, ${fillColor} ${pct}%, transparent)`;

  return (
    <div
      className={cn("relative shrink-0 animate-float-slow", className)}
      style={{ width: dims.w, height: dims.h, minWidth: dims.w, minHeight: dims.h }}
    >
      {glow && (
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-60"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${fillColor}, transparent 60%)`,
          }}
        />
      )}
      {/* Valve cap */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-t-md"
        style={{
          top: 0,
          width: dims.w * 0.25,
          height: dims.h * 0.05,
          background: "linear-gradient(180deg, #4a4a4f, #2a2a2e)",
        }}
      />
      {/* Neck */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: dims.h * 0.05,
          width: dims.w * 0.35,
          height: dims.h * 0.06,
          background: "linear-gradient(180deg, #3a3a3f, #1e1e22)",
          borderRadius: 6,
        }}
      />
      {/* Body */}
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: dims.h * 0.11,
          bottom: 0,
          borderRadius: dims.w * 0.28,
          background:
            "linear-gradient(135deg, #2a2d33 0%, #1a1c20 45%, #0e0f12 100%)",
          boxShadow:
            "inset 8px 0 20px rgba(255,255,255,0.05), inset -12px 0 24px rgba(0,0,0,0.6), 0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Highlight */}
        <div
          className="absolute top-4 bottom-4 rounded-full opacity-40"
          style={{
            left: "15%",
            width: 8,
            background:
              "linear-gradient(180deg, transparent, rgba(255,255,255,0.7), transparent)",
            filter: "blur(3px)",
          }}
        />
        {/* Gas fill */}
        <div
          className="absolute left-0 right-0 bottom-0 transition-all duration-1000"
          style={{
            height: `${percent}%`,
            background: `linear-gradient(180deg, ${mix(38)} 0%, ${mix(70)} 100%)`,
            borderTop: `2px solid ${fillColor}`,
            boxShadow: `0 0 30px ${mix(45)}, inset 0 20px 40px ${mix(25)}`,
          }}
        >
          {/* Liquid shine */}
          <div
            className="absolute inset-x-0 top-0 h-8 opacity-30"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
            }}
          />
        </div>
        {/* Level markers */}
        <div className="absolute inset-y-6 right-3 flex flex-col justify-between opacity-30">
          {[100, 75, 50, 25, 0].map((v) => (
            <div key={v} className="flex items-center gap-1">
              <div className="h-px w-2 bg-white/60" />
            </div>
          ))}
        </div>
      </div>
      {/* Percent readout */}
      {showLabel && (
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center"
          style={{ bottom: dims.h * 0.15 }}
        >
          <div
            className="text-white font-bold tracking-tight drop-shadow-lg"
            style={{ fontSize: dims.w * 0.18 }}
          >
            {Math.round(percent)}
            <span className="text-white/70" style={{ fontSize: dims.w * 0.09 }}>
              %
            </span>
          </div>
        </div>
      )}
    </div>
  );
}