<!-- App Layout: Sidebar + Header + Main Content -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { initServices } from '$lib/services';
  import { initAuth, auth, logout } from '$lib/auth.svelte';
  import { initSettings, settings, toggleTheme, setLanguage } from '$lib/settings.svelte';
  import { initAdminTools } from '$lib/admin';
  import { initializeSync, syncState } from '$lib/sync.svelte';
  import { goto } from '$app/navigation';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let ready = $state(false);
  let sidebarOpen = $state(true);

  onMount(async () => {
    await initServices();
    initSettings();
    initAuth();
    initAdminTools();
    initializeSync();
    ready = true;
  });

  $effect(() => {
    if (ready && !auth.isAuthenticated && $page.url.pathname !== '/login') {
      goto('/login');
    }
  });

  const navItems = $derived([
    { href: '/', label: settings.language === 'el' ? 'Πίνακας Ελέγχου' : 'Dashboard', icon: '📊' },
    { href: '/patients', label: settings.language === 'el' ? 'Ασθενείς' : 'Patients', icon: '👥' },
    { href: '/calendar', label: settings.language === 'el' ? 'Ημερολόγιο' : 'Calendar', icon: '📅' },
    { href: '/settings', label: settings.language === 'el' ? 'Ρυθμίσεις' : 'Settings', icon: '⚙️' },
  ]);

  function isActive(href: string, currentPath: string): boolean {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  }
</script>

<svelte:head>
  <title>Aegis Health</title>
  <meta name="description" content="Local-first health management for Greek medical practices" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

