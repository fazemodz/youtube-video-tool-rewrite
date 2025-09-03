import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, check localStorage or system preference
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setDark(stored === "true");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Toggle class on <html>
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", dark.toString());
    }
  }, [dark, mounted]);

  return [dark, setDark] as const;
} 