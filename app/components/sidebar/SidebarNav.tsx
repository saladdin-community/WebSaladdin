import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Settings,
  Home,
} from "lucide-react";
import Link from "next/link";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface SidebarNavProps {
  activeItem?: string;
  className?: string;
}

export default function SidebarNav({
  activeItem,
  className = "",
}: SidebarNavProps) {
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
      badge: 12,
    },
    {
      id: "certificates",
      label: "Certificates",
      icon: <Award className="h-5 w-5" />,
      href: "/certificates",
      badge: 3,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  return (
    <aside className={`${className} w-full md:w-64`}>
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[rgba(255,255,255,0.1)]">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeItem === item.id
                  ? "bg-gradient-gold text-black font-semibold"
                  : "text-[#d4d4d4] hover:bg-[#262626]"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-[#d4af35] text-black rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-6 p-4 bg-[#262626] rounded-lg">
          <h4 className="font-semibold text-white mb-2">Need help?</h4>
          <p className="text-sm text-[#a3a3a3] mb-3">
            Contact our support team for assistance
          </p>
          <button className="w-full py-2 bg-[#1f1f1f] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors text-sm">
            Get Help
          </button>
        </div>
      </div>
    </aside>
  );
}
