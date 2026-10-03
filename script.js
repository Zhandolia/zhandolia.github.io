// Original, deterministic point-rendered spiral galaxy. No external imagery.
(() => {
  const canvas = document.querySelector('#space');
  const button = document.querySelector('#motion-toggle');
  const context = canvas?.getContext('2d');
  if (!context || !button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let seed = 73129;
  function random() { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; }
  function normal() { return Math.sqrt(-2 * Math.log(Math.max(.00001, random()))) * Math.cos(2 * Math.PI * random()); }
  const colors = ['#879ae0', '#a7b6f0', '#baa9e0', '#dfbed1', '#f0ccaf', '#ffe6cb'];
  const particles = [];
  // Three loose spiral arms, with a warmer, denser central bulge.
  for (let i = 0; i < 5800; i++) {
    const radius = Math.pow(random(), .72);
    const angle = (i % 3) * Math.PI * 2 / 3 + radius * 6.8 + normal() * (.12 + radius * .27);
    particles.push({ radius, angle, depth: normal() * .022, color: radius < .19 ? 5 : radius < .38 ? 4 : Math.floor(random() * 4), alpha: .26 + random() * .64, phase: random() * 6.28, size: random() > .987 ? 1.4 : .65 });
  }
  for (let i = 0; i < 1500; i++) {
    const radius = Math.abs(normal()) * .12;
    particles.push({ radius, angle: random() * Math.PI * 2, depth: normal() * .016, color: random() > .4 ? 5 : 4, alpha: .35 + random() * .5, phase: random() * 6.28, size: .65 });
  }
  const stars = Array.from({length:155}, () => ({x:random(),y:random(),alpha:.12+random()*.55,size:random()>.98?2:1,phase:random()*6.28}));
  let width = 0, height = 0, radius = 0, tilt = 0, field = null;
  let frame = 0, elapsed = 0, lastTime = 0, paused = reduced.matches;
  let active = document.querySelector('#about').classList.contains('active') || !document.body.classList.contains('panels-ready');
  let inView = true;

  function resize() {
    // Use layout dimensions so an expanding panel cannot distort the artwork.
    const cssWidth = canvas.clientWidth, cssHeight = canvas.clientHeight;
    if (!cssWidth || !cssHeight) return;
    const ratio = Math.max(2, cssWidth / 700);
    const nextWidth = Math.ceil(cssWidth / ratio), nextHeight = Math.ceil(cssHeight / ratio);
    if (width === nextWidth && height === nextHeight) return;
    width = canvas.width = nextWidth; height = canvas.height = nextHeight;
    context.imageSmoothingEnabled = false;
    tilt = cssWidth < 600 ? -.92 : -.3;
    const xExtent = Math.sqrt(Math.cos(tilt) ** 2 + (.52 * Math.sin(tilt)) ** 2);
    const yExtent = Math.sqrt(Math.sin(tilt) ** 2 + (.52 * Math.cos(tilt)) ** 2);
    radius = Math.min(width * .46 / xExtent, height * .43 / yExtent);
    field = document.createElement('canvas'); field.width = width; field.height = height;
    const sky = field.getContext('2d');
    sky.fillStyle = '#0d1325'; sky.fillRect(0,0,width,height);
    const halo = sky.createRadialGradient(width*.5,height*.52,0,width*.5,height*.52,radius*.9);
    halo.addColorStop(0,'#313344'); halo.addColorStop(.2,'#22283d'); halo.addColorStop(.6,'#131b31'); halo.addColorStop(1,'#0d1325');
    sky.fillStyle = halo; sky.fillRect(0,0,width,height);
    for (const star of stars) {
      sky.fillStyle = `rgba(172,186,225,${star.alpha})`;
      const x = Math.floor(star.x*width), y = Math.floor(star.y*height);
      sky.fillRect(x,y,1,1);
      if (star.size===2) {
        sky.globalAlpha=.35;
        sky.fillRect(x-2,y,5,1); sky.fillRect(x,y-2,1,5);
        sky.globalAlpha=1;
      }
    }
    draw(elapsed);
  }
  function draw(time) {
    if (!field) return;
    context.drawImage(field,0,0);
    const spin = time * .000023;
    const cos = Math.cos(tilt), sin = Math.sin(tilt);
    const cx = width*.5, cy = height*.52;
    context.globalCompositeOperation = 'lighter';
    for (const point of particles) {
      const a = point.angle + spin;
      const x = Math.cos(a)*point.radius*radius;
      const y = (Math.sin(a)*point.radius*.52+point.depth)*radius;
      const px = Math.round(cx + x*cos-y*sin);
      const py = Math.round(cy + x*sin+y*cos);
      const twinkle = .83+.17*Math.sin(point.phase+time*.001);
      context.globalAlpha=point.alpha*twinkle;
      context.fillStyle=colors[point.color];
      context.fillRect(px,py,point.size,point.size);
    }
    context.globalAlpha=1;
    context.globalCompositeOperation='source-over';
    // Sparse foreground starlight keeps the still sky connected to the animation.
    context.fillStyle='#d8dcf1';
    for (let i=0;i<stars.length;i+=19) {
      const star=stars[i];
      context.globalAlpha=.18+.3*(1+Math.sin(star.phase+time*.0007));
      context.fillRect(Math.floor(star.x*width),Math.floor(star.y*height),1,1);
    }
    context.globalAlpha=1;
  }
  function tick(now) {
    if (now-lastTime>=1000/24) {
      if(lastTime)elapsed+=Math.min(now-lastTime,100);
      lastTime=now;draw(elapsed);
    }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);lastTime=0;
    button.textContent=paused?'Play animation':'Pause animation';
    button.setAttribute('aria-pressed',String(paused));
    if(!paused&&active&&inView&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  button.hidden=false;
  button.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',event=>{paused=event.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('panelchange',event=>{active=event.detail.page==='about';if(active)resize();sync();});
  new ResizeObserver(()=>{if(active)resize();}).observe(canvas.parentElement);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();}).observe(canvas);
  resize();sync();
})();
