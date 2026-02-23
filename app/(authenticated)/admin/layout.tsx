"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LogOut, Home } from "lucide-react";
import { adminNavItems, settingsNavItems, NavItem } from "@/constants/sidebar";
import { useRouter } from "next/navigation";
import { usePostApiLogout } from "@/app/lib/generated";
import { logoutLocal } from "@/app/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  const logoutMutation = usePostApiLogout({
    mutation: {
      onSuccess: () => {
        logoutLocal();
        router.push("/login");
      },
    },
  });

  const renderNavItem = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname?.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
          isActive
            ? "bg-gradient-gold text-black font-semibold shadow-lg"
            : "text-[#d4d4d4] hover:bg-[#262626] hover:text-white"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        <span className="flex-shrink-0">{item.icon}</span>

        <div
          className={`flex-1 transition-opacity duration-300 whitespace-nowrap overflow-hidden ${
            isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
          }`}
        >
          {item.label}
        </div>

        {item.badge && !isCollapsed && (
          <span
            className={`px-2 py-1 text-xs rounded-full transition-opacity duration-300 ${
              isActive ? "bg-black/20 text-black" : "bg-[#d4af35] text-black"
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] border-r border-[rgba(255,255,255,0.1)] transition-all duration-300 ease-in-out z-20 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.1)] h-[88px] flex items-center justify-center overflow-hidden">
            <div
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                isCollapsed ? "w-10 justify-center" : "w-full"
              }`}
            >
              <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-gold flex items-center justify-center">
                <span className="text-black font-bold text-lg">SH</span>
              </div>
              <div
                className={`transition-opacity duration-300 whitespace-nowrap overflow-hidden ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                <h2 className="font-bold text-white">Salahuddin</h2>
                <p className="text-xs text-[#737373]">Heritage Learning</p>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="p-4 h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin overflow-x-hidden">
            <div className="space-y-1">
              <p
                className={`text-xs font-medium text-[#737373] px-4 py-2 transition-opacity duration-300 whitespace-nowrap ${
                  isCollapsed
                    ? "opacity-0 text-center text-[10px]"
                    : "opacity-100"
                }`}
              >
                MAIN MENU
              </p>
              <div className="space-y-1">
                {adminNavItems.map(renderNavItem)}
              </div>
            </div>

            {/* Removed Settings and Help Sections as per request */}
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[rgba(255,255,255,0.1)] bg-[#1a1a1a]">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center">
                    <span className="text-black font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Admin</p>
                    <p className="text-xs text-[#737373]">Administrator</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-[#262626] rounded-lg transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5 text-[#737373]" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-[#737373]" />
                )}
              </button>
            </div>

            <div
              className={`mt-4 space-y-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "opacity-0 h-0" : "opacity-100"}`}
            >
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#737373] hover:text-white hover:bg-[#262626] rounded-lg transition-colors whitespace-nowrap"
              >
                <Home className="h-4 w-4 shrink-0" />
                <span>Back to Home</span>
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#737373] hover:text-white hover:bg-[#262626] rounded-lg transition-colors whitespace-nowrap"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 min-h-screen ${
            isCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
