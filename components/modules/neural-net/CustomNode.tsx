"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { useAppStore } from "@/store/useAppStore";

interface CustomNodeData {
  label: string;
  color: string;
  bookId: string;
  imageUrl?: string;
  description?: string;
  [key: string]: unknown;
}

type CustomNodeType = Node<CustomNodeData, 'custom'>;

export default function CustomNode({ id, data }: NodeProps<CustomNodeType>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState(data.imageUrl || "");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState(data.description || "");
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const bookId = data.bookId;
  const color = data.color;
  const imageUrl = data.imageUrl;
  const description = data.description;

  const renameNode = useAppStore((s) => s.renameNode);
  const removeNeuralNode = useAppStore((s) => s.removeNeuralNode);
  const updateNodeImage = useAppStore((s) => s.updateNodeImage);
  const updateNodeColor = useAppStore((s) => s.updateNodeColor);
  const updateNodeDescription = useAppStore((s) => s.updateNodeDescription);

  const colors = ["#f59e0b", "#8b5cf6", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#8b5cf6", "#14b8a6", "#64748b", "#f43f5e"];

  const [prevData, setPrevData] = useState({ label: data.label, imageUrl: data.imageUrl, description: data.description });

  if (data.label !== prevData.label || data.imageUrl !== prevData.imageUrl || data.description !== prevData.description) {
    setEditLabel(data.label);
    setEditImageUrl(data.imageUrl || "");
    setEditDesc(data.description || "");
    setPrevData({ label: data.label, imageUrl: data.imageUrl, description: data.description });
  }

  const handleRenameSubmit = () => {
    if (editLabel.trim() && editLabel !== data.label) {
      renameNode(bookId, id, editLabel.trim());
    } else {
      setEditLabel(data.label);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRenameSubmit();
    else if (e.key === "Escape") {
      setEditLabel(data.label);
      setIsEditing(false);
    }
  };

  const handleAddImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingImage(true);
  };

  const handleImageSubmit = () => {
    if (editImageUrl.trim() !== (imageUrl || "")) {
      updateNodeImage(bookId, id, editImageUrl.trim());
    }
    setIsEditingImage(false);
  };

  const handleDescSubmit = () => {
    if (editDesc.trim() !== (description || "")) {
      updateNodeDescription(bookId, id, editDesc.trim());
    }
    setIsEditingDesc(false);
  };

  return (
    <div className="relative group min-w-[140px]">
      {/* 4-Sided Easy Handles */}
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        className="!w-full !h-2 !bg-accent/0 !border-0 !rounded-none !top-[-4px] hover:!bg-accent/40 transition-colors"
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        className="!w-full !h-2 !bg-accent/0 !border-0 !rounded-none !bottom-[-4px] hover:!bg-accent/40 transition-colors"
      />
      <Handle
        type="source"
        id="left"
        position={Position.Left}
        className="!h-full !w-2 !bg-accent/0 !border-0 !rounded-none !left-[-4px] hover:!bg-accent/40 transition-colors"
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        className="!h-full !w-2 !bg-accent/0 !border-0 !rounded-none !right-[-4px] hover:!bg-accent/40 transition-colors"
      />

      {/* Delete Button (visible on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeNeuralNode(bookId, id);
        }}
        className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md hover:bg-red-600 cursor-pointer"
        title="Delete Node"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Add Image Button (visible on hover if no image exists) */}
      {!imageUrl && !isEditingImage && (
        <button
          onClick={handleAddImage}
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-surface/80 border border-border-color text-muted flex items-center justify-center
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-sm hover:text-foreground cursor-pointer"
          title="Add Image"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
      )}

      {/* Main Card */}
      <div
        className="bg-surface border-2 rounded-xl shadow-lg flex flex-col group/card relative
                   hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        style={{
          borderColor: color,
          boxShadow: `0 0 16px ${color}22, 0 4px 12px rgba(0,0,0,0.15)`,
        }}
      >
        {/* Pulsing glow background */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${color}22`
          }}
        />

        {/* Image Section */}
        {isEditingImage ? (
          <div className="p-2 border-b border-border-color bg-background/90" onDoubleClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              type="text"
              placeholder="Paste Image URL"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              onBlur={handleImageSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleImageSubmit();
                else if (e.key === "Escape") setIsEditingImage(false);
              }}
              className="text-xs font-sans text-foreground bg-surface border border-border-color rounded px-2 py-1 w-full outline-none focus:border-accent"
            />
          </div>
        ) : imageUrl ? (
          <div className="relative group/image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Node reference" className="w-full h-24 object-cover" />
            <button
              onClick={handleAddImage}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          </div>
        ) : null}

        {/* Text Section */}
        <div className="px-4 py-3 flex flex-col gap-2 relative z-10 bg-surface/80 backdrop-blur-sm">
          <div className="flex items-center gap-2" onDoubleClick={() => setIsEditing(true)}>
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 cursor-pointer relative"
              style={{ backgroundColor: color }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              {/* Color Picker Palette */}
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 bg-surface border border-border-color p-2 rounded-lg shadow-xl grid grid-cols-5 gap-1 z-50">
                  {colors.map(c => (
                    <button
                      key={c}
                      className="w-4 h-4 rounded-full border border-black/20 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                      onClick={(e) => { e.stopPropagation(); updateNodeColor(bookId, id, c); setShowColorPicker(false); }}
                    />
                  ))}
                </div>
              )}
            </div>
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleKeyDown}
                className="text-sm font-sans font-medium text-foreground bg-background/90 border border-accent rounded px-1.5 w-full outline-none"
              />
            ) : (
              <span className="text-sm font-sans font-medium text-foreground pointer-events-none select-none">
                {data.label}
              </span>
            )}
          </div>
          
          {/* Description Section */}
          <div onDoubleClick={() => setIsEditingDesc(true)} className="mt-1 min-h-[20px]">
            {isEditingDesc ? (
              <textarea
                autoFocus
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                onBlur={handleDescSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setEditDesc(description || ""); setIsEditingDesc(false); }
                }}
                placeholder="Description..."
                className="text-xs font-sans text-muted bg-background/90 border border-border-color rounded px-1.5 py-1 w-full outline-none focus:border-accent resize-none custom-scrollbar"
                rows={3}
              />
            ) : (
              <p className={`text-xs font-sans ${description ? 'text-muted' : 'text-muted/30 italic'} select-none`}>
                {description || "Double-click to add notes..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
