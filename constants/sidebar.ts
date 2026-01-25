export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href: string;
  badge?: number;
  subItems?: NavItem[];
}

export const adminNavItems: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/admin/overview",
  },
  {
    id: "courses",
    label: "Courses",
    href: "/admin/courses",
    badge: 8,
  },
  {
    id: "students",
    label: "Students",
    href: "/admin/students",
    badge: 28,
  },
];

export const settingsNavItems: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
  },
];
