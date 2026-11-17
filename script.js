const menuToggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('.mobile-menu');
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');mobileMenu.classList.toggle('open',!open);menuToggle.querySelector('i').className=open?'fa-solid fa-bars':'fa-solid fa-xmark'});
mobileMenu.addEventListener('click',e=>{if(e.target.closest('a')){mobileMenu.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}});
const navTrigger=document.querySelector('.nav-trigger');
const navItem=navTrigger.closest('.nav-item');
navTrigger.addEventListener('click',()=>{const open=!navItem.classList.contains('open');navItem.classList.toggle('open',open);navTrigger.setAttribute('aria-expanded',String(open))});
document.addEventListener('click',e=>{if(!e.target.closest('.nav-item')){navItem.classList.remove('open');navTrigger.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){navItem.classList.remove('open');navTrigger.setAttribute('aria-expanded','false');mobileMenu.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}});
const megaData=[
  ['Sealing & Gaskets','MLS gaskets, heatshields and application-led sealing solutions.','product-sealing.png','Sealing components preview'],
  ['Precision Forgings','Forged gears, transmission shafts, axles and crown wheels.','product-forgings.png','Precision forgings preview'],
  ['Chassis & Suspension','Control arms, steering knuckles and axle assemblies.','product-chassis.png','Chassis components preview'],
  ['Anti-Vibration & Rubber','Mounts, bushings, molded rubber parts and hoses.','product-rubber.png','Rubber components preview']
];
document.querySelectorAll('.mega-tab').forEach(tab=>{const activate=()=>{document.querySelectorAll('.mega-tab').forEach(item=>item.classList.toggle('active',item===tab));const data=megaData[Number(tab.dataset.mega)];document.querySelector('#mega-title').textContent=data[0];document.querySelector('#mega-text').textContent=data[1];const image=document.querySelector('#mega-image');image.src=`assets/images/${data[2]}`;image.alt=data[3]};tab.addEventListener('mouseenter',activate);tab.addEventListener('focus',activate)});
const productTrack=document.querySelector('.product-track');
const moveProducts=direction=>productTrack.scrollBy({left:direction*productTrack.clientWidth*.75,behavior:'smooth'});
document.querySelector('.product-prev').addEventListener('click',()=>moveProducts(-1));
document.querySelector('.product-next').addEventListener('click',()=>moveProducts(1));
const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const index=entry.target.dataset.app;document.querySelectorAll('.app-scene').forEach(scene=>scene.classList.toggle('active',scene===entry.target));document.querySelectorAll('[data-app-image]').forEach(image=>image.classList.toggle('active',image.dataset.appImage===index))}}),{rootMargin:'-35% 0px -35% 0px',threshold:.05});
document.querySelectorAll('.app-scene').forEach(scene=>sceneObserver.observe(scene));
const capSlides=[
  {title:'Share the requirement',text:'Begin with application, drawing context, annual volume and validation needs.',a:['Connect','Bring the requirement into one view','hero-components.png'],b:['Structure','Align specification and evidence','quality-inspection.png']},
  {title:'Review the application',text:'Organize vehicle context, material needs and expected operating conditions.',a:['Application','Start with the vehicle context','application-engineering.png'],b:['Material','Map component requirements','product-rubber.png']},
  {title:'Prepare the sourcing path',text:'Bring product, quality and commercial questions into one review.',a:['Review','Inspect relevant evidence','gasket-metrology.png'],b:['Source','Prepare the next conversation','product-forgings.png']}
];
let capIndex=0;
const renderCapability=()=>{const slide=capSlides[capIndex];document.querySelector('#cap-number').textContent=String(capIndex+1).padStart(2,'0');document.querySelector('#cap-title').textContent=slide.title;document.querySelector('#cap-text').textContent=slide.text;[['a',slide.a],['b',slide.b]].forEach(([side,data])=>{document.querySelector(`#cap-label-${side}`).textContent=data[0];document.querySelector(`#cap-card-${side}`).textContent=data[1];const image=document.querySelector(`#cap-image-${side}`);image.src=`assets/images/${data[2]}`;image.alt=data[1]})};
document.querySelector('.cap-prev').addEventListener('click',()=>{capIndex=(capIndex+capSlides.length-1)%capSlides.length;renderCapability()});
document.querySelector('.cap-next').addEventListener('click',()=>{capIndex=(capIndex+1)%capSlides.length;renderCapability()});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(item=>revealObserver.observe(item));
const video=document.querySelector('.hero-video');
new IntersectionObserver(entries=>entries.forEach(entry=>entry.isIntersecting?video.play().catch(()=>{}):video.pause()),{threshold:.05}).observe(video);
