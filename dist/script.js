document.getElementById('year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sections = document.querySelectorAll('.intro-main,.principles,.statement-inner,.services-heading,.service,.contact-grid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  sections.forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
}
