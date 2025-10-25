"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { useWindowManager } from "./WindowContext";
import { Window } from "./Window";
import { Dock } from "./Dock";

export function WindowManager() {
  const { windows } = useWindowManager();

  return (
    <div
      className="window-manager"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Windows Container */}
      <AnimatePresence>
        {windows.map((window) => (
          <Window key={window.id} window={window} />
        ))}
      </AnimatePresence>

      {/* Dock/Taskbar */}
      <Dock />
    </div>
  );
}
