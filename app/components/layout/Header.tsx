"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, BookOpen, Moon, Sun, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { usePostApiLogout } from "@/app/lib/generated";
import { getAuthUser, logoutLocal } from "@/app/lib/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const logoutMutation = usePostApiLogout({
    mutation: {
      onSuccess: () => {
        logoutLocal();
        setUser(null);
        router.push("/login");
      },
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/" },
    { label: "Course", href: "/" },
    { label: "Mentor", href: "/" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-secondary-900/90 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg">
              <Image
                src="/images/icon.png"
                alt="Saladdin LMS Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Saladdin</h1>
              <p className="text-sm text-neutral-400">LMS Platform</p>
            </div>
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-neutral-300 hover:text-primary-500"
              >
                {item.label}
              </Link>
            ))}

            {/* Theme */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-neutral-300 hover:bg-secondary-800"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* AUTH SECTION */}
            {!user ? (
              <div className="flex gap-3">
                <Link href="/login">
                  <button className="btn outline-1">Login</button>
                </Link>
                <Link href="/signup">
                  <button className="btn btn-primary">Sign Up</button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-neutral-200 max-w-[160px]">
                  <User size={18} className="shrink-0" />

                  <span
                    className="truncate whitespace-nowrap overflow-hidden"
                    title={user.name} // hover untuk lihat full name
                  >
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className=" btn flex items-center gap-2 text-red-400 hover:text-red-500 outline-1"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile */}
          <button
            className="rounded-lg p-2 text-neutral-300 hover:bg-secondary-800 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
