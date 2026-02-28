import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export default function StatCard({
  label,
  value,
  icon,
  bgColor,
  iconColor,
}: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 flex items-center gap-6 transition-all duration-300 hover:border-white/10 group">
      <div
        className={`${bgColor} ${iconColor} p-4 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white mb-0.5">{value}</h3>
        <p className="text-sm font-medium text-[#737373] uppercase tracking-wider">
          {label}
        </p>
      </div>
    </div>
  );
}
