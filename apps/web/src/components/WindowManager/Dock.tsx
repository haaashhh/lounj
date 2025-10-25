"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWindowManager } from "./WindowContext";
import { DOCK_HEIGHT } from "./types";

export function Dock() {
  const { windows, focusWindow, activeWindowId } = useWindowManager();

  return (
    <motion.div
      className="dock"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: DOCK_HEIGHT,
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "0 16px",
        zIndex: 10000,
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {windows.map((window) => (
        <motion.button
          key={window.id}
          onClick={() => focusWindow(window.id)}
          style={{
            height: 40,
            minWidth: 40,
            maxWidth: 200,
            padding: "0 12px",
            backgroundColor:
              window.id === activeWindowId && window.state !== "minimized"
                ? "#0078d4"
                : "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 500,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          whileHover={{ scale: 1.05, backgroundColor: "#0078d4" }}
          whileTap={{ scale: 0.95 }}
        >
          {window.icon && <span>{window.icon}</span>}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {window.title}
          </span>
          {window.state === "minimized" && (
            <span style={{ fontSize: 10, opacity: 0.6 }}>(minimized)</span>
          )}
        </motion.button>
      ))}

      {windows.length === 0 && (
        <div style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 13 }}>
          No windows open
        </div>
      )}
    </motion.div>
  );
}
