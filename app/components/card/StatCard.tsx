import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  bgColor,
  trend = "up",
}: StatsCardProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-amber-400",
  };

  return (
    <div
      className={`${bgColor} rounded-xl p-6 border border-[rgba(255,255,255,0.1)]`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-black/20 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${trendColors[trend]}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-[#d4d4d4]">{title}</p>
    </div>
  );
}
