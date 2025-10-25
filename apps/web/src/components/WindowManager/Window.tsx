"use client";

import React, { useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import type { WindowData } from "./types";
import { useWindowManager } from "./WindowContext";
import {
  SNAP_THRESHOLD,
  MIN_WINDOW_WIDTH,
  MIN_WINDOW_HEIGHT,
  TITLEBAR_HEIGHT,
  DOCK_HEIGHT,
} from "./types";

interface WindowProps {
  window: WindowData;
}

export function Window({ window }: WindowProps) {
  const {
    focusWindow,
    removeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowBounds,
  } = useWindowManager();

  const windowRef = useRef<HTMLDivElement>(null);
  const [_isDragging, setIsDragging] = useState(false);
  const [_isResizing, setIsResizing] = useState(false);
  const [_resizeDirection, setResizeDirection] = useState<string>("");

  const { id, title, content, state, bounds, zIndex, isActive } = window;
  const minWidth = window.minWidth ?? MIN_WINDOW_WIDTH;
  const minHeight = window.minHeight ?? MIN_WINDOW_HEIGHT;

  // Handle snap to edges
  const snapToEdges = (x: number, y: number, width: number, height: number) => {
    const viewportWidth =
      typeof globalThis.window !== "undefined"
        ? globalThis.window.innerWidth
        : 1920;
    const viewportHeight =
      typeof globalThis.window !== "undefined"
        ? globalThis.window.innerHeight - DOCK_HEIGHT
        : 1080;

    let snappedX = x;
    let snappedY = y;

    // Snap to left edge
    if (x < SNAP_THRESHOLD) snappedX = 0;
    // Snap to right edge
    if (x + width > viewportWidth - SNAP_THRESHOLD)
      snappedX = viewportWidth - width;
    // Snap to top edge
    if (y < SNAP_THRESHOLD) snappedY = 0;
    // Snap to bottom edge
    if (y + height > viewportHeight - SNAP_THRESHOLD)
      snappedY = viewportHeight - height;

    return { x: snappedX, y: snappedY };
  };

  const handleDragStart = () => {
    setIsDragging(true);
    focusWindow(id);
  };

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (state === "maximized") return;

    const newX = bounds.x + info.delta.x;
    const newY = bounds.y + info.delta.y;

    updateWindowBounds(id, { x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const snapped = snapToEdges(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    );
    if (snapped.x !== bounds.x || snapped.y !== bounds.y) {
      updateWindowBounds(id, snapped);
    }
  };

  const handleResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startBounds = { ...bounds };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newBounds = { ...startBounds };

      if (direction.includes("e")) {
        newBounds.width = Math.max(minWidth, startBounds.width + deltaX);
      }
      if (direction.includes("w")) {
        const newWidth = Math.max(minWidth, startBounds.width - deltaX);
        if (newWidth > minWidth) {
          newBounds.x = startBounds.x + deltaX;
          newBounds.width = newWidth;
        }
      }
      if (direction.includes("s")) {
        newBounds.height = Math.max(minHeight, startBounds.height + deltaY);
      }
      if (direction.includes("n")) {
        const newHeight = Math.max(minHeight, startBounds.height - deltaY);
        if (newHeight > minHeight) {
          newBounds.y = startBounds.y + deltaY;
          newBounds.height = newHeight;
        }
      }

      updateWindowBounds(id, newBounds);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection("");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMaximize = () => {
    if (state === "maximized") {
      restoreWindow(id);
    } else {
      maximizeWindow(id);
    }
  };

  const handleMinimize = () => {
    minimizeWindow(id);
  };

  const handleClose = () => {
    removeWindow(id);
  };

  if (state === "minimized") {
    return null;
  }

  const windowStyle =
    state === "maximized"
      ? {
          x: 0,
          y: 0,
          width: "100vw",
          height: `calc(100vh - ${DOCK_HEIGHT}px)`,
        }
      : {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        };

  return (
    <motion.div
      ref={windowRef}
      className="window"
      style={{
        position: "absolute",
        zIndex,
        ...windowStyle,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      drag={state !== "maximized" && (window.draggable ?? true)}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        top: 0,
        right:
          typeof globalThis.window !== "undefined"
            ? globalThis.window.innerWidth - bounds.width
            : 1920,
        bottom:
          typeof globalThis.window !== "undefined"
            ? globalThis.window.innerHeight - DOCK_HEIGHT - bounds.height
            : 1080,
      }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        className={`window-container ${isActive ? "active" : ""}`}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1e1e1e",
          border: `2px solid ${isActive ? "#0078d4" : "#333"}`,
          borderRadius: state === "maximized" ? 0 : 8,
          overflow: "hidden",
          boxShadow: isActive
            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
            : "0 4px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Title Bar */}
        <div
          className="window-titlebar"
          style={{
            height: TITLEBAR_HEIGHT,
            backgroundColor: isActive ? "#0078d4" : "#2d2d2d",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            cursor: "move",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {window.icon && <span>{window.icon}</span>}
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
              {title}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleMinimize}
              style={{
                width: 24,
                height: 24,
                border: "none",
                backgroundColor: "transparent",
                color: "#fff",
                cursor: "pointer",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              −
            </button>
            <button
              onClick={handleMaximize}
              style={{
                width: 24,
                height: 24,
                border: "none",
                backgroundColor: "transparent",
                color: "#fff",
                cursor: "pointer",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {state === "maximized" ? "❐" : "□"}
            </button>
            <button
              onClick={handleClose}
              style={{
                width: 24,
                height: 24,
                border: "none",
                backgroundColor: "transparent",
                color: "#fff",
                cursor: "pointer",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e81123")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="window-content"
          style={{
            flex: 1,
            overflow: "auto",
            backgroundColor: "#252525",
            color: "#fff",
          }}
        >
          {content}
        </div>

        {/* Resize Handles */}
        {state !== "maximized" && (window.resizable ?? true) && (
          <>
            {["n", "s", "e", "w", "ne", "nw", "se", "sw"].map((dir) => (
              <div
                key={dir}
                className={`resize-handle resize-${dir}`}
                style={{
                  position: "absolute",
                  ...getResizeHandleStyle(dir),
                  cursor: getResizeCursor(dir),
                }}
                onMouseDown={(e) => handleResize(e, dir)}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}

function getResizeHandleStyle(direction: string): React.CSSProperties {
  const size = 8;
  const base: React.CSSProperties = {
    backgroundColor: "transparent",
  };

  switch (direction) {
    case "n":
      return { ...base, top: -size / 2, left: 0, right: 0, height: size };
    case "s":
      return { ...base, bottom: -size / 2, left: 0, right: 0, height: size };
    case "e":
      return { ...base, right: -size / 2, top: 0, bottom: 0, width: size };
    case "w":
      return { ...base, left: -size / 2, top: 0, bottom: 0, width: size };
    case "ne":
      return {
        ...base,
        top: -size / 2,
        right: -size / 2,
        width: size,
        height: size,
      };
    case "nw":
      return {
        ...base,
        top: -size / 2,
        left: -size / 2,
        width: size,
        height: size,
      };
    case "se":
      return {
        ...base,
        bottom: -size / 2,
        right: -size / 2,
        width: size,
        height: size,
      };
    case "sw":
      return {
        ...base,
        bottom: -size / 2,
        left: -size / 2,
        width: size,
        height: size,
      };
    default:
      return base;
  }
}

function getResizeCursor(direction: string): string {
  switch (direction) {
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "nw":
    case "se":
      return "nwse-resize";
    default:
      return "default";
  }
}