{#if !ready}
  <div class="loading-screen">
    <div class="loading-spinner"></div>
    <p>Loading Aegis Health…</p>
  </div>
{:else}
  <div class="app" class:sidebar-collapsed={!sidebarOpen}>
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo">🛡️</span>
        {#if sidebarOpen}
          <h1 class="app-title">Aegis Health</h1>
        {/if}
        <button class="toggle-btn" onclick={() => sidebarOpen = !sidebarOpen} aria-label="Toggle sidebar">
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav class="sidebar-nav">
        {#each navItems as item}
          <a
            href={item.href}
            class="nav-item"
            class:active={isActive(item.href, $page.url.pathname)}
          >
            <span class="nav-icon">{item.icon}</span>
            {#if sidebarOpen}
              <span class="nav-label">{item.label}</span>
            {/if}
          </a>
        {/each}
      </nav>

      <div class="sidebar-footer">
        {#if auth.user}
          <div class="user-profile" class:open={sidebarOpen}>
            <div class="user-avatar" style="background-color: {auth.user.color}">
              {auth.user.name.charAt(0).toUpperCase()}
            </div>
            {#if sidebarOpen}
              <div class="user-info">
                <span class="username">{auth.user.name}</span>
                <button class="logout-btn" onclick={() => { logout(); goto('/login'); }}>Log out</button>
              </div>
            {/if}
          </div>
        {/if}
        
        <div class="sync-status">
          <span 
            class="sync-dot" 
            class:online={syncState.status === 'connected'}
            class:connecting={syncState.status === 'connecting'}
            class:offline={syncState.status === 'disconnected' || syncState.status === 'offline'}
          ></span>
          {#if sidebarOpen}
            <span class="sync-label">
              {syncState.status === 'connected' ? 'Synced' : 
               syncState.status === 'connecting' ? 'Connecting...' : 'Offline'}
            </span>
          {/if}
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main-content">
      {@render children()}
    </main>
  </div>
{/if}

<style>
  :root {
    /* Light Theme (Default) */
    --bg-main: #f4f4f5;
    --bg-sidebar: #ffffff;
    --bg-card: #ffffff;
    --bg-input: #f4f4f5;
    --text-main: #18181b;
    --text-muted: #71717a;
    --border: #e4e4e7;
    --border-card: #e4e4e7;
    --nav-active: #eef2ff;
    --nav-active-text: #6366f1;
    --accent: #6366f1;
    --accent-glow: rgba(99,102,241,0.1);
    --danger: #ef4444;
    --danger-bg: rgba(239,68,68,0.1);
  }

  :global(.dark) {
    /* Dark Theme (Overrides) */
    --bg-main: #0f1117;
    --bg-sidebar: #13141b;
    --bg-card: #18181b;
    --bg-input: #0f1117;
    --text-main: #e4e4e7;
    --text-muted: #a1a1aa;
    --border: #27272a;
    --border-card: #27272a;
    --nav-active: #1e1e24;
    --nav-active-text: #a5b4fc;
    --accent: #8b5cf6;
    --accent-glow: rgba(139,92,246,0.15);
    --danger: #fca5a5;
    --danger-bg: rgba(239,68,68,0.15);
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-main);
    color: var(--text-main);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.2s, color 0.2s;
  }

  :global(a) { text-decoration: none; color: inherit; }

  /* Loading screen */
  .loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
    gap: 1rem;
    background: var(--bg-main);
    color: var(--text-muted);
    font-family: monospace;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  
  .app { display: flex; height: 100vh; overflow: hidden; }
  
  /* Sidebar */
  .sidebar {
    width: 260px;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 1rem;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }
  
  .sidebar.collapsed { width: 70px; padding: 1rem 0.5rem; }

  .sidebar-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding: 0 0.5rem;
  }
  
  .brand { display: flex; align-items: center; gap: 0.75rem; overflow: hidden; }
  .logo-icon {
    width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), #8b5cf6);
    border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
    box-shadow: 0 4px 12px var(--accent-glow); flex-shrink: 0;
  }
  .brand-text { font-weight: 700; font-size: 1.1rem; color: var(--text-main); white-space: nowrap; }
  
  .toggle-btn {
    background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem; font-size: 0.8rem;
  }
  .toggle-btn:hover { color: var(--text-main); }

  .sidebar.collapsed .brand-text, .sidebar.collapsed .toggle-btn { display: none; }
  .sidebar.collapsed .sidebar-header { justify-content: center; }

  /* Nav */
  .sidebar-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  
  .nav-item {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem;
    border-radius: 8px; color: var(--text-muted); font-size: 0.9rem; font-weight: 500;
    white-space: nowrap; overflow: hidden; transition: all 0.2s;
  }
  
  .nav-item:hover { background: var(--nav-active); color: var(--text-main); }
  .nav-item.active { background: var(--nav-active); color: var(--nav-active-text); }
  .nav-icon { min-width: 20px; text-align: center; }

  .sidebar.collapsed .nav-item { justify-content: center; padding: 0.75rem; }
  .sidebar.collapsed .nav-label { display: none; }

  /* Main Content */
  .main-content {
    flex: 1; overflow-y: auto; padding: 2rem;
    background: var(--bg-main);
  }

  /* Sidebar Footer */
  .sidebar-footer {
    padding: 0.75rem 0.5rem; border-top: 1px solid var(--border);
    margin-top: auto; display: flex; flex-direction: column; gap: 1rem;
  }

  .user-profile {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;
    border-radius: 8px; background: var(--bg-card); overflow: hidden;
    border: 1px solid var(--border);
  }

  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem;
    color: white; flex-shrink: 0;
  }

  .user-info { display: flex; flex-direction: column; gap: 0.1rem; min-width: 0; }
  .username { font-size: 0.85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-main); }
  .logout-btn { background: none; border: none; padding: 0; font-size: 0.75rem; color: var(--danger); cursor: pointer; text-align: left; }
  .logout-btn:hover { text-decoration: underline; }

  .sync-status { display: flex; align-items: center; gap: 0.5rem; padding-left: 0.5rem; }
  .sync-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted); box-shadow: none; transition: all 0.3s; }
  .sync-dot.online { background: #22c55e; box-shadow: 0 0 8px rgba(34,197,94,0.4); }
  .sync-dot.connecting { background: #eab308; box-shadow: 0 0 8px rgba(234,179,8,0.4); }
  .sync-dot.offline { background: var(--danger); box-shadow: 0 0 8px var(--danger-bg); }
  .sync-label { font-size: 0.75rem; color: var(--text-muted); }
  
  .mobile-menu-btn { display: none; margin-bottom: 1rem; background: none; border: none; font-size: 1.5rem; color: var(--text-main); }

  @media (max-width: 768px) {
    .app { flex-direction: column; }
    .sidebar { position: fixed; height: 100vh; z-index: 50; transform: translateX(-100%); width: 260px; }
    .sidebar.mobile-open { transform: translateX(0); }
    .mobile-menu-btn { display: block; }
    .main-content { padding: 1rem; }
  }
</style>
