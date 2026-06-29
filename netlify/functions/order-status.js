// Netlify Function — POST /.netlify/functions/order-status
// Updates a takeaway order's status (confirmed / rejected) and emails the customer.
// Body: { orderId, status }  where status ∈ { 'confirmed', 'rejected' }.
// Optional overrides (skip the DB round-trip): { email, name, lang, when, total, code }.

const {
  getOrder,
  updateOrderStatus,
  normalizeStatus,
  formatWhen,
  sendStatusEmail,
} = require('./lib/order-notify');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const body = JSON.parse(event.body || '{}');
    const { orderId } = body;
    const resolved = normalizeStatus(body.status);

    if (!resolved) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "status must be 'confirmed' or 'rejected'" }) };
    }
    if (!orderId && !body.email) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'orderId (or email) is required' }) };
    }

    // Update the DB row (best-effort) and read back the customer details.
    let row = null;
    if (orderId) {
      try {
        const res = await updateOrderStatus(orderId, resolved);
        row = res.row;
      } catch (dbErr) {
        console.error('Supabase status update error:', dbErr);
        if (!body.email) {
          return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Could not update order status', detail: dbErr.detail }) };
        }
      }
    }

    const email = body.email || (row && row.customer_email) || '';
    const name = body.name || (row && row.customer_name) || '';
    const lang = body.lang || (row && row.language) || 'en';
    const total = (typeof body.total === 'number') ? body.total : (row && Number(row.total_amount));
    const code = body.code || (row && row.code) || '';
    const when = body.when || formatWhen(row, lang);

    let emailed = false;
    if (email) {
      await sendStatusEmail(resolved, { email, name, lang, when, total, code });
      emailed = true;
    }

    return {
      statusCode: 200, headers: CORS,
      body: JSON.stringify({ success: true, status: resolved, emailed }),
    };
  } catch (err) {
    console.error('order-status function error:', err);
    return {
      statusCode: 500, headers: CORS,
      body: JSON.stringify({ error: 'Could not process order status update.' }),
    };
  }
};
