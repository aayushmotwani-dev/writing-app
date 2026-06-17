"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

const fontSizes = [
  { label: "Small", value: "text-base" },
  { label: "Medium", value: "text-lg" },
  { label: "Large", value: "text-xl" },
  { label: "Extra Large", value: "text-2xl" },
];

const lineSpacings = [
  { label: "Tight", value: "leading-snug" },
  { label: "Normal", value: "leading-relaxed" },
  { label: "Loose", value: "leading-loose" },
];

const fontFamilies = [
  { label: "Serif", value: "font-serif" },
  { label: "Sans", value: "font-sans" },
  { label: "Mono", value: "font-mono" },
];

const editorWidths = [
  { label: "Narrow", value: "max-w-3xl" },
  { label: "Medium", value: "max-w-4xl" },
  { label: "Wide", value: "max-w-5xl" },
];

export default function SettingsModal() {
  const isOpen = useAppStore((s) => s.settingsOpen);
  const toggleSettings = useAppStore((s) => s.toggleSettings);
  const editorSettings = useAppStore((s) => s.editorSettings);
  const updateEditorSettings = useAppStore((s) => s.updateEditorSettings);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") toggleSettings();
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleSettings}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-surface border border-border-color rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border-color flex items-center justify-between bg-surface/50">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Workspace Settings</h2>
              <button
                onClick={toggleSettings}
                className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-background transition-colors"
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[75vh]">
              
              {/* Font Family */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Editor Font Family</label>
                <div className="grid grid-cols-3 gap-2">
                  {fontFamilies.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => updateEditorSettings({ fontFamily: font.value })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        editorSettings.fontFamily === font.value
                          ? "bg-accent/10 border-accent/50 text-accent"
                          : "border-border-color text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Editor Font Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => updateEditorSettings({ fontSize: size.value })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        editorSettings.fontSize === size.value
                          ? "bg-accent/10 border-accent/50 text-accent"
                          : "border-border-color text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Spacing */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Line Spacing</label>
                <div className="grid grid-cols-3 gap-2">
                  {lineSpacings.map((spacing) => (
                    <button
                      key={spacing.value}
                      onClick={() => updateEditorSettings({ lineSpacing: spacing.value })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        editorSettings.lineSpacing === spacing.value
                          ? "bg-accent/10 border-accent/50 text-accent"
                          : "border-border-color text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {spacing.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Width */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Editor Width</label>
                <div className="grid grid-cols-3 gap-2">
                  {editorWidths.map((width) => (
                    <button
                      key={width.value}
                      onClick={() => updateEditorSettings({ editorWidth: width.value })}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        editorSettings.editorWidth === width.value
                          ? "bg-accent/10 border-accent/50 text-accent"
                          : "border-border-color text-muted hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {width.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">Writing Preferences</label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-muted">Typewriter Scroll Mode</span>
                  <input 
                    type="checkbox" 
                    checked={editorSettings.typewriterScroll} 
                    onChange={(e) => updateEditorSettings({ typewriterScroll: e.target.checked })} 
                    className="accent-accent w-4 h-4 cursor-pointer rounded border-border-color bg-surface"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-muted">Show Auto-Save Indicator</span>
                  <input 
                    type="checkbox" 
                    checked={editorSettings.showAutoSave} 
                    onChange={(e) => updateEditorSettings({ showAutoSave: e.target.checked })} 
                    className="accent-accent w-4 h-4 cursor-pointer rounded border-border-color bg-surface"
                  />
                </label>
              </div>

              {/* Session Goal */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Session Word Goal</label>
                <input 
                  type="number" 
                  value={editorSettings.sessionGoal} 
                  onChange={(e) => updateEditorSettings({ sessionGoal: parseInt(e.target.value) || 0 })}
                  className="w-full bg-background border border-border-color rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              {/* Focus Mode Intensity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Focus Mode Dimming</label>
                  <span className="text-xs text-muted font-mono">{editorSettings.focusIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="10"
                  value={editorSettings.focusIntensity}
                  onChange={(e) => updateEditorSettings({ focusIntensity: parseInt(e.target.value) })}
                  className="w-full accent-accent bg-border-color h-2 rounded-full appearance-none outline-none"
                />
                <p className="text-[11px] text-muted leading-relaxed">
                  Adjust how much the surrounding paragraphs fade out when you enter Focus Mode.
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
