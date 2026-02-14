// ── Yjs Provider ──
// Manages Y.Doc, IndexedDB persistence, and WebSocket sync

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';

const DOC_NAME = 'aegis-health';

let ydoc: Y.Doc | null = null;
let persistence: IndexeddbPersistence | null = null;
let wsProvider: WebsocketProvider | null = null;

export function getYDoc(): Y.Doc {
  if (!ydoc) {
    ydoc = new Y.Doc();
  }
  return ydoc;
}

export function initPersistence(): Promise<void> {
  return new Promise((resolve) => {
    const doc = getYDoc();
    if (persistence) {
      resolve();
      return;
    }
    persistence = new IndexeddbPersistence(DOC_NAME, doc);
    persistence.on('synced', () => {
      console.log('[Aegis] IndexedDB persistence synced');
      resolve();
    });
  });
}

export function initSync(serverUrl: string, onStatusChange?: (status: 'connected' | 'disconnected' | 'connecting') => void): void {
  const doc = getYDoc();
  if (wsProvider) return;

  console.log(`[Aegis] Connecting to sync server: ${serverUrl}`);
  wsProvider = new WebsocketProvider(serverUrl, DOC_NAME, doc);

  wsProvider.on('status', (event: { status: 'connected' | 'disconnected' | 'connecting' }) => {
    console.log(`[Aegis] Sync status: ${event.status}`);
    if (onStatusChange) onStatusChange(event.status);
  });
}

// ── Yjs shared types (top-level maps) ──

export function getPatientsMap(): Y.Map<Y.Map<string>> {
  return getYDoc().getMap('patients');
}

export function getAppointmentsMap(): Y.Map<Y.Map<string>> {
  return getYDoc().getMap('appointments');
}

export function getMedicationsMap(): Y.Map<Y.Map<string>> {
  return getYDoc().getMap('medications');
}

export function getHealthRecordsMap(): Y.Map<Y.Map<string>> {
  return getYDoc().getMap('healthRecords');
}

export function getUsersMap(): Y.Map<Y.Map<string>> {
  return getYDoc().getMap('users');
}

// ── Cleanup ──

export function destroyProvider(): void {
  persistence?.destroy();
  wsProvider?.destroy();
  ydoc?.destroy();
  persistence = null;
  wsProvider = null;
  ydoc = null;
}
