// hooks/useScrollAnimation.ts
"use client";

import { useEffect, useState } from "react";

export const useScrollAnimation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state untuk header
      setScrolled(currentScrollY > 10);

      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return { scrolled, scrollDirection };
};
