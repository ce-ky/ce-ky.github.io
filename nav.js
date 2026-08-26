// Keeps the main content's top edge lined up with wherever the
// (vertically-centered, fixed) sidebar's title actually renders, since
// that position shifts with viewport height. The navbar itself is now
// compiled straight into the page by Jekyll (see _includes/navbar.html),
// so there's no fetch/injection step to wait on here anymore.
(function () {
  function alignContentTop() {
    var nav = document.querySelector('header nav');
    var content = document.querySelector('.content');
    if (!nav || !content) return;

    if (getComputedStyle(nav).position !== 'fixed') {
      // Mobile layout: nav stacks above the content instead of sitting
      // beside it, so let the stylesheet's own margin-top apply.
      content.style.marginTop = '';
      return;
    }

    var navHead = nav.querySelector('.navhead');
    if (!navHead) return;
    var top = navHead.getBoundingClientRect().top;
    content.style.marginTop = Math.max(top, 0) + 'px';
  }

  alignContentTop();
  window.addEventListener('resize', alignContentTop);
  // Custom fonts can still be loading at this point; their metrics differ
  // from the fallback font, so re-measure once they're in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignContentTop);
  }
})();
