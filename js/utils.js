/* HarvestScale — Utils: format & helper */
(function () {
  'use strict';
  function formatRupiah(n) {
    const num = Number(n) || 0;
    return 'Rp ' + num.toLocaleString('id-ID');
  }
  function formatTanggal(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function generateId(prefix) {
    return (prefix || 'id') + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }
  window.Utils = { formatRupiah, formatTanggal, generateId };
})();
