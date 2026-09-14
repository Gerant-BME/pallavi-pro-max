interface GaugeProps {
  percent: number;
  size?: number;
  label?: string;
  sub?: string;
}

export function Gauge({ percent, size = 200, label, sub }: GaugeProps) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c * 0.75; // 270deg arc
  const total = c * 0.75;
  const color =
    percent > 50 ? "var(--success)" : percent > 20 ? "var(--warning)" : "var(--danger)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          strokeDasharray={`${total} ${c}`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
            transition: "stroke-dasharray 1s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold tracking-tight text-white">
          {percent}
          <span className="text-lg text-white/60">%</span>
        </div>
        {label && <div className="mt-1 text-xs uppercase tracking-widest text-white/50">{label}</div>}
        {sub && <div className="mt-2 text-xs text-white/60">{sub}</div>}
      </div>
    </div>
  );
}