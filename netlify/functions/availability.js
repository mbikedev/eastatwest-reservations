// Netlify Function — GET /.netlify/functions/availability?date=YYYY-MM-DD
// Returns per-slot seat availability computed from existing Supabase reservations.

const CAPACITY = 22;

const ALL_SLOTS = [
  '12:00','12:30','13:00','13:30','14:00',
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00',
];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

function fullCapacity(date) {
  const available = Object.fromEntries(ALL_SLOTS.map(s => [s, CAPACITY]));
  return { statusCode: 200, headers: CORS, body: JSON.stringify({ date, available, capacity: CAPACITY }) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const { date } = event.queryStringParameters || {};
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid or missing date (YYYY-MM-DD)' }) };
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, return full capacity so the UI still works
  if (!url || !key) return fullCapacity(date);

  let reservations = [];
  try {
    const res = await fetch(
      `${url}/rest/v1/reservations?date=eq.${date}&status=neq.cancelled&select=start_time,end_time,guests`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (res.ok) reservations = await res.json();
  } catch (_) {
    // Network error — fall back to full capacity so booking still works
    return fullCapacity(date);
  }

  // For each slot, count guests whose reservation spans it (start <= slot < end)
  const available = {};
  for (const slot of ALL_SLOTS) {
    const booked = reservations
      .filter(r => r.start_time <= slot && slot < r.end_time)
      .reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
    available[slot] = Math.max(0, CAPACITY - booked);
  }

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({ date, available, capacity: CAPACITY }),
  };
};
