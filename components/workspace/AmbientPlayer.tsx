"use client";

import { useAppStore } from "@/store/useAppStore";

export default function AmbientPlayer() {
  const isSpotifyOpen = useAppStore((s) => s.isSpotifyOpen);
  const toggleSpotify = useAppStore((s) => s.toggleSpotify);

  return (
    <button
      onClick={toggleSpotify}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 text-left border-l-2
                 ${isSpotifyOpen 
                   ? "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954] font-medium" 
                   : "text-muted hover:text-foreground hover:bg-surface border-transparent"
                 }`}
    >
      <span className="shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.08 10.26c-3.96-2.34-10.56-2.52-14.34-1.38-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.38-1.26 11.64-1.02 16.14 1.62.54.3.72 1.02.42 1.56-.24.54-.96.72-1.62.36z"/>
        </svg>
      </span>
      <div className="flex flex-col">
        <span className="text-sm">Spotify Player</span>
        <span className="text-[10px] opacity-70 font-sans tracking-wide">
          {isSpotifyOpen ? "Connected" : "Focus Music"}
        </span>
      </div>
    </button>
  );
}
