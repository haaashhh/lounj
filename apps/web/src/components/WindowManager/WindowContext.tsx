"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  WindowData,
  WindowManagerContextType,
  WindowState,
  WindowBounds,
} from "./types";
import { DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT } from "./types";

const WindowManagerContext = createContext<WindowManagerContextType | null>(
  null
);

const STORAGE_KEY = "windowscape-windows";

export function WindowManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1000);

  // Load windows from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Don't restore minimized/maximized states
        const restored = parsed.map((w: WindowData) => ({
          ...w,
          state: "normal" as WindowState,
          isActive: false,
        }));
        setWindows(restored);
      } catch (error) {
        console.error("Failed to restore windows:", error);
      }
    }
  }, []);

  // Save windows to localStorage
  useEffect(() => {
    if (windows.length > 0) {
      // Only save positions and sizes, not state
      const toSave = windows.map((w) => ({
        ...w,
        state: "normal" as WindowState,
        isActive: false,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [windows]);

  const addWindow = useCallback(
    (windowData: Omit<WindowData, "id" | "zIndex" | "isActive">) => {
      const id = `window-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const newWindow: WindowData = {
        ...windowData,
        id,
        zIndex: nextZIndex,
        isActive: true,
        bounds: {
          x: windowData.bounds?.x ?? 100 + windows.length * 30,
          y: windowData.bounds?.y ?? 100 + windows.length * 30,
          width: windowData.bounds?.width ?? DEFAULT_WINDOW_WIDTH,
          height: windowData.bounds?.height ?? DEFAULT_WINDOW_HEIGHT,
        },
      };

      setWindows((prev) =>
        prev.map((w) => ({ ...w, isActive: false })).concat(newWindow)
      );
      setActiveWindowId(id);
      setNextZIndex((z) => z + 1);
    },
    [nextZIndex, windows.length]
  );

  const removeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId(null);
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                zIndex: nextZIndex,
                isActive: true,
                state: w.state === "minimized" ? "normal" : w.state,
              }
            : { ...w, isActive: false }
        )
      );
      setActiveWindowId(id);
      setNextZIndex((z) => z + 1);
    },
    [nextZIndex]
  );

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, state: "minimized", isActive: false } : w
      )
    );
    setActiveWindowId(null);
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, state: "maximized" } : w))
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, state: "normal" } : w))
    );
  }, []);

  const updateWindowBounds = useCallback(
    (id: string, bounds: Partial<WindowBounds>) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, bounds: { ...w.bounds, ...bounds } } : w
        )
      );
    },
    []
  );

  const updateWindowState = useCallback((id: string, state: WindowState) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, state } : w)));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        addWindow,
        removeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        updateWindowBounds,
        updateWindowState,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within WindowManagerProvider"
    );
  }
  return context;
}
