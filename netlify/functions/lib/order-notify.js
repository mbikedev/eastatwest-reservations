// Shared helpers for takeaway-order status notifications.
// Used by order-status.js (admin/API call) and order-action.js (email buttons).

const nodemailer = require('nodemailer');
const crypto = require('crypto');

function parsePort(raw) {
  const n = parseInt(String(raw || '').replace(/\D/g, ''), 10);
  return isNaN(n) ? 587 : n;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parsePort(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false },
});

// ── Supabase ──────────────────────────────────────────────────
function supabaseBase() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase URL or key missing');
  return {
    url,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  };
}

async function getOrder(orderId) {
  const { url, headers } = supabaseBase();
  const res = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=*`, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase get error ${res.status}: ${text}`);
  const rows = JSON.parse(text || '[]');
  return Array.isArray(rows) ? rows[0] : rows;
}

// Candidate column values to try, in order of preference. Different deployments
// use different `status` vocabularies (or an enum/check constraint), so we try
// the most likely spellings until one is accepted by the database.
const STATUS_CANDIDATES = {
  confirmed: [
    'confirmed', 'accepted', 'approved', 'ready', 'preparing', 'processing',
    'in_progress', 'paid', 'fulfilled', 'completed', 'done', 'delivered',
    'served', 'active', 'validated',
  ],
  rejected: [
    'rejected', 'cancelled', 'canceled', 'declined', 'refused', 'denied',
    'failed', 'void', 'voided', 'refunded',
  ],
};

async function patchStatus(orderId, status) {
  const { url, headers } = supabaseBase();
  const res = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({ status }),
  });
  const text = await res.text();
  let rows = [];
  try { rows = JSON.parse(text || '[]'); } catch (_) { rows = []; }
  if (!Array.isArray(rows)) rows = [rows];
  return { ok: res.ok, httpStatus: res.status, rows, text };
}

// Update the order to a canonical status ('confirmed' | 'rejected'), trying the
// candidate spellings until the DB accepts one. Returns { row, usedStatus }.
async function updateOrderStatus(orderId, canonical) {
  const candidates = STATUS_CANDIDATES[canonical] || [canonical];
  let last = null;
  for (const value of candidates) {
    const r = await patchStatus(orderId, value);
    if (r.ok && r.rows.length > 0) return { row: r.rows[0], usedStatus: value };
    last = r;
    // A 200 with no rows means the value was accepted but no row matched/was
    // visible (RLS or wrong id) — trying other spellings won't help.
    if (r.ok && r.rows.length === 0) break;
  }
  const detail = last ? `HTTP ${last.httpStatus}: ${last.text}` : 'no response from database';
  const err = new Error(`Could not update order status. ${detail}`);
  err.detail = detail;
  throw err;
}

// ── Status normalisation ──────────────────────────────────────
function normalizeStatus(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'confirmed' || s === 'confirm' || s === 'accepted' || s === 'accept') return 'confirmed';
  if (s === 'rejected' || s === 'reject' || s === 'cancelled' || s === 'canceled' || s === 'declined' || s === 'decline') return 'rejected';
  return null;
}

// ── Signed action tokens (for confirm/reject links in emails) ──
function actionSecret() {
  return process.env.ORDER_ACTION_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SMTP_PASS
    || 'eaw-order-action-fallback';
}

function signAction(orderId, action) {
  return crypto.createHmac('sha256', actionSecret())
    .update(`${orderId}:${action}`)
    .digest('hex');
}

function verifyAction(orderId, action, token) {
  if (!token) return false;
  const expected = signAction(orderId, action);
  const a = Buffer.from(String(token));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try { return crypto.timingSafeEqual(a, b); } catch (_) { return false; }
}

// ── Human-readable pickup label from stored date + time ────────
function formatWhen(row, lang) {
  const date = row && row.delivery_date;
  const time = row && row.delivery_time;
  if (!date && !time) return '';
  let dayLabel = '';
  if (date) {
    try {
      const [y, m, d] = String(date).split('-').map(Number);
      dayLabel = new Date(y, (m || 1) - 1, d || 1).toLocaleDateString(
        lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB',
        { weekday: 'long', day: 'numeric', month: 'long' }
      );
    } catch (_) { dayLabel = String(date); }
  }
  if (dayLabel && time) return `${dayLabel} · ${time}`;
  return dayLabel || String(time);
}

