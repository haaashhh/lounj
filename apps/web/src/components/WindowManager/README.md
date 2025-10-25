# Window Manager

A fully-featured, draggable and resizable window manager for React with smooth animations powered by Framer Motion.

## Features

- ✨ **Drag & Drop**: Drag windows around the screen
- 🔄 **Resizable**: Resize from any edge or corner
- ⬆️ **Maximize/Minimize**: Full window controls
- 📌 **Snap to Edges**: Automatically snap windows to screen edges
- 💾 **Persistence**: Save and restore window positions using localStorage
- 🎨 **Smooth Animations**: Powered by Framer Motion
- 🎯 **Z-Index Management**: Automatic window focus and layering
- 🪟 **Multiple Windows**: Support for unlimited windows
- 📱 **Taskbar/Dock**: Minimized windows appear in the dock

## Usage

### Basic Setup

```tsx
import {
  WindowManagerProvider,
  WindowManager,
} from "@/components/WindowManager";

export default function App() {
  return (
    <WindowManagerProvider>
      <WindowManager />
      {/* Your app content */}
    </WindowManagerProvider>
  );
}
```

### Creating Windows

```tsx
import { useWindowManager } from "@/components/WindowManager";

function MyComponent() {
  const { addWindow } = useWindowManager();

  const createWindow = () => {
    addWindow({
      title: "My Window",
      icon: "🌍",
      content: <div>Window content here</div>,
      state: "normal",
      bounds: {
        x: 100,
        y: 100,
        width: 600,
        height: 400,
      },
      resizable: true,
      draggable: true,
      minWidth: 300,
      minHeight: 200,
    });
  };

  return <button onClick={createWindow}>Open Window</button>;
}
```

### Window Manager Context

The `useWindowManager` hook provides access to all window management functions:

```tsx
const {
  windows, // Array of all windows
  activeWindowId, // ID of the currently active window
  addWindow, // Create a new window
  removeWindow, // Close a window
  focusWindow, // Bring window to front
  minimizeWindow, // Minimize to dock
  maximizeWindow, // Maximize window
  restoreWindow, // Restore from maximized
  updateWindowBounds, // Update position/size
  updateWindowState, // Update window state
} = useWindowManager();
```

## Window Props

| Prop        | Type                                     | Default    | Description             |
| ----------- | ---------------------------------------- | ---------- | ----------------------- |
| `title`     | `string`                                 | required   | Window title            |
| `content`   | `React.ReactNode`                        | required   | Window content          |
| `icon`      | `string`                                 | optional   | Icon emoji or character |
| `state`     | `"normal" \| "minimized" \| "maximized"` | `"normal"` | Window state            |
| `bounds`    | `{ x, y, width, height }`                | centered   | Position and size       |
| `resizable` | `boolean`                                | `true`     | Allow resizing          |
| `draggable` | `boolean`                                | `true`     | Allow dragging          |
| `minWidth`  | `number`                                 | `300`      | Minimum width           |
| `minHeight` | `number`                                 | `200`      | Minimum height          |
| `maxWidth`  | `number`                                 | unlimited  | Maximum width           |
| `maxHeight` | `number`                                 | unlimited  | Maximum height          |

## Keyboard Shortcuts

- **Close**: Click the X button
- **Minimize**: Click the − button
- **Maximize/Restore**: Click the □ button or double-click titlebar

## Customization

### Styling

The window manager uses inline styles for maximum compatibility, but you can customize colors and dimensions by modifying the constants in `types.ts`:

```typescript
export const SNAP_THRESHOLD = 20; // Snap distance in pixels
export const MIN_WINDOW_WIDTH = 300; // Default minimum width
export const MIN_WINDOW_HEIGHT = 200; // Default minimum height
export const DEFAULT_WINDOW_WIDTH = 600;
export const DEFAULT_WINDOW_HEIGHT = 400;
export const TITLEBAR_HEIGHT = 40;
export const DOCK_HEIGHT = 60;
```

### Custom Window Content

Windows can contain any React component:

```tsx
addWindow({
  title: "Custom Content",
  content: (
    <div>
      <h2>My Custom Component</h2>
      <input type="text" />
      <button>Submit</button>
    </div>
  ),
  // ... other props
});
```

## Architecture

### Components

- **WindowManagerProvider**: Context provider for window state
- **WindowManager**: Main container component
- **Window**: Individual window component with drag/resize
- **Dock**: Taskbar showing all windows

### State Management

State is managed using React Context with the following features:

- Automatic z-index management
- Window focus tracking
- Position persistence via localStorage
- State updates with immutable patterns

### Animations

Animations are handled by Framer Motion:

- Window open/close fade
- Drag with momentum disabled
- Smooth maximize/minimize transitions
- Dock button hover effects

## Performance

- Windows use `React.memo` internally
- Drag operations are throttled
- Only active window receives pointer events
- Resize handles are conditionally rendered

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Examples

See the demo page at `/demo` for a full working example with multiple window types.

## License

MIT - Part of the Worldscape project
