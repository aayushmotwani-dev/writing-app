"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Focus } from "@tiptap/extension-focus";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { useAppStore } from "@/store/useAppStore";
import type { Character } from "@/store/useAppStore";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.749 10.749 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function BoldIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>;
}

function ItalicIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>;
}

function UnderlineIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>;
}

function StrikethroughIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>;
}

function CodeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
}

function BlockquoteIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>;
}

function ListIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
}

function HighlightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>;
}

function LinkIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
}

function AlignLeftIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>;
}

function AlignCenterIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/></svg>;
}

function AlignRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>;
}

/* ------------------------------------------------------------------ */
/*  Character Card                                                     */
/* ------------------------------------------------------------------ */

function getRoleBadgeClasses(role: string): string {
  const r = role.toLowerCase();
  if (r === "protagonist") return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
  if (r === "deuteragonist") return "bg-amber-500/15 text-amber-400 border border-amber-500/20";
  if (r === "antagonist") return "bg-red-500/15 text-red-400 border border-red-500/20";
  return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
}

function CharacterCard({ character }: { character: Character }) {
  // Keeping character card intact
  const initials = character.name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ backgroundColor: character.imageColor }}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{character.name}</p>
          <span className={`inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${getRoleBadgeClasses(character.role)}`}>{character.role}</span>
        </div>
      </div>
      <div className="pl-5 flex flex-wrap gap-1.5 mt-2">
        {character.traits.map((trait) => (
          <span key={trait} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border-color text-muted">{trait}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typewriter Component                                               */
/* ------------------------------------------------------------------ */

export default function Typewriter() {
  const book = useAppStore((s) => s.getActiveBook());
  const updateTypewriterText = useAppStore((s) => s.updateTypewriterText);
  const focusMode = useAppStore((s) => s.focusMode);
  const toggleFocusMode = useAppStore((s) => s.toggleFocusMode);
  const codexOpen = useAppStore((s) => s.codexOpen);
  const toggleCodex = useAppStore((s) => s.toggleCodex);
  const editorSettings = useAppStore((s) => s.editorSettings);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleUpdate = useCallback(({ editor }: { editor: import("@tiptap/react").Editor }) => {
    if (!book) return;
    setIsSaving(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateTypewriterText(book.id, editor.getHTML());
      setTimeout(() => setIsSaving(false), 500); // give it a brief "Saved" delay
    }, 1000);
  }, [book, updateTypewriterText]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false, // We'll use the specific Heading extension below
      }),
      Heading.configure({ levels: [1, 2] }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Focus.configure({ className: 'has-focus', mode: 'all' })
    ],
    content: book?.manuscript || "",
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: `w-full bg-transparent outline-none ${editorSettings.fontSize} ${editorSettings.lineSpacing} prose prose-stone dark:prose-invert max-w-none`,
        style: `min-height: 50vh;`
      }
    }
  });

  // Floating menu state
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!editor) return;
    const updateMenu = () => {
      if (editor.state.selection.empty) {
        setMenuCoords(null);
        return;
      }
      // Get coordinates of the selection
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      
      // We adjust top/left to float above the selection
      setMenuCoords({
        top: coords.top - 50,
        left: coords.left,
      });
    };

    const handleBlur = () => setMenuCoords(null);
    editor.on('selectionUpdate', updateMenu);
    editor.on('blur', handleBlur);
    return () => {
      editor.off('selectionUpdate', updateMenu);
      editor.off('blur', handleBlur);
    };
  }, [editor]);

  // Sync content when switching books
  useEffect(() => {
    if (!book) return;
    if (editor && editor.getHTML() !== book.manuscript) {
      // Check if it's vastly different to avoid cursor jumps on small updates
      editor.commands.setContent(book.manuscript);
    }
  }, [book, editor]);

  // Decoupled word counter
  const [wordCount, setWordCount] = useState(0);
  const counterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editor) return;
    
    const compute = () => {
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter(Boolean).length);
    };
    compute();

    const handleUpdate = () => {
      if (counterTimeoutRef.current) clearTimeout(counterTimeoutRef.current);
      counterTimeoutRef.current = setTimeout(compute, 500);
    };

    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
      if (counterTimeoutRef.current) clearTimeout(counterTimeoutRef.current);
    };
  }, [editor]);

  // Typewriter Scroll Mode
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor || !editorSettings.typewriterScroll) return;
    
    const handleSelection = () => {
      if (scrollContainerRef.current) {
        const { head } = editor.state.selection;
        try {
          const coords = editor.view.coordsAtPos(head);
          const containerRect = scrollContainerRef.current.getBoundingClientRect();
          
          // Target scroll to put caret in the middle
          const targetY = scrollContainerRef.current.scrollTop + (coords.top - containerRect.top) - (containerRect.height / 2);
          
          scrollContainerRef.current.scrollTo({ top: targetY, behavior: 'smooth' });
        } catch {
          // ignore coords error if view isn't fully ready
        }
      }
    };
    
    editor.on('selectionUpdate', handleSelection);
    return () => {
      editor.off('selectionUpdate', handleSelection);
    };
  }, [editor, editorSettings.typewriterScroll]);

  // Handle Escape key to exit focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusMode) {
        toggleFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, toggleFocusMode]);

  // Reading Time
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (!book) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        No active book selected.
      </div>
    );
  }

  return (
    <div 
      className="flex h-full transition-colors duration-500"
      style={{
        "--focus-intensity": (1 - editorSettings.focusIntensity / 100).toString()
      } as React.CSSProperties}
    >
      {/* Main writing area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar - Hides in Focus Mode */}
        <div className={`flex items-center justify-between px-4 py-2 border-b border-border-color bg-background/80 backdrop-blur-sm sticky top-0 z-10 transition-transform duration-500 ${focusMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFocusMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                focusMode
                  ? "bg-surface text-foreground shadow-sm border border-border-color/50"
                  : "text-muted hover:text-foreground hover:bg-surface border border-transparent"
              }`}
            >
              <EyeIcon open={focusMode} />
              Focus
            </button>
            <button
              onClick={toggleCodex}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                codexOpen
                  ? "bg-surface text-foreground shadow-sm border border-border-color/50"
                  : "text-muted hover:text-foreground hover:bg-surface border border-transparent"
              }`}
            >
              <BookIcon />
              Codex
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            {editorSettings.showAutoSave && (
              <motion.span layout className="flex items-center gap-1.5 opacity-70">
                {isSaving ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Saved</span>
                  </>
                )}
              </motion.span>
            )}

            {editorSettings.showAutoSave && <span className="w-px h-3 bg-border-color" />}

            <motion.span layout className="tabular-nums">
              <span className="font-medium text-foreground/60">{wordCount.toLocaleString()}</span>
              {editorSettings.sessionGoal > 0 ? ` / ${editorSettings.sessionGoal.toLocaleString()} words` : ' words'}
            </motion.span>
            <span className="w-px h-3 bg-border-color" />
            <motion.span layout className="tabular-nums">
              <span className="font-medium text-foreground/60">{readingTime}</span> min read
            </motion.span>
          </div>
        </div>

        {/* Manuscript Editor */}
        <div
          ref={scrollContainerRef}
          className={`flex-1 flex justify-center py-16 px-8 overflow-y-auto transition-all duration-700 ${
            focusMode ? "focus-mode" : ""
          } ${editorSettings.fontFamily} font-prose`}
        >
          <div className={`${editorSettings.editorWidth} w-full relative`}>
            
            {/* Custom Floating Menu */}
            <AnimatePresence>
              {editor && menuCoords && !editor.state.selection.empty && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed bg-surface/90 backdrop-blur-2xl border border-border-color/80 shadow-[0_4px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-xl p-1.5 flex items-center gap-0.5 z-50 pointer-events-auto ring-1 ring-black/5"
                  style={{ top: menuCoords.top, left: menuCoords.left, transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                    title="Heading 1"
                  >
                    <span className="font-bold text-[10px] w-[16px] h-[16px] flex items-center justify-center">H1</span>
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                    title="Heading 2"
                  >
                    <span className="font-bold text-[10px] w-[16px] h-[16px] flex items-center justify-center">H2</span>
                  </button>

                  <div className="w-px h-4 bg-border-color mx-1" />

                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <BoldIcon />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <ItalicIcon />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('underline') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <UnderlineIcon />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('strike') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <StrikethroughIcon />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('code') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <CodeIcon />
                  </button>
                  
                  <div className="w-px h-4 bg-border-color mx-1" />

                  <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <BlockquoteIcon />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <ListIcon />
                  </button>
                  
                  <div className="w-px h-4 bg-border-color mx-1" />
                  
                  <button
                    onClick={() => {
                      if (editor.isActive('highlight')) {
                        editor.chain().focus().unsetHighlight().run();
                      } else {
                        editor.chain().focus().toggleHighlight().run();
                      }
                    }}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('highlight') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <HighlightIcon />
                  </button>
                  <button
                    onClick={() => {
                      const previousUrl = editor.getAttributes('link').href;
                      const url = window.prompt('URL', previousUrl);
                      if (url === null) return;
                      if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
                        return;
                      }
                      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive('link') ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <LinkIcon />
                  </button>

                  <div className="w-px h-4 bg-border-color mx-1" />

                  <button
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <AlignLeftIcon />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <AlignCenterIcon />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground hover:bg-background'}`}
                  >
                    <AlignRightIcon />
                  </button>
                  
                  <div className="w-px h-4 bg-border-color mx-1" />
                  
                  {/* Color presets */}
                  {['#F59E0B', '#10B981', '#3B82F6', '#EF4444', 'reset'].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        if (color === 'reset') editor.chain().focus().unsetColor().run();
                        else editor.chain().focus().setColor(color).run();
                      }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                        (color === 'reset' && !editor.getAttributes('textStyle').color) || 
                        (color !== 'reset' && editor.isActive('textStyle', { color }))
                          ? 'border-accent scale-110' 
                          : 'border-transparent'
                      } ${color === 'reset' ? 'bg-foreground/50' : ''}`}
                      style={color !== 'reset' ? { backgroundColor: color } : {}}
                      title={color === 'reset' ? 'Reset Color' : ''}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <EditorContent editor={editor} />
            
            {/* Breathing room at the end */}
            <div className="h-64" />
          </div>
        </div>
      </div>

      {/* Floating Exit Focus Mode Button */}
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 opacity-50 hover:opacity-100 transition-opacity"
          >
            <button
              onClick={toggleFocusMode}
              className="px-4 py-2 bg-surface text-foreground shadow-lg border border-border-color rounded-full text-xs font-medium flex items-center gap-2 hover:bg-background transition-colors"
            >
              <span className="font-mono text-[10px] bg-border-color px-1.5 py-0.5 rounded">ESC</span>
              Exit Focus Mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Codex flyout - Hides in Focus Mode */}
      <AnimatePresence>
        {codexOpen && !focusMode && (
          <motion.aside
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="w-80 border-l border-border-color bg-sidebar h-full overflow-y-auto shrink-0"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-color sticky top-0 bg-sidebar/90 backdrop-blur-sm z-10">
              <h2 className="font-serif text-sm font-semibold text-foreground">Character Codex</h2>
              <button onClick={toggleCodex} className="p-1 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors duration-300">
                <CloseIcon />
              </button>
            </div>
            <div className="px-4 divide-y divide-border-color">
              {book.characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating Exit Focus Mode Button */}
      <AnimatePresence>
        {focusMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleFocusMode}
            className="fixed bottom-8 right-8 bg-surface/80 backdrop-blur-md border border-border-color p-3 rounded-full text-muted hover:text-accent hover:border-accent/50 shadow-lg z-50 transition-all duration-300 group"
            title="Exit Focus Mode (Esc)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
              <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
              <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.749 10.749 0 0 1 4.446-5.143" />
              <path d="m2 2 20 20" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
