/* HarvestScale — Store: state + localStorage */
(function () {
  'use strict';
  const KEY = 'harvestscale';
  const state = { transaksi: [], draft: null, sampah: [] };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) { console.warn('Store.load:', e); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Store.save:', e); }
  }
  function getParam(key) {
    return new URLSearchParams(location.search).get(key);
  }
  function go(path) { location.href = path; }

  load();
  window.Store = { state, load, save, getParam, go };
})();
