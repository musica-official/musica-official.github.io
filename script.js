(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.slide')];
  const dots = [...carousel.querySelectorAll('.dot')];
  const previous = carousel.querySelector('.previous');
  const next = carousel.querySelector('.next');
  const current = carousel.querySelector('[data-current]');
  const infoCards = [...document.querySelectorAll('.info-card')];
  const viewport = carousel.querySelector('.carousel-viewport');

  let index = 0, startX = 0, startY = 0, dragging = false;

  function update(nextIndex, animate = true) {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translate3d(-${index * 100}%,0,0)`;
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    if (current) current.textContent = String(index + 1).padStart(2, '0');
    infoCards.forEach((card, i) => card.style.opacity = i === index ? '1' : '.58');
  }

  previous.addEventListener('click', () => update(index - 1));
  next.addEventListener('click', () => update(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => update(i)));
  infoCards.forEach((card, i) => card.addEventListener('click', () => update(i)));

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') update(index - 1);
    if (e.key === 'ArrowRight') update(index + 1);
  });

  viewport.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX = e.clientX; startY = e.clientY; dragging = true;
    viewport.setPointerCapture?.(e.pointerId);
  });
  viewport.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) update(index + (dx < 0 ? 1 : -1));
  });
  viewport.addEventListener('pointercancel', () => dragging = false);

  update(0, false);
})();