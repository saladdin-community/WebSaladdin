// app/providers/theme-provider.tsx
"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force dark theme
    document.documentElement.classList.add("dark");
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
