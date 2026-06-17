"use client";

import { useState, useMemo, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import type { Reference } from "@/store/useAppStore";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function DocumentIconLarge() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted/60">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Movie Poster Card                                                  */
/* ------------------------------------------------------------------ */

function MoviePosterCard({
  reference,
  index,
  onClick,
}: {
  reference: Reference;
  index: number;
  onClick: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.45 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="aspect-[2/3] rounded-xl overflow-hidden cursor-pointer border border-border-color hover:border-accent/30 transition-all duration-300 mb-4 break-inside-avoid relative group"
      style={{ background: reference.imageGradient || '#1a1a1a' }}
    >
      {/* Real Image */}
      {reference.imageUrl && !imageError && (
        <img 
          src={reference.imageUrl} 
          alt={reference.title} 
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />

      {/* Content - Hidden on hover to make room for notes */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="font-serif text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          {reference.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {reference.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white/90 backdrop-blur-md border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hover Notes Overlay (Frosted Glass) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-center items-center text-center">
        <h3 className="font-serif text-lg font-semibold text-accent mb-3 drop-shadow-md">
          {reference.title}
        </h3>
        <div className="relative w-full max-h-[10em] overflow-y-auto custom-scrollbar pr-2">
          <p className="font-serif text-white/90 text-sm italic leading-relaxed drop-shadow-md">
            {reference.notes || "No notes yet. Click to add some."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Script PDF Card                                                    */
/* ------------------------------------------------------------------ */

function ScriptPdfCard({
  reference,
  index,
  onClick,
}: {
  reference: Reference;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.45 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="rounded-xl overflow-hidden cursor-pointer border border-border-color hover:border-accent/30 transition-all duration-300 mb-4 break-inside-avoid bg-surface group"
    >
      <div className="flex items-center justify-center py-8 bg-background/50">
        <DocumentIcon />
      </div>
      <div className="p-4 border-t border-border-color">
        <h3 className="font-serif text-sm font-semibold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
          {reference.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted mb-3">
          {reference.filename && <span>{reference.filename}</span>}
          {reference.pageCount && (
            <>
              <span className="w-px h-3 bg-border-color" />
              <span>{reference.pageCount} pages</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {reference.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border-color text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Flyout Panel                                                       */
/* ------------------------------------------------------------------ */

function FlyoutPanel({
  reference,
  onClose,
}: {
  reference: Reference;
  onClose: () => void;
}) {
  const book = useAppStore((s) => s.getActiveBook());
  const updateReferenceNotes = useAppStore((s) => s.updateReferenceNotes);
  const deleteReference = useAppStore((s) => s.deleteReference);
  const [notes, setNotes] = useState(reference.notes);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    if (book) updateReferenceNotes(book.id, reference.id, e.target.value);
  };

  return (
    <motion.aside
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="w-96 border-l border-border-color bg-sidebar h-full overflow-y-auto shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-color sticky top-0 bg-sidebar/90 backdrop-blur-sm z-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          Reference Detail
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { if(book) deleteReference(book.id, reference.id); }}
            className="p-1.5 rounded-md text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors duration-300"
            title="Delete reference"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors duration-300"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Preview */}
        {reference.type === "movie-poster" ? (
          <div className="w-full aspect-[2/3] rounded-lg overflow-hidden relative shadow-lg" style={{ background: reference.imageGradient || '#1a1a1a' }}>
            {reference.imageUrl && (
              <img 
                src={reference.imageUrl} 
                alt={reference.title} 
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="font-serif text-white text-xl font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {reference.title}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-[4/3] rounded-lg bg-background border border-border-color flex flex-col items-center justify-center gap-3">
            <DocumentIconLarge />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{reference.filename ?? reference.title}</p>
              {reference.pageCount && <p className="text-xs text-muted mt-0.5">{reference.pageCount} pages</p>}
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <h3 className="font-serif text-xl font-semibold text-foreground">{reference.title}</h3>
          <span className="text-xs text-muted uppercase tracking-wider">
            {reference.type === "movie-poster" ? "Visual Reference" : "Script Document"}
          </span>
        </div>

        {/* Tags */}
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted mb-2">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {reference.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border-color text-foreground/70">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stylistic Notes */}
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted mb-2">Stylistic Notes</p>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add your thoughts on this reference..."
            className="w-full h-40 bg-background border border-border-color rounded-lg p-3 font-serif text-sm resize-none focus:border-accent focus:outline-none transition-colors duration-300 text-foreground"
          />
        </div>
      </div>
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Reference Modal                                                */
/* ------------------------------------------------------------------ */

function AddReferenceModal({ onClose }: { onClose: () => void }) {
  const book = useAppStore((s) => s.getActiveBook());
  const addReference = useAppStore((s) => s.addReference);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsStr, setTagsStr] = useState("");

  if (!book) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    
    addReference(book.id, {
      id: crypto.randomUUID(),
      title: title.trim(),
      type: 'movie-poster',
      imageGradient: "linear-gradient(to bottom right, #334155, #0f172a)",
      imageUrl: imageUrl.trim() || undefined,
      notes: notes.trim(),
      tags: tags.length ? tags : ['Inspiration'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-surface border border-border-color rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border-color flex items-center justify-between bg-surface/50">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Add Visual Reference</h2>
          <button onClick={onClose} className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background transition-colors">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Title</label>
            <input 
              autoFocus required
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              placeholder="e.g. Cyberpunk Alleyway"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Image URL</label>
            <input 
              value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Tags (comma separated)</label>
            <input 
              value={tagsStr} onChange={(e) => setTagsStr(e.target.value)}
              className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              placeholder="Lighting, Mood, Architecture"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1 uppercase tracking-wider">Notes</label>
            <textarea 
              value={notes} onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 bg-background border border-border-color rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:border-accent font-serif"
              placeholder="Why is this important to the story?"
            />
          </div>
          
          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20">
              Add to Moodboard
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lookbook                                                           */
/* ------------------------------------------------------------------ */

export default function Lookbook() {
  const book = useAppStore((s) => s.getActiveBook());
  const lookbookFlyoutId = useAppStore((s) => s.lookbookFlyoutId);
  const setLookbookFlyout = useAppStore((s) => s.setLookbookFlyout);

  const [isAddingRef, setIsAddingRef] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'visual' | 'scripts'>('all');

  const selectedReference = useMemo(
    () => lookbookFlyoutId && book ? book.references.find((r) => r.id === lookbookFlyoutId) ?? null : null,
    [lookbookFlyoutId, book]
  );

  if (!book) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        No active book selected.
      </div>
    );
  }

  const uniqueTags = Array.from(new Set(book.references.flatMap(r => r.tags)));
  const filteredReferences = book.references.filter(r => {
    if (filterType === 'visual' && r.type !== 'movie-poster') return false;
    if (filterType === 'scripts' && r.type !== 'script-pdf') return false;
    if (filterTag && !r.tags.includes(filterTag)) return false;
    return true;
  });

  return (
    <div className="flex h-full relative">
      {/* Main grid */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-foreground">The Lookbook</h1>
              <p className="text-sm text-muted mt-1">Visual references and stylistic touchstones</p>
            </div>
            
            <button
              onClick={() => setIsAddingRef(true)}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-color hover:border-accent/50 hover:text-accent text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <PlusIcon />
              Add Reference
            </button>
          </motion.div>

          {/* Controls */}
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-surface border border-border-color rounded-lg p-1 shadow-sm">
                {(['all', 'visual', 'scripts'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
                      filterType === type
                        ? "bg-accent text-white shadow-sm"
                        : "text-muted hover:text-foreground hover:bg-background/50"
                    }`}
                  >
                    {type === 'all' ? 'All' : type === 'visual' ? 'Visual' : 'Scripts'}
                  </button>
                ))}
              </div>
            </div>

            {uniqueTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterTag(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterTag === null ? "bg-foreground text-background" : "bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  All Tags
                </button>
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterTag === tag ? "bg-accent text-white" : "bg-surface text-muted hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Masonry grid */}
          {filteredReferences.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
              <AnimatePresence>
                {filteredReferences.map((ref, i) =>
                  ref.type === "movie-poster" ? (
                    <MoviePosterCard key={ref.id} reference={ref} index={i} onClick={() => setLookbookFlyout(ref.id)} />
                  ) : (
                    <ScriptPdfCard key={ref.id} reference={ref} index={i} onClick={() => setLookbookFlyout(ref.id)} />
                  )
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-muted font-sans text-sm">No references match your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Flyout panel */}
      <AnimatePresence>
        {selectedReference && <FlyoutPanel key={selectedReference.id} reference={selectedReference} onClose={() => setLookbookFlyout(null)} />}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddingRef && <AddReferenceModal onClose={() => setIsAddingRef(false)} />}
      </AnimatePresence>
    </div>
  );
}
