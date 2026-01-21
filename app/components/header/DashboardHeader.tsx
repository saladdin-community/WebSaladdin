import { Bell, Search, User } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  greeting?: string;
}

export default function DashboardHeader({
  userName,
  greeting = "Welcome back",
}: DashboardHeaderProps) {
  return (
    <header className="bg-[#121212]/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container-custom py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {greeting}, <span className="text-gradient-gold">{userName}</span>
              !
            </h1>
            <p className="text-[#737373] mt-1">
              Pick up where you left off and continue your journey.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737373]" />
              <input
                type="text"
                placeholder="Search..."
                className="input pl-10 pr-4 py-2.5 w-64 bg-[#1f1f1f] border border-[rgba(255,255,255,0.1)] rounded-lg focus:border-[#d4af35] focus:ring-1 focus:ring-[rgba(212,175,53,0.3)]"
              />
            </div>

            <button className="relative p-2 bg-[#1f1f1f] rounded-lg hover:bg-[#262626] transition-colors">
              <Bell className="h-5 w-5 text-[#d4d4d4]" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#d4af35] rounded-full border-2 border-[#121212]"></span>
            </button>

            <button className="p-2 bg-[#1f1f1f] rounded-lg hover:bg-[#262626] transition-colors">
              <User className="h-5 w-5 text-[#d4d4d4]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
