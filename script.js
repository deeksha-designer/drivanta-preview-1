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

const searchDialog = document.querySelector('#site-search');
const searchTriggers = [...document.querySelectorAll('.header-search, .mobile-search-trigger')];
const searchClose = searchDialog.querySelector('.search-close');
const searchInput = searchDialog.querySelector('#site-search-input');
const searchForm = searchDialog.querySelector('.search-form');
const searchResults = searchDialog.querySelector('.search-results');
const searchIndex = [
  { title: 'Gaskets & sealing systems', keywords: 'gaskets sealing powertrain products', href: '#products' },
  { title: 'Forged components', keywords: 'forging forged powertrain products', href: '#products' },
  { title: 'Chassis components', keywords: 'chassis vehicle systems products', href: '#products' },
  { title: 'Rubber components', keywords: 'rubber hoses vibration products', href: '#products' },
  { title: 'Passenger and commercial vehicle applications', keywords: 'passenger commercial vehicles application', href: '#applications' },
  { title: 'Electric mobility', keywords: 'electric vehicle ev mobility application', href: '#applications' },
  { title: 'Engineering review capabilities', keywords: 'engineering review process requirement capabilities', href: '#capabilities' },
  { title: 'Quality and validation evidence', keywords: 'quality inspection validation traceability evidence', href: '#quality' },
  { title: 'RFQ guides and technical resources', keywords: 'rfq guide resources technical library', href: '#resources' },
  { title: 'Request a quote', keywords: 'quote contact enquiry requirement brief', href: '#quote' }
];
let searchReturnFocus = null;
const renderSearchResults = value => {
  const query = value.trim().toLowerCase();
  if (!query) {
    searchResults.innerHTML = '';
    return;
  }
  const matches = searchIndex.filter(item => `${item.title} ${item.keywords}`.toLowerCase().includes(query));
  searchResults.innerHTML = matches.length
    ? matches.map(item => `<a href="${item.href}"><span>${item.title}</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>`).join('')
    : '<p>No matching content found. Try products, applications, quality or RFQ.</p>';
  searchResults.querySelectorAll('a').forEach(link => link.addEventListener('click', closeSearch));
};
function openSearch(trigger) {
  closeMega();
  searchReturnFocus = trigger;
  searchDialog.hidden = false;
  document.body.classList.add('search-open');
  searchTriggers.forEach(item => item.setAttribute('aria-expanded', 'true'));
  window.setTimeout(() => searchInput.focus(), 30);
}
function closeSearch() {
  searchDialog.hidden = true;
  document.body.classList.remove('search-open');
  searchTriggers.forEach(item => item.setAttribute('aria-expanded', 'false'));
  if (searchReturnFocus) searchReturnFocus.focus();
}
searchTriggers.forEach(trigger => trigger.addEventListener('click', () => openSearch(trigger)));
searchClose.addEventListener('click', closeSearch);
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  renderSearchResults(searchInput.value);
});
searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
searchDialog.querySelectorAll('[data-search]').forEach(button => button.addEventListener('click', () => {
  searchInput.value = button.dataset.search;
  renderSearchResults(searchInput.value);
  searchInput.focus();
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !searchDialog.hidden) closeSearch();
});

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
  ['Start with the vehicle, duty cycle and performance need.','Connect the operating context before product selection.','assets/images/premium/application-engineering.jpg','assets/images/premium/product-sealing.jpg'],
  ['Bring drawings, interfaces and material expectations together.','Organise the technical inputs into one review-ready brief.','assets/images/premium/product-sealing.jpg','assets/images/premium/suspension-detail.jpg'],
  ['Review manufacturability, quality evidence and open questions.','Keep engineering and sourcing decisions connected.','assets/images/premium/quality-inspection.jpg','assets/images/premium/manufacturing-cnc.jpg'],
  ['Agree the validation scope before quotation and nomination.','Create a clearer path from review to commercial response.','assets/images/premium/factory-operator.jpg','assets/images/premium/hero-assembly.jpg']
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
