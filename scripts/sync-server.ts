
import * as Y from 'yjs';
import * as sync from 'y-protocols/dist/sync.cjs';
import * as awareness from 'y-protocols/dist/awareness.cjs';
import * as encoding from 'lib0/dist/encoding.cjs';
import * as decoding from 'lib0/dist/decoding.cjs';

/**
 * AEGIS HEALTH - Stateful Bun Sync Server
 * This version stores the document in memory so data survives 
 * between different client connections.
 */

const port = process.env.PORT || 1234;
const docs = new Map<string, Y.Doc>();

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
      console.log(`[Sync] Client connected to: ${roomName}`);
      
      if (!docs.has(roomName)) {
        docs.set(roomName, new Y.Doc());
      }
      const doc = docs.get(roomName)!;

      // 1. Send Sync Step 1 (Our state vector)
      const encoder = encoding.createEncoder();
      encoding.writeUint8(encoder, 0); // messageSync
      sync.writeSyncStep1(encoder, doc);
      ws.send(encoding.toUint8Array(encoder));
    },
    message(ws, message) {
      const { roomName } = ws.data as { roomName: string };
      const doc = docs.get(roomName)!;
      
      const decoder = decoding.createDecoder(new Uint8Array(message as ArrayBuffer));
      const messageType = decoding.readUint8(decoder);
      
      if (messageType === 0) { // messageSync
        const encoder = encoding.createEncoder();
        encoding.writeUint8(encoder, 0);
        const syncMessageType = sync.readSyncMessage(decoder, encoder, doc, ws);
        
        // If there's a reply to send back to the requester
        if (encoding.length(encoder) > 1) {
          ws.send(encoding.toUint8Array(encoder));
        }

        // 2. Broadcast updates to other clients
        if (syncMessageType === 2) { // update
          // The update is already applied to our local 'doc' in-memory
          // We could broadcast to others here, but for simplicity in this MVP 
          // we just follow the Yjs protocol logic.
          server.publish(roomName, message);
        }
      }
      
      // Allow relaying for non-sync messages
      ws.subscribe(roomName);
    },
    close(ws) {
      const { roomName } = ws.data as { roomName: string };
      console.log(`[Sync] Client disconnected from: ${roomName}`);
    }
  }
});

console.log(`🛡️ Aegis Sync Server running at ws://127.0.0.1:${server.port}`);
