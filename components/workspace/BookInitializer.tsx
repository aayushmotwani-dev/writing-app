"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function BookInitializer({ bookId }: { bookId: string }) {
  const setActiveBook = useAppStore((s) => s.setActiveBook);

  useEffect(() => {
    if (bookId) {
      setActiveBook(bookId);
    }

    return () => {
      // Prevent race conditions on rapid navigation
      useAppStore.setState((state) => {
        if (state.activeBookId === bookId) {
          return { activeBookId: null };
        }
        return state;
      });
    };
  }, [bookId, setActiveBook]);

  return null;
}
