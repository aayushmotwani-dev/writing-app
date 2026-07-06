"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import type { Book } from "@/data/mockData";

interface BookCardProps {
  book: Book;
  index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
  const router = useRouter();
  const deleteBook = useAppStore((s) => s.deleteBook);
  const renameBook = useAppStore((s) => s.renameBook);
  const duplicateBook = useAppStore((s) => s.duplicateBook);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const formattedDate = new Date(book.lastEdited).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const wordCount = book.manuscript ? book.manuscript.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length : 0;
  const progressPercent = Math.min(100, (wordCount / 50000) * 100);

  // Genre-based spine color
  const genreColors: Record<string, string> = {
    'Fantasy': '#6366F1',
    'Sci-Fi': '#06B6D4',
    'Thriller': '#EF4444',
    'Romance': '#EC4899',
    'Mystery': '#8B5CF6',
    'Horror': '#1F2937',
    'Literary Fiction': '#D97706',
    'Historical': '#92400E',
  };
  const spineColor = genreColors[book.genre] || 'var(--accent)';

  const handleCardClick = () => {
    if (!isEditing && !showConfirmDelete && !isOpening) {
      setIsOpening(true);
      setTimeout(() => {
        router.push(`/workspace/${book.id}`);
      }, 400); // Wait for the "slide off shelf" animation
    }
  };

  const handleRenameSubmit = () => {
    if (editTitle.trim() && editTitle !== book.title) {
      renameBook(book.id, editTitle.trim());
    } else {
      setEditTitle(book.title); // revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setEditTitle(book.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.1, 0.8), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        onClick={handleCardClick}
        whileHover={!isEditing && !showConfirmDelete && !isOpening ? { y: -2 } : {}}
        animate={isOpening ? { scale: 1.05, y: 15, opacity: 0 } : { scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: isOpening ? 0.4 : 0.2, ease: isOpening ? "anticipate" : "easeOut" }}
        className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface border border-border-color hover:border-accent/20 cursor-pointer group transition-all duration-300"
        style={{
          boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)'
        }}
      >
        {/* Colored genre spine */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 z-20"
          style={{ background: `linear-gradient(to bottom, ${spineColor}, ${spineColor}88)` }}
        />

        {/* Paper texture gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-foreground/[0.02] pointer-events-none" />

        {/* Action Menu (Ellipsis) */}
        <div className="absolute top-3 right-3 z-20" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-2 rounded-md bg-background/80 hover:bg-background text-muted hover:text-foreground border border-border-color backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-2 w-48 bg-background/80 backdrop-blur-2xl border border-border-color/80 rounded-xl shadow-2xl p-1 z-30 ring-1 ring-black/5"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setIsEditing(true);
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-foreground/80 hover:bg-surface hover:text-foreground rounded-md transition-colors group cursor-default active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                    Rename
                  </div>
                  <span className="text-[10px] text-muted font-sans font-medium tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">⌘R</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    duplicateBook(book.id);
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-foreground/80 hover:bg-surface hover:text-foreground rounded-md transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Duplicate
                  </div>
                  <span className="text-[10px] text-muted font-sans font-medium tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">⌘D</span>
                </button>
                <div className="h-px bg-border-color/50 my-1 mx-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setShowConfirmDelete(true);
                  }}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-red-500/80 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors group cursor-default active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    Delete
                  </div>
                  <span className="text-[10px] text-red-500/50 font-sans font-medium tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">⌘⌫</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delete Confirmation Overlay */}
        <AnimatePresence>
          {showConfirmDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </div>
              <p className="text-white font-medium text-sm mb-4">
                Delete "{book.title}"?
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(false);
                  }}
                  className="flex-1 px-3 py-2 rounded-md bg-surface hover:bg-background text-xs font-medium text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBook(book.id);
                  }}
                  className="flex-1 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Centered title / input */}
        <div className="absolute inset-0 flex items-center justify-center p-6 z-10 pointer-events-none">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-background border border-accent/50 rounded-md px-3 py-2 font-serif text-xl font-bold text-foreground text-center shadow-sm focus:outline-none pointer-events-auto"
            />
          ) : (
            <h3
              className="font-serif text-xl md:text-2xl font-semibold text-foreground text-center leading-snug pointer-events-auto"
            >
              {book.title}
            </h3>
          )}
        </div>

        {/* Bottom metadata bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-2.5 z-10 pointer-events-none bg-gradient-to-t from-surface/80 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-muted px-2 py-0.5 rounded-sm border border-border-color bg-background/40 backdrop-blur-sm">
              {book.genre}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-sans text-muted">
              <span className="flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                {wordCount.toLocaleString()}w
              </span>
              <span className="w-px h-2.5 bg-border-color" />
              <span>{formattedDate}</span>
            </div>
          </div>
          {/* Thin progress bar */}
          <div className="w-full h-0.5 bg-border-color rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%`, backgroundColor: spineColor }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
