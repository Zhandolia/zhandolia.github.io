// All portfolio content and navigation work without JavaScript.
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
let scheduled = false;
function updateNavigation() {
  scheduled = false;
  let active = '';
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= Math.max(140, window.innerHeight * .25)) active = section.id;
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8) active = 'contact';
  for (const link of links) {
    if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function scheduleUpdate() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate, { passive: true });
updateNavigation();

// Original procedural pixel art: ordered dithering on a lit sphere and tilted rings.
// The expensive planet texture is drawn once. Only the stars and its position move.
(() => {
  const canvas = document.querySelector('#space');
  const button = document.querySelector('#motion-toggle');
  const context = canvas?.getContext('2d');
  if (!context || !button) return;
  const w = canvas.width, h = canvas.height;
  const planet = document.createElement('canvas');
  planet.width = w; planet.height = h;
  const texture = planet.getContext('2d');
  if (!texture) return;
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const cx = 205, cy = 157, radius = 68, tilt = -.48;
  const cosine = Math.cos(tilt), sine = Math.sin(tilt);
  for (let y = 16; y < h - 25; y += 2) {
    for (let x = 8; x < w - 8; x += 2) {
      const dx = (x - cx) / radius, dy = (y - cy) / radius;
      const u = dx * cosine + dy * sine;
      const v = -dx * sine + dy * cosine;
      const ringDistance = Math.hypot(u / 1.85, v / .58);
      const sphereDistance = dx * dx + dy * dy;
      const ring = ringDistance > .73 && ringDistance < 1.22;
      let brightness = 0;
      if (ring && (sphereDistance > 1 || v > .13)) {
        const bands = .6 + .25 * Math.sin(ringDistance * 135);
        const gap = ringDistance > 1.027 && ringDistance < 1.06;
        brightness = gap ? .045 : bands * (.82 - .2 * dx);
        // The planet casts a soft shadow over the right-hand rings.
        if (u > .35 && v < .18) brightness *= .28;
      } else if (sphereDistance <= 1) {
        const z = Math.sqrt(1 - sphereDistance);
        const light = Math.max(0, -.6 * dx - .38 * dy + .57 * z);
        const bands = .84 + .13 * Math.sin((dy + dx * .13) * 39);
        brightness = light * bands;
      } else continue;
      const threshold = (bayer[((y / 2) % 4) * 4 + ((x / 2) % 4)] + .5) / 16;
      texture.fillStyle = brightness > threshold ? '#c7d5b8' : '#222a23';
      texture.fillRect(x, y, 2, 2);
    }
  }
  // Seeded positions make the sky stable across reloads.
  let seed = 4127;
  function random() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  const stars = Array.from({ length: 95 }, () => ({ x: random() * w, y: random() * h, phase: random() * Math.PI * 2, size: random() > .94 ? 2 : 1, speed: .3 + random() * .6 }));
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = preference.matches, visible = true, frame = 0, elapsed = 0, lastTime = 0;
  function draw(time) {
    context.clearRect(0, 0, w, h);
    for (const star of stars) {
      const brightness = .28 + .32 * (1 + Math.sin(star.phase + time * .0005));
      context.fillStyle = `rgba(199,213,184,${brightness})`;
      const x = Math.floor((star.x + time * .0017 * star.speed) % w);
      context.fillRect(x, Math.floor(star.y), star.size, star.size);
      if (star.size === 2) {
        context.globalAlpha = .35;
        context.fillRect(x - 2, Math.floor(star.y), 6, 1);
        context.fillRect(x, Math.floor(star.y) - 2, 1, 6);
        context.globalAlpha = 1;
      }
    }
    context.drawImage(planet, 0, Math.round(Math.sin(time * .0003) * 3));
  }
  function tick(now) {
    if (now - lastTime >= 1000 / 24) {
      if (lastTime) elapsed += Math.min(now - lastTime, 100);
      lastTime = now;
      draw(elapsed);
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    lastTime = 0;
    button.textContent = paused ? 'Play animation' : 'Pause animation';
    button.setAttribute('aria-pressed', String(paused));
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  button.hidden = false;
  button.addEventListener('click', () => { paused = !paused; sync(); });
  preference.addEventListener('change', event => { paused = event.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(canvas);
  }
  draw(0);
  sync();
})();
