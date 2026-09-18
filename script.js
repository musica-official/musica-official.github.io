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

/* === Musica cinematic motion === */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal-on-scroll');

  if (!reduce && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
      observer.observe(el);
    });
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }

  if (!reduce) {
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('pointermove', (e) => {
        const x = (e.clientX / window.innerWidth - .5);
        const y = (e.clientY / window.innerHeight - .5);
        hero.style.setProperty('--mx', `${x * 10}px`);
        hero.style.setProperty('--my', `${y * 8}px`);
      }, { passive: true });
    }
  }
})();

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  const visual=document.querySelector('.hero-visual');
  if(visual && innerWidth>800){
    window.addEventListener('pointermove', e=>{
      const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
      visual.style.transform=`translate3d(${x*10}px,${y*8}px,0)`;
    },{passive:true});
  }
  document.querySelectorAll('.feature,.info-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(700px) rotateX(${y*-2}deg) rotateY(${x*2}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
})();
