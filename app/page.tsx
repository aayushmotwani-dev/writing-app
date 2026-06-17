"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import BookCard from "@/components/library/BookCard";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
  const books = useAppStore((s) => s.books);
  const addBook = useAppStore((s) => s.addBook);
  const loadExampleBooks = useAppStore((s) => s.loadExampleBooks);
  const router = useRouter();

  const handleNewBook = () => {
    const newBookId = addBook();
    router.push(`/workspace/${newBookId}`);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"edited" | "alphabetical">("edited");
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const genres = useMemo(() => Array.from(new Set(books.map(b => b.genre).filter(Boolean))), [books]);

  const filteredBooks = useMemo(() => {
    return books
      .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(b => genreFilter ? b.genre === genreFilter : true)
      .sort((a, b) => {
        if (sortOption === "edited") {
          return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
        } else {
          return a.title.localeCompare(b.title);
        }
      });
  }, [books, searchQuery, genreFilter, sortOption]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-border-color">

        <div className="relative max-w-7xl mx-auto px-8 pt-16 pb-12 flex flex-col items-center text-center">
          {/* Logo / Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-5xl md:text-6xl font-bold text-foreground tracking-tight"
          >
            Manuscripta
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-sans text-sm md:text-base text-foreground/40 tracking-[0.2em] uppercase"
          >
            Your Cinematic Writing Studio
          </motion.p>

          {/* New Book button */}
          <motion.button
            onClick={handleNewBook}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-foreground text-background font-sans font-medium text-sm transition-colors hover:opacity-90 cursor-pointer shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Book
          </motion.button>
        </div>
      </header>



      {/* ── Library Toolbar ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full max-w-md relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text"
            placeholder="Search manuscripts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            suppressHydrationWarning
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border-color rounded-full text-sm outline-none focus:border-accent text-foreground transition-colors shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {genres.length > 0 && (
            <select
              value={genreFilter || ""}
              onChange={(e) => setGenreFilter(e.target.value || null)}
              suppressHydrationWarning
              className="px-4 py-2.5 bg-surface border border-border-color rounded-full text-sm outline-none focus:border-accent text-muted cursor-pointer"
            >
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          )}

          <div className="flex items-center bg-surface border border-border-color rounded-full p-1 shadow-sm shrink-0">
            <button
              onClick={() => setSortOption("edited")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${sortOption === 'edited' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortOption("alphabetical")}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${sortOption === 'alphabetical' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}
            >
              A-Z
            </button>
          </div>
        </div>
      </div>

      {/* ── Book Grid ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-8 pb-12">
        {!mounted ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16 items-end pb-8">
            {filteredBooks.map((book, index) => (
              <div key={book.id} className="relative group/shelf">
                <BookCard book={book} index={index} />
                {/* Individual shelf line under each book */}
                <div className="absolute -bottom-2 -inset-x-4 h-2 bg-border-color/50 rounded-full blur-[1px] -z-10 opacity-50 dark:opacity-20" />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-28 rounded-lg border-2 border-dashed border-foreground/10 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/20"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              </svg>
            </div>
            <p className="font-serif text-lg text-foreground/30">
              No books yet
            </p>
            <p className="mt-1 font-sans text-sm text-foreground/20">
              Create your first manuscript to begin
            </p>
            <button
              onClick={loadExampleBooks}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-border-color text-sm font-medium text-muted hover:text-foreground hover:border-accent/50 transition-all duration-300 shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"/></svg>
              Load example projects
            </button>
          </motion.div>
        )}
      </main>

      {/* ── Footer whisper ──────────────────────────────────────── */}
      <footer className="pb-8 text-center">
        <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-foreground/15">
          Craft worlds. Tell stories.
        </p>
      </footer>
    </div>
  );
}
