"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, type Snippet } from "@/store/useAppStore";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return "just now";
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function SnippetCard({
  snippet,
  index,
  bookId,
}: {
  snippet: Snippet;
  index: number;
  bookId: string;
}) {
  const deleteSnippet = useAppStore((s) => s.deleteSnippet);
  const toggleSnippetPin = useAppStore((s) => s.toggleSnippetPin);
  const updateSandboxSnippet = useAppStore((s) => s.updateSandboxSnippet);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(snippet.content);

  const handleSave = () => {
    updateSandboxSnippet(bookId, snippet.id, editText);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.06, 0.5),
        ease: "easeOut",
      }}
      className="break-inside-avoid mb-4 group relative"
      onDoubleClick={() => { if (!isEditing) setIsEditing(true); }}
    >
      <div
        className="border-l-4 bg-surface rounded-lg p-4 shadow-sm
                   hover:shadow-md transition-shadow duration-300 relative"
        style={{ borderLeftColor: snippet.color }}
      >
        {/* Actions (Delete/Pin) on Hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); toggleSnippetPin(bookId, snippet.id); }}
            className={`p-1.5 rounded-md transition-colors ${snippet.pinned ? 'text-accent bg-accent/10' : 'text-muted hover:text-foreground hover:bg-surface'}`}
            title="Pin snippet"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteSnippet(bookId, snippet.id); }}
            className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete snippet"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        {isEditing ? (
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            className="w-full bg-background border border-accent rounded-md px-2 py-1 font-serif text-foreground/90 leading-relaxed text-[15px] focus:outline-none resize-none mt-4"
            rows={Math.max(2, editText.split('\n').length)}
          />
        ) : (
          <p className={`font-serif text-foreground/90 leading-relaxed text-[15px] whitespace-pre-wrap ${snippet.pinned ? 'mt-4' : ''}`}>
            {snippet.content}
          </p>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted tracking-wide flex items-center gap-1.5">
            {snippet.pinned && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-accent">
                <path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
              </svg>
            )}
            {formatRelativeTime(snippet.createdAt)}
          </span>

          {snippet.tag && (
            <span
              className="inline-block text-[10px] font-sans font-medium uppercase tracking-wider
                         px-2 py-0.5 rounded-full bg-white/5 dark:bg-white/10 text-muted"
              style={{
                borderLeft: `2px solid ${snippet.color}`,
              }}
            >
              {snippet.tag}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Sandbox() {
  const book = useAppStore((s) => s.getActiveBook());
  const addSnippet = useAppStore((s) => s.addSnippet);

  const [newText, setNewText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  if (!book) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        No active book selected.
      </div>
    );
  }

  const snippets = book.snippets;

  const handleAddSnippet = (text: string, tag: string) => {
    if (!text.trim()) return;
    const colors = [
      "#f59e0b",
      "#8b5cf6",
      "#10b981",
      "#ef4444",
      "#3b82f6",
      "#ec4899",
      "#6366f1",
      "#14b8a6",
    ];
    const newSnippet: Snippet = {
      id: `snip-${crypto.randomUUID()}`,
      content: text,
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
      tag: tag.trim() || undefined,
    };
    addSnippet(book.id, newSnippet);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddSnippet(newText, newTag);
      setNewText("");
      setNewTag("");
    }
  };

  const uniqueTags = Array.from(new Set(snippets.map(s => s.tag).filter(Boolean))) as string[];

  const filteredSnippets = snippets
    .filter(s => (filterTag ? s.tag === filterTag : true))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="relative min-h-full flex flex-col">
      {/* Content area */}
      <div className="p-8 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
            The Sandbox
          </h1>
          <p className="mt-1 text-sm text-muted font-sans mb-4">
            Capture raw ideas, fragments, and sparks
          </p>
          
          <div className="relative max-w-2xl bg-surface border border-border-color rounded-xl overflow-hidden focus-within:border-accent transition-colors shadow-sm">
            <textarea
              suppressHydrationWarning
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your raw idea..."
              rows={2}
              className="w-full bg-transparent px-4 pt-3 pb-2 font-serif text-foreground focus:outline-none resize-none"
            />
            <div className="bg-background/50 px-4 py-2 border-t border-border-color/50 flex items-center justify-between">
              <input 
                type="text" 
                placeholder="# Add a tag (optional)" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-xs text-muted focus:text-foreground focus:outline-none w-1/2"
              />
              <div className="text-[10px] text-muted font-sans uppercase tracking-wider">
                Press Enter ↵
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tag Filters */}
        {uniqueTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterTag === null ? "bg-foreground text-background" : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              All
            </button>
            {uniqueTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterTag === tag ? "bg-accent text-white" : "bg-surface text-muted hover:text-foreground"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Masonry grid */}
        {filteredSnippets.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {filteredSnippets.map((snippet, i) => (
              <SnippetCard key={snippet.id} snippet={snippet} index={i} bookId={book.id} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-surface flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <p className="text-muted font-sans text-sm">
              {filterTag ? `No snippets found for #${filterTag}.` : "No snippets yet. Click the button below to capture your first idea."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => {
          handleAddSnippet("A new idea begins here…", "");
        }}
        className="fixed bottom-8 right-8 bg-accent text-white rounded-full
                   px-6 py-3 shadow-lg hover:bg-accent-hover
                   transition-colors duration-300 font-sans text-sm font-medium
                   flex items-center gap-2 z-50 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Snippet
      </button>
    </div>
  );
}
