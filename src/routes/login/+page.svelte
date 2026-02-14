<!-- Login / User Selection Page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { auth, login, register, getAllUsers } from '$lib/auth.svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n';
  import type { User } from '$core';

  let users = $state<User[]>([]);
  let showRegister = $state(false);
  let selectedUser = $state<User | null>(null);
  
  // Login Inputs
  let pin = $state('');
  let loginError = $state('');
  
  // Register Inputs Removed
  // Users must be created via CLI / Admin script


  onMount(() => {
    loadUsers();
  });

  function loadUsers() {
    users = getAllUsers();
    // showRegister logic removed
  }

  async function handleLogin() {
    if (!selectedUser) return;
    try {
      const success = await login(selectedUser.id, pin);
      if (success) {
        goto('/');
      } else {
        loginError = t('incorrect_pin');
        pin = '';
      }
    } catch (e) {
      loginError = t('login_failed');
    }
  }

  // Registration Logic Removed

  function selectUser(user: User) {
    selectedUser = user;
    pin = '';
    loginError = '';
    // Focus pin input? (need element ref)
  }
</script>

<div class="login-page">
  <div class="login-container">
    <div class="brand">
      <span class="logo">🛡️</span>
      <h1>Aegis Health</h1>
    </div>

    <!-- User Selection View -->
    {#if !showRegister && !selectedUser}
      <h2 class="subtitle">{t('select_user')}</h2>
      <div class="user-grid">
        {#each users as user}
          <button class="user-card" onclick={() => selectUser(user)}>
            <div class="user-avatar-lg" style="background-color: {user.color}">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span class="user-name">{user.name}</span>
          </button>
        {/each}
        
        {#if users.length === 0}
          <div class="empty-users">
            <p>{t('no_users_found')}</p>
            <small>{t('run_admin_script')}</small>
          </div>
        {/if}
      </div>

    <!-- PIN Entry View -->
    {:else if !showRegister && selectedUser}
      <div class="pin-entry">
        <div class="selected-user-header">
          <div class="user-avatar-lg" style="background-color: {selectedUser.color}">
            {selectedUser.name.charAt(0).toUpperCase()}
          </div>
          <h3>{selectedUser.name}</h3>
        </div>
        
        <p class="instruction">{t('enter_pin')}</p>
        
        <form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <input 
            type="password" 
            bind:value={pin} 
            maxlength="6" 
            placeholder="••••"
            class="pin-input"
            autofocus
          />
          {#if loginError}
            <div class="error-msg">{loginError}</div>
          {/if}
          
          <div class="actions">
            <button type="button" class="btn btn-ghost" onclick={() => selectedUser = null}>{t('back')}</button>
            <button type="submit" class="btn btn-primary" disabled={!pin}>{t('unlock')}</button>
          </div>
        </form>
      </div>

    <!-- Registration View Removed -->
    {/if}
  </div>
</div>

<style>
  .login-page {
    display: flex; justify-content: center; align-items: center; min-height: 100vh;
    background: var(--bg-main); color: var(--text-main);
  }

  .login-container {
    width: 100%; max-width: 480px; padding: 2rem;
    display: flex; flex-direction: column; align-items: center;
  }

  .brand { display: flex; flex-direction: column; align-items: center; margin-bottom: 2rem; }
  .logo { font-size: 3rem; margin-bottom: 0.5rem; }
  h1 { font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, var(--accent), #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .subtitle { font-size: 1rem; color: var(--text-muted); margin-bottom: 1.5rem; }

  /* User Grid */
  .user-grid {
    display: flex; flex-wrap: wrap; gap: 1.5rem; width: 100%; justify-content: center;
  }

  .user-card {
    background: none; border: none; cursor: pointer; display: flex; flex-direction: column;
    align-items: center; gap: 0.75rem; transition: transform 0.2s;
  }
  .user-card:hover { transform: translateY(-4px); }

  .user-avatar-lg {
    width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 1.5rem; font-weight: 600; color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 2px solid var(--border-card);
  }

  .user-name { font-size: 0.9rem; color: var(--text-main); font-weight: 500; }
  .empty-users { text-align: center; color: var(--text-muted); }

  /* PIN Entry */
  .pin-entry { width: 100%; max-width: 300px; text-align: center; }
  .selected-user-header { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
  .selected-user-header h3 { font-size: 1.25rem; font-weight: 600; color: var(--text-main); }
  .instruction { color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem; }
  
  .pin-input {
    width: 100%; padding: 0.75rem; font-size: 1.5rem; letter-spacing: 0.5em; text-align: center;
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px;
    color: var(--text-main); margin-bottom: 1rem;
  }
  .pin-input:focus { outline: none; border-color: var(--accent); }

  /* Actions */
  .error-msg { color: var(--danger); font-size: 0.9rem; margin-bottom: 1rem; text-align: center; }
  .actions { display: flex; gap: 1rem; justify-content: center; }

  .btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 1rem; transition: opacity 0.2s; }
  .btn-primary { background: linear-gradient(135deg, var(--accent), #8b5cf6); color: white; }
  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--bg-card); color: var(--text-main); }
</style>
