"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Action data                                                        */
/* ------------------------------------------------------------------ */

type ActionKey = "stakes" | "subtext" | "pacing";

interface ActionDef {
  key: ActionKey;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const actions: ActionDef[] = [
  {
    key: "stakes",
    icon: <ZapIcon />,
    title: "Interrogate Stakes",
    description: "Analyze dramatic tension and character stakes",
  },
  {
    key: "subtext",
    icon: <SearchIcon />,
    title: "Check Subtext",
    description: "Examine layered meaning and thematic depth",
  },
  {
    key: "pacing",
    icon: <BarChartIcon />,
    title: "Pacing Audit",
    description: "Evaluate narrative rhythm and scene flow",
  },
];

/* ------------------------------------------------------------------ */
/*  Mock responses                                                     */
/* ------------------------------------------------------------------ */

function StakesResponse() {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-foreground/80">
        The protagonist&apos;s internal conflict peaks in Act 2b but the
        external stakes plateau. Consider raising the antagonist&apos;s threat
        level to match the emotional trajectory. The midpoint reversal at Scene
        7 needs a stronger catalyst.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Confidence: High — based on 7 manuscript paragraphs analyzed
      </div>
    </div>
  );
}

function SubtextResponse() {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-foreground/80">
        Strong thematic undercurrent of isolation vs. connection. The recurring
        water imagery effectively mirrors emotional states. Consider deepening
        the mirror between the protagonist and antagonist — their motivations
        echo each other but this parallel is currently too subtle.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Themes detected: isolation, memory, architecture-as-metaphor
      </div>
    </div>
  );
}

