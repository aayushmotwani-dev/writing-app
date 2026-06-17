"use client";

import { useMemo, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppStore, type NeuralNode, type NeuralEdge } from "@/store/useAppStore";
import dagre from "dagre";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  ConnectionMode,
  MiniMap,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomNode from "./neural-net/CustomNode";
import CustomEdge from "./neural-net/CustomEdge";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// -----------------------------------------------------------------------------
// Layout Utility
// -----------------------------------------------------------------------------
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // TB = Top to Bottom layout.
  // Add some spacing between nodes
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 200, ranksep: 250 });

  nodes.forEach((node) => {
    // Estimated width and height of our custom cards
    dagreGraph.setNode(node.id, { width: 180, height: 140 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        // We shift by half the width/height because dagre calculates the center
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 70,
      },
    };
  });

  return newNodes;
};

// -----------------------------------------------------------------------------
// Canvas Content
// -----------------------------------------------------------------------------
function NeuralCanvas() {
  const book = useAppStore((s) => s.getActiveBook());
  const bookId = book?.id || '';


  const updateNodePosition = useAppStore((s) => s.updateNodePosition);
  const addNeuralNode = useAppStore((s) => s.addNeuralNode);
  const addNeuralEdge = useAppStore((s) => s.addNeuralEdge);
  const removeNeuralEdge = useAppStore((s) => s.removeNeuralEdge);
  const removeNeuralNode = useAppStore((s) => s.removeNeuralNode);
  const updateNeuralEdge = useAppStore((s) => s.updateNeuralEdge);
  const setNeuralNodes = useAppStore((s) => s.setNeuralNodes);

  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();

  // Map Zustand state to React Flow state
  const initialNodes: Node[] = useMemo(() => {
    return (book?.neuralNodes || []).map((n) => ({
      id: n.id,
      type: "custom",
      position: { x: n.x, y: n.y },
      data: { 
        label: n.label, 
        color: n.color, 
        imageUrl: n.imageUrl, 
        bookId: bookId 
      },
    }));
  }, [book?.neuralNodes, bookId]);

  const initialEdges: Edge[] = useMemo(() => {
    return (book?.neuralEdges || []).map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      type: "custom",
      animated: true,
      reconnectable: true,
      data: {
        label: e.label,
        bookId: bookId,
        controlPoint: e.controlPoint,
      },
      style: { strokeWidth: 2, stroke: "var(--color-accent)" },
    }));
  }, [book?.neuralEdges, bookId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const neuralNodesLength = book?.neuralNodes?.length || 0;
  const neuralEdgesLength = book?.neuralEdges?.length || 0;
  const prevNodeCount = useRef(neuralNodesLength);
  const prevEdgeCount = useRef(neuralEdgesLength);

  useEffect(() => {
    if (neuralNodesLength !== prevNodeCount.current) {
      setNodes(initialNodes);
      prevNodeCount.current = neuralNodesLength;
    }
  }, [neuralNodesLength, initialNodes, setNodes]);

  useEffect(() => {
    if (neuralEdgesLength !== prevEdgeCount.current) {
      setEdges(initialEdges);
      prevEdgeCount.current = neuralEdgesLength;
    }
  }, [neuralEdgesLength, initialEdges, setEdges]);

  // Handle Drag Stop to persist positions to Zustand
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateNodePosition(bookId, node.id, node.position.x, node.position.y);
    },
    [bookId, updateNodePosition]
  );

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: NeuralEdge = {
        id: `edge-${crypto.randomUUID()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };
      addNeuralEdge(bookId, newEdge);
    },
    [bookId, addNeuralEdge]
  );

  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  // Handle re-connections (moving a wire)
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
      
      updateNeuralEdge(
        bookId,
        oldEdge.id,
        newConnection.source,
        newConnection.target,
        newConnection.sourceHandle,
        newConnection.targetHandle
      );
    },
    [bookId, updateNeuralEdge, setEdges]
  );

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        removeNeuralEdge(bookId, edge.id);
      }
      edgeReconnectSuccessful.current = true;
    },
    [bookId, removeNeuralEdge, setEdges]
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      for (const edge of deletedEdges) {
        removeNeuralEdge(bookId, edge.id);
      }
    },
    [bookId, removeNeuralEdge]
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      for (const node of deletedNodes) {
        removeNeuralNode(bookId, node.id);
      }
    },
    [bookId, removeNeuralNode]
  );

  const handleAddNode = () => {
    const colors = ["#f59e0b", "#8b5cf6", "#10b981", "#ef4444", "#3b82f6", "#ec4899"];
    const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    
    const newNode: NeuralNode = {
      id: `node-${crypto.randomUUID()}`,
      label: "New Node",
      x: center.x,
      y: center.y,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    addNeuralNode(bookId, newNode);
  };

  const handleAutoSort = () => {
    const layoutedNodes = getLayoutedElements(nodes, edges);
    
    // Update local React Flow state instantly so UI doesn't ignore the layout
    setNodes(layoutedNodes);
    
    // Save new positions to the global store immediately
    const updatedNeuralNodes = (book?.neuralNodes || []).map(n => {
      const layoutedNode = layoutedNodes.find(ln => ln.id === n.id);
      if (layoutedNode) {
        return {
          ...n,
          x: layoutedNode.position.x,
          y: layoutedNode.position.y,
        };
      }
      return n;
    });

    setNeuralNodes(bookId, updatedNeuralNodes);
    
    // Smoothly animate the view to fit the new layout
    setTimeout(() => {
      fitView({ duration: 800, padding: 0.3 });
    }, 50);
  };

  if (!book) {
    return (
      <div className="flex h-full items-center justify-center text-muted">
        No active book selected.
      </div>
    );
  }

  return (
    <div className="h-full w-full relative flex flex-col">
      {/* Top Header & Add Button */}
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight drop-shadow-md">
            Neural Net
          </h1>
          <p className="mt-1 text-sm text-muted font-sans drop-shadow-sm">
            Map your story&rsquo;s connective tissue
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }} className="mt-4 pointer-events-auto">
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg
                       bg-surface/80 backdrop-blur-md border border-border-color shadow-sm text-foreground text-sm font-sans font-medium
                       hover:bg-surface hover:border-accent/50 transition-all duration-300 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Node
          </button>
        </motion.div>
      </div>

      {/* Floating Control Overlay (Bottom Left) */}
      <div className="absolute bottom-8 left-8 z-50 flex items-center gap-2 bg-surface/80 backdrop-blur-md p-2 rounded-xl border border-border-color shadow-lg">
        {/* Auto Sort Button */}
        <button
          onClick={handleAutoSort}
          className="px-3 h-8 rounded flex items-center gap-2 text-xs font-medium text-accent hover:text-white hover:bg-accent transition-colors border border-accent/30"
          title="Auto Layout"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Auto Sort
        </button>
        <div className="w-px h-5 bg-border-color mx-1"></div>
        <button
          onClick={() => zoomIn({ duration: 300 })}
          className="w-8 h-8 rounded flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors"
          title="Zoom In"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button
          onClick={() => zoomOut({ duration: 300 })}
          className="w-8 h-8 rounded flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors"
          title="Zoom Out"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <div className="w-px h-5 bg-border-color mx-1"></div>
        <button
          onClick={() => fitView({ duration: 500, padding: 0.2 })}
          className="w-8 h-8 rounded flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors"
          title="Center Canvas"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
        <div className="w-px h-5 bg-border-color mx-1"></div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onEdgesDelete={onEdgesDelete}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesConnectable={true}
          connectionMode={ConnectionMode.Loose}
          elementsSelectable={true}
          deleteKeyCode={['Backspace', 'Delete']}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          className="bg-background"
        >
          <Background color="var(--color-muted)" gap={24} size={1} className="opacity-15" />
          <MiniMap 
            pannable
            zoomable
            nodeColor={(n) => n.data?.color as string || '#3b82f6'} 
            maskColor="rgba(0,0,0,0.5)"
            style={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Export (Wrapped with Provider)
// -----------------------------------------------------------------------------
export default function NeuralNet() {
  return (
    <ReactFlowProvider>
      <NeuralCanvas />
    </ReactFlowProvider>
  );
}
