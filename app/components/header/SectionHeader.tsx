"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  viewAllHref?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionClick,
  viewAllHref,
  icon,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-[#d4af35]/10 flex items-center justify-center text-[#d4af35]">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[#737373] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-[#737373] hover:text-[#d4af35] transition-colors flex items-center gap-1 group"
        >
          View catalog
          <ChevronRight
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      ) : (
        actionLabel &&
        onActionClick && (
          <button
            onClick={onActionClick}
            className="px-6 py-2 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#262626] transition-colors border border-white/5"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
