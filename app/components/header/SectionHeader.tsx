interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionClick,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-[#737373] mt-1">{subtitle}</p>}
      </div>

      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-6 py-2.5 bg-[#262626] text-white font-semibold rounded-lg hover:bg-[#2d2d2d] transition-colors border border-[rgba(255,255,255,0.1)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
