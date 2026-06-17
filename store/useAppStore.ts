import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  mockBooks,
  type Book,
  type Character,
  type Reference,
  type BlueprintAct,
  type BeatCard,
  type NeuralNode,
  type NeuralEdge,
  type Snippet,
  type ModuleType
} from '@/data/mockData';

export type { Book, Character, Reference, BlueprintAct, BeatCard, NeuralNode, NeuralEdge, Snippet, ModuleType };

interface AppState {
  books: Book[];
  activeBookId: string | null;
  activeModule: ModuleType;
  focusMode: boolean;
  codexOpen: boolean;
  lookbookFlyoutId: string | null;
  isSpotifyOpen: boolean;
  spotifyUrl: string;
  settingsOpen: boolean;
  editorSettings: {
    fontSize: string;
    lineSpacing: string;
    focusIntensity: number;
    fontFamily: string;
    editorWidth: string;
    showAutoSave: boolean;
    typewriterScroll: boolean;
    sessionGoal: number;
  };

  // Actions
  setActiveBook: (id: string | null) => void;
  setActiveModule: (module: ModuleType) => void;
  toggleFocusMode: () => void;
  toggleCodex: () => void;
  setLookbookFlyout: (id: string | null) => void;
  toggleSpotify: () => void;
  setSpotifyUrl: (url: string) => void;
  toggleSettings: () => void;
  updateEditorSettings: (settings: Partial<AppState['editorSettings']>) => void;
  getActiveBook: () => Book | undefined;
  addSnippet: (bookId: string, snippet: Snippet) => void;
  addNeuralNode: (bookId: string, node: NeuralNode) => void;
  setNeuralNodes: (bookId: string, nodes: NeuralNode[]) => void;
  updateNodeImage: (bookId: string, nodeId: string, imageUrl: string) => void;
  addNeuralEdge: (bookId: string, edge: NeuralEdge) => void;
  updateNeuralEdge: (bookId: string, edgeId: string, source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null) => void;
  updateEdgeControlPoint: (bookId: string, edgeId: string, controlPoint: { x: number; y: number } | null) => void;
  updateEdgeLabel: (bookId: string, edgeId: string, label: string) => void;
  removeNeuralNode: (bookId: string, nodeId: string) => void;
  removeNeuralEdge: (bookId: string, edgeId: string) => void;
  addBook: () => string;

  deleteBook: (bookId: string) => void;
  renameBook: (bookId: string, newTitle: string) => void;
  duplicateBook: (bookId: string) => void;

  updateSandboxSnippet: (bookId: string, snippetId: string, text: string) => void;
  deleteSnippet: (bookId: string, snippetId: string) => void;
  toggleSnippetPin: (bookId: string, snippetId: string) => void;

  updateNodePosition: (bookId: string, nodeId: string, x: number, y: number) => void;
  renameNode: (bookId: string, nodeId: string, newLabel: string) => void;
  updateNodeColor: (bookId: string, nodeId: string, color: string) => void;
  updateNodeDescription: (bookId: string, nodeId: string, description: string) => void;

  setStructurePreset: (bookId: string, presetType: '3-act' | '5-act' | 'custom') => void;
  addCustomAct: (bookId: string, title: string) => void;
  deleteAct: (bookId: string, actId: string) => void;
  renameAct: (bookId: string, actId: string, newTitle: string) => void;
  addBeatCard: (bookId: string, actId: string) => void;
  updateBeatCard: (bookId: string, beatId: string, updates: Partial<Omit<BeatCard, 'id' | 'actId'>>) => void;
  deleteBeatCard: (bookId: string, beatId: string) => void;
  moveBeatCard: (bookId: string, beatId: string, targetActId: string) => void;
  reorderBeatCards: (bookId: string, sourceActId: string, destinationActId: string, sourceIndex: number, destinationIndex: number, beatId: string) => void;

  updateTypewriterText: (bookId: string, text: string) => void;

  updateReferenceNotes: (bookId: string, referenceId: string, notes: string) => void;
  addReference: (bookId: string, reference: Reference) => void;
  deleteReference: (bookId: string, referenceId: string) => void;
  loadExampleBooks: () => void;
}

