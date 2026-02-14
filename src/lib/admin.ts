import { userUseCases } from '$lib/services';
import { register } from '$lib/auth.svelte';

// ── Admin Tools ──
// Since user creation is removed from UI, this helper allows creation via Browser Console.
// Usage: window.aegis.createUser('Name', 'PIN');

export const adminTools = {
  async createUser(name: string, pin: string) {
    console.log(`Creating user "${name}"...`);
    try {
      const user = await register(name, pin);
      console.log('✅ User created successfully:', user);
      return user;
    } catch (e) {
      console.error('❌ Failed to create user:', e);
    }
  },
  
  listUsers() {
    const users = userUseCases.getAll();
    console.table(users.map(u => ({ id: u.id, name: u.name, lastLogin: u.lastLoginAt })));
    return users;
  }
};

export function initAdminTools() {
  if (typeof window !== 'undefined') {
    (window as any).aegis = adminTools;
    
    // Log instructions to the console with styling
    console.group('%c🛡️ Aegis Admin CLI', 'color: #6366f1; font-size: 14px; font-weight: bold;');
    console.log('%cTo create a new user, run:', 'color: #a1a1aa;');
    console.log('%cwindow.aegis.createUser("Name", "PIN")', 'color: #22c55e; font-weight: bold; font-family: monospace;');
    console.log('%cExample: window.aegis.createUser("Dr. House", "1234")', 'color: #71717a; font-style: italic;');
    console.groupEnd();
  }
}
