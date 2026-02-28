"use client";

import { useState } from "react";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import FloatingAdminButton from "@/app/components/admin/FloatingAdminButton";
import SidebarNav from "@/app/components/sidebar/SidebarNav";
import { Menu } from "lucide-react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex bg-[#0a0a0a] min-h-screen">
      {/* Sidebar - Controlled visibility */}
      <SidebarNav
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          isExpanded ? "lg:pl-64" : "lg:pl-24"
        }`}
      >
        {/* Mobile Top Header Toggle */}
        <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between bg-[#121212] z-30 relative">
          <h1 className="text-white font-bold text-sm uppercase tracking-widest opacity-60">
            Saladdin LMS
          </h1>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-[#a3a3a3] hover:text-white bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto scrollbar-thin relative z-0">
          <ThemeProvider>
            <div className="p-4 md:p-8 lg:p-10">{children}</div>
          </ThemeProvider>
        </main>
      </div>

      <FloatingAdminButton />
    </div>
  );
}
