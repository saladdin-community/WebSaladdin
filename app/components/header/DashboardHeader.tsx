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
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {greeting}, <span className="text-[#d4af35]">{userName}</span>!
          </h1>
          <p className="text-[#737373] mt-1 text-sm font-medium">
            Pick up where you left off and continue your journey.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2.5 bg-[#1a1a1a] border border-white/5 rounded-full hover:bg-[#262626] transition-all duration-300 hover:scale-105 group">
            <Bell className="h-5 w-5 text-[#a3a3a3] group-hover:text-white transition-colors" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-[#d4af35] rounded-full border-2 border-[#0a0a0a]"></span>
          </button>

          {/* User Info / Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-white/10 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white group-hover:text-[#d4af35] transition-colors">
                {userName}
              </p>
              <p className="text-[10px] font-medium text-[#737373]">Student</p>
            </div>
            <div className="h-10 w-10 bg-gradient-to-br from-[#262626] to-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#d4af35]/50 transition-all duration-300">
              <User size={20} className="text-[#d4af35]" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
