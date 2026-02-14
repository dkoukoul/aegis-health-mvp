import { initSync } from '$infra/yjs/yjs-provider';
import { PUBLIC_SYNC_SERVER_URL } from '$env/static/public';

export const syncState = $state({
  status: 'offline' as 'connected' | 'disconnected' | 'connecting' | 'offline',
  lastSync: null as Date | null,
});

export function initializeSync() {
  const SYNC_SERVER_URL = PUBLIC_SYNC_SERVER_URL || 'ws://localhost:1234';

  initSync(SYNC_SERVER_URL, (status) => {
    syncState.status = status;
    if (status === 'connected') {
      syncState.lastSync = new Date();
    }
  });
}
