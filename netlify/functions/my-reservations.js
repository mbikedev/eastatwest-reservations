// Netlify Function — GET /.netlify/functions/my-reservations?email=...
// Returns past reservations for a given email address.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const { email } = event.queryStringParameters || {};
  if (!email || !email.includes('@')) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify([]) };
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/reservations?email=eq.${encodeURIComponent(email)}&order=date.desc&limit=20&select=invoice_number,date,start_time,end_time,guests,status,special_requests`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    const data = res.ok ? await res.json() : [];
    return { statusCode: 200, headers: CORS, body: JSON.stringify(Array.isArray(data) ? data : []) };
  } catch (_) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify([]) };
  }
};