const updateBook = (state: AppState, bookId: string, updater: (book: Book) => Partial<Book>): Partial<AppState> => ({
  books: state.books.map((b) =>
    b.id === bookId ? { ...b, ...updater(b), lastEdited: new Date().toISOString() } : b
  ),
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      books: [],
      activeBookId: null,
      activeModule: 'sandbox',
      focusMode: false,
      codexOpen: false,
      lookbookFlyoutId: null,
      isSpotifyOpen: false,
      spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ", // Deep Focus default
  settingsOpen: false,
  editorSettings: {
    fontSize: "text-lg",
    lineSpacing: "leading-relaxed",
    focusIntensity: 70, // percentage of dimming
    fontFamily: "font-serif",
    editorWidth: "max-w-[70ch]",
    showAutoSave: true,
    typewriterScroll: false,
    sessionGoal: 500,
  },

  setActiveBook: (id) => set({ activeBookId: id }),
  setActiveModule: (module) => set({ activeModule: module }),
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
  toggleCodex: () => set((s) => ({ codexOpen: !s.codexOpen })),
  setLookbookFlyout: (id) => set({ lookbookFlyoutId: id }),
  toggleSpotify: () => set((s) => ({ isSpotifyOpen: !s.isSpotifyOpen })),
  setSpotifyUrl: (url) => set({ spotifyUrl: url }),
  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),
  updateEditorSettings: (settings) => set((s) => ({ editorSettings: { ...s.editorSettings, ...settings } })),
  
  getActiveBook: () => {
    const state = get();
    const book = state.books.find((b) => b.id === state.activeBookId);
    return book ?? state.books[0] ?? undefined;
  },

  addSnippet: (bookId, snippet) =>
    set((state) => updateBook(state, bookId, (b) => ({ snippets: [snippet, ...b.snippets] }))),

  addNeuralNode: (bookId, node) =>
    set((state) => updateBook(state, bookId, (b) => ({ neuralNodes: [...b.neuralNodes, node] }))),

  addBook: () => {
    const newBookId = crypto.randomUUID();
    const newBook: Book = {
      id: newBookId,
      title: "Untitled Draft",
      genre: "Unspecified",
      synopsis: "",
      lastEdited: new Date().toISOString(),
      coverGradient: "linear-gradient(to bottom right, #4b5563, #000000)",
      activeStructure: 'custom',
      acts: [],
      beats: [],
      characters: [],
      snippets: [],
      references: [],
      neuralNodes: [],
      neuralEdges: [],
      manuscript: "",
    };

    set((state) => ({
      books: [newBook, ...state.books],
    }));

    return newBookId;
  },

  deleteBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((b) => b.id !== bookId),
      activeBookId: state.activeBookId === bookId ? null : state.activeBookId,
    })),

  renameBook: (bookId, newTitle) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId ? { ...b, title: newTitle, lastEdited: new Date().toISOString() } : b
      ),
    })),

  duplicateBook: (bookId) => {
    set((state) => {
      const bookToCopy = state.books.find((b) => b.id === bookId);
      if (!bookToCopy) return state;

      // Deep copy with a new ID
      const newBook: Book = JSON.parse(JSON.stringify(bookToCopy));
      newBook.id = crypto.randomUUID();
      newBook.title = `${newBook.title} (Copy)`;
      newBook.lastEdited = new Date().toISOString();

      return {
        books: [newBook, ...state.books],
      };
    });
  },

  updateSandboxSnippet: (bookId, snippetId, text) =>
    set((state) => updateBook(state, bookId, (b) => ({
      snippets: b.snippets.map((s) => s.id === snippetId ? { ...s, content: text } : s)
    }))),

  deleteSnippet: (bookId, snippetId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      snippets: b.snippets.filter((s) => s.id !== snippetId)
    }))),

  toggleSnippetPin: (bookId, snippetId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      snippets: b.snippets.map((s) => s.id === snippetId ? { ...s, pinned: !s.pinned } : s)
    }))),

  updateNodePosition: (bookId, nodeId, x, y) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralNodes: b.neuralNodes.map((n) => n.id === nodeId ? { ...n, x, y } : n)
    }))),

  setNeuralNodes: (bookId, nodes) =>
    set((state) => updateBook(state, bookId, () => ({ neuralNodes: nodes }))),

  updateNodeImage: (bookId, nodeId, imageUrl) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralNodes: b.neuralNodes.map((n) => n.id === nodeId ? { ...n, imageUrl } : n)
    }))),

  addNeuralEdge: (bookId, edge) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralEdges: [...b.neuralEdges, edge]
    }))),

  updateNeuralEdge: (bookId, edgeId, source, target, sourceHandle, targetHandle) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralEdges: b.neuralEdges.map((e) => e.id === edgeId ? { ...e, source, target, sourceHandle, targetHandle } : e)
    }))),

  updateEdgeControlPoint: (bookId, edgeId, controlPoint) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralEdges: b.neuralEdges.map((e) => e.id === edgeId ? { ...e, controlPoint: controlPoint || undefined } : e)
    }))),

  updateEdgeLabel: (bookId, edgeId, label) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralEdges: b.neuralEdges.map((e) => e.id === edgeId ? { ...e, label } : e)
    }))),

  removeNeuralNode: (bookId, nodeId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralNodes: b.neuralNodes.filter((n) => n.id !== nodeId),
      neuralEdges: b.neuralEdges.filter((e) => e.source !== nodeId && e.target !== nodeId)
    }))),

  removeNeuralEdge: (bookId, edgeId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralEdges: b.neuralEdges.filter((e) => e.id !== edgeId)
    }))),

  renameNode: (bookId, nodeId, newLabel) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralNodes: b.neuralNodes.map((n) => n.id === nodeId ? { ...n, label: newLabel } : n)
    }))),

  updateNodeColor: (bookId, nodeId, color) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralNodes: b.neuralNodes.map((n) => (n.id === nodeId ? { ...n, color } : n))
    }))),

  updateNodeDescription: (bookId, nodeId, description) =>
    set((state) => updateBook(state, bookId, (b) => ({
      neuralNodes: b.neuralNodes.map((n) => (n.id === nodeId ? { ...n, description } : n))
    }))),

  // ACTS & BEATS
  setStructurePreset: (bookId, presetType) =>
    set((state) => ({
      books: state.books.map((b) => {
        if (b.id !== bookId) return b;
        let newActs: BlueprintAct[] = [];
        if (presetType === '3-act') {
          newActs = [
            { id: 'act-1', title: 'Act I' },
            { id: 'act-2', title: 'Act II' },
            { id: 'act-3', title: 'Act III' },
          ];
        } else if (presetType === '5-act') {
          newActs = [
            { id: 'act-1', title: 'Act I' },
            { id: 'act-2a', title: 'Act IIa' },
            { id: 'act-2b', title: 'Act IIb' },
            { id: 'act-3', title: 'Act III' },
            { id: 'act-4', title: 'Act IV' },
          ];
        } else {
          newActs = [];
        }
        const newActIds = new Set(newActs.map(a => a.id));
        return { ...b, activeStructure: presetType, acts: newActs, beats: b.beats.filter(bt => newActIds.has(bt.actId)), lastEdited: new Date().toISOString() };
      }),
    })),

  addCustomAct: (bookId, title) =>
    set((state) => updateBook(state, bookId, (b) => ({
      acts: [...b.acts, { id: `act-${crypto.randomUUID()}`, title }]
    }))),

  deleteAct: (bookId, actId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      acts: b.acts.filter((a) => a.id !== actId),
      beats: b.beats.filter((bt) => bt.actId !== actId)
    }))),

  renameAct: (bookId, actId, newTitle) =>
    set((state) => updateBook(state, bookId, (b) => ({
      acts: b.acts.map((a) => (a.id === actId ? { ...a, title: newTitle } : a))
    }))),

  addBeatCard: (bookId, actId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      beats: [...b.beats, { id: `beat-${crypto.randomUUID()}`, actId, title: 'New Beat', description: '' }]
    }))),

  updateBeatCard: (bookId, beatId, updates) =>
    set((state) => updateBook(state, bookId, (b) => ({
      beats: b.beats.map((bt) => (bt.id === beatId ? { ...bt, ...updates } : bt))
    }))),

  deleteBeatCard: (bookId, beatId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      beats: b.beats.filter((bt) => bt.id !== beatId)
    }))),

  moveBeatCard: (bookId, beatId, targetActId) =>
    set((state) => updateBook(state, bookId, (b) => ({
      beats: b.beats.map((bt) => (bt.id === beatId ? { ...bt, actId: targetActId } : bt))
    }))),

  reorderBeatCards: (bookId, sourceActId, destinationActId, sourceIndex, destinationIndex, beatId) =>
    set((state) => ({
      books: state.books.map((b) => {
        if (b.id !== bookId) return b;
        const newBeats = [...b.beats];
        const targetBeatIndex = newBeats.findIndex((bt) => bt.id === beatId);
        if (targetBeatIndex === -1) return b;

        const [removed] = newBeats.splice(targetBeatIndex, 1);
        const movedBeat = { ...removed, actId: destinationActId };

        const destBeats = newBeats.filter((bt) => bt.actId === destinationActId);
        if (destinationIndex >= destBeats.length) {
          // append at the very end of the global array
          newBeats.push(movedBeat);
        } else {
          // insert before the item currently at destinationIndex
          const itemAtIndex = destBeats[destinationIndex];
          const globalInsertIndex = newBeats.findIndex((bt) => bt.id === itemAtIndex.id);
          newBeats.splice(globalInsertIndex, 0, movedBeat);
        }

        return { ...b, beats: newBeats, lastEdited: new Date().toISOString() };
      }),
    })),

  updateTypewriterText: (bookId, text) =>
    set((state) => updateBook(state, bookId, () => ({ manuscript: text }))),

  updateReferenceNotes: (bookId, referenceId, notes) =>
    set((state) => updateBook(state, bookId, (b) => ({
      references: b.references.map((r) => r.id === referenceId ? { ...r, notes } : r)
    }))),

  addReference: (bookId, reference) =>
    set((state) => updateBook(state, bookId, (b) => ({
      references: [reference, ...b.references]
    }))),

  deleteReference: (bookId, referenceId) =>
    set((state) => ({
      books: state.books.map((b) =>
        b.id === bookId
          ? {
              ...b,
              references: b.references.filter((r) => r.id !== referenceId),
              lastEdited: new Date().toISOString(),
            }
          : b
      ),
      lookbookFlyoutId: state.lookbookFlyoutId === referenceId ? null : state.lookbookFlyoutId,
    })),

  loadExampleBooks: () => set((state) => {
    // Only add examples that don't already exist
    const existingIds = new Set(state.books.map(b => b.id));
    const newBooks = mockBooks.filter(b => !existingIds.has(b.id));
    return { books: [...state.books, ...newBooks] };
  }),
  }),
  {
    name: 'manuscripta-storage',
  }
));
