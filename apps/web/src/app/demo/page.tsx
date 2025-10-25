"use client";

import React from "react";
import {
  WindowManager,
  WindowManagerProvider,
  useWindowManager,
} from "@/components/WindowManager";

function DemoContent() {
  const { addWindow } = useWindowManager();

  const createSampleWindow = (index: number) => {
    const samples = [
      {
        title: "Welcome to Worldscape",
        icon: "🌍",
        content: (
          <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 16 }}>Welcome!</h2>
            <p style={{ lineHeight: 1.6, marginBottom: 12 }}>
              This is a fully-featured window manager built with React and
              Framer Motion.
            </p>
            <h3 style={{ marginTop: 24, marginBottom: 12 }}>Features:</h3>
            <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
              <li>✨ Drag windows around</li>
              <li>🔄 Resize from any edge or corner</li>
              <li>⬆️ Maximize and minimize windows</li>
              <li>📌 Snap to screen edges</li>
              <li>💾 Persistent window positions</li>
              <li>🎨 Smooth animations</li>
              <li>🎯 Z-index management</li>
            </ul>
          </div>
        ),
      },
      {
        title: "File Explorer",
        icon: "📁",
        content: (
          <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 16 }}>File Explorer</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Documents", "Downloads", "Pictures", "Videos", "Music"].map(
                (folder) => (
                  <div
                    key={folder}
                    style={{
                      padding: 12,
                      backgroundColor: "#2d2d2d",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    📁 {folder}
                  </div>
                )
              )}
            </div>
          </div>
        ),
      },
      {
        title: "Terminal",
        icon: "💻",
        content: (
          <div
            style={{
              padding: 16,
              fontFamily: "monospace",
              backgroundColor: "#000",
              height: "100%",
            }}
          >
            <div style={{ color: "#0f0" }}>
              <div>$ worldscape --version</div>
              <div>v1.0.0</div>
              <div style={{ marginTop: 12 }}>$ ls</div>
              <div>apps/ packages/ services/ design/</div>
              <div style={{ marginTop: 12 }}>
                $ <span className="cursor">_</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Settings",
        icon: "⚙️",
        content: (
          <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 24 }}>Settings</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="checkbox" defaultChecked />
                <span>Enable window snapping</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="checkbox" defaultChecked />
                <span>Save window positions</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="checkbox" defaultChecked />
                <span>Smooth animations</span>
              </label>
              <hr style={{ border: "1px solid #333", margin: "16px 0" }} />
              <div>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Theme
                </label>
                <select
                  style={{
                    padding: 8,
                    backgroundColor: "#2d2d2d",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: 4,
                    width: "100%",
                  }}
                >
                  <option>Dark</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "About",
        icon: "ℹ️",
        content: (
          <div style={{ padding: 24, textAlign: "center" }}>
            <h1 style={{ fontSize: 48, marginBottom: 16 }}>🌍</h1>
            <h2 style={{ marginBottom: 8 }}>Worldscape</h2>
            <p style={{ color: "#888", marginBottom: 24 }}>Version 1.0.0</p>
            <p style={{ lineHeight: 1.6 }}>
              A modern window manager built with React, TypeScript, and Framer
              Motion.
            </p>
            <div
              style={{
                marginTop: 24,
                padding: 16,
                backgroundColor: "#2d2d2d",
                borderRadius: 8,
              }}
            >
              <p style={{ fontSize: 12, color: "#888" }}>
                Created with ❤️ for the Worldscape project
              </p>
            </div>
          </div>
        ),
      },
    ];

    const sample = samples[index % samples.length];
    addWindow({
      title: sample.title,
      icon: sample.icon,
      content: sample.content,
      state: "normal",
      bounds: {
        x: 100 + index * 40,
        y: 100 + index * 40,
        width: 600,
        height: 400,
      },
    });
  };

  return (
    <>
      <WindowManager />

      {/* Control Panel */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 10001,
          backgroundColor: "rgba(30, 30, 30, 0.95)",
          backdropFilter: "blur(10px)",
          padding: 20,
          borderRadius: 8,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h3 style={{ marginBottom: 16, color: "#fff" }}>Window Manager Demo</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Welcome", "File Explorer", "Terminal", "Settings", "About"].map(
            (name, idx) => (
              <button
                key={name}
                onClick={() => createSampleWindow(idx)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#0078d4",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#006cbe")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0078d4")
                }
              >
                Open {name}
              </button>
            )
          )}
        </div>
        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#2d2d2d",
            borderRadius: 4,
          }}
        >
          <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
            💡 Try dragging, resizing, minimizing, and maximizing windows!
          </p>
        </div>
      </div>
    </>
  );
}

export default function DemoPage() {
  return (
    <WindowManagerProvider>
      <DemoContent />
    </WindowManagerProvider>
  );
}
