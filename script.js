const header = document.querySelector('.site-header');
const megaTriggers = [...document.querySelectorAll('.mega-trigger')];
const megaMenus = [...document.querySelectorAll('.mega-menu')];
const closeMega = () => {
  megaMenus.forEach(menu => menu.hidden = true);
  megaTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
};
megaTriggers.forEach(trigger => trigger.addEventListener('click', event => {
  event.stopPropagation();
  const menu = document.getElementById(trigger.getAttribute('aria-controls'));
  const opening = menu.hidden;
  closeMega();
  if (opening) {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }
}));
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

const heroVideo = document.querySelector('.hero video');
const videoControl = document.querySelector('.video-control');
videoControl.addEventListener('click', () => {
  if (heroVideo.paused) {
    heroVideo.play();
    videoControl.textContent = 'Ⅱ';
    videoControl.setAttribute('aria-label', 'Pause background video');
  } else {
    heroVideo.pause();
    videoControl.textContent = '▶';
    videoControl.setAttribute('aria-label', 'Play background video');
  }
});

const track = document.querySelector('.product-track');
const cards = [...document.querySelectorAll('.product-card')];
let productIndex = 0;
function moveProducts(direction) {
  const visible = window.innerWidth > 1020 ? 4 : window.innerWidth > 700 ? 2 : 1;
  const max = Math.max(0, cards.length - visible);
  productIndex = Math.min(max, Math.max(0, productIndex + direction));
  const gap = 18;
  const distance = cards[0].getBoundingClientRect().width + gap;
  track.style.transform = `translateX(${-productIndex * distance}px)`;
}
document.querySelector('[data-product="prev"]').addEventListener('click', () => moveProducts(-1));
document.querySelector('[data-product="next"]').addEventListener('click', () => moveProducts(1));
window.addEventListener('resize', () => { productIndex = 0; track.style.transform = ''; });

const journeyTabs = [...document.querySelectorAll('.journey-tabs button')];
journeyTabs.forEach(tab => tab.addEventListener('click', () => {
  journeyTabs.forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
}));
