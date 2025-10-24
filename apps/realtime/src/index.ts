import { WebSocketServer, type WebSocket } from "ws";
import type { IncomingMessage } from "http";

interface Client {
  ws: WebSocket;
  id: string;
  worldId?: string;
}

interface WebSocketMessage {
  type: string;
  worldId?: string;
  data?: unknown;
  [key: string]: unknown;
}

const clients = new Map<string, Client>();

const wss = new WebSocketServer({
  port: parseInt(process.env.WS_PORT || "3002", 10),
});

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

wss.on("connection", (ws: WebSocket, _request: IncomingMessage) => {
  const clientId = generateId();
  const client: Client = {
    ws,
    id: clientId,
  };

  clients.set(clientId, client);
  console.log(`Client ${clientId} connected. Total clients: ${clients.size}`);

  ws.on("message", (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(client, message);
    } catch (error) {
      console.error("Error parsing message:", error);
      ws.send(JSON.stringify({ error: "Invalid message format" }));
    }
  });

  ws.on("close", () => {
    clients.delete(clientId);
    console.log(
      `Client ${clientId} disconnected. Total clients: ${clients.size}`
    );
  });

  ws.on("error", (error) => {
    console.error(`Error from client ${clientId}:`, error);
  });

  ws.send(
    JSON.stringify({
      type: "connected",
      clientId,
    })
  );
});

function handleMessage(client: Client, message: WebSocketMessage) {
  switch (message.type) {
    case "join-world":
      client.worldId = message.worldId;
      broadcastToWorld(client.worldId, {
        type: "user-joined",
        clientId: client.id,
      });
      break;

    case "leave-world":
      if (client.worldId) {
        broadcastToWorld(client.worldId, {
          type: "user-left",
          clientId: client.id,
        });
        client.worldId = undefined;
      }
      break;

    case "world-update":
      if (client.worldId) {
        broadcastToWorld(
          client.worldId,
          {
            type: "world-update",
            data: message.data,
            clientId: client.id,
          },
          client.id
        );
      }
      break;

    default:
      client.ws.send(JSON.stringify({ error: "Unknown message type" }));
  }
}

function broadcastToWorld(
  worldId: string,
  message: WebSocketMessage,
  excludeClientId?: string
) {
  for (const client of clients.values()) {
    if (client.worldId === worldId && client.id !== excludeClientId) {
      client.ws.send(JSON.stringify(message));
    }
  }
}

console.log(
  `WebSocket server is running on port ${process.env.WS_PORT || "3002"}`
);
