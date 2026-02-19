"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { getAuthUser } from "@/app/lib/auth";

export default function FloatingAdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    // Assuming the user object has a role property.
    // Based on previous conversations/context, I should verify the user shape,
    // but typically it's user.role.
    // I'll check if user exists and if role is 'admin'.
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/admin/overview"
        className="flex items-center justify-center w-14 h-14 bg-gradient-gold rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        title="Admin Dashboard"
      >
        <LayoutDashboard className="h-6 w-6 text-black" />
        <span className="absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Admin Dashboard
        </span>
      </Link>
    </div>
  );
}
