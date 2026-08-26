// List/grid layout toggle for a collection listing page. The button pair
// and the two layout containers (.layout-list / .layout-grid) are expected
// to already be in the DOM (see _layouts/collection-list.html). The choice
// is remembered per browser under the key given via this script tag's
// data-storage-key attribute, so each listing page (games/drawings/etc.)
// keeps its own preference.
(function () {
  var script = document.currentScript;
  var storageKey = (script && script.dataset.storageKey) || 'layout';
  var main = document.querySelector('main.content');
  if (!main) return;

  var buttons = document.querySelectorAll('[data-layout-btn]');
  var stored = localStorage.getItem(storageKey);

  function setLayout(layout) {
    main.dataset.layout = layout;
    buttons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.layoutBtn === layout);
    });
    localStorage.setItem(storageKey, layout);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLayout(btn.dataset.layoutBtn);
    });
  });

  setLayout(stored === 'list' ? 'list' : 'grid');
})();
