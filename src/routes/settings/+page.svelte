<script lang="ts">
  import { seedDatabase } from '$lib/seed';
  import { settings, toggleTheme, setLanguage } from '$lib/settings.svelte';
  import { t } from '$lib/i18n';
</script>

<div class="settings-page">
  <h1 class="page-title">{t('settings')}</h1>

  <section class="card">
    <h2 class="card-title">{t('appearance_language')}</h2>
    
    <div class="setting-row">
      <div class="setting-label">{t('theme')}</div>
      <button class="btn btn-ghost" onclick={toggleTheme}>
        {settings.theme === 'dark' ? '🌙 ' + t('dark_mode') : '☀️ ' + t('light_mode')}
      </button>
    </div>

    <div class="setting-row">
      <div class="setting-label">Language / Γλώσσα</div>
      <div class="radio-group">
        <label class="radio-label">
          <input type="radio" name="lang" value="en" checked={settings.language === 'en'} onchange={() => setLanguage('en')} />
          English 🇬🇧
        </label>
        <label class="radio-label">
          <input type="radio" name="lang" value="el" checked={settings.language === 'el'} onchange={() => setLanguage('el')} />
          Ελληνικά 🇬🇷
        </label>
      </div>
    </div>
  </section>

  <section class="card">
    <h2 class="card-title">{t('data_sync')}</h2>
    <div class="setting-row">
      <div class="sync-info">
        <span class="sync-dot online"></span>
        <span>{t('data_stored_local')}</span>
      </div>
    </div>
    <p class="setting-note">{t('sync_coming_soon')}</p>
  </section>

  <section class="card">
    <h2 class="card-title">{t('data_management')}</h2>
    <div class="setting-row">
      <div class="setting-label">{t('seed_fake_data')}</div>
      <button class="btn btn-primary" onclick={seedDatabase}>Seed</button>
    </div>
    <p class="setting-note">{t('seed_note')}</p>
  </section>

  <section class="card">
    <h2 class="card-title">{t('about')}</h2>
    <p class="about-text" style="white-space: pre-line;">
      <strong>Aegis Health</strong> v0.1.0 (MVP)
      {t('app_description')}
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

  .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .card-title { font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin-bottom: 1rem; }
  
  .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .setting-label { font-size: 0.95rem; color: var(--text-main); font-weight: 500; }
  
  .radio-group { display: flex; gap: 1rem; }
  .radio-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted); cursor: pointer; }
  .radio-label input { accent-color: var(--accent); }
  
  .setting-note { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; }
  .about-text { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }

  .sync-info { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #d4d4d8; }
  .sync-dot { width: 8px; height: 8px; border-radius: 50%; }
  .sync-dot.online { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.4); }

  .btn { padding: 0.5rem 1rem; border-radius: 8px; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { opacity: 0.9; }
  .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text-main); }
  .btn-ghost:hover { background: var(--bg-main); }
</style>
