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

// ---------- Scroll reveal (staggered) ----------
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in-view');
      // stagger children that opt in
      const kids = e.target.querySelectorAll('.stagger-child');
      kids.forEach((k, i) => { k.style.transitionDelay = (i * 90) + 'ms'; k.classList.add('in-view'); });
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => io.observe(el));

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

// ---------- Hero photo parallax on scroll ----------
const heroPhoto = document.querySelector('.hero-photo');
function parallaxHero(){
  if(!heroPhoto) return;
  const y = window.scrollY;
  if(y < window.innerHeight){
    heroPhoto.style.transform = `translateY(${y * 0.12}px)`;
  }
}
window.addEventListener('scroll', parallaxHero, { passive: true });

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

// ---------- Particle background ----------
const canvas = document.getElementById('particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w, h, particles;
  const COUNT = 55;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.body.scrollHeight;
  }
  function makeParticles(){
    particles = Array.from({length: COUNT}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
    }));
  }
  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });
  window.addEventListener('load', () => { resize(); makeParticles(); });
  if('ResizeObserver' in window){
    new ResizeObserver(() => resize()).observe(document.body);
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(55,230,196,0.5)';
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    // connecting lines for nearby particles
    ctx.strokeStyle = 'rgba(90,169,255,0.08)';
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    if(!reduceMotion) requestAnimationFrame(step);
  }
  step();
}
