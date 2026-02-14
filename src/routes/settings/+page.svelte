<!-- Settings Page -->
<script lang="ts">
  let language = $state('en');
</script>

<div class="settings-page">
  <h1 class="page-title">Settings</h1>

  <section class="card">
    <h2 class="card-title">Language / Γλώσσα</h2>
    <div class="setting-row">
      <label>
        <input type="radio" bind:group={language} value="en" /> English 🇬🇧
      </label>
      <label>
        <input type="radio" bind:group={language} value="el" /> Ελληνικά 🇬🇷
      </label>
    </div>
    <p class="setting-note">i18n support coming in the next update.</p>
  </section>

  <section class="card">
    <h2 class="card-title">Data & Sync</h2>
    <div class="setting-row">
      <div class="sync-info">
        <span class="sync-dot online"></span>
        <span>Data stored locally in your browser (IndexedDB)</span>
      </div>
    </div>
    <p class="setting-note">Cross-device sync via WebSocket relay will be available in Phase 2.</p>
  </section>

  <section class="card">
    <h2 class="card-title">About</h2>
    <p class="about-text">
      <strong>Aegis Health</strong> v0.1.0 (MVP)<br />
      A local-first health management app for Greek medical practices.<br />
      No data is stored in the cloud. Your data stays on your device.
    </p>
  </section>
</div>

<style>
  .settings-page { max-width: 600px; }

  .page-title {
    font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #e4e4e7, #a1a1aa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; }
  .card-title { font-size: 1rem; font-weight: 600; color: #d4d4d8; margin-bottom: 1rem; }

  .setting-row { display: flex; gap: 1.5rem; align-items: center; }
  .setting-row label { display: flex; align-items: center; gap: 0.4rem; cursor: pointer; color: #d4d4d8; font-size: 0.9rem; }
  .setting-note { font-size: 0.8rem; color: #52525b; margin-top: 0.75rem; }

  .sync-info { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #d4d4d8; }
  .sync-dot { width: 8px; height: 8px; border-radius: 50%; }
  .sync-dot.online { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.4); }

  .about-text { font-size: 0.85rem; color: #a1a1aa; line-height: 1.6; }
</style>
