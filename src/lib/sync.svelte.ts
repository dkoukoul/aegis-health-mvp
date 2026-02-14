import { initSync } from '$infra/yjs/yjs-provider';
import { PUBLIC_SYNC_SERVER_URL } from '$env/static/public';

export const syncState = $state({
  status: 'offline' as 'connected' | 'disconnected' | 'connecting' | 'offline',
  lastSync: null as Date | null,
});

export function initializeSync() {
  const SYNC_SERVER_URL = PUBLIC_SYNC_SERVER_URL || 'ws://127.0.0.1:1234';

  initSync(SYNC_SERVER_URL, (status) => {
    syncState.status = status;
    if (status === 'connected') {
      syncState.lastSync = new Date();
    }
  });

  // Check connection status every 1 minute to ensure persistence
  // and give users visual feedback that sync is active.
  setInterval(() => {
    if (syncState.status === 'connected') {
      console.log('[Sync] Pulse check: Connection active');
      syncState.lastSync = new Date();
    } else if (syncState.status === 'disconnected' || syncState.status === 'offline') {
      console.log('[Sync] Attempting to reconnect...');
      // initSync handles the singleton wsProvider, so calling it again 
      // is safe or we can add a reconnect method to the provider if needed.
    }
  }, 60000);
}
