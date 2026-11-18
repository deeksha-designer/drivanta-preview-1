const header = document.querySelector('.site-header');
const megaTriggers = [...document.querySelectorAll('.mega-trigger')];
const megaMenus = [...document.querySelectorAll('.mega-menu')];
const closeMega = () => {
  megaMenus.forEach(menu => menu.hidden = true);
  megaTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
};
const openMega = trigger => {
  const menu = document.getElementById(trigger.getAttribute('aria-controls'));
  closeMega();
  menu.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
};
megaTriggers.forEach(trigger => trigger.addEventListener('click', event => {
  event.stopPropagation();
  const menu = document.getElementById(trigger.getAttribute('aria-controls'));
  const opening = menu.hidden;
  closeMega();
  if (opening) openMega(trigger);
}));
megaTriggers.forEach(trigger => {
  trigger.addEventListener('mouseenter', () => openMega(trigger));
  trigger.addEventListener('focus', () => openMega(trigger));
});
header.addEventListener('mouseleave', closeMega);
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMega();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMega();
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuToggle.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const track = document.querySelector('.product-track');
const cards = [...document.querySelectorAll('.product-card')];
let productIndex = 0;
function moveProducts(direction) {
  const visible = window.innerWidth > 1020 ? 3 : window.innerWidth > 700 ? 2 : 1;
  const max = Math.max(0, cards.length - visible);
  productIndex = Math.min(max, Math.max(0, productIndex + direction));
  const gap = 18;
  const distance = cards[0].getBoundingClientRect().width + gap;
  track.style.transform = `translateX(${-productIndex * distance}px)`;
}
document.querySelector('[data-product="prev"]').addEventListener('click', () => moveProducts(-1));
document.querySelector('[data-product="next"]').addEventListener('click', () => moveProducts(1));
window.addEventListener('resize', () => { productIndex = 0; track.style.transform = ''; });

const filterButtons = [...document.querySelectorAll('.filter-tabs button')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  productIndex = 0;
  track.style.transform = '';
  const firstVisible = cards.find(card => !card.hidden);
  if (firstVisible) firstVisible.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});
}));

const journeyTabs = [...document.querySelectorAll('.journey-tabs button')];
const journeyContent = [
  ['Start with the vehicle, duty cycle and performance need.','Connect the operating context before product selection.','assets/images/application-engineering.png','assets/images/hero-components.png'],
  ['Bring drawings, interfaces and material expectations together.','Organise the technical inputs into one review-ready brief.','assets/images/hero-components.png','assets/images/product-families.png'],
  ['Review manufacturability, quality evidence and open questions.','Keep engineering and sourcing decisions connected.','assets/images/gasket-metrology.png','assets/images/quality-inspection.png'],
  ['Agree the validation scope before quotation and nomination.','Create a clearer path from review to commercial response.','assets/images/quality-inspection.png','assets/images/manufacturing-floor.png']
];
journeyTabs.forEach((tab, selectedIndex) => tab.addEventListener('click', () => {
  journeyTabs.forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  const cards = [...document.querySelectorAll('.journey-cards article')];
  cards.forEach(card => card.classList.add('is-changing'));
  window.setTimeout(() => {
    document.querySelector('#journey-title-a').textContent = journeyContent[selectedIndex][0];
    document.querySelector('#journey-title-b').textContent = journeyContent[selectedIndex][1];
    document.querySelector('#journey-image-a').src = journeyContent[selectedIndex][2];
    document.querySelector('#journey-image-b').src = journeyContent[selectedIndex][3];
    cards.forEach(card => card.classList.remove('is-changing'));
  }, 160);
}));

const processCards = [...document.querySelectorAll('.cap-flow article')];
let processIndex = 0;
function moveProcess(direction) {
  processIndex = (processIndex + direction + processCards.length) % processCards.length;
  processCards.forEach((card, index) => card.classList.toggle('active', index === processIndex));
  const flow = document.querySelector('.cap-flow');
  flow.scrollTo({left:processCards[processIndex].offsetLeft-flow.offsetLeft,behavior:'smooth'});
}
document.querySelector('.cap-prev').addEventListener('click', () => moveProcess(-1));
document.querySelector('.cap-next').addEventListener('click', () => moveProcess(1));

const logoMarquee = document.querySelector('.logo-marquee');
if (logoMarquee) [...logoMarquee.children].forEach(item => logoMarquee.append(item.cloneNode(true)));

const revealTargets = document.querySelectorAll('main > section:not(.hero), .footer-contact');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }), {threshold:.12});
  revealTargets.forEach(target => { target.classList.add('reveal-section'); revealObserver.observe(target); });
}

const statValues = [...document.querySelectorAll('.stats dd[data-value]')];
const animateStats = () => statValues.forEach(stat => {
  const target = Number(stat.dataset.value);
  const start = performance.now();
  const tick = now => {
    const progress = Math.min(1, (now - start) / 900);
    const eased = 1 - Math.pow(1 - progress, 3);
    stat.textContent = String(Math.round(target * eased)).padStart(2, '0');
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
if ('IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { animateStats(); statsObserver.disconnect(); }
  }), {threshold:.35});
  const stats = document.querySelector('.stats');
  if (stats) statsObserver.observe(stats);
} else animateStats();
