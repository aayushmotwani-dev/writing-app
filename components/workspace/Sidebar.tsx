"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/useAppStore";
import type { ModuleType } from "@/store/useAppStore";
import AmbientPlayer from "./AmbientPlayer";
import SpotifyWidget from "./SpotifyWidget";
import SettingsModal from "./SettingsModal";

const NAV_ITEMS: { key: ModuleType; label: string; icon: React.ReactNode }[] = [
  {
    key: "sandbox",
    label: "Sandbox",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2 L10 6" />
        <path d="M10 6 C10 6 6 8 6 12 C6 15.3 7.8 17 10 18 C12.2 17 14 15.3 14 12 C14 8 10 6 10 6Z" />
        <circle cx="10" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "neural-net",
    label: "Neural Net",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="4" cy="5" r="1.5" />
        <circle cx="4" cy="15" r="1.5" />
        <circle cx="10" cy="7" r="1.5" />
        <circle cx="10" cy="13" r="1.5" />
        <circle cx="16" cy="10" r="1.5" />
        <line x1="5.5" y1="5.5" x2="8.5" y2="6.5" />
        <line x1="5.5" y1="14.5" x2="8.5" y2="13.5" />
        <line x1="5.5" y1="5.5" x2="8.5" y2="12.5" />
        <line x1="5.5" y1="14.5" x2="8.5" y2="7.5" />
        <line x1="11.5" y1="7.5" x2="14.5" y2="9.5" />
        <line x1="11.5" y1="12.5" x2="14.5" y2="10.5" />
      </svg>
    ),
  },
  {
    key: "blueprint",
    label: "Blueprint",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <line x1="3" y1="7" x2="17" y2="7" />
        <line x1="7" y1="7" x2="7" y2="17" />
        <line x1="3" y1="12" x2="7" y2="12" />
      </svg>
    ),
  },
  {
    key: "typewriter",
    label: "Typewriter",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2 C10 2 9 3 9 4 C9 5 10 5 10 5 L10 14" />
        <path d="M10 5 L15 2" />
        <path d="M7 14 L13 14 L14 18 L6 18 Z" />
      </svg>
    ),
  },
  {
    key: "editors-desk",
    label: "Editor's Desk",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="10" r="3" />
        <circle cx="14" cy="10" r="3" />
        <line x1="9" y1="10" x2="11" y2="10" />
        <line x1="3" y1="10" x2="1" y2="8" />
        <line x1="17" y1="10" x2="19" y2="8" />
      </svg>
    ),
  },
  {
    key: "lookbook",
    label: "Lookbook",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="16" height="12" rx="2" />
        <circle cx="7" cy="8" r="1.5" />
        <path d="M2 14 L6 10 L9 13 L13 8 L18 14" />
      </svg>
    ),
  },
  {
    key: "timeline",
    label: "Timeline",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="2" y1="10" x2="18" y2="10" />
        <circle cx="6" cy="10" r="2" fill="currentColor" />
        <circle cx="14" cy="10" r="2" fill="currentColor" />
        <path d="M6 14 L6 16 M14 6 L14 4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const activeModule = useAppStore((s) => s.activeModule);
  const setActiveModule = useAppStore((s) => s.setActiveModule);
  const activeBookId = useAppStore((s) => s.activeBookId);
  const books = useAppStore((s) => s.books);
  const activeBook = books.find(b => b.id === activeBookId);
  const toggleSettings = useAppStore((s) => s.toggleSettings);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Global Keyboard Shortcuts for Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= NAV_ITEMS.length) {
          e.preventDefault();
          setActiveModule(NAV_ITEMS[num - 1].key);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveModule]);

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-border-color flex flex-col shrink-0 select-none">
      {/* ── Top: Back link & book title ── */}
      <div className="px-5 pt-5 pb-4 space-y-3">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors duration-300
                     flex items-center gap-2 group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <line x1="15" y1="10" x2="5" y2="10" />
            <polyline points="10,5 5,10 10,15" />
          </svg>
          Back to Library
        </Link>

        {activeBook && (
          <h2 className="font-serif text-lg text-foreground leading-snug truncate">
            {activeBook.title}
          </h2>
        )}
      </div>

      {/* ── Middle: Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon }) => {
          const isActive = activeModule === key;
          return (
            <button
              key={key}
              onClick={() => setActiveModule(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer group relative
                         transition-all duration-200 text-left
                         ${
                           isActive
                             ? "bg-surface text-foreground shadow-sm font-medium border border-border-color/50"
                             : "text-muted hover:text-foreground hover:bg-surface/50 border border-transparent"
                         }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r-full" />
              )}
              <span className={`shrink-0 transition-colors duration-200 ${isActive ? 'text-accent' : ''}`}>{icon}</span>
              <span className="text-sm flex-1">{label}</span>
              <span className="text-[10px] font-mono opacity-0 group-hover:opacity-40 transition-opacity">{NAV_ITEMS.findIndex(i => i.key === key) + 1}</span>
            </button>
          );
        })}

        {/* ── Outline Tree ── */}
        {activeBook && (
          <div className="mt-8 px-2 pb-4">
            <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-3 pl-2">Story Outline</h3>
            <div className="space-y-3">
              {activeBook.acts.map(act => (
                <div key={act.id} className="group/act">
                  <div className="text-[11px] font-semibold text-foreground/60 py-1 pl-2 uppercase tracking-wider">{act.title}</div>
                  <div className="pl-4 ml-2 border-l border-border-color/30 space-y-0.5 mt-1">
                    {activeBook.beats.filter(b => b.actId === act.id).map(beat => (
                      <div 
                        key={beat.id} 
                        className="text-[11px] text-muted/80 truncate hover:text-accent cursor-pointer transition-colors duration-150 py-0.5 pl-2 -ml-px border-l-2 border-transparent hover:border-accent/50"
                        onClick={() => setActiveModule('blueprint')}
                      >
                        {beat.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Bottom: Theme toggle, Settings, & Ambient player ── */}
      <div className="border-t border-border-color px-4 py-4 space-y-3">
        {/* Session stat */}
        {activeBook && (
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[10px] font-sans uppercase tracking-widest text-muted/60">Session</span>
            <span className="text-[11px] font-mono text-accent font-medium">
              {(activeBook.manuscript ? activeBook.manuscript.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length : 0).toLocaleString()} words
            </span>
          </div>
        )}
        <div className="flex items-center justify-between px-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground
                       transition-colors duration-300 cursor-pointer min-w-[100px]"
          >
            {mounted ? (
              theme === "dark" ? (
                /* Sun icon */
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="10" r="4" />
                  <line x1="10" y1="1" x2="10" y2="3" />
                  <line x1="10" y1="17" x2="10" y2="19" />
                  <line x1="1" y1="10" x2="3" y2="10" />
                  <line x1="17" y1="10" x2="19" y2="10" />
                  <line x1="3.5" y1="3.5" x2="5" y2="5" />
                  <line x1="15" y1="15" x2="16.5" y2="16.5" />
                  <line x1="3.5" y1="16.5" x2="5" y2="15" />
                  <line x1="15" y1="5" x2="16.5" y2="3.5" />
                </svg>
              ) : (
                /* Moon icon */
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 12 A7 7 0 1 1 8 3 A5 5 0 0 0 17 12Z" />
                </svg>
              )
            ) : (
              <div className="w-[18px] h-[18px]" />
            )}
            <span className={!mounted ? "opacity-0" : ""}>
              {mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Loading..."}
            </span>
          </button>

          {/* Settings Toggle */}
          <button
            onClick={toggleSettings}
            className="text-muted hover:text-foreground transition-colors p-1"
            title="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>

        {/* Ambient player / Spotify Toggle */}
        <AmbientPlayer />
      </div>

      {mounted && createPortal(
        <>
          <SpotifyWidget />
          <SettingsModal />
        </>,
        document.body
      )}
    </aside>
  );
}
