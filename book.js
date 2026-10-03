// Progressive enhancement: without JS, every chapter remains in document order.
(() => {
  const pages = [...document.querySelectorAll('.book-page')];
  const nav = [...document.querySelectorAll('nav a')];
  const previous = document.querySelector('#previous-page');
  const next = document.querySelector('#next-page');
  const indicator = document.querySelector('#page-indicator');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const titles = ['Cover', 'Experience', 'Projects', 'About', 'Contact'];
  let current = -1, animation = null;
  const indexForHash = () => Math.max(0, pages.findIndex(page => `#${page.id}` === location.hash));

  function show(index, animate = true, focus = true) {
    if (index < 0 || index >= pages.length || index === current) return;
    animation?.cancel();
    animation = null;
    const oldIndex = current;
    const outgoing = pages[oldIndex];
    const incoming = pages[index];
    current = index;
    pages.forEach((page, i) => {
      page.hidden = i !== index;
      page.inert = i !== index;
      page.style.zIndex = i === index ? '1' : '0';
      page.classList.remove('is-turning');
      page.tabIndex = -1;
    });
    nav.forEach(link => {
      if (link.hash === `#${incoming.id}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    previous.disabled = index === 0;
    next.disabled = index === pages.length - 1;
    previous.setAttribute('aria-label', index ? `Previous page: ${titles[index - 1]}` : 'Previous page');
    next.setAttribute('aria-label', index < pages.length - 1 ? `Next page: ${titles[index + 1]}` : 'Next page');
    indicator.textContent = `${String(index).padStart(2, '0')} / 04 — ${titles[index]}`;
    document.dispatchEvent(new CustomEvent('bookpagechange', { detail: { page: incoming.id } }));
    if (focus) incoming.focus({ preventScroll: true });
    if (!animate || !outgoing || reduced.matches || !incoming.animate) return;

    // Forward turns lift the old leaf; backward turns lay the previous leaf down.
    const forward = index > oldIndex;
    const leaf = forward ? outgoing : incoming;
    outgoing.hidden = false;
    leaf.style.zIndex = '2';
    leaf.classList.add('is-turning');
    const open = { transform: 'rotateY(0deg)', filter: 'brightness(1)', opacity: 1 };
    const folded = { transform: 'rotateY(-96deg)', filter: 'brightness(.45)', opacity: .3 };
    const turn = leaf.animate(forward ? [open, folded] : [folded, open], { duration: 650, easing: 'cubic-bezier(.25,.65,.25,1)' });
    animation = turn;
    turn.finished.then(() => {
      if (animation !== turn) return;
      outgoing.hidden = true;
      incoming.hidden = false;
      leaf.classList.remove('is-turning');
      incoming.style.zIndex = '1';
      animation = null;
    }).catch(() => {}); // Rapid chapter changes cancel the superseded turn.
  }
  function navigate(index) {
    if (index < 0 || index >= pages.length || index === current) return;
    history.pushState(null, '', `#${pages[index].id}`);
    show(index);
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (link.hash === '#main') { event.preventDefault(); pages[current].focus({ preventScroll: true }); return; }
    const index = pages.findIndex(page => `#${page.id}` === link.hash);
    if (index < 0) return;
    event.preventDefault();
    navigate(index);
  });
  previous.addEventListener('click', () => navigate(current - 1));
  next.addEventListener('click', () => navigate(current + 1));
  window.addEventListener('hashchange', () => show(indexForHash()));
  window.addEventListener('popstate', () => show(indexForHash()));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(current - 1); }
  });
  let touch = null;
  const book = document.querySelector('#main');
  book.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('a, button, input, textarea, select')) { touch = null; return; }
    touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  book.addEventListener('touchend', event => {
    if (!touch || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 85 && Math.abs(dx) > Math.abs(dy) * 2) navigate(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  book.addEventListener('touchcancel', () => { touch = null; }, { passive: true });
  document.body.classList.add('book-ready');
  document.querySelector('.book-controls').hidden = false;
  show(indexForHash(), false, false);
})();
