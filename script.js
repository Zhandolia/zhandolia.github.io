// Navigation and content remain usable without JavaScript.
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
let scheduled = false;
function updateNavigation() {
  scheduled = false;
  let active = '';
  const threshold = window.innerHeight * 0.35;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) active = section.id;
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
document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', scheduleUpdate));
updateNavigation();
