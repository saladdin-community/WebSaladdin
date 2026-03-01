import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label?: string;
  title?: string;
  value: string | number;
  icon: React.ReactNode | LucideIcon;
  bgColor: string;
  iconColor?: string;
  color?: string;
}

export default function StatCard({
  label,
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  color,
}: StatCardProps) {
  const displayLabel = label || title;
  const displayColor = iconColor || color || "text-white";

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 flex items-center gap-6 transition-all duration-300 hover:border-white/10 group">
      <div
        className={`${bgColor} ${displayColor} p-4 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        {typeof Icon === "function" ? <Icon className="h-6 w-6" /> : Icon}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white mb-0.5">{value}</h3>
        <p className="text-sm font-medium text-[#737373] uppercase tracking-wider">
          {displayLabel}
        </p>
      </div>
    </div>
  );
}
