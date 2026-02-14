<!-- App Layout: Sidebar + Header + Main Content -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { initServices } from '$lib/services';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  let ready = $state(false);
  let sidebarOpen = $state(true);

  onMount(async () => {
    await initServices();
    ready = true;
  });

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/patients', label: 'Patients', icon: '👥' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

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
        <div class="sync-status">
          <span class="sync-dot online"></span>
          {#if sidebarOpen}
            <span class="sync-label">Local</span>
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
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0f1117;
    color: #e4e4e7;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  :global(a) {
    text-decoration: none;
    color: inherit;
  }

  /* Loading screen */
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 1rem;
    color: #a1a1aa;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #27272a;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* App layout */
  .app {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
    transition: grid-template-columns 0.3s ease;
  }

  .app.sidebar-collapsed {
    grid-template-columns: 64px 1fr;
  }

  /* Sidebar */
  .sidebar {
    background: #18181b;
    border-right: 1px solid #27272a;
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    overflow: hidden;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 0.5rem;
    margin-bottom: 1rem;
  }

  .logo {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .app-title {
    font-size: 1.1rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
  }

  .toggle-btn {
    margin-left: auto;
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 0.75rem;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
  }

  .toggle-btn:hover {
    color: #e4e4e7;
    background: #27272a;
  }

  /* Navigation */
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: 8px;
    color: #a1a1aa;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .nav-item:hover {
    background: #27272a;
    color: #e4e4e7;
  }

  .nav-item.active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1));
    color: #a5b4fc;
    font-weight: 500;
  }

  .nav-icon {
    font-size: 1.15rem;
    flex-shrink: 0;
    width: 24px;
    text-align: center;
  }

  .nav-label {
    font-size: 0.9rem;
  }

  /* Sidebar footer */
  .sidebar-footer {
    padding: 0.75rem 0.5rem;
    border-top: 1px solid #27272a;
    margin-top: 0.5rem;
  }

  .sync-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sync-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .sync-dot.online {
    background: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
  }

  .sync-label {
    font-size: 0.8rem;
    color: #71717a;
  }

  /* Main content */
  .main-content {
    padding: 2rem;
    overflow-y: auto;
    max-height: 100vh;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .app {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: fixed;
      z-index: 50;
      width: 240px;
      height: 100vh;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .app:not(.sidebar-collapsed) .sidebar {
      transform: translateX(0);
    }

    .main-content {
      padding: 1rem;
    }
  }
</style>
