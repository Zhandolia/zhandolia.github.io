import { trips, drivers, pickupCode, initialState, transition } from './model.mjs';
const $ = selector => document.querySelector(selector);
let state = initialState();
const stages = ['requested', 'matched', 'arrived', 'in_progress', 'completed'];
const labels = { ready: 'Choose a route', requested: 'Request created', matched: 'Driver matched', arrived: 'At pickup', in_progress: 'On the way', completed: 'Home together', cancelled: 'Request cancelled' };
const metrics = t => `<div class="metrics"><div><strong>${t.miles} mi</strong><small>Sample distance</small></div><div><strong>${t.minutes} min</strong><small>Sample duration</small></div><div><strong>$${t.fare}</strong><small>Illustrative fare</small></div></div>`;
const person = d => `<div class="person"><span class="avatar" aria-hidden="true">${d.name[0]}</span><div><strong>${d.name}</strong><small>Sample driver · ${d.rating} / 5 sample rating</small></div></div>`;
const primary = (text, action) => `<button class="primary" data-action="${action}">${text}</button>`;
const cancel = () => '<button class="text-button cancel" data-action="cancel">Cancel sample request</button>';
const switchTo = role => `<button class="secondary" data-switch="${role}">See ${role} view</button>`;
function render(focus = false) {
  const t = trips.find(t => t.id === state.tripId), d = drivers.find(d => d.id === state.driverId), rider = state.role === 'rider';
  let title, intro, content;
  if (['ready', 'cancelled'].includes(state.status)) {
    title = rider ? 'Where are you heading?' : 'A nearby ride. Your next stop.';
    intro = rider ? 'A designated driver takes you home in your own car.' : 'Explore a sample request from someone travelling with their own car.';
    content = `${state.status === 'cancelled' ? '<p class="success">Sample request cancelled. You can start again below.</p>' : ''}<label class="field">Sample route<select id="trip-select">${trips.map(x => `<option value="${x.id}" ${t.id === x.id ? 'selected' : ''}>${x.pickup} → ${x.destination}</option>`).join('')}</select></label><div class="vehicle"><span class="avatar" aria-hidden="true">C</span><div><strong>Passenger’s own car</strong><small>Sample vehicle · automatic sedan</small></div></div>${metrics(t)}${primary(rider ? 'Request a sample ride' : 'Find sample requests', 'request')}<p class="panel-hint">Try another route to see the map and trip estimate change.</p>`;
  } else if (state.status === 'requested') {
    title = rider ? 'Meet your sample driver.' : 'A ride request is ready.';
    intro = rider ? 'Choose a fictional driver to continue the presentation.' : 'You are viewing the demo as Alex R. Accept the sample request to connect both sides.';
    content = rider ? drivers.map(x => `<button class="driver-choice" data-driver="${x.id}"><span class="avatar" aria-hidden="true">${x.name[0]}</span><span><strong>${x.name}</strong><small>${x.rating} / 5 · sample rating</small></span><span class="eta">${x.eta} min →</span></button>`).join('') : `${person(drivers[0])}<p class="panel-hint">${t.pickup} → ${t.destination}<br>One passenger · automatic sedan</p>${metrics(t)}<button class="primary" data-driver="alex">Accept sample request</button>`;
    content += switchTo(rider ? 'driver' : 'rider') + cancel();
  } else if (state.status === 'matched') {
    title = rider ? 'Your driver is on the way.' : 'You’re matched. Let’s go.';
    intro = rider ? `${d.name} is ${d.eta} minutes away in this sample trip.` : `Head to ${t.pickup} to meet the passenger and their car.`;
    content = `${person(d)}${metrics(t)}${primary('Simulate arrival at pickup', 'arrive')}${switchTo(rider ? 'driver' : 'rider')}${cancel()}`;
  } else if (state.status === 'arrived') {
    title = rider ? 'A quick check before you go.' : 'Confirm the passenger’s code.';
    intro = rider ? 'Share this sample code with your driver to confirm the pickup.' : 'Enter the code shown in rider view to start the sample journey.';
    content = `${person(d)}${rider ? `<p class="code" aria-label="Sample pickup code ${pickupCode}">${pickupCode}</p>${switchTo('driver')}<p class="panel-hint">Switch to driver view and enter the code to continue.</p>` : `<form id="code-form"><label class="field" for="pickup-code">Pickup code<input id="pickup-code" name="code" inputmode="numeric" autocomplete="off" pattern="[0-9]{4}" maxlength="4" placeholder="4 digits" required aria-describedby="code-hint code-error"></label><p id="code-hint" class="panel-hint">For this presentation, the sample code is ${pickupCode}.</p><p id="code-error" class="error" role="alert"></p><button class="primary" type="submit">Confirm code & start trip</button></form>${switchTo('rider')}`}${cancel()}`;
  } else if (state.status === 'in_progress') {
    title = 'On the way home.';
    intro = `The pickup is confirmed. ${d.name} is driving the passenger’s car to ${t.destination}.`;
    content = `${person(d)}${metrics(t)}${primary('Simulate arrival home', 'complete')}${switchTo(rider ? 'driver' : 'rider')}<p class="panel-hint">Trip progress is advanced manually for the demo. No live GPS or navigation is running.</p>`;
  } else {
    title = 'You and your car are home.';
    intro = 'The sample journey is complete. No payment was collected.';
    content = metrics(t);
    if (state.reviewed) content += `<p class="success">Thanks! Your ${state.rating}-star sample review is shown in this session only.</p>`;
    else if (rider) content += '<form id="review-form"><label class="field">How was your sample ride?<select name="rating" id="rating" required><option value="">Choose a rating</option><option value="5">5 stars · Excellent</option><option value="4">4 stars · Good</option><option value="3">3 stars · Okay</option><option value="2">2 stars · Could be better</option><option value="1">1 star · Poor</option></select></label><p id="review-error" class="error" role="alert"></p><button class="primary" type="submit">Submit sample rating</button></form>';
    else content += `<p class="success">Sample trip completed.</p>${switchTo('rider')}`;
    content += '<button class="secondary" data-action="reset">Try another journey</button><p class="panel-hint">Demo progress resets when you refresh or close the page.</p>';
  }
  $('#panel').innerHTML = `<h2 class="panel-heading" id="panel-title" tabindex="-1">${title}</h2><p class="panel-intro">${intro}</p>${content}`;
  document.querySelectorAll('[data-role]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.role === state.role)));
  $('#status-badge').textContent = labels[state.status];
  $('#pickup-label').textContent = t.pickup;
  $('#destination-label').textContent = t.destination;
  $('#map-label').textContent = `${t.pickup} to ${t.destination}: ${labels[state.status]}. Illustrated sample route.`;
  const path = `M${t.point[0]} ${t.point[1]}V${t.end[1]}H${t.end[0]}`;
  $('#route-line').setAttribute('d', path); $('#route-shadow').setAttribute('d', path);
  $('#pickup-marker').setAttribute('transform', `translate(${t.point.join(' ')})`);
  $('#home-marker').setAttribute('transform', `translate(${t.end.join(' ')})`);
  const driverPoint = state.status === 'completed' ? t.end : state.status === 'in_progress' ? [t.point[0], t.end[1]] : state.status === 'arrived' ? t.point : d.point;
  $('#driver-marker').setAttribute('transform', `translate(${driverPoint.join(' ')})`);
  $('#driver-marker').style.display = ['ready', 'cancelled'].includes(state.status) ? 'none' : '';
  $('#approach-line').setAttribute('d', ['requested', 'matched'].includes(state.status) ? `M${d.point.join(' ')}H${t.point[0]}V${t.point[1]}` : '');
  document.querySelectorAll('[data-stage]').forEach(li => {
    const active = stages.indexOf(state.status), index = stages.indexOf(li.dataset.stage);
    li.className = index === active ? 'current' : index < active ? 'done' : '';
    if (index === active) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  if (focus) $('#panel-title').focus({ preventScroll: true });
}
function act(action) {
  try {
    state = transition(state, action);
    render(action.type !== 'trip');
    $('#announcement').textContent = `${state.role === 'rider' ? 'Rider' : 'Driver'} view. ${labels[state.status]}.${state.reviewed ? ' Sample rating saved for this session.' : ''}`;
  } catch (error) {
    const target = $(action.type === 'start' ? '#code-error' : '#review-error');
    if (target) target.textContent = error.message; else $('#announcement').textContent = error.message;
    if (action.type === 'start') { $('#pickup-code').setAttribute('aria-invalid', 'true'); $('#pickup-code').focus(); }
  }
}
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.id === 'reset') act({ type: 'reset' });
  else if (b.dataset.role || b.dataset.switch) act({ type: 'role', value: b.dataset.role || b.dataset.switch });
  else if (b.dataset.driver) act({ type: 'match', driverId: b.dataset.driver });
  else if (b.dataset.action) act({ type: b.dataset.action });
});
document.addEventListener('change', e => { if (e.target.id === 'trip-select') act({ type: 'trip', value: e.target.value }); });
document.addEventListener('submit', e => {
  if (e.target.id === 'code-form') { e.preventDefault(); act({ type: 'start', code: $('#pickup-code').value }); }
  if (e.target.id === 'review-form') { e.preventDefault(); act({ type: 'review', rating: Number($('#rating').value) }); }
});
render();
