"use client";

import { useSyncExternalStore } from "react";

const THEME_CHANGE_EVENT = "themechange";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, callback);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

// The inline theme-init script (see layout.tsx) sets the real class before
// hydration; this default only matters for the very first server-rendered
// pass, and useSyncExternalStore reconciles it right after mount.
function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md active:scale-90 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-primary-600"
    >
      <span
        aria-hidden="true"
        className={`inline-block transition-transform duration-300 ease-out ${isDark ? "rotate-0" : "rotate-180"}`}
      >
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
