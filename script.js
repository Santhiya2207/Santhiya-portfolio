// ---------- Typing effect ----------
const roles = ["Software Developer", "Full-Stack Developer", "Data Analyst"];
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  if(!typedEl) return;
  const word = roles[roleIndex];
  if(!deleting){
    charIndex++;
    typedEl.textContent = word.slice(0, charIndex);
    if(charIndex === word.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    charIndex--;
    typedEl.textContent = word.slice(0, charIndex);
    if(charIndex === 0){ deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ---------- Scroll reveal (replays each time a slide is active) ----------
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    const kids = e.target.querySelectorAll('.stagger-child');
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      kids.forEach((k, i) => { k.style.transitionDelay = (i * 100) + 'ms'; k.classList.add('in-view'); });
    } else {
      e.target.classList.remove('in-view');
      kids.forEach(k => { k.style.transitionDelay = '0ms'; k.classList.remove('in-view'); });
    }
  });
}, { threshold: 0.35 });
reveals.forEach(el => io.observe(el));

// ---------- Keyboard slide navigation ----------
const allSlides = [document.getElementById('hero'), ...document.querySelectorAll('main > section'), document.querySelector('footer')].filter(Boolean);
function currentSlideIndex(){
  let idx = 0, best = -Infinity;
  allSlides.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if(visible > best){ best = visible; idx = i; }
  });
  return idx;
}
window.addEventListener('keydown', (e) => {
  if(!['ArrowDown','ArrowUp','PageDown','PageUp'].includes(e.key)) return;
  e.preventDefault();
  const idx = currentSlideIndex();
  const dir = (e.key === 'ArrowDown' || e.key === 'PageDown') ? 1 : -1;
  const next = allSlides[Math.min(Math.max(idx + dir, 0), allSlides.length - 1)];
  if(next) next.scrollIntoView({ behavior:'smooth' });
});

// ---------- Scroll progress bar ----------
const progressBar = document.getElementById('scrollProgress');
function updateProgress(){
  if(!progressBar) return;
  const scrollTop = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrollTop / total) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ---------- Dot nav active state ----------
const dots = document.querySelectorAll('.dotnav .dot');
const sections = ['hero','summary','projects','experience','skills','certs']
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const idx = sections.indexOf(entry.target);
      dots.forEach(d => d.classList.remove('active'));
      if(dots[idx]) dots[idx].classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => navIO.observe(s));

// ---------- 3D tilt on hero photo ----------
const photoCard = document.getElementById('photoCard');
if(photoCard && window.matchMedia('(hover:hover)').matches){
  photoCard.addEventListener('mousemove', (e) => {
    const r = photoCard.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    photoCard.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  photoCard.addEventListener('mouseleave', () => {
    photoCard.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  });
}

// ---------- Magnetic buttons ----------
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

// ---------- Cursor glow ----------
const glow = document.getElementById('cursorGlow');
if(glow && window.matchMedia('(hover:hover)').matches){
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
  });
}
