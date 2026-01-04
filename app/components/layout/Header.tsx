"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Course", href: "#course" },
    { label: "Mentor", href: "#mentor" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-secondary-900/90 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-gold">
              <BookOpen className="h-6 w-6 text-secondary-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Salahuddin</h1>
              <p className="text-sm text-neutral-400">Heritage Learning</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-neutral-300 transition-colors hover:text-primary-500"
              >
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-neutral-300 hover:bg-secondary-800"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 text-neutral-400 hover:text-gold transition-colors"
              >
                <button className="btn outline-1">Login</button>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 text-neutral-400 hover:text-gold transition-colors"
              >
                <button className="btn btn-primary">Sign Up</button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-neutral-300 hover:bg-secondary-800 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="animate-fade-in border-t border-border bg-secondary-900 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-neutral-300 hover:bg-secondary-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-neutral-300">Theme</span>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-lg p-2 text-neutral-300 hover:bg-secondary-800"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <button className="btn btn-primary mt-2">Get Started</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
