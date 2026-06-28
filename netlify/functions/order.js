// Netlify Function — POST /.netlify/functions/order
// Processes a takeaway / delivery order (pay on pickup or cash on delivery): sends notification emails + saves to Supabase.

const nodemailer = require('nodemailer');
const { signAction } = require('./lib/order-notify');

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
async function saveOrderToSupabase(orderRow, items) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase URL or key missing');

  const headers = {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: 'return=representation',
  };

  const orderRes = await fetch(`${url}/rest/v1/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderRow),
  });
  const orderText = await orderRes.text();
  if (!orderRes.ok) throw new Error(`Supabase orders error ${orderRes.status}: ${orderText}`);

  const inserted = JSON.parse(orderText);
  const orderId = Array.isArray(inserted) ? inserted[0].id : inserted.id;

  if (items && items.length > 0) {
    const itemRows = items.map(item => ({
      order_id: orderId,
      product_name: item.name,
      quantity: item.qty,
      unit_price: item.price,
      total_price: item.lineTotal,
    }));
    const itemsRes = await fetch(`${url}/rest/v1/order_items`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify(itemRows),
    });
    if (!itemsRes.ok) {
      const t = await itemsRes.text();
      console.error(`Supabase order_items error ${itemsRes.status}: ${t}`);
    }
  }

  return orderId;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function buildRestaurantOrderHtml(customer, items, totals, pickup, code, lang, deliveryType, deliveryAddress, actionHtml = '') {
  const isDelivery = deliveryType === 'delivery';
  const copy = {
    en: { title: isDelivery ? 'New Delivery Order' : 'New Takeaway Order', timeLabel: isDelivery ? 'Delivery time' : 'Pickup time', address: 'Address', name: 'Name', phone: 'Phone', email: 'Email', subtotal: 'Subtotal', tax: 'VAT 12%', total: 'Total', badge: isDelivery ? 'DELIVERY · CASH' : 'PAY ON PICKUP' },
    fr: { title: isDelivery ? 'Nouvelle commande livraison' : 'Nouvelle commande à emporter', timeLabel: isDelivery ? 'Heure de livraison' : 'Heure de retrait', address: 'Adresse', name: 'Nom', phone: 'Téléphone', email: 'E-mail', subtotal: 'Sous-total', tax: 'TVA 12%', total: 'Total', badge: isDelivery ? 'LIVRAISON · ESPÈCES' : 'PAIEMENT SUR PLACE' },
    nl: { title: isDelivery ? 'Nieuwe leveringsbestelling' : 'Nieuwe afhaalbestelling', timeLabel: isDelivery ? 'Leveringstijd' : 'Afhaaltijd', address: 'Adres', name: 'Naam', phone: 'Telefoon', email: 'E-mail', subtotal: 'Subtotaal', tax: 'BTW 12%', total: 'Totaal', badge: isDelivery ? 'LEVERING · CONTANT' : 'BETALEN BIJ AFHALING' },
  };
  const c = copy[lang] || copy.en;

  const itemRows = items.map(item => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eee;font-size:14px;color:#1A2419;font-weight:500;">${item.name}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eee;font-size:14px;color:#7E8B7A;text-align:center;width:40px;">${item.qty}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eee;font-size:14px;color:#1A2419;font-weight:600;text-align:right;white-space:nowrap;">€${item.lineTotal.toFixed(2)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
      <tr><td style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#1F5C2E;height:4px;font-size:0;">&nbsp;</td></tr></table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:24px 28px 0;font-size:20px;font-weight:700;color:#1F5C2E;">${c.title}</td>
            <td style="padding:24px 28px 0;text-align:right;"><span style="background:${isDelivery ? '#1F5C2E' : '#D9A93A'};color:${isDelivery ? '#fff' : '#1A1410'};padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;">${c.badge}</span></td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 28px 16px;font-size:13px;color:#888;">Code: <strong style="color:#1A2419;">${code}</strong></td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 28px;">
          <tr><td>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 16px 10px 0;font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;width:1%;">${c.name}</td>
                <td style="padding:10px 0;font-size:14px;color:#1A2419;font-weight:500;">${customer.name}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px 10px 0;font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">${c.phone}</td>
                <td style="padding:10px 0;font-size:14px;color:#1A2419;font-weight:500;"><a href="tel:${customer.phone}" style="color:#1F5C2E;">${customer.phone}</a></td>
              </tr>
              ${customer.email ? `<tr>
                <td style="padding:10px 16px 10px 0;font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">${c.email}</td>
                <td style="padding:10px 0;font-size:14px;color:#1A2419;font-weight:500;">${customer.email}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 16px 10px 0;font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">${c.timeLabel}</td>
                <td style="padding:10px 0;font-size:16px;color:#1F5C2E;font-weight:700;">${pickup}</td>
              </tr>
              ${isDelivery && deliveryAddress ? `<tr>
                <td style="padding:10px 16px 10px 0;font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;white-space:nowrap;">${c.address}</td>
                <td style="padding:10px 0;font-size:14px;color:#1A2419;font-weight:600;">${deliveryAddress}</td>
              </tr>` : ''}
            </table>
          </td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 28px;margin-top:8px;">
          <tr><td><table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
            <tr>
              <td colspan="2" style="padding:10px 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.4px;">${c.subtotal}</td>
              <td style="padding:10px 0 4px;font-size:14px;color:#1A2419;text-align:right;">€${totals.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:4px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.4px;">${c.tax}</td>
              <td style="padding:4px 0;font-size:14px;color:#1A2419;text-align:right;">€${totals.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:10px 0;font-size:14px;font-weight:700;color:#1A2419;border-top:2px solid #1F5C2E;">${c.total}</td>
              <td style="padding:10px 0;font-size:18px;font-weight:700;color:#1F5C2E;text-align:right;border-top:2px solid #1F5C2E;">€${totals.total.toFixed(2)}</td>
            </tr>
          </table></td></tr>
        </table>
        ${actionHtml}
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:28px;">&nbsp;</td></tr></table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

// Confirm / reject buttons for the restaurant email (links to order-action).
function buildActionButtons(baseUrl, orderId, lang) {
  if (!orderId || !baseUrl) return '';
  const confirmUrl = `${baseUrl}/.netlify/functions/order-action?orderId=${orderId}&action=confirm&token=${signAction(orderId, 'confirm')}`;
  const rejectUrl = `${baseUrl}/.netlify/functions/order-action?orderId=${orderId}&action=reject&token=${signAction(orderId, 'reject')}`;
  const c = {
    en: { prompt: 'Respond to this order:', confirm: 'Confirm order', reject: 'Reject order' },
    fr: { prompt: 'Répondre à cette commande :', confirm: 'Confirmer', reject: 'Refuser' },
    nl: { prompt: 'Reageer op deze bestelling:', confirm: 'Bevestigen', reject: 'Weigeren' },
  }[lang] || { prompt: 'Respond to this order:', confirm: 'Confirm order', reject: 'Reject order' };
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:8px 28px 0;">
      <tr><td style="font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:10px;">${c.prompt}</td></tr>
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:6px;width:50%;">
            <a href="${confirmUrl}" style="display:block;text-align:center;background:#1F5C2E;color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 0;border-radius:10px;">${c.confirm}</a>
          </td>
          <td style="padding-left:6px;width:50%;">
            <a href="${rejectUrl}" style="display:block;text-align:center;background:#B0413E;color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 0;border-radius:10px;">${c.reject}</a>
          </td>
        </tr></table>
      </td></tr>
    </table>`;
}

function buildCustomerOrderHtml(customer, items, totals, pickup, code, lang, deliveryType, deliveryAddress) {
  const isDelivery = deliveryType === 'delivery';
  const copy = {
    en: {
      title: 'Order received',
      sub: isDelivery ? 'Your order is on its way. Pay cash at the door.' : 'We have received your order — the restaurant will confirm it shortly. Keep this code for pickup.',
      timeLabel: isDelivery ? 'Delivered by' : 'Ready by',
      total: isDelivery ? 'Total to pay at the door' : 'Total to pay at pickup',
      addrLabel: 'Delivery address',
      addr: "East at West · Bld de l'Empereur 26, 1000 Brussels",
      cancel: 'Questions? Call us at: <a href="tel:+32465206024" style="color:#1F5C2E;font-weight:600;">+32 465 20 60 24</a>',
    },
    fr: {
      title: 'Commande reçue',
      sub: isDelivery ? 'Votre commande est en route. Payez en espèces à la porte.' : 'Nous avons bien reçu votre commande — le restaurant la confirmera sous peu. Conservez ce code pour le retrait.',
      timeLabel: isDelivery ? 'Livraison prévue à' : 'Prêt à',
      total: isDelivery ? 'Total à payer à la porte' : 'Total à payer sur place',
      addrLabel: 'Adresse de livraison',
      addr: "East at West · Bld de l'Empereur 26, 1000 Bruxelles",
      cancel: 'Des questions ? Appelez-nous au : <a href="tel:+32465206024" style="color:#1F5C2E;font-weight:600;">+32 465 20 60 24</a>',
    },
    nl: {
      title: 'Bestelling ontvangen',
      sub: isDelivery ? 'Uw bestelling is onderweg. Betaal contant aan de deur.' : 'We hebben uw bestelling ontvangen — het restaurant bevestigt ze binnenkort. Bewaar deze code voor het afhalen.',
      timeLabel: isDelivery ? 'Geleverd om' : 'Klaar om',
      total: isDelivery ? 'Totaal te betalen aan de deur' : 'Totaal te betalen bij afhaling',
      addrLabel: 'Leveringsadres',
      addr: "East at West · Bld de l'Empereur 26, 1000 Brussel",
      cancel: 'Vragen? Bel ons op: <a href="tel:+32465206024" style="color:#1F5C2E;font-weight:600;">+32 465 20 60 24</a>',
    },
  };
  const c = copy[lang] || copy.en;

  const itemList = items.map(i => `<li style="padding:4px 0;font-size:14px;color:#1A2419;">${i.qty}× ${i.name} — €${i.lineTotal.toFixed(2)}</li>`).join('');

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
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#1F5C2E;height:5px;font-size:0;">&nbsp;</td></tr></table>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:32px 36px 24px;">
            <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;color:#1A2419;">${c.title}</h1>
            <p style="margin:0 0 24px;font-size:14px;color:#4B5A48;">${c.sub}</p>
            ${!isDelivery ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:16px 20px;text-align:center;">
                <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7E8B7A;margin-bottom:6px;">Code</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:700;color:#1F5C2E;letter-spacing:2px;">${code}</div>
              </td></tr>
            </table>` : ''}
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;border-radius:10px;margin-bottom:${isDelivery && deliveryAddress ? '12px' : '24px'};">
              <tr><td style="padding:14px 20px;">
                <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7E8B7A;margin-bottom:4px;">${c.timeLabel}</div>
                <div style="font-size:22px;font-weight:700;color:#1A2419;">${pickup}</div>
              </td></tr>
            </table>
            ${isDelivery && deliveryAddress ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF1E5;border-radius:10px;margin-bottom:24px;">
              <tr><td style="padding:14px 20px;">
                <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7E8B7A;margin-bottom:4px;">${c.addrLabel}</div>
                <div style="font-size:16px;font-weight:600;color:#1A2419;">${deliveryAddress}</div>
              </td></tr>
            </table>` : ''}
            <ul style="margin:0 0 20px;padding:0 0 0 16px;">${itemList}</ul>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #1F5C2E;padding-top:12px;">
              <tr>
                <td style="padding-top:12px;font-size:14px;font-weight:700;color:#1A2419;">${c.total}</td>
                <td style="padding-top:12px;font-size:18px;font-weight:700;color:#1F5C2E;text-align:right;">€${totals.total.toFixed(2)}</td>
              </tr>
            </table>
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
        <p style="margin:0 0 4px;font-size:12px;color:#7E8B7A;">${c.addr}</p>
        <p style="margin:0;font-size:11px;color:#9DAD99;">${c.cancel}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { customer, items, totals, pickup, pickupDate = null, lang = 'en', deliveryType = 'pickup', deliveryAddress = '' } = JSON.parse(event.body || '{}');

    if (!customer?.name || !customer?.phone || !items?.length) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const code = 'TO-' + String(Math.floor(Math.random() * 9000) + 1000);
    const from = `"East at West" <${process.env.SMTP_FROM_EMAIL}>`;
    const isDelivery = deliveryType === 'delivery';

    // Pickup date — use the day the customer chose, else today
    const todayStr = new Date().toISOString().split('T')[0];
    const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(pickupDate || '') ? pickupDate : todayStr;
    const isFutureDay = isoDate !== todayStr;

    // Compute ETA label
    let etaStr = pickup;
    if (pickup === 'asap') {
      const e = new Date();
      e.setMinutes(e.getMinutes() + (isDelivery ? 40 : 25));
      etaStr = e.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    // Show "date at time" for orders placed for a future day
    const whenStr = isFutureDay ? `${isoDate} ${etaStr}` : etaStr;

    const subjectPrefix = isDelivery ? '[DELIVERY]' : '[ORDER]';
    const subjectSuffix = isDelivery ? `· delivery ${whenStr} · ${deliveryAddress}` : `· pickup ${whenStr}`;

    // Save to Supabase FIRST so we have the order id for the confirm/reject links.
    const deliveryDate = isoDate;
    const orderRow = {
      customer_name: customer.name,
      customer_email: customer.email || '',
      customer_phone: customer.phone,
      delivery_type: deliveryType,
      delivery_date: deliveryDate,
      delivery_time: etaStr,
      delivery_address: isDelivery && deliveryAddress ? { street: deliveryAddress } : null,
      total_amount: totals.total,
      status: 'pending',
      language: lang,
    };
    let orderId = null;
    try {
      orderId = await saveOrderToSupabase(orderRow, items);
    } catch (dbErr) {
      console.error('Supabase save error (non-fatal):', dbErr);
    }

    // Build the restaurant's one-tap confirm/reject buttons (needs the saved id).
    const baseUrl = (process.env.URL || `https://${(event.headers && event.headers.host) || ''}`).replace(/\/$/, '');
    const actionHtml = orderId ? buildActionButtons(baseUrl, orderId, lang) : '';

    const emails = [
      transporter.sendMail({
        from,
        to: process.env.SMTP_FROM_EMAIL,
        replyTo: customer.email || undefined,
        subject: `${subjectPrefix} ${code} · ${customer.name} ${subjectSuffix}`,
        html: buildRestaurantOrderHtml(customer, items, totals, whenStr, code, lang, deliveryType, deliveryAddress, actionHtml),
      }),
    ];

    if (customer.email) {
      const subjectMap = {
        fr: `Commande reçue – East at West (${code})`,
        nl: `Bestelling ontvangen – East at West (${code})`,
        en: `Order received – East at West (${code})`,
      };
      emails.push(transporter.sendMail({
        from,
        to: customer.email,
        subject: subjectMap[lang] || subjectMap.en,
        html: buildCustomerOrderHtml(customer, items, totals, whenStr, code, lang, deliveryType, deliveryAddress),
      }));
    }

    await Promise.all(emails);

    return {
      statusCode: 200, headers: CORS,
      body: JSON.stringify({ success: true, code, eta: whenStr }),
    };
  } catch (err) {
    console.error('order function error:', err);
    return {
      statusCode: 500, headers: CORS,
      body: JSON.stringify({ error: 'Could not place order. Please try again.' }),
    };
  }
};
