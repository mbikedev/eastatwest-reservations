// Netlify Function — /.netlify/functions/order-action
// Confirm / reject an order straight from the restaurant's notification email.
//
//   GET  ?orderId=..&action=confirm|reject&token=..  → renders a confirmation page
//   POST (form: orderId, action, token)              → performs it + emails the customer
//
// The two-step GET→POST flow prevents email clients (which pre-fetch links) from
// auto-triggering the action. Links are signed with an HMAC token.

const {
  getOrder,
  updateOrderStatus,
  normalizeStatus,
  verifyAction,
  formatWhen,
  sendStatusEmail,
} = require('./lib/order-notify');

const BRAND = '#1F5C2E';
const RED = '#B0413E';

function htmlResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    body,
  };
}

function page({ accent = BRAND, heading, message, inner = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>East at West · Order</title>
</head>
<body style="margin:0;padding:0;background:#EFF1E5;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;padding:48px 16px;min-height:100vh;">
  <tr><td align="center" valign="top">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
      <tr><td align="center" style="padding:0 0 24px;">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${BRAND};">East at West</span>
      </td></tr>
      <tr><td style="background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 28px rgba(26,36,25,0.10);">
        <div style="background:${accent};height:5px;font-size:0;">&nbsp;</div>
        <div style="padding:32px 34px 34px;">
          <h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;color:#1A2419;">${heading}</h1>
          <p style="margin:0 0 22px;font-size:15px;line-height:1.55;color:#4B5A48;">${message}</p>
          ${inner}
        </div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function orderSummary(row, lang) {
  if (!row) return '';
  const when = formatWhen(row, lang);
  const total = (row.total_amount != null && !isNaN(Number(row.total_amount)))
    ? `€${Number(row.total_amount).toFixed(2)}` : '';
  const rows = [
    ['Customer', row.customer_name || ''],
    ['Pickup', when],
    ['Total', total],
    ['Phone', row.customer_phone || ''],
  ].filter(([, v]) => v);
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;border-radius:12px;margin-bottom:24px;">
    <tr><td style="padding:16px 20px;">
      ${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:12px;padding:4px 0;font-size:14px;">
        <span style="color:#7E8B7A;text-transform:uppercase;letter-spacing:0.5px;font-size:11px;font-weight:700;padding-top:3px;">${k}</span>
        <span style="color:#1A2419;font-weight:600;text-align:right;">${v}</span>
      </div>`).join('')}
    </td></tr>
  </table>`;
}

function parseForm(event) {
  const ct = (event.headers && (event.headers['content-type'] || event.headers['Content-Type'])) || '';
  let raw = event.body || '';
  if (event.isBase64Encoded) {
    try { raw = Buffer.from(raw, 'base64').toString('utf8'); } catch (_) {}
  }
  if (ct.includes('application/json')) {
    try { return JSON.parse(raw || '{}'); } catch (_) { return {}; }
  }
  const out = {};
  new URLSearchParams(raw).forEach((v, k) => { out[k] = v; });
  return out;
}

exports.handler = async (event) => {
  const isPost = event.httpMethod === 'POST';
  const params = isPost ? parseForm(event) : (event.queryStringParameters || {});
  const orderId = params.orderId;
  const action = params.action;
  const token = params.token;
  const resolved = normalizeStatus(action);

  // ── Validate ────────────────────────────────────────────────
  if (!orderId || !resolved || !verifyAction(orderId, action, token)) {
    return htmlResponse(400, page({
      accent: RED,
      heading: 'Invalid or expired link',
      message: 'This confirmation link is not valid. Please use the buttons in the original order email, or update the order from your dashboard.',
    }));
  }

  const accent = resolved === 'confirmed' ? BRAND : RED;
  const verb = resolved === 'confirmed' ? 'Confirm' : 'Reject';
  const past = resolved === 'confirmed' ? 'confirmed' : 'rejected';

  // ── Look up the order for context ───────────────────────────
  let row = null;
  try { row = await getOrder(orderId); } catch (e) { console.error('getOrder error:', e); }

  if (row === undefined || row === null) {
    return htmlResponse(404, page({
      accent: RED,
      heading: 'Order not found',
      message: `We could not find order #${orderId}. It may have been removed.`,
    }));
  }

  const lang = row.language || 'en';

  // Already actioned? (any status other than the initial 'pending'.)
  // Don't re-email the customer.
  if (row.status && row.status !== 'pending') {
    const rejectLike = ['rejected', 'cancelled', 'canceled', 'declined', 'refused'].includes(String(row.status).toLowerCase());
    return htmlResponse(200, page({
      accent: rejectLike ? RED : BRAND,
      heading: 'Already handled',
      message: `Order #${orderId} is already marked as <strong>${row.status}</strong>. No further action is needed and the customer has already been notified.`,
      inner: orderSummary(row, lang),
    }));
  }

  // ── GET: show the confirmation screen (no side effects) ─────
  if (!isPost) {
    return htmlResponse(200, page({
      accent,
      heading: `${verb} this order?`,
      message: `You are about to <strong>${past === 'confirmed' ? 'confirm' : 'reject'}</strong> order #${orderId}. The customer will be notified by email.`,
      inner: orderSummary(row, lang) + `
        <form method="POST" action="/.netlify/functions/order-action" style="margin:0;">
          <input type="hidden" name="orderId" value="${orderId}"/>
          <input type="hidden" name="action" value="${action}"/>
          <input type="hidden" name="token" value="${token}"/>
          <button type="submit" style="display:block;width:100%;box-sizing:border-box;border:none;cursor:pointer;background:${accent};color:#fff;font-size:16px;font-weight:700;padding:15px 0;border-radius:12px;">
            ${verb} order
          </button>
        </form>`,
    }));
  }

  // ── POST: perform the update + notify the customer ──────────
  try {
    const { row: updated } = await updateOrderStatus(orderId, resolved);
    const r = updated || row;
    const email = r.customer_email || '';
    let emailed = false;
    if (email) {
      await sendStatusEmail(resolved, {
        email,
        name: r.customer_name || '',
        lang,
        when: formatWhen(r, lang),
        total: r.total_amount != null ? Number(r.total_amount) : undefined,
        code: r.code || '',
      });
      emailed = true;
    }
    return htmlResponse(200, page({
      accent,
      heading: `Order ${past}`,
      message: `Order #${orderId} has been <strong>${past}</strong>.` +
        (emailed
          ? ' A notification email has been sent to the customer.'
          : ' (No customer email was on file, so no email was sent.)'),
      inner: orderSummary(r, lang),
    }));
  } catch (err) {
    console.error('order-action error:', err);
    const detail = err && err.detail
      ? `<br/><br/><span style="font-size:12px;color:#9A6B69;">${String(err.detail).replace(/</g, '&lt;').slice(0, 400)}</span>`
      : '';
    return htmlResponse(500, page({
      accent: RED,
      heading: 'Something went wrong',
      message: `We could not update order #${orderId}. Please try again, or update it from your dashboard.${detail}`,
    }));
  }
};
