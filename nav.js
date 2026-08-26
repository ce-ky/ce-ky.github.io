// Loads the shared navbar, then keeps the main content's top edge lined up
// with wherever the (vertically-centered, fixed) sidebar's title actually
// renders, since that position shifts with viewport height.
(function () {
  function alignContentTop() {
    var nav = document.querySelector('#navbar nav');
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

  fetch('/navbar.html')
    .then(function (response) { return response.text(); })
    .then(function (data) {
      document.getElementById('navbar').innerHTML = data;
      alignContentTop();
      window.addEventListener('resize', alignContentTop);
      // Custom fonts can still be loading at this point; their metrics
      // differ from the fallback font, so re-measure once they're in.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(alignContentTop);
      }
    })
    .catch(function (error) { console.error('Error loading navigation:', error); });
})();
