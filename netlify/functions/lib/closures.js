// Shared holiday-closure helpers for Netlify functions.
// Holidays are managed in the eastatwest.com admin (/admin/holidays) and
// stored in the shared Supabase "holidays" table.

async function fetchActiveHolidays() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const res = await fetch(
    `${url}/rest/v1/holidays?is_active=eq.true&select=name,start_date,end_date,is_recurring,recurrence_pattern,recurrence_end_date`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

// dateStr: 'YYYY-MM-DD'. Mirrors the check_date_is_holiday() logic in Supabase.
function isDateInHoliday(dateStr, h) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || '')) return false;

  if (!h.is_recurring) {
    return dateStr >= h.start_date && dateStr <= h.end_date;
  }

  const p = h.recurrence_pattern;
  if (!p) return false;
  if (h.recurrence_end_date && dateStr > h.recurrence_end_date) return false;

  const [y, m, d] = dateStr.split('-').map(Number);
  if (p.type === 'annual') return p.month === m && p.day === d;
  if (p.type === 'weekly') return new Date(y, m - 1, d).getDay() === p.day_of_week;
  if (p.type === 'monthly') return p.day === d;
  return false;
}

function closureFor(dateStr, holidays) {
  return (holidays || []).find(h => isDateInHoliday(dateStr, h)) || null;
}

module.exports = { fetchActiveHolidays, isDateInHoliday, closureFor };
