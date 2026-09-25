// Self-contained presentation data. No production users, locations, or services.
export const trips = [
  { id: 'riverside', pickup: 'Riverside Café', destination: 'Oak Street home', miles: 5.4, minutes: 18, fare: 22, point: [200, 150], end: [510, 340] },
  { id: 'arts', pickup: 'Arts District', destination: 'Parkside home', miles: 3.8, minutes: 14, fare: 17, point: [340, 110], end: [145, 350] },
  { id: 'station', pickup: 'Central Station', destination: 'Hillcrest home', miles: 7.2, minutes: 25, fare: 29, point: [290, 280], end: [530, 130] },
];
export const drivers = [
  { id: 'alex', name: 'Alex R.', rating: '4.9', eta: 4, point: [140, 220] },
  { id: 'sam', name: 'Sam T.', rating: '4.8', eta: 7, point: [440, 190] },
];
export const pickupCode = '4821';
export const initialState = () => ({ status: 'ready', tripId: 'riverside', driverId: 'alex', role: 'rider', rating: 0, reviewed: false });
export function transition(state, action) {
  const s = { ...state };
  const requireStatus = (...allowed) => { if (!allowed.includes(s.status)) throw new Error('That action is not available at this stage.'); };
  switch (action.type) {
    case 'role':
      if (!['rider', 'driver'].includes(action.value)) throw new Error('Choose a rider or driver view.');
      s.role = action.value; break;
    case 'trip':
      requireStatus('ready', 'cancelled');
      if (!trips.some(t => t.id === action.value)) throw new Error('Choose a sample route.');
      s.tripId = action.value; s.status = 'ready'; break;
    case 'request': requireStatus('ready', 'cancelled'); s.status = 'requested'; s.rating = 0; s.reviewed = false; break;
    case 'match':
      requireStatus('requested');
      if (!drivers.some(d => d.id === action.driverId)) throw new Error('Choose a sample driver.');
      s.driverId = action.driverId; s.status = 'matched'; break;
    case 'arrive': requireStatus('matched'); s.status = 'arrived'; break;
    case 'start':
      requireStatus('arrived');
      if (String(action.code).trim() !== pickupCode) throw new Error('That code does not match. Use the sample rider’s code, 4821.');
      s.status = 'in_progress'; break;
    case 'complete': requireStatus('in_progress'); s.status = 'completed'; break;
    case 'review':
      requireStatus('completed');
      if (s.reviewed) throw new Error('This sample review has already been submitted.');
      if (!Number.isInteger(action.rating) || action.rating < 1 || action.rating > 5) throw new Error('Choose a rating from 1 to 5.');
      s.rating = action.rating; s.reviewed = true; break;
    case 'cancel': requireStatus('requested', 'matched', 'arrived'); s.status = 'cancelled'; break;
    case 'reset': return initialState();
    default: throw new Error('Unknown action.');
  }
  return s;
}