// ── Customer-facing confirm / reject email ─────────────────────
function buildStatusEmail({ status, name, lang, when, total, code }) {
  const accepted = status === 'confirmed';
  const accent = accepted ? '#1F5C2E' : '#B0413E';
  const money = (typeof total === 'number' && !isNaN(total)) ? `€${total.toFixed(2)}` : null;

  const copy = {
    en: {
      greet: name ? `Hi ${name},` : 'Hello,',
      title: accepted ? 'Your order is confirmed' : 'Your order could not be accepted',
      sub: accepted
        ? 'Good news — the restaurant has confirmed your takeaway order.'
        : 'We are sorry, but the restaurant is unable to prepare your order. You have not been charged.',
      whenLabel: 'Pickup',
      totalLabel: 'Total to pay at pickup',
      codeLabel: 'Code',
      foot: accepted ? 'See you soon at East at West.' : 'Please call us if you would like to arrange another time.',
      call: 'Questions? Call us at: <a href="tel:+32465206024" style="color:' + accent + ';font-weight:600;">+32 465 20 60 24</a>',
    },
    fr: {
      greet: name ? `Bonjour ${name},` : 'Bonjour,',
      title: accepted ? 'Votre commande est confirmée' : 'Votre commande n’a pas pu être acceptée',
      sub: accepted
        ? 'Bonne nouvelle — le restaurant a confirmé votre commande à emporter.'
        : 'Nous sommes désolés, le restaurant ne peut pas préparer votre commande. Aucun montant ne vous a été débité.',
      whenLabel: 'Retrait',
      totalLabel: 'Total à payer sur place',
      codeLabel: 'Code',
      foot: accepted ? 'À bientôt chez East at West.' : 'Appelez-nous si vous souhaitez convenir d’un autre horaire.',
      call: 'Des questions ? Appelez-nous au : <a href="tel:+32465206024" style="color:' + accent + ';font-weight:600;">+32 465 20 60 24</a>',
    },
    nl: {
      greet: name ? `Hallo ${name},` : 'Hallo,',
      title: accepted ? 'Uw bestelling is bevestigd' : 'Uw bestelling kon niet worden aanvaard',
      sub: accepted
        ? 'Goed nieuws — het restaurant heeft uw afhaalbestelling bevestigd.'
        : 'Het spijt ons, het restaurant kan uw bestelling niet bereiden. Er werd niets aangerekend.',
      whenLabel: 'Afhalen',
      totalLabel: 'Totaal te betalen bij afhaling',
      codeLabel: 'Code',
      foot: accepted ? 'Tot snel bij East at West.' : 'Bel ons gerust om een ander moment af te spreken.',
      call: 'Vragen? Bel ons op: <a href="tel:+32465206024" style="color:' + accent + ';font-weight:600;">+32 465 20 60 24</a>',
    },
  };
  const c = copy[lang] || copy.en;

  const codeBlock = (accepted && code) ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;border-radius:10px;margin-bottom:14px;">
              <tr><td style="padding:16px 20px;text-align:center;">
                <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7E8B7A;margin-bottom:6px;">${c.codeLabel}</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:700;color:${accent};letter-spacing:2px;">${code}</div>
              </td></tr>
            </table>` : '';

  const whenBlock = when ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;border-radius:10px;margin-bottom:14px;">
              <tr><td style="padding:14px 20px;">
                <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7E8B7A;margin-bottom:4px;">${c.whenLabel}</div>
                <div style="font-size:20px;font-weight:700;color:#1A2419;">${when}</div>
              </td></tr>
            </table>` : '';

  const totalBlock = (accepted && money) ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${accent};margin-top:6px;">
              <tr>
                <td style="padding-top:12px;font-size:14px;font-weight:700;color:#1A2419;">${c.totalLabel}</td>
                <td style="padding-top:12px;font-size:18px;font-weight:700;color:${accent};text-align:right;">${money}</td>
              </tr>
            </table>` : '';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#EFF1E5;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td align="center" style="padding:0 0 24px;">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#1F5C2E;">East at West</span>
      </td></tr>
      <tr><td style="background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 4px 28px rgba(26,36,25,0.09);">
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:${accent};height:5px;font-size:0;">&nbsp;</td></tr></table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:32px 36px 24px;">
            <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:600;color:#1A2419;">${c.title}</h1>
            <p style="margin:0 0 6px;font-size:14px;color:#1A2419;">${c.greet}</p>
            <p style="margin:0 0 24px;font-size:14px;color:#4B5A48;">${c.sub}</p>
            ${codeBlock}
            ${whenBlock}
            ${totalBlock}
            <p style="margin:20px 0 0;font-size:14px;color:#4B5A48;">${c.foot}</p>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:#EFF1E5;padding:16px 36px;border-top:1px solid #E0E4D2;">
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:#7E8B7A;letter-spacing:0.5px;margin-bottom:4px;">East at West</div>
            <div style="font-size:13px;color:#1A2419;">Bld de l'Empereur 26, 1000 Brussels</div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td align="center" style="padding:20px 0 4px;">
        <p style="margin:0;font-size:11px;color:#9DAD99;">${c.call}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

async function sendStatusEmail(status, { email, name, lang, when, total, code }) {
  const subjectMap = {
    confirmed: {
      fr: 'Commande confirmée – East at West',
      nl: 'Bestelling bevestigd – East at West',
      en: 'Order confirmed – East at West',
    },
    rejected: {
      fr: 'Commande non acceptée – East at West',
      nl: 'Bestelling geweigerd – East at West',
      en: 'Order could not be accepted – East at West',
    },
  };
  const subject = subjectMap[status][lang] || subjectMap[status].en;
  await transporter.sendMail({
    from: `"East at West" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject,
    html: buildStatusEmail({ status, name, lang, when, total, code }),
  });
}

module.exports = {
  transporter,
  supabaseBase,
  getOrder,
  updateOrderStatus,
  normalizeStatus,
  signAction,
  verifyAction,
  formatWhen,
  buildStatusEmail,
  sendStatusEmail,
};
