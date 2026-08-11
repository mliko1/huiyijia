/* ============================================================
   HUIYIJIA — Theme Toggle (Light / Dark)
   Persists choice via localStorage, defaults to light.
   ============================================================ */
(function () {
  'use strict';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // Expose globally so inline onclick works
  window.toggleTheme = toggleTheme;

  // Sync toggle button icons on load
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  });
})();
