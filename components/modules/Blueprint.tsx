/* eslint-disable react-hooks/refs */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult, type DraggableProvided, type DraggableStateSnapshot } from "@hello-pangea/dnd";
import { useAppStore, type BlueprintAct, type BeatCard, type Book } from "@/store/useAppStore";

export default function Blueprint() {
  const book = useAppStore((s) => s.getActiveBook());
  
  const setStructurePreset = useAppStore((s) => s.setStructurePreset);
  const addCustomAct = useAppStore((s) => s.addCustomAct);
  const reorderBeatCards = useAppStore((s) => s.reorderBeatCards);

  const [isAddingAct, setIsAddingAct] = useState(false);
  const [newActTitle, setNewActTitle] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleAddAct = () => {
    if (newActTitle.trim() && book) {
      addCustomAct(book.id, newActTitle.trim());
      setNewActTitle("");
      setIsAddingAct(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!book) return;
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    reorderBeatCards(
      book.id,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
      draggableId
    );
  };

  if (!isMounted) return null;

  if (!book) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        No active book selected.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8">
      {/* Top Toolbar */}
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-border-color">
        <div>
          <motion.h1 layout="position" className="font-serif text-3xl font-bold text-foreground tracking-tight drop-shadow-md">
            Blueprint
          </motion.h1>
          <div className="flex items-center gap-3 mt-2">
            <motion.p layout="position" className="text-sm text-muted font-sans drop-shadow-sm">
              Architect your narrative structure
            </motion.p>
            <span className="w-1 h-1 rounded-full bg-border-color" />
            <p className="text-xs font-medium text-foreground/70 tracking-wide uppercase">
              {book.acts.length} Acts <span className="mx-1 text-muted">•</span> {book.beats.length} Beats
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          {/* Tag Filter */}
          {book.beats.some(b => b.tags && b.tags.length > 0) && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-muted mr-1">Filter</span>
              <button
                onClick={() => setFilterTag(null)}
                className={`px-2 py-0.5 text-xs rounded-full transition-colors ${filterTag === null ? 'bg-foreground text-background' : 'bg-surface text-muted hover:text-foreground'}`}
              >
                All
              </button>
              {Array.from(new Set(book.beats.flatMap(b => b.tags || []))).map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-2 py-0.5 text-xs rounded-full transition-colors ${filterTag === tag ? 'bg-accent text-white' : 'bg-surface text-muted hover:text-foreground'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* Segmented Control */}
          <div className="flex items-center bg-surface border border-border-color rounded-lg p-1 shadow-sm">
            {(['3-act', '5-act', 'custom'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setStructurePreset(book.id, preset)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
                  book.activeStructure === preset
                    ? "bg-accent text-white shadow-sm"
                    : "text-muted hover:text-foreground hover:bg-background/50"
                }`}
              >
                {preset === '3-act' ? '3-Act' : preset === '5-act' ? '5-Act' : 'Custom'}
              </button>
            ))}
          </div>

          {/* Add Act Button (Custom Mode Only) */}
          <AnimatePresence>
            {book.activeStructure === 'custom' && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap flex items-center"
              >
                {isAddingAct ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Act Title..."
                      value={newActTitle}
                      onChange={(e) => setNewActTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddAct()}
                      onBlur={() => {
                        if (!newActTitle.trim()) setIsAddingAct(false);
                      }}
                      className="px-3 py-1.5 text-sm rounded-md border border-accent bg-background text-foreground outline-none w-40"
                    />
                    <button onClick={handleAddAct} className="text-accent hover:text-accent-hover text-sm font-medium px-2">
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingAct(true)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-border-color bg-surface/50 hover:bg-surface text-sm font-medium text-foreground transition-colors shadow-sm ml-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Act
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>

      {/* Dynamic Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto overflow-y-hidden pb-4 snap-x">
          <AnimatePresence mode="popLayout">
            {book.acts.map((act) => (
              <ActColumn
                key={act.id}
                book={book}
                act={act}
                beats={book.beats.filter((b) => b.actId === act.id)}
                filterTag={filterTag}
              />
            ))}
          </AnimatePresence>

          {/* Empty State for Custom */}
          {book.acts.length === 0 && book.activeStructure === 'custom' && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
              <p className="text-lg font-medium">Your canvas is empty.</p>
              <p className="text-sm">Click &quot;+ Add Act&quot; to build your custom structure.</p>
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Subcomponents
// -----------------------------------------------------------------------------

function ActColumn({ book, act, beats, filterTag }: { book: Book; act: BlueprintAct; beats: BeatCard[]; filterTag: string | null }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(act.title);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const renameAct = useAppStore((s) => s.renameAct);
  const deleteAct = useAppStore((s) => s.deleteAct);
  const addBeatCard = useAppStore((s) => s.addBeatCard);

  const handleRename = () => {
    if (editTitle.trim() && editTitle !== act.title) {
      renameAct(book.id, act.id, editTitle.trim());
    } else {
      setEditTitle(act.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`flex-shrink-0 flex flex-col bg-surface/30 rounded-xl border border-border-color overflow-hidden snap-start relative group/col transition-all duration-300 ${
        isCollapsed ? 'w-[60px] cursor-pointer' : 'w-[340px]'
      }`}
      onClick={() => isCollapsed && setIsCollapsed(false)}
    >
      {/* Column Header */}
      <div className={`p-4 border-b border-border-color/50 bg-background/50 backdrop-blur-sm flex items-center sticky top-0 z-10 transition-all ${isCollapsed ? 'flex-col justify-center h-full gap-4' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex-1 mr-2" onDoubleClick={() => book.activeStructure === 'custom' && setIsEditingTitle(true)}>
          {isEditingTitle && book.activeStructure === 'custom' ? (
            <input
              autoFocus
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="text-sm font-bold bg-transparent text-foreground border-b border-accent outline-none w-full"
            />
          ) : (
            <h3 className="font-serif font-bold text-foreground uppercase tracking-wider text-sm">
              {act.title}
            </h3>
          )}
        </div>
        )}

        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3' : 'gap-1'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }} 
            className="w-6 h-6 flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              {isCollapsed ? <path d="M19 12H5m7 7-7-7 7-7" /> : <path d="M5 12h14M12 5l7 7-7 7" />}
            </svg>
          </button>
          {!isCollapsed && (
            <span className="text-xs text-muted font-medium bg-surface px-2 py-0.5 rounded-full border border-border-color">
              {beats.length}
            </span>
          )}
          {book.activeStructure === 'custom' && !isCollapsed && (
            <button
              onClick={() => deleteAct(book.id, act.id)}
              className="w-6 h-6 flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover/col:opacity-100"
              title="Delete Act"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Cards List (Droppable Zone) */}
      {!isCollapsed && (
        <>
          <Droppable droppableId={act.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors ${
              snapshot.isDraggingOver ? 'bg-accent/5' : ''
            }`}
          >
            {beats.map((beat, index) => (
              <Draggable key={beat.id} draggableId={beat.id} index={index}>
                {(provided, snapshot) => (
                  <BeatCardItem 
                    provided={provided} 
                    snapshot={snapshot} 
                    book={book} 
                    beat={beat} 
                    isFilteredOut={filterTag !== null && !(beat.tags?.includes(filterTag))}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

          {/* Add Beat Button */}
          <div className="p-3 border-t border-border-color/50 bg-background/50">
            <button
              onClick={() => addBeatCard(book.id, act.id)}
              className="w-full py-2 rounded-lg border border-dashed border-muted text-muted hover:text-foreground hover:border-accent hover:bg-accent/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Beat
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

function BeatCardItem({ provided, snapshot, book, beat, isFilteredOut }: { provided: DraggableProvided, snapshot: DraggableStateSnapshot, book: Book; beat: BeatCard; isFilteredOut: boolean }) {
  const updateBeatCard = useAppStore((s) => s.updateBeatCard);
  const deleteBeatCard = useAppStore((s) => s.deleteBeatCard);

  const [localTitle, setLocalTitle] = useState(beat.title);
  const [localDesc, setLocalDesc] = useState(beat.description);
  const [prevBeatTitle, setPrevBeatTitle] = useState(beat.title);
  const [prevBeatDesc, setPrevBeatDesc] = useState(beat.description);

  if (beat.title !== prevBeatTitle || beat.description !== prevBeatDesc) {
    setLocalTitle(beat.title);
    setLocalDesc(beat.description);
    setPrevBeatTitle(beat.title);
    setPrevBeatDesc(beat.description);
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`relative bg-surface/80 dark:bg-[#151515] p-4 rounded-lg border transition-all duration-300 group/card
        ${snapshot.isDragging ? 'border-accent shadow-xl shadow-accent/20 ring-1 ring-accent z-50 opacity-100' : 'border-border-color shadow-sm hover:border-accent/40'}
        ${isFilteredOut && !snapshot.isDragging ? 'opacity-30 grayscale hover:opacity-80 hover:grayscale-0' : 'opacity-100'}
      `}
      style={{
        ...provided.draggableProps.style,
        // Optional: keep rotation/scaling when dragging
          transform: snapshot.isDragging 
          ? (provided.draggableProps.style?.transform || "") + " scale(1.02) rotate(1deg)"
          : provided.draggableProps.style?.transform,
      }}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <input
          type="text"
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={() => updateBeatCard(book.id, beat.id, { title: localTitle })}
          placeholder="Beat Title"
          className="font-bold text-sm bg-transparent text-foreground outline-none border-b border-transparent focus:border-accent transition-colors flex-1"
        />
        <button
          onClick={() => deleteBeatCard(book.id, beat.id)}
          className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover/card:opacity-100"
          title="Delete Beat"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <textarea
        value={localDesc}
        onChange={(e) => setLocalDesc(e.target.value)}
        onBlur={() => updateBeatCard(book.id, beat.id, { description: localDesc })}
        placeholder="Describe what happens..."
        className="w-full text-xs text-muted bg-transparent outline-none resize-none min-h-[60px] focus:text-foreground transition-colors"
      />

      <div className="flex items-center justify-between mt-3 border-t border-border-color/50 pt-3">
        <div className="flex items-center gap-1 flex-wrap flex-1">
          {beat.tags && beat.tags.length > 0 && beat.tags.map(tag => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-accent/10 text-accent uppercase tracking-wider">
              {tag}
            </span>
          ))}
          {!beat.tags?.length && (
            <span className="text-[10px] text-muted opacity-0 group-hover/card:opacity-100 transition-opacity italic">No tags</span>
          )}
        </div>
        
        {/* Status Badge Toggle */}
        <button
          onClick={() => {
            const nextStatus = beat.status === 'final' ? 'draft' : beat.status === 'revised' ? 'final' : 'revised';
            updateBeatCard(book.id, beat.id, { status: nextStatus });
          }}
          className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors ml-2
            ${!beat.status || beat.status === 'draft' ? 'bg-surface text-muted border border-border-color hover:text-foreground' : ''}
            ${beat.status === 'revised' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : ''}
            ${beat.status === 'final' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : ''}
          `}
        >
          {beat.status || 'draft'}
        </button>
      </div>
      
      {/* Drag handle indicator (optional, makes it feel more draggable) */}
      <div className="absolute top-1/2 -left-1 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-opacity">
         <svg width="8" height="16" viewBox="0 0 8 16" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/50">
           <circle cx="2" cy="4" r="1" />
           <circle cx="2" cy="8" r="1" />
           <circle cx="2" cy="12" r="1" />
           <circle cx="6" cy="4" r="1" />
           <circle cx="6" cy="8" r="1" />
           <circle cx="6" cy="12" r="1" />
         </svg>
      </div>
    </div>
  );
}
