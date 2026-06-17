"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function SpotifyWidget() {
  const isOpen = useAppStore((s) => s.isSpotifyOpen);
  const toggleSpotify = useAppStore((s) => s.toggleSpotify);
  const spotifyUrl = useAppStore((s) => s.spotifyUrl);
  const setSpotifyUrl = useAppStore((s) => s.setSpotifyUrl);

  const [inputUrl, setInputUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Controls iframe height

  // Helper to convert standard spotify URL to embed URL
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("/embed/")) {
        const urlObj = new URL(url);
        urlObj.searchParams.set("theme", "0");
        return urlObj.toString();
      }
      
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        const type = pathParts[0]; 
        const id = pathParts[1];
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleSaveUrl = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed); // Validate URL
      setSpotifyUrl(trimmed);
      setIsEditing(false);
      setInputUrl("");
    } catch {
      alert("Please enter a valid URL.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={false}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : 50, 
          scale: isOpen ? 1 : 0.95,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 w-[340px] bg-surface/95 backdrop-blur-xl border border-border-color rounded-2xl shadow-2xl overflow-hidden z-[100] flex flex-col"
      >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border-color flex items-center justify-between bg-surface/50">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM19.08 10.26c-3.96-2.34-10.56-2.52-14.34-1.38-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.38-1.26 11.64-1.02 16.14 1.62.54.3.72 1.02.42 1.56-.24.54-.96.72-1.62.36z"/>
              </svg>
              <span className="text-sm font-semibold text-foreground tracking-wide">Focus Music</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsEditing(!isEditing)} className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background transition-colors" title="Change Playlist">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background transition-colors" title={isExpanded ? "Compact View" : "Expand View"}>
                {isExpanded ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                )}
              </button>
              <button onClick={toggleSpotify} className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background transition-colors" title="Minimize">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-0 bg-background/50">
            {isEditing ? (
              <div className="p-5 flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted">Paste Spotify Track/Playlist Link</label>
                  <input
                    autoFocus
                    type="text"
                    placeholder="https://open.spotify.com/playlist/..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveUrl()}
                    className="w-full bg-surface border border-border-color rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all shadow-sm"
                  />
                </div>
                <button onClick={handleSaveUrl} className="w-full bg-accent text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-accent-hover transition-colors shadow-md">
                  Update Player
                </button>
              </div>
            ) : (
              <iframe
                title="Spotify Embed"
                style={{ borderRadius: "0 0 16px 16px", transition: "height 0.3s ease", border: 'none' }}
                src={getEmbedUrl(spotifyUrl)}
                width="100%"
                height={isExpanded ? "352" : "80"}
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block"
              ></iframe>
            )}
          </div>
      </motion.div>
    </AnimatePresence>
  );
}
