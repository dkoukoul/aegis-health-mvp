// ── Yjs Provider ──
// Manages Y.Doc, IndexedDB persistence, and WebSocket sync

import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

const DOC_NAME = 'aegis-health';

let ydoc: Y.Doc | null = null;
let persistence: IndexeddbPersistence | null = null;

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

// ── Cleanup ──

export function destroyProvider(): void {
  persistence?.destroy();
  ydoc?.destroy();
  persistence = null;
  ydoc = null;
}
