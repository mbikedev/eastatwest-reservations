// Netlify Function — POST /.netlify/functions/reserve
// Saves reservation to Supabase + sends SMTP emails via nodemailer.

const nodemailer = require('nodemailer');

// ── SMTP ──────────────────────────────────────────────────────
function parsePort(raw) {
  const n = parseInt(String(raw || '').replace(/\D/g, ''), 10);
  return isNaN(n) ? 587 : n;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parsePort(process.env.SMTP_PORT),
  secure: false, // STARTTLS on 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// ── Supabase ──────────────────────────────────────────────────
async function saveToSupabase(row) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log('Supabase key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon');
  console.log('Supabase key prefix:', key ? key.substring(0, 40) : '(none)');
  console.log('Supabase key length:', key ? key.length : 0);
  console.log('Supabase URL:', url);
  console.log('Supabase row:', JSON.stringify(row));
  if (!url || !key) {
    throw new Error('Supabase URL or key missing');
  }
  const res = await fetch(`${url}/rest/v1/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  const responseText = await res.text();
  console.log('Supabase response status:', res.status);
  console.log('Supabase response body:', responseText || '(empty)');
  if (!res.ok) {
    throw new Error(`Supabase error ${res.status}: ${responseText}`);
  }
}

// ── Email subjects ────────────────────────────────────────────
function guestSubject(lang, code, pending) {
  const map = {
    fr: pending
      ? `Réservation en attente – East@West (${code})`
      : `Réservation confirmée – East@West (${code})`,
    nl: pending
      ? `Reservering in behandeling – East@West (${code})`
      : `Reservering bevestigd – East@West (${code})`,
    en: pending
      ? `Reservation pending – East@West (${code})`
      : `Reservation confirmed – East@West (${code})`,
  };
  return map[lang] || map.en;
}

// ── Guest confirmation email ──────────────────────────────────
function buildGuestHtml(data, code, lang) {
  const pending = data.party >= 7;

  const copy = {
    en: {
      title: pending ? 'Reservation pending' : "You're booked!",
      sub: pending
        ? "Your reservation is awaiting manager approval. We'll text you within the hour."
        : 'We look forward to welcoming you at East@West.',
      code: 'Confirmation code',
      guests: 'Guests', date: 'Date', time: 'Time',
      occasion: 'Occasion', notes: 'Allergies & dietary', special: 'Special requests', addr: 'Address',
      footer: "East@West · Bld de l'Empereur 26, 1000 Brussels",
      cancel: 'For cancellation, please call us at: <a href="tel:+32465206024" style="color:#1F5C2E;font-weight:600;">+32 465 20 60 24</a>',
    },
    fr: {
      title: pending ? 'Réservation en attente' : "C'est réservé !",
      sub: pending
        ? "Votre réservation est en attente d'approbation. Nous vous répondrons dans l'heure."
        : 'Nous avons hâte de vous accueillir à East@West.',
      code: 'Code de confirmation',
      guests: 'Personnes', date: 'Date', time: 'Heure',
      occasion: 'Occasion', notes: 'Allergies & régimes', special: 'Demandes spéciales', addr: 'Adresse',
      footer: "East@West · Bld de l'Empereur 26, 1000 Bruxelles",
      cancel: 'Pour annuler, veuillez nous appeler au : <a href="tel:+32465206024" style="color:#1F5C2E;font-weight:600;">+32 465 20 60 24</a>',
    },
    nl: {
      title: pending ? 'Reservering in behandeling' : 'Reservering bevestigd!',
      sub: pending
        ? 'Uw reservering wacht op goedkeuring van de manager. We nemen binnen het uur contact met u op.'
        : 'We kijken ernaar uit u te verwelkomen bij East@West.',
      code: 'Bevestigingscode',
      guests: 'Gasten', date: 'Datum', time: 'Tijdstip',
      occasion: 'Gelegenheid', notes: 'Allergieën & dieet', special: 'Speciale verzoeken', addr: 'Adres',
      footer: "East@West · Bld de l'Empereur 26, 1000 Brussel",
      cancel: 'Voor annulering, bel ons op: <a href="tel:+32465206024" style="color:#1F5C2E;font-weight:600;">+32 465 20 60 24</a>',
    },
  };
  const s = copy[lang] || copy.en;

  const occasionLabels = {
    en: { none: 'Dinner', birthday: 'Birthday', anniv: 'Anniversary', date: 'Date night', business: 'Business' },
    fr: { none: 'Dîner', birthday: 'Anniversaire', anniv: 'Anniversaire de mariage', date: 'En amoureux', business: 'Affaires' },
    nl: { none: 'Diner', birthday: 'Verjaardag', anniv: 'Jubileum', date: 'Romantische avond', business: 'Zakelijk' },
  };
  const oLabels = occasionLabels[lang] || occasionLabels.en;

  const accent = pending ? '#D9A93A' : '#1F5C2E';

  const detailRows = [
    [s.guests, String(data.party)],
    [s.date, data.date],
    [s.time, data.endTime ? `${data.time} → ${data.endTime}` : data.time],
    data.occasion && data.occasion !== 'none' ? [s.occasion, oLabels[data.occasion] || data.occasion] : null,
    data.notes ? [s.notes, data.notes] : null,
    data.specialRequests ? [s.special, data.specialRequests] : null,
  ]
    .filter(Boolean)
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:13px 0;border-bottom:1px solid #E0E4D2;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#7E8B7A;width:120px;vertical-align:top;">${label}</td>
        <td style="padding:13px 0;border-bottom:1px solid #E0E4D2;font-size:15px;color:#1A2419;font-weight:500;line-height:1.5;">${value}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${s.title}</title>
</head>
<body style="margin:0;padding:0;background:#EFF1E5;font-family:Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#EFF1E5;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

      <!-- Wordmark -->
      <tr><td align="center" style="padding:0 0 28px;">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#1F5C2E;font-weight:normal;">East @ West</span>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 28px rgba(26,36,25,0.09);">

        <!-- Top colour bar -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="background:${accent};height:5px;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>

        <!-- Body -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr><td style="padding:36px 40px 32px;">

            <h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:600;color:#1A2419;letter-spacing:-0.4px;line-height:1.15;">${s.title}</h1>
            <p style="margin:0 0 26px;font-size:15px;color:#4B5A48;line-height:1.6;">${s.sub}</p>

            <!-- Code block -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#EFF1E5;border-radius:10px;margin-bottom:28px;">
              <tr><td style="padding:18px 20px;">
                <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7E8B7A;margin-bottom:7px;">${s.code}</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:${accent};letter-spacing:1.5px;">${code}</div>
              </td></tr>
            </table>

            <!-- Detail rows -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-top:1px solid #E0E4D2;">
              ${detailRows}
            </table>

          </td></tr>

          <!-- Address footer strip -->
          <tr><td style="background:#EFF1E5;padding:20px 40px;border-top:1px solid #E0E4D2;">
            <div style="font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#7E8B7A;margin-bottom:6px;">${s.addr}</div>
            <div style="font-size:14px;color:#1A2419;font-weight:500;">Bld de l'Empereur 26, 1000 Brussels</div>
          </td></tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding:24px 0 4px;">
        <p style="margin:0 0 6px;font-size:12px;color:#7E8B7A;">${s.footer}</p>
        <p style="margin:0;font-size:11px;color:#9DAD99;line-height:1.5;">${s.cancel}</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── Restaurant notification email ─────────────────────────────
function buildRestaurantHtml(data, code, lang) {
  const pending = data.party >= 7;

  const copy = {
    en: {
      title: 'New Reservation',
      pending: 'PENDING APPROVAL', confirmed: 'CONFIRMED',
      name: 'Name', email: 'Email', phone: 'Phone', party: 'Party size',
      date: 'Date', time: 'Time', occasion: 'Occasion', notes: 'Notes', special: 'Special requests',
      approvalNote: `This party (${data.party} guests) requires manual approval. Please confirm or decline by replying to ${data.email}.`,
    },
    fr: {
      title: 'Nouvelle réservation',
      pending: 'EN ATTENTE', confirmed: 'CONFIRMÉE',
      name: 'Nom', email: 'E-mail', phone: 'Téléphone', party: 'Personnes',
      date: 'Date', time: 'Heure', occasion: 'Occasion', notes: 'Notes', special: 'Demandes spéciales',
      approvalNote: `Ce groupe (${data.party} personnes) nécessite une approbation manuelle. Veuillez confirmer ou refuser en répondant à ${data.email}.`,
    },
    nl: {
      title: 'Nieuwe reservering',
      pending: 'IN BEHANDELING', confirmed: 'BEVESTIGD',
      name: 'Naam', email: 'E-mail', phone: 'Telefoon', party: 'Aantal gasten',
      date: 'Datum', time: 'Tijdstip', occasion: 'Gelegenheid', notes: 'Notities', special: 'Speciale verzoeken',
      approvalNote: `Deze groep (${data.party} gasten) vereist handmatige goedkeuring. Bevestig of weiger door te antwoorden op ${data.email}.`,
    },
  };
  const c = copy[lang] || copy.en;

  const statusBadge = pending
    ? `<span style="background:#D9A93A;color:#1A1410;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;">${c.pending}</span>`
    : `<span style="background:#1F5C2E;color:#fff;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;">${c.confirmed}</span>`;

  const rows = [
    [c.name, data.name],
    [c.email, `<a href="mailto:${data.email}" style="color:#1F5C2E;">${data.email}</a>`],
    [c.phone, data.phone || '—'],
    [c.party, String(data.party)],
    [c.date, data.date],
    [c.time, data.endTime ? `${data.time} &rarr; ${data.endTime}` : data.time],
    data.occasion && data.occasion !== 'none' ? [c.occasion, data.occasion] : null,
    data.notes ? [c.notes, data.notes] : null,
    data.specialRequests ? [c.special, data.specialRequests.replace(/\n/g, '<br>')] : null,
  ]
    .filter(Boolean)
    .map(
      ([label, value]) => `
    <tr>
      <td style="padding:12px 16px 12px 0;border-bottom:1px solid #eee;font-size:11px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;white-space:nowrap;vertical-align:top;width:1%;">${label}</td>
      <td style="padding:12px 0 12px 0;border-bottom:1px solid #eee;font-size:14px;color:#1A2419;font-weight:500;line-height:1.5;word-break:break-word;">${value}</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
      <tr><td style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">

        <!-- green top bar -->
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#1F5C2E;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr></table>

        <!-- header -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:28px 28px 0;font-size:20px;font-weight:700;color:#1F5C2E;">${c.title}</td>
            <td style="padding:28px 28px 0;text-align:right;">${statusBadge}</td>
          </tr>
        </table>

        <!-- code -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 28px 20px;font-size:13px;color:#888;">Code: <strong style="color:#1A2419;">${code}</strong></td></tr>
        </table>

        <!-- divider -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:0 28px;"><div style="border-top:1px solid #eee;font-size:0;line-height:0;">&nbsp;</div></td></tr>
        </table>

        <!-- data rows -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 28px;">
          <tr><td>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rows}
            </table>
          </td></tr>
        </table>

        ${pending ? `
        <!-- approval note -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:0 28px 28px;">
            <div style="margin-top:20px;padding:14px 16px;background:#FFF8E8;border-left:3px solid #D9A93A;border-radius:4px;font-size:13px;color:#7A5C1E;line-height:1.5;">${c.approvalNote}</div>
          </td></tr>
        </table>` : '<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="height:28px;">&nbsp;</td></tr></table>'}

      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ── Handler ───────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { data, lang = 'en' } = JSON.parse(event.body || '{}');

    if (!data || !data.name || !data.email || !data.date || !data.time || !data.endTime) {
      return {
        statusCode: 400, headers: CORS,
        body: JSON.stringify({ error: 'Missing required fields: name, email, date, time, endTime' }),
      };
    }

    const code = 'EW-' + String(Math.floor(Math.random() * 9000) + 1000);
    const pending = data.party >= 7;
    const from = `"East@West" <${process.env.SMTP_FROM_EMAIL}>`;

    // Supabase save — await and capture result for diagnostics
    let supabaseError = null;
    try {
      await saveToSupabase({
        invoice_number: code,
        status: pending ? 'pending' : 'confirmed',
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        guests: data.party,
        date: data.date,
        start_time: data.time,
        end_time: data.endTime || data.time,
        special_requests: [data.notes, data.specialRequests].filter(Boolean).join('\n\n') || null,
        language: lang,
      });
    } catch (e) {
      supabaseError = e.message;
      console.error('Supabase save failed:', e.message);
    }

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail({
        from, to: data.email,
        subject: guestSubject(lang, code, pending),
        html: buildGuestHtml(data, code, lang),
      }),
      transporter.sendMail({
        from, to: process.env.SMTP_FROM_EMAIL,
        replyTo: data.email,
        subject: `${pending ? '[PENDING] ' : '[NEW] '}${code} · ${data.party} guests · ${data.date}`,
        html: buildRestaurantHtml(data, code, lang),
      }),
    ]);

    return {
      statusCode: 200, headers: CORS,
      body: JSON.stringify({ success: true, code, pending, supabaseError }),
    };
  } catch (err) {
    console.error('reserve function error:', err);
    return {
      statusCode: 500, headers: CORS,
      body: JSON.stringify({ success: false, error: 'Could not process reservation. Please try again.' }),
    };
  }
};
