export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowBounds extends WindowPosition, WindowSize {}

export type WindowState = "normal" | "minimized" | "maximized";

export interface WindowData {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: string;
  state: WindowState;
  bounds: WindowBounds;
  zIndex: number;
  isActive: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  draggable?: boolean;
}

export interface WindowManagerContextType {
  windows: WindowData[];
  activeWindowId: string | null;
  addWindow: (window: Omit<WindowData, "id" | "zIndex" | "isActive">) => void;
  removeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowBounds: (id: string, bounds: Partial<WindowBounds>) => void;
  updateWindowState: (id: string, state: WindowState) => void;
}

export const SNAP_THRESHOLD = 20; // pixels
export const MIN_WINDOW_WIDTH = 300;
export const MIN_WINDOW_HEIGHT = 200;
export const DEFAULT_WINDOW_WIDTH = 600;
export const DEFAULT_WINDOW_HEIGHT = 400;
export const TITLEBAR_HEIGHT = 40;
export const DOCK_HEIGHT = 60;
