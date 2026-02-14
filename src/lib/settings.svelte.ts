// ── Settings Management ──
// Handles persistence of Theme and Language

export const settings = $state({
  theme: 'dark' as 'dark' | 'light',
  language: 'en' as 'en' | 'el',
});

export function initSettings() {
  const t = localStorage.getItem('aegis_theme');
  const l = localStorage.getItem('aegis_language');
  
  if (t === 'light' || t === 'dark') settings.theme = t;
  if (l === 'en' || l === 'el') settings.language = l;

  applyTheme(settings.theme);
}

// Helper to toggle theme class
export function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(settings.theme);
  saveSettings();
}

export function setLanguage(lang: 'en' | 'el') {
  settings.language = lang;
  saveSettings();
}

function applyTheme(theme: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
}

function saveSettings() {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('aegis_theme', settings.theme);
  localStorage.setItem('aegis_language', settings.language);
}
