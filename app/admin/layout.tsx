"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { adminNavItems, settingsNavItems, NavItem } from "@/constants/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const renderNavItem = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname?.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-gradient-gold text-black font-semibold shadow-lg"
            : "text-[#d4d4d4] hover:bg-[#262626] hover:text-white"
        }`}
      >
        <span className={`${isCollapsed ? "mx-auto" : ""}`}>{item.icon}</span>
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  isActive
                    ? "bg-black/20 text-black"
                    : "bg-[#d4af35] text-black"
                }`}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-[#1a1a1a] to-[#121212] border-r border-[rgba(255,255,255,0.1)] transition-all duration-300 z-20 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
            <div
              className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <span className="text-black font-bold text-lg">SH</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="font-bold text-white">Salahuddin</h2>
                  <p className="text-xs text-[#737373]">Heritage Learning</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="p-4 h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin">
            <div className="space-y-1">
              <p
                className={`text-xs font-medium text-[#737373] px-4 py-2 ${isCollapsed ? "text-center" : ""}`}
              >
                {isCollapsed ? "MENU" : "MAIN MENU"}
              </p>
              <div className="space-y-1">
                {adminNavItems.map(renderNavItem)}
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <p
                className={`text-xs font-medium text-[#737373] px-4 py-2 ${isCollapsed ? "text-center" : ""}`}
              >
                {isCollapsed ? "SETTINGS" : "SETTINGS"}
              </p>
              <div className="space-y-1">
                {settingsNavItems.map(renderNavItem)}
              </div>
            </div>

            {/* Help Section */}
            {!isCollapsed && (
              <div className="mt-8 p-4 bg-[#262626] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#d4af35]/10">
                    {settingsNavItems[1]?.icon}
                  </div>
                  <span className="text-sm font-medium text-white">
                    Need help?
                  </span>
                </div>
                <p className="text-xs text-[#a3a3a3] mb-3">
                  Contact our support team for assistance
                </p>
                <button className="w-full py-2 bg-[#1f1f1f] text-white text-sm rounded-lg hover:bg-[#2a2a2a] transition-colors">
                  Get Help
                </button>
              </div>
            )}
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

            {!isCollapsed && (
              <button className="w-full mt-4 flex items-center gap-2 px-3 py-2 text-sm text-[#737373] hover:text-white hover:bg-[#262626] rounded-lg transition-colors">
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            )}
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
