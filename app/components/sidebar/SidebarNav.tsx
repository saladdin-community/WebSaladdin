"use client";

import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Settings,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { usePostApiLogout } from "@/app/lib/generated";
import { logoutLocal } from "@/app/lib/auth";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface SidebarNavProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function SidebarNav({
  isMobileOpen,
  onMobileClose,
  isExpanded = true,
  onToggleExpand,
}: SidebarNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const logoutMutation = usePostApiLogout({
    mutation: {
      onSuccess: () => {
        logoutLocal();
        router.push("/login");
      },
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      href: "/",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      id: "courses",
      label: "Courses",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/courses",
    },
  ];

  const getIsActive = (href: string) => {
    if (href === "/") return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`h-screen bg-[#121212] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-64 lg:w-24"
      } lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header Section (Logo + Toggle) */}
      <div
        className={`flex items-center border-b border-white/5 ${
          isExpanded
            ? "justify-between p-6"
            : "justify-between p-6 lg:px-3 lg:justify-between lg:py-6"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src="/images/icon.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${!isExpanded ? "hidden lg:hidden" : ""}`}
          >
            <h2 className="text-white text-xs font-semibold leading-tight truncate uppercase tracking-wider opacity-80">
              Saladdin
            </h2>
          </div>
        </Link>

        {/* Close Button Mobile */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 text-[#a3a3a3] hover:text-white transition-colors flex-shrink-0 ml-auto"
        >
          <LogOut className="h-5 w-5 rotate-180" />
        </button>

        {/* Toggle Expand Button (Desktop only) */}
        <button
          onClick={onToggleExpand}
          className={`hidden lg:flex p-1.5 text-[#a3a3a3] hover:text-white hover:bg-white/5 rounded-lg transition-colors flex-shrink-0 ${
            !isExpanded ? "ml-1" : "ml-auto"
          }`}
          title={isExpanded ? "Minimize sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {navItems.map((item) => {
          const active = getIsActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center py-3 rounded-xl transition-all duration-300 group ${
                active
                  ? "bg-[#d4af35] text-black font-bold shadow-[0_4px_20px_rgba(212,175,53,0.2)]"
                  : "text-[#a3a3a3] hover:bg-white/5 hover:text-white"
              } ${!isExpanded ? "px-4 lg:px-0 lg:justify-center" : "px-4"}`}
              title={!isExpanded ? item.label : undefined}
            >
              <div
                className={`flex-shrink-0 transition-colors ${
                  active
                    ? "text-black"
                    : "text-[#737373] group-hover:text-[#d4af35]"
                } ${!isExpanded ? "mr-3 lg:mr-0" : "mr-3"}`}
              >
                {item.icon}
              </div>
              <span
                className={`text-sm truncate ${!isExpanded ? "lg:hidden" : ""}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button Section */}
      <div
        className={`p-4 mt-auto border-t border-white/5 ${!isExpanded ? "lg:flex lg:justify-center" : ""}`}
      >
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className={`flex items-center py-3 rounded-xl text-[#a3a3a3] hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group w-full ${
            !isExpanded ? "px-4 lg:px-0 lg:justify-center" : "px-4"
          }`}
          title={!isExpanded ? "Logout" : undefined}
        >
          <LogOut
            className={`h-5 w-5 flex-shrink-0 ${
              logoutMutation.isPending
                ? "animate-pulse"
                : "group-hover:translate-x-1"
            } transition-transform ${!isExpanded ? "mr-3 lg:mr-0" : "mr-3"}`}
          />
          <span
            className={`text-sm font-medium truncate ${!isExpanded ? "lg:hidden" : ""}`}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}
