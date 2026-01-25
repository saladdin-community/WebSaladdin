import { Search, Bell, User, Plus } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onAddNew?: () => void;
  addButtonLabel?: string;
}

export default function AdminHeader({
  title,
  subtitle,
  onAddNew,
  addButtonLabel = "Add New",
}: AdminHeaderProps) {
  return (
    <header className="bg-gradient-to-b from-[#121212] to-transparent backdrop-blur-sm sticky top-0 z-10 border-b border-[rgba(255,255,255,0.1)]">
      <div className="container-custom py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-[#737373] mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                placeholder="Search..."
                className="input pl-10 pr-4 py-2.5 w-full md:w-64 bg-[#1f1f1f] border border-[rgba(255,255,255,0.1)] rounded-lg"
              />
            </div>

            {onAddNew && (
              <button
                onClick={onAddNew}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-gold text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="h-5 w-5" />
                {addButtonLabel}
              </button>
            )}

            <button className="relative p-2.5 bg-[#1f1f1f] rounded-lg hover:bg-[#262626] transition-colors border border-[rgba(255,255,255,0.1)]">
              <Bell className="h-5 w-5 text-[#d4d4d4]" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-gold rounded-full border-2 border-[#121212]"></span>
            </button>

            <button className="p-2.5 bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-lg hover:from-[#262626] hover:to-[#1c1c1c] transition-all border border-[rgba(255,255,255,0.1)]">
              <User className="h-5 w-5 text-[#d4d4d4]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
