(() => {
  const panels = [...document.querySelectorAll('.panel')];
  const tabs = panels.map(panel => panel.querySelector('.panel-tab'));
  const bodies = panels.map(panel => panel.querySelector('.panel-content'));
  const aliases = {top:'about',experience:'work',contact:'about'};
  const fromHash = () => { const hash=location.hash.slice(1); return Math.max(0,panels.findIndex(panel=>panel.id===(aliases[hash]||hash))); };
  let active=-1;
  function show(index, focus=false) {
    if(index===active || index<0 || index>=panels.length)return;
    active=index;
    panels.forEach((panel,i)=>{
      panel.classList.toggle('active',i===index);
      tabs[i].setAttribute('aria-expanded',String(i===index));
      bodies[i].hidden=i!==index;
      bodies[i].inert=i!==index;
    });
    if(focus)tabs[index].focus({preventScroll:true});
    document.dispatchEvent(new CustomEvent('panelchange',{detail:{page:panels[index].id}}));
  }
  function navigate(index) {
    if(index===active || index<0 || index>=panels.length)return;
    history.pushState(null,'',`#${panels[index].id}`);
    show(index,true);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>navigate(index));
    tab.addEventListener('keydown',event=>{
      let next=index;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%panels.length;
      else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+panels.length-1)%panels.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=panels.length-1;
      else return;
      event.preventDefault();navigate(next);
    });
  });
  document.querySelector('.footer-name').addEventListener('click',event=>{event.preventDefault();navigate(0);});
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();bodies[active].focus({preventScroll:true});});
  window.addEventListener('hashchange',()=>show(fromHash()));
  window.addEventListener('popstate',()=>show(fromHash()));
  document.body.classList.add('panels-ready');
  show(fromHash());
  const clock=document.querySelector('#local-time');
  function updateClock(){clock.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZoneName:'short'}).format(new Date());clock.dateTime=new Date().toISOString();}
  updateClock();setInterval(updateClock,60000);
})();
