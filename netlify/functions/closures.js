// Netlify Function — GET /.netlify/functions/closures
// Returns active holiday closures so the UI can grey out closed dates.

const { fetchActiveHolidays } = require('./lib/closures');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
  // Short cache: closures rarely change, but admins expect edits to show up fast.
  'Cache-Control': 'public, max-age=300',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  try {
    const closures = await fetchActiveHolidays();
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ closures }) };
  } catch (_) {
    // Fail soft: an empty list only affects the visual greying; the reserve and
    // order functions and the database trigger still block closed dates.
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ closures: [] }) };
  }
};
