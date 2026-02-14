import { initSync } from '$infra/yjs/yjs-provider';

export const syncState = $state({
  status: 'offline' as 'connected' | 'disconnected' | 'connecting' | 'offline',
  lastSync: null as Date | null,
});

export function initializeSync() {
  // Default to localhost for development
  // In production, this would be an environment variable
  const SYNC_SERVER_URL = 'ws://localhost:1234';

  initSync(SYNC_SERVER_URL, (status) => {
    syncState.status = status;
    if (status === 'connected') {
      syncState.lastSync = new Date();
    }
  });
}
