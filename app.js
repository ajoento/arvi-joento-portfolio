document.querySelectorAll('[data-comparison]').forEach(comparison => {
  const input = comparison.querySelector('input');
  const update = value => {
    const position = Math.max(0, Math.min(100, Number(value)));
    input.value = String(position);
    input.setAttribute('aria-valuetext', `Ennen-kuvaa näkyy ${Math.round(position)} prosenttia`);
    comparison.style.setProperty('--position', `${position}%`);
  };
  let pointerId = null;
  const move = event => {
    const rect = comparison.getBoundingClientRect();
    update((event.clientX - rect.left) / rect.width * 100);
  };
  input.addEventListener('input', () => update(input.value));
  input.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault();
    pointerId = event.pointerId;
    input.focus({preventScroll: true});
    input.setPointerCapture(pointerId);
    move(event);
  });
  input.addEventListener('pointermove', event => { if (event.pointerId === pointerId) move(event); });
  const release = event => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    if (input.hasPointerCapture(event.pointerId)) input.releasePointerCapture(event.pointerId);
  };
  input.addEventListener('pointerup', release);
  input.addEventListener('pointercancel', release);
  input.addEventListener('lostpointercapture', () => { pointerId = null; });
  update(input.value);
});
const navlinks = [...document.querySelectorAll('.navlinks a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navlinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin: '-20% 0px -60% 0px', threshold: 0});
  navlinks.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
}
