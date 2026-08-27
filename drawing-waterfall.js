// Drawings gallery: masonry columns + lightbox (_layouts/collection-list.html).
//
// Splits the flat list of .drawing-item figures into 1/2/3 equal-width
// columns depending on viewport width, round-robin (item 0 -> column 0,
// item 1 -> column 1, ...), each column stacking its own items top to
// bottom so heights follow each image's natural aspect ratio. Deliberately
// not CSS multi-column (column-count) — see the comment in style.css on
// .drawing-waterfall for why that broke the lightbox overlay below.
//
// Clicking a thumbnail opens its full-size image in a centered overlay;
// clicking the backdrop, the close button, or pressing Escape closes it.
(function () {
  var container = document.getElementById('drawing-waterfall');
  var modal = document.getElementById('drawing-modal');
  if (!container || !modal) return;

  var items = Array.prototype.slice.call(container.children);

  function columnCountForWidth(width) {
    if (width >= 1024) return 3;
    if (width >= 640) return 2;
    return 1;
  }

  var currentCount = null;

  function layoutColumns() {
    var count = columnCountForWidth(window.innerWidth);
    if (count === currentCount) return;
    currentCount = count;

    var columns = [];
    for (var i = 0; i < count; i++) {
      var col = document.createElement('div');
      col.className = 'drawing-column';
      columns.push(col);
    }

    items.forEach(function (item, i) {
      columns[i % count].appendChild(item);
    });

    container.innerHTML = '';
    columns.forEach(function (col) { container.appendChild(col); });
    container.classList.add('js-columns');
  }

  layoutColumns();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutColumns, 150);
  });

  var modalImg = modal.querySelector('.drawing-modal-img');
  var modalCaption = modal.querySelector('.drawing-modal-caption');
  var closeBtn = modal.querySelector('.drawing-modal-close');

  function openModal(img) {
    modalImg.src = img.dataset.full || img.src;
    modalImg.alt = img.alt || '';
    var caption = img.dataset.caption || '';
    modalCaption.textContent = caption;
    modalCaption.hidden = !caption;
    modal.hidden = false;
  }

  function closeModal() {
    modal.hidden = true;
    modalImg.src = '';
  }

  items.forEach(function (item) {
    var img = item.querySelector('img');
    if (img) img.addEventListener('click', function () { openModal(img); });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