function PacingResponse() {
  const acts = [
    { label: "Act 1", pct: 60, color: "bg-blue-500" },
    { label: "Act 2a", pct: 75, color: "bg-indigo-500" },
    { label: "Act 2b", pct: 90, color: "bg-violet-500" },
    { label: "Act 3", pct: 95, color: "bg-amber-500" },
    { label: "Act 4", pct: 70, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-4">
      {/* Bar chart */}
      <div className="flex items-end gap-3 h-32">
        {acts.map((act) => (
          <div key={act.label} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-muted font-medium">
              {act.pct}%
            </span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${act.pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`w-full rounded-t-md ${act.color}`}
            />
            <span className="text-[10px] text-muted">{act.label}</span>
          </div>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">
        Overall rhythm is strong. Act 3 climax hits at the right intensity.
        Consider tightening Act 4 — the denouement lingers 15% longer than
        optimal.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="w-2 h-2 rounded-full bg-violet-500" />
        Peak intensity at 95% — excellent climactic placement
      </div>
    </div>
  );
}

const responses: Record<ActionKey, () => React.ReactNode> = {
  stakes: StakesResponse,
  subtext: SubtextResponse,
  pacing: PacingResponse,
};

/* ------------------------------------------------------------------ */
/*  EditorsDesk                                                        */
/* ------------------------------------------------------------------ */

export default function EditorsDesk() {
  const book = useAppStore((s) => s.getActiveBook());
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const [annotationMode, setAnnotationMode] = useState<'none' | 'adverbs' | 'passive'>('none');
  const [copied, setCopied] = useState(false);

  const manuscript = book?.manuscript;
  const paragraphs = useMemo(() => {
    if (!manuscript) return [];
    // Replace closing paragraph/br tags with newlines to preserve breaks, then strip remaining HTML
    const withNewlines = manuscript.replace(/<\/p>|<br\s*\/?>/gi, '\n');
    const plainText = withNewlines.replace(/<[^>]*>?/gm, '');
    return plainText.split(/\n+/).map(p => p.trim()).filter(Boolean);
  }, [manuscript]);

  const stats = useMemo(() => {
    const text = paragraphs.join(" ");
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgSentenceLength = sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : "0";
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgSentenceLength,
      readingTime: Math.max(1, Math.ceil(words.length / 250))
    };
  }, [paragraphs]);

  const renderAnnotatedText = (text: string) => {
    if (annotationMode === 'none') return text;
    
    let regex: RegExp;
    let className: string;

    if (annotationMode === 'adverbs') {
      regex = /\b(\w+ly)\b/gi;
      className = "bg-amber-500/20 text-amber-200 border-b border-amber-500/40 rounded px-0.5";
    } else {
      // passive voice
      regex = /\b(is|are|was|were|be|been|being)\s+(\w+ed|en)\b/gi;
      className = "bg-rose-500/20 text-rose-200 border-b border-rose-500/40 rounded px-0.5";
    }

    const parts = text.split(regex);
    // split with regex containing capture groups keeps the captured parts in the array
    // so odd indices are the matches
    return parts.map((part, i) => {
      if (i % 2 === 1) { // It's a match
        return <span key={i} className={className}>{part}</span>;
      }
      return part;
    });
  };

  const handleExport = () => {
    const data = `Analysis for ${book?.title || 'Draft'}\n\nWord Count: ${stats.wordCount}\nSentences: ${stats.sentenceCount}\nAvg Sentence Length: ${stats.avgSentenceLength} words\nReading Time: ${stats.readingTime} min\n`;
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ResponseComponent = activeAction ? responses[activeAction] : null;

  if (!book) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        No active book selected.
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left pane — Draft */}
      <div className="w-1/2 border-r border-border-color overflow-y-auto p-8 relative">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
                Draft
              </h2>
              <p className="text-xs text-muted">
                Read-only manuscript preview
              </p>
            </div>
            <div className="flex bg-surface border border-border-color rounded-full p-1 shadow-sm">
              <button onClick={() => setAnnotationMode('none')} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${annotationMode === 'none' ? 'bg-accent text-white' : 'text-muted hover:text-foreground'}`}>Clean</button>
              <button onClick={() => setAnnotationMode('adverbs')} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${annotationMode === 'adverbs' ? 'bg-amber-500/20 text-amber-400' : 'text-muted hover:text-foreground'}`}>Adverbs</button>
              <button onClick={() => setAnnotationMode('passive')} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors ${annotationMode === 'passive' ? 'bg-rose-500/20 text-rose-400' : 'text-muted hover:text-foreground'}`}>Passive</button>
            </div>
          </div>

          {paragraphs.map((text, i) => (
            <motion.p
              key={`p-${i}-${text.slice(0, 20)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="font-serif text-base leading-relaxed mb-4 text-foreground/80"
            >
              {renderAnnotatedText(text)}
            </motion.p>
          ))}
          <div className="h-32" />
        </div>
      </div>

      {/* Right pane — AI Analysis */}
      <div className="w-1/2 overflow-y-auto p-8 bg-surface/30">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-accent">
                  <SparkleIcon />
                </span>
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  AI Analysis
                </h2>
              </div>
              <p className="text-xs text-muted">
                Structural and thematic feedback
              </p>
            </div>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border-color text-xs font-medium text-muted hover:text-foreground hover:bg-background transition-colors"
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="emerald" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                  Export Stats
                </>
              )}
            </button>
          </div>

          {/* Client-Side Stats */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            <div className="p-3 bg-background border border-border-color rounded-xl flex flex-col justify-center text-center shadow-sm">
              <span className="text-xl font-bold text-foreground font-serif">{stats.wordCount.toLocaleString()}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Words</span>
            </div>
            <div className="p-3 bg-background border border-border-color rounded-xl flex flex-col justify-center text-center shadow-sm">
              <span className="text-xl font-bold text-foreground font-serif">{stats.sentenceCount.toLocaleString()}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Sentences</span>
            </div>
            <div className="p-3 bg-background border border-border-color rounded-xl flex flex-col justify-center text-center shadow-sm">
              <span className="text-xl font-bold text-foreground font-serif">{stats.avgSentenceLength}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Avg Words/Sent</span>
            </div>
            <div className="p-3 bg-background border border-border-color rounded-xl flex flex-col justify-center text-center shadow-sm">
              <span className="text-xl font-bold text-foreground font-serif">{stats.readingTime}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Min Read</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 mb-8">
            {actions.map((action) => {
              const isActive = activeAction === action.key;
              return (
                <motion.button
                  key={action.key}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() =>
                    setActiveAction(isActive ? null : action.key)
                  }
                  className={`w-full p-4 rounded-xl border text-left group transition-all duration-300 ${
                    isActive
                      ? "border-accent/50 bg-accent/5"
                      : "border-border-color bg-surface hover:border-accent/30 hover:bg-accent/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{action.icon}</span>
                    <div>
                      <p
                        className={`font-medium transition-colors duration-300 ${
                          isActive ? "text-accent" : "text-foreground group-hover:text-accent"
                        }`}
                      >
                        {action.title}
                      </p>
                      <p className="text-sm text-muted mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* AI response */}
          <AnimatePresence mode="wait">
            {activeAction && ResponseComponent && (
              <motion.div
                key={activeAction}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="p-5 rounded-xl border border-border-color bg-background"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-accent">
                    Analysis Result
                  </span>
                  <span className="flex-1 h-px bg-border-color" />
                </div>
                <ResponseComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
