
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { v4 as uuidv4 } from 'uuid';

/**
 * AEGIS HEALTH - User Creation Script
 * Run with: bun scripts/create-user.ts "Doctor Name" "1234"
 */

const name = process.argv[2];
const pin = process.argv[3];

if (!name || !pin) {
  console.error('Usage: bun scripts/create-user.ts "User Name" "PIN"');
  process.exit(1);
}

const WS_URL = process.env.PUBLIC_SYNC_SERVER_URL || 'ws://localhost:1234';
const ROOM_NAME = 'aegis-health';

const doc = new Y.Doc();
const wsProvider = new WebsocketProvider(WS_URL, ROOM_NAME, doc, { connect: true });

wsProvider.on('status', (event: any) => {
  if (event.status === 'connected') {
    createUser();
  }
});

function getRandomColor() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function createUser() {
  console.log(`[Admin] Creating user: ${name}...`);

  const usersMap = doc.getMap('users');
  const userId = uuidv4();
  
  const userYMap = new Y.Map<string>();
  const userData = {
    id: userId,
    name: name,
    pin: pin, // Hash this in production! Currently plain for MVP
    color: getRandomColor(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  for (const [k, v] of Object.entries(userData)) {
    userYMap.set(k, v);
  }

  usersMap.set(userId, userYMap);

  console.log(`[Admin] Successfully created user ${name} (ID: ${userId}) with PIN: ${pin}`);
  console.log('[Admin] Waiting for sync...');

  setTimeout(() => {
    console.log('[Admin] Done. Exiting.');
    process.exit(0);
  }, 2000);
}
