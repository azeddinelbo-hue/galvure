document.getElementById('year').textContent = new Date().getFullYear();
const paths = {
  launch: { index: '01 / Starting presence', title: 'Start with the essentials.', copy: 'Build the identity and key materials your audience needs to recognize and understand you. Add other touchpoints only where they serve a clear purpose.' },
  grow: { index: '02 / Growing presence', title: 'Make every touchpoint work together.', copy: 'Bring your sales materials, digital presence and day-to-day communication into one coherent system that reflects the business you have become.' },
  refine: { index: '03 / Evolving presence', title: 'Keep what works. Sharpen what does not.', copy: 'Identify where the current image falls short, then refine the elements that matter most. A complete rebrand is only useful when the diagnosis supports it.' }
};
const result = document.querySelector('.pathfinder-result');
const choices = document.querySelectorAll('.path-choice');
choices.forEach((choice) => choice.addEventListener('click', () => {
  if (choice.getAttribute('aria-pressed') === 'true') return;
  choices.forEach((button) => { const selected = button === choice; button.classList.toggle('is-active', selected); button.setAttribute('aria-pressed', String(selected)); });
  const next = paths[choice.dataset.path];
  result.getAnimations().forEach((animation) => animation.cancel());
  result.querySelector('.result-index').textContent = next.index;
  document.getElementById('result-title').textContent = next.title;
  document.getElementById('result-copy').textContent = next.copy;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) result.animate([{ opacity: 0.65, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}));
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const hero = document.querySelector('.hero');
  const orb = document.querySelector('.orb');
  let frame = 0;
  hero.addEventListener('pointermove', (event) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = hero.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width - .5) * 24;
      const y = ((event.clientY - box.top) / box.height - .5) * 24;
      orb.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(-18deg)`;
      frame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => { if (frame) cancelAnimationFrame(frame); orb.style.transform = ''; });
}
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sections = document.querySelectorAll('.intro-main,.principles,.pathfinder,.statement-inner,.services-heading,.contact-grid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  sections.forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
}
