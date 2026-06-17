"use client";

import { useState, useRef, useEffect } from "react";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow } from "@xyflow/react";
import { useAppStore } from "@/store/useAppStore";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const { screenToFlowPosition } = useReactFlow();
  
  const bookId = data?.bookId as string;
  
  // Read edge properties from global store to bypass React Flow's stale edge array during dragging
  const storeEdge = useAppStore((s) => s.books.find((b) => b.id === bookId)?.neuralEdges?.find((e) => e.id === id));
  
  const initialLabel = storeEdge?.label || (data?.label as string) || "";
  const savedControlPoint = storeEdge?.controlPoint || (data?.controlPoint as { x: number; y: number } | undefined);
  
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(initialLabel);
  const [prevInitialLabel, setPrevInitialLabel] = useState(initialLabel);
  const [activeControlPoint, setActiveControlPoint] = useState<{x: number, y: number} | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  if (initialLabel !== prevInitialLabel) {
    setLabel(initialLabel);
    setPrevInitialLabel(initialLabel);
  }

  useEffect(() => {
    return () => { cleanupRef.current?.(); };
  }, []);

  const updateEdgeLabel = useAppStore((s) => s.updateEdgeLabel);
  const removeNeuralEdge = useAppStore((s) => s.removeNeuralEdge);
  const updateEdgeControlPoint = useAppStore((s) => s.updateEdgeControlPoint);

  const handleBlur = () => {
    setIsEditing(false);
    if (label !== initialLabel) {
      updateEdgeLabel(bookId, id, label.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setLabel(initialLabel);
      setIsEditing(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isEditing) return;
    
    // Stop canvas panning
    e.stopPropagation();

    // Start Dragging
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const flowPos = screenToFlowPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
      setActiveControlPoint(flowPos);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      cleanupRef.current = null;
      
      const finalPos = screenToFlowPosition({ x: upEvent.clientX, y: upEvent.clientY });
      setActiveControlPoint(null);
      updateEdgeControlPoint(bookId, id, finalPos);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    cleanupRef.current = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  };

  // Determine the curve shape
  const cp = activeControlPoint || savedControlPoint;
  
  let finalEdgePath = "";
  let finalLabelX = 0;
  let finalLabelY = 0;

  if (cp) {
    // Custom Quadratic Bezier: M start Q controlPoint end
    finalEdgePath = `M ${sourceX} ${sourceY} Q ${cp.x} ${cp.y} ${targetX} ${targetY}`;
    // Midpoint of quadratic bezier at t=0.5
    finalLabelX = 0.25 * sourceX + 0.5 * cp.x + 0.25 * targetX;
    finalLabelY = 0.25 * sourceY + 0.5 * cp.y + 0.25 * targetY;
  } else {
    // Fallback standard curve
    const [path, lx, ly] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    finalEdgePath = path;
    finalLabelX = lx;
    finalLabelY = ly;
  }

  // Draw a subtle "guide line" from source -> cp -> target when dragging to look like a physics engine
  const isDragging = activeControlPoint !== null;

  return (
    <>
      <BaseEdge 
        path={finalEdgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: isDragging ? 3 : 2,
          opacity: isDragging ? 0.8 : 1,
          transition: isDragging ? "none" : "stroke-width 0.2s, opacity 0.2s"
        }} 
      />
      
      {/* Invisible wider path for grabbing the wire anywhere */}
      <path
        d={finalEdgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={30}
        onPointerDown={handlePointerDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', pointerEvents: 'stroke' }}
      />
      
      {/* Ghost Physics Lines while dragging */}
      {isDragging && cp && (
        <path
          d={`M ${sourceX} ${sourceY} L ${cp.x} ${cp.y} L ${targetX} ${targetY}`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="opacity-40"
        />
      )}

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${finalLabelX}px, ${finalLabelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan group flex items-center"
        >
          <div 
            onPointerDown={handlePointerDown}
            className={`bg-surface/80 backdrop-blur-md border border-border-color rounded-full px-2 py-0.5 shadow-sm flex items-center gap-1 transition-transform ${isDragging ? 'scale-110 shadow-md ring-2 ring-accent/50' : 'hover:scale-105'}`}
            style={{ cursor: isEditing ? 'text' : (isDragging ? 'grabbing' : 'grab') }}
          >
            {isEditing ? (
              <div className="flex flex-col items-center gap-1 p-1">
                <input
                  autoFocus
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="bg-background outline-none border border-border-color rounded py-0.5 text-[10px] font-sans text-foreground w-24 text-center"
                  placeholder="label..."
                />
                <div className="flex items-center gap-1" onMouseDown={e => e.preventDefault()}>
                  <button onClick={(e) => { e.stopPropagation(); updateEdgeLabel(bookId, id, "Conflict"); setIsEditing(false); }} className="text-[8px] uppercase tracking-wider bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded hover:bg-red-500/40">Conflict</button>
                  <button onClick={(e) => { e.stopPropagation(); updateEdgeLabel(bookId, id, "Ally"); setIsEditing(false); }} className="text-[8px] uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded hover:bg-emerald-500/40">Ally</button>
                  <button onClick={(e) => { e.stopPropagation(); updateEdgeLabel(bookId, id, "Theme"); setIsEditing(false); }} className="text-[8px] uppercase tracking-wider bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded hover:bg-amber-500/40">Theme</button>
                </div>
              </div>
            ) : (
              <span
                onDoubleClick={() => setIsEditing(true)}
                className={`text-[10px] font-sans px-1 select-none ${label ? 'text-foreground' : 'text-muted italic opacity-0 group-hover:opacity-100 transition-opacity'}`}
              >
                {label || "drag to curve"}
              </span>
            )}
            
            {/* Delete Edge Button */}
            {!isDragging && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNeuralEdge(bookId, id);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors ml-1"
                title="Delete Connection"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
