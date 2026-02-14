
import * as Y from 'yjs';
import * as sync from 'y-protocols/dist/sync.cjs';
import * as encoding from 'lib0/dist/encoding.cjs';
import * as decoding from 'lib0/dist/decoding.cjs';

/**
 * AEGIS HEALTH - Stateful Bun Sync Server (v2)
 * This server maintains the Yjs document in memory.
 */

const port = process.env.PORT || 1234;
const docs = new Map<string, Y.Doc>();

const server = Bun.serve({
  port: port,
  fetch(req, server) {
    const url = new URL(req.url);
    const roomName = url.pathname.slice(1) || 'aegis-health';
    if (server.upgrade(req, { data: { roomName } })) return;
    return new Response("🛡️ Aegis Sync Server is active.");
  },
  websocket: {
    open(ws) {
      const { roomName } = ws.data as { roomName: string };
      ws.subscribe(roomName);
      
      if (!docs.has(roomName)) docs.set(roomName, new Y.Doc());
      const doc = docs.get(roomName)!;

      // Send Sync Step 1
      const encoder = encoding.createEncoder();
      encoding.writeUint8(encoder, 0); // messageSync
      sync.writeSyncStep1(encoder, doc);
      ws.send(encoding.toUint8Array(encoder));
      
      console.log(`[Sync] Client joined room: ${roomName}`);
    },
    message(ws, message) {
      const { roomName } = ws.data as { roomName: string };
      const doc = docs.get(roomName)!;
      
      const encoder = encoding.createEncoder();
      const decoder = decoding.createDecoder(new Uint8Array(message as ArrayBuffer));
      const messageType = decoding.readUint8(decoder);
      
      if (messageType === 0) { // messageSync
        encoding.writeUint8(encoder, 0); // messageSync
        const syncMessageType = sync.readSyncMessage(decoder, encoder, doc, ws);
        
        // If we have a reply (like Step 2 or missing updates), send it
        if (encoding.length(encoder) > 1) {
          ws.send(encoding.toUint8Array(encoder));
        }

        // Broadcast updates to all other clients in the room
        if (syncMessageType === 2) { // update
          server.publish(roomName, message);
        }
      }
    },
    close(ws) {
      const { roomName } = ws.data as { roomName: string };
      console.log(`[Sync] Client left room: ${roomName}`);
    }
  }
});

console.log(`🛡️ Aegis Sync Server running at ws://127.0.0.1:${server.port}`);
