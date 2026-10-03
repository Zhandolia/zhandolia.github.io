// Original pixel-art worlds. All artwork is generated locally; no network assets.
(() => {
  const canvas = document.querySelector('#space');
  const button = document.querySelector('#motion-toggle');
  const context = canvas?.getContext('2d');
  if (!context || !button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const bayer = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  let seed = 4127;
  const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
  const stars = Array.from({length:240}, () => ({x:random(),y:random(),phase:random()*6.28,size:random()>.96?2:1,speed:.2+random()*.7}));
  let width = 0, height = 0, worlds = [], paused = reduced.matches;
  let frame = 0, elapsed = 0, lastTime = 0;
  let coverVisible = document.querySelector('#about').classList.contains('active') || !document.body.classList.contains('panels-ready');

  function makeWorld(radius, kind) {
    const ringed = kind === 'ringed';
    const extent = ringed ? 2.36 : 1.08;
    const size = Math.ceil(radius * extent * 2);
    const art = document.createElement('canvas');
    art.width = size; art.height = size;
    const paint = art.getContext('2d');
    const middle = size / 2;
    const tilt = .68, cos = Math.cos(tilt), sin = Math.sin(tilt);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x-middle)/radius, dy = (y-middle)/radius;
        const d = dx*dx+dy*dy;
        const u = dx*cos+dy*sin, v = -dx*sin+dy*cos;
        const rd = Math.hypot(u/1.85,v/.55);
        const ring = ringed && rd>.72 && rd<1.22;
        let brightness = 0, light = '#d9d6cf', dark = '#1e1b18';
        if (ring && (d>1 || v>.1)) {
          const gap = rd>1.03 && rd<1.065;
          brightness = gap ? .025 : (.64+.21*Math.sin(rd*150))*(.85-.18*dx);
          if (u>.35 && v<.18) brightness *= .22;
          light = '#d9d6cf'; dark = '#1e1b18';
        } else if (d<=1) {
          const z = Math.sqrt(1-d);
          const illumination = Math.max(0,-.61*dx-.4*dy+.57*z);
          brightness = illumination*(.81+.16*Math.sin((dy+dx*.1)*37));
          if (kind==='blue') {
            const land = Math.sin(dx*9+Math.sin(dy*7))+Math.cos(dy*13+z*5)>.6;
            const cloud = Math.sin(dx*18+dy*20)*Math.sin(z*16+dy*9)>.68;
            light = cloud ? '#d5e5d6' : land ? '#9da987' : '#75aaa9';
            dark = land ? '#293e32' : '#1c3a42';
            brightness = illumination*(cloud?1.1:.9);
          } else if (kind==='rust') {
            light = '#d9a67d'; dark = '#513a2f';
            brightness = illumination*(.75+.2*Math.sin(dx*17+Math.cos(dy*9)));
          } else if (kind==='moon') {
            light = '#b9c2b9'; dark = '#2b3635';
            brightness = illumination*(.7+.25*Math.sin(dx*15)*Math.cos(dy*19));
          }
        } else continue;
        const threshold = (bayer[(y%4)*4+x%4]+.5)/16;
        paint.fillStyle = brightness>threshold ? light : dark;
        paint.fillRect(x,y,1,1);
      }
    }
    return art;
  }
  function resize() {
    // Layout dimensions stay stable while the page is rotating in 3D.
    const bounds = { width: canvas.clientWidth, height: canvas.clientHeight };
    // A deliberately low resolution makes square pixels visible, even on Retina.
    const newWidth = Math.max(1,Math.ceil(bounds.width/3));
    const newHeight = Math.max(1,Math.ceil(bounds.height/3));
    if (newWidth===width && newHeight===height) return;
    width = canvas.width = newWidth; height = canvas.height = newHeight;
    context.imageSmoothingEnabled = false;
    const mobile = bounds.width<700;
    const r = Math.min(width*.29,height*.48);
    worlds = [{art:makeWorld(r,'ringed'),x:.63,y:.68,phase:0,drift:2}];
    draw(elapsed);
  }
  function draw(time) {
    context.fillStyle = '#1e1b18'; context.fillRect(0,0,width,height);
    for (const star of stars) {
      const alpha = .24+.27*(1+Math.sin(star.phase+time*.0005));
      context.fillStyle = `rgba(216,213,205,${alpha})`;
      const x = Math.floor((star.x*width+time*.001*star.speed)%width);
      const y = Math.floor(star.y*height);
      context.fillRect(x,y,star.size,star.size);
      if (star.size===2) {
        context.globalAlpha=.4;
        context.fillRect(x-2,y,6,1); context.fillRect(x,y-2,1,6);
        context.globalAlpha=1;
      }
    }
    for (const world of worlds) {
      const drift = Math.sin(time*.00025+world.phase)*world.drift;
      const x = Math.round(world.x*width-world.art.width/2);
      const y = Math.round(world.y*height-world.art.height/2+drift);
      context.drawImage(world.art,x,y);
    }
    // One brief, slow shooting star per 18-second cycle.
    const streak = (time+3500)%18000;
    if (streak<1800) {
      const progress = streak/1800;
      const x = Math.round(width*(.45+progress*.22)), y = Math.round(height*(.03+progress*.17));
      for (let i=0;i<14;i++) {
        context.fillStyle = `rgba(216,213,205,${(1-i/14)*.65})`;
        context.fillRect(x-i,y-Math.floor(i*.4),1,1);
      }
    }
  }
  function tick(now) {
    if (now-lastTime>=1000/24) {
      if (lastTime) elapsed+=Math.min(now-lastTime,100);
      lastTime=now; draw(elapsed);
    }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); lastTime=0;
    button.textContent=paused?'Play animation':'Pause animation';
    button.setAttribute('aria-pressed',String(paused));
    if (!paused && coverVisible && !document.hidden) frame=requestAnimationFrame(tick);
  }
  button.hidden=false;
  button.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',event=>{paused=event.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('panelchange',event=>{
    coverVisible=event.detail.page==='about';
    if (coverVisible) resize();
    sync();
  });
  new ResizeObserver(()=>{if(coverVisible) resize();}).observe(canvas.parentElement);
  resize();sync();
})();
