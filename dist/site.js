const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.inert = !open;
  document.body.style.overflow = open ? 'hidden' : '';
}
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); } });
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

if (!reduced.matches && 'IntersectionObserver' in window) {
  const visible = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); visible.unobserve(entry.target); }
  }), { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.intro-grid,.teaser-grid,.method-preview,.split-grid,.principle-grid,.capability-grid,.choice-tool,.process-layout,.contact-layout').forEach(element => { element.classList.add('inview'); visible.observe(element); });
}

const hero = document.querySelector('.home-hero');
if (hero && matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced.matches) {
  let frame = 0;
  hero.addEventListener('pointermove', event => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width - .5) * 28}px`);
      hero.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height - .5) * 28}px`);
      frame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => { hero.style.setProperty('--mx', '0px'); hero.style.setProperty('--my', '0px'); });
}

const filters = document.querySelectorAll('[data-filter]');
const capabilities = document.querySelectorAll('.capability');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  capabilities.forEach(card => {
    const show = button.dataset.filter === 'all' || card.dataset.category === button.dataset.filter;
    card.hidden = !show;
    if (show && !reduced.matches) card.animate([{opacity:.4,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.23,1,.32,1)'});
  });
}));

const choices = {
  launch: ['01 / Starting presence','Build the essentials.','Give people the identity and key materials they need to recognize and understand you. Add other touchpoints when they answer a clear need.'],
  grow: ['02 / Growing presence','Make it work together.','Connect your materials, digital presence and daily communication in one coherent system that reflects the business you have become.'],
  refresh: ['03 / Evolving presence','Refine with intent.','Keep what is working. Identify the gaps and sharpen the elements that matter most. A full rebrand only makes sense when the diagnosis supports it.']
};
const choiceButtons = document.querySelectorAll('[data-choice]');
choiceButtons.forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  choiceButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const [number,title,copy] = choices[button.dataset.choice];
  document.getElementById('choice-number').textContent = number;
  document.getElementById('choice-title').textContent = title;
  document.getElementById('choice-copy').textContent = copy;
  const panel = document.querySelector('.choice-result');
  panel.getAnimations().forEach(animation => animation.cancel());
  if (!reduced.matches) panel.animate([{opacity:.55,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.23,1,.32,1)'});
}));

const stages = [
  ['01 / 03','U','See the business clearly.','We listen, observe and identify what affects the way people understand and trust your business. The goal is to find the real gap before choosing a design response.'],
  ['02 / 03','D','Choose the right direction.','We define a focused brief and a practical scope. The decisions about audience, message and touchpoints become a clear guide for the creative work.'],
  ['03 / 03','E','Make the idea visible.','We turn the direction into a coherent visual system and apply it with care across the places where your business needs to show up.']
];
const tabs = [...document.querySelectorAll('[data-step]')];
function selectStage(index,focus=false) {
  if (!tabs.length) return;
  tabs.forEach((tab,i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
  const [count,letter,title,copy] = stages[index];
  document.getElementById('process-count').textContent = count;
  document.getElementById('process-letter').textContent = letter;
  document.getElementById('process-title').textContent = title;
  document.getElementById('process-copy').textContent = copy;
  document.getElementById('indicator-fill').style.width = `${(index+1)*100/3}%`;
  document.querySelector('.process-panel').setAttribute('aria-labelledby',tabs[index].id);
  document.querySelector('.process-shape').style.borderRadius = ['50%','22%','8%'][index];
  document.querySelector('.process-shape').style.transform = `rotate(${[-20,25,0][index]}deg)`;
  if (focus) tabs[index].focus();
  const panel = document.querySelector('.process-panel');
  panel.getAnimations().forEach(animation => animation.cancel());
  if (!reduced.matches) panel.animate([{opacity:.7,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.23,1,.32,1)'});
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => selectStage(index));
  tab.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); selectStage((index+1)%tabs.length,true); } if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); selectStage((index+tabs.length-1)%tabs.length,true); } });
});
document.querySelector('.next-step')?.addEventListener('click', () => { const index = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'); selectStage((index+1)%tabs.length); });

document.getElementById('enquiry-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  if (!form.reportValidity()) { status.textContent = 'Please complete the required fields.'; return; }
  const data = new FormData(form);
  const subject = encodeURIComponent(`Galvure enquiry: ${data.get('focus')}`);
  const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nFocus: ${data.get('focus')}\n\n${data.get('message')}`);
  status.textContent = 'Your email app is opening with a prepared message.';
  window.location.href = `mailto:hello@galvure.com?subject=${subject}&body=${body}`;
});
