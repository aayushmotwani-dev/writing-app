"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, type BeatCard } from "@/store/useAppStore";

export default function Timeline() {
  const book = useAppStore((s) => s.getActiveBook());
  const updateBeatCard = useAppStore((s) => s.updateBeatCard);
  const setActiveModule = useAppStore((s) => s.setActiveModule);
  
  const [editingBeat, setEditingBeat] = useState<BeatCard | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  if (!book) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        No active book selected.
      </div>
    );
  }

  const handleEditOpen = (beat: BeatCard) => {
    setEditingBeat(beat);
    setEditTitle(beat.title);
    setEditDesc(beat.description);
  };

  const handleEditSave = () => {
    if (editingBeat) {
      updateBeatCard(book.id, editingBeat.id, {
        title: editTitle,
        description: editDesc,
      });
      setEditingBeat(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "final": return "bg-emerald-500";
      case "revised": return "bg-blue-500";
      case "draft":
      default:
        return "bg-amber-500";
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight drop-shadow-md">
            Timeline
          </h1>
          <p className="mt-1 text-sm text-muted font-sans">
            Chronological narrative overview
          </p>
        </div>
      </div>

      {/* Horizontal Timeline Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar px-8 pb-12 pt-16 flex items-center">
        <div className="flex items-stretch min-h-[300px] pb-8 relative">
          
          {/* Connecting middle line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border-color -translate-y-1/2 z-0" />

          {book.acts.map((act) => {
            const actBeats = book.beats.filter(b => b.actId === act.id);
            if (actBeats.length === 0) return null;

            return (
              <div key={act.id} className="flex items-center relative z-10 shrink-0">
                {/* Act Divider */}
                <div className="flex flex-col items-center justify-center mx-6 relative group">
                  <div className="absolute -top-12 text-xs font-bold uppercase tracking-widest text-muted whitespace-nowrap">
                    {act.title}
                  </div>
                  <div className="w-1 h-32 bg-border-color rounded-full" />
                </div>

                {/* Beats for this Act */}
                <div className="flex items-center gap-12">
                  {actBeats.map((beat, i) => {
                    const isTop = i % 2 === 0;
                    return (
                      <motion.div
                        key={beat.id}
                        whileHover={{ scale: 1.05, y: isTop ? -5 : 5 }}
                        className={`relative cursor-pointer flex flex-col items-center w-48 ${isTop ? 'mb-40' : 'mt-40'}`}
                        onClick={() => handleEditOpen(beat)}
                      >
                        {/* Dot on the timeline */}
                        <div className={`absolute ${isTop ? '-bottom-[4.5rem]' : '-top-[4.5rem]'} w-4 h-4 rounded-full border-2 border-background ${getStatusColor(beat.status)} shadow-md z-20`} />
                        {/* Connecting vertical line */}
                        <div className={`absolute ${isTop ? '-bottom-16 h-16' : '-top-16 h-16'} w-0.5 bg-border-color z-10`} />

                        {/* Card */}
                        <div className="w-full bg-surface border border-border-color rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="relative overflow-hidden whitespace-nowrap flex-1">
                              <h3 className="font-sans text-sm font-semibold text-foreground">{beat.title || "Untitled Beat"}</h3>
                              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-surface to-transparent" />
                            </div>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(beat.status)} shrink-0 mt-1.5`} title={beat.status || 'draft'} />
                          </div>
                          <div className="relative">
                            <p className="text-xs text-muted leading-relaxed max-h-[4.5em] overflow-hidden">
                              {beat.description || "No description..."}
                            </p>
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-surface to-transparent" />
                          </div>
                          {beat.tags && beat.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {beat.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-background border border-border-color rounded text-muted">
                                  {tag}
                                </span>
                              ))}
                              {beat.tags.length > 2 && <span className="text-[9px] text-muted">+{beat.tags.length - 2}</span>}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {book.beats.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full min-w-[500px] text-muted space-y-4 relative z-10 bg-background/80 backdrop-blur-sm p-8 rounded-xl border border-dashed border-border-color">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p>No beats added yet.</p>
              <button onClick={() => setActiveModule("blueprint")} className="text-sm text-accent hover:underline">
                Go to Blueprint to add beats
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Overlay */}
      <AnimatePresence>
        {editingBeat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setEditingBeat(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-border-color rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-serif font-semibold text-foreground">Edit Timeline Beat</h2>
                <button onClick={() => setEditingBeat(null)} className="text-muted hover:text-foreground">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">Title</label>
                  <input
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent transition-colors resize-none custom-scrollbar"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border-color">
                <button
                  onClick={() => setEditingBeat(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
