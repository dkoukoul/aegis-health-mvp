
/**
 * AEGIS HEALTH - Native Bun Sync Server
 * Use this to sync data across devices.
 * Run with: bun scripts/sync-server.ts
 */

const port = process.env.PORT || 1234;

// Track connected clients per "room"
const rooms = new Map<string, Set<any>>();

const server = Bun.serve({
  port: port,
  fetch(req, server) {
    const url = new URL(req.url);
    const roomName = url.pathname.slice(1) || 'aegis-health';
    
    if (server.upgrade(req, { data: { roomName } })) {
      return;
    }
    return new Response("🛡️ Aegis Sync Server is active.");
  },
  websocket: {
    open(ws) {
      const { roomName } = ws.data as { roomName: string };
      if (!rooms.has(roomName)) {
        rooms.set(roomName, new Set());
      }
      rooms.get(roomName)!.add(ws);
      console.log(`[Sync] Client joined room: ${roomName} (Total: ${rooms.get(roomName)!.size})`);
    },
    message(ws, message) {
      const { roomName } = ws.data as { roomName: string };
      const clients = rooms.get(roomName);
      
      if (clients) {
        // Relay the binary Yjs message to everyone EXCEPT the sender
        for (const client of clients) {
          if (client !== ws) {
            client.send(message);
          }
        }
      }
    },
    close(ws) {
      const { roomName } = ws.data as { roomName: string };
      const clients = rooms.get(roomName);
      if (clients) {
        clients.delete(ws);
        console.log(`[Sync] Client left room: ${roomName}`);
        if (clients.size === 0) rooms.delete(roomName);
      }
    }
  }
});

console.log(`🛡️ Aegis Sync Server running at ws://127.0.0.1:${server.port}`);
