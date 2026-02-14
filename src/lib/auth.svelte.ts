import { userUseCases } from '$lib/services';
import type { User } from '$core';

// Global auth state
export const auth = $state({
  user: null as User | null,
  isAuthenticated: false,
});

export function initAuth() {
  const storedId = sessionStorage.getItem('aegis_user_id');
  if (storedId) {
    const user = userUseCases.getById(storedId);
    if (user) {
      auth.user = user;
      auth.isAuthenticated = true;
    }
  }
}

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function register(name: string, pin: string): Promise<User> {
  const pinHash = await hashPin(pin);
  const user = userUseCases.create({
    name,
    pinHash,
  });
  // Auto-login after register
  auth.user = user;
  auth.isAuthenticated = true;
  return user;
}

export async function login(userId: string, pin: string): Promise<boolean> {
  const user = userUseCases.getById(userId);
  if (!user) return false;

  const inputHash = await hashPin(pin);
  if (user.pinHash === inputHash) {
    auth.user = user;
    auth.isAuthenticated = true;
    sessionStorage.setItem('aegis_user_id', user.id);
    
    // Update last login
    userUseCases.update(user.id, { lastLoginAt: new Date().toISOString() });
    return true;
  }
  return false;
}

export function logout() {
  auth.user = null;
  auth.isAuthenticated = false;
  sessionStorage.removeItem('aegis_user_id');
}

export function getAllUsers(): User[] {
  return userUseCases.getAll();
}
