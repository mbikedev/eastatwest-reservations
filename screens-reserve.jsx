// Reservation flow — 5 steps: party → date → time → details → confirm
// then a "you\'re booked" confirmation screen.

// ─────────────────────────────────────────────────────────────
// Decorative ornament — Lebanese-inspired diamond divider.
// Used consistently across the flow as a subtle "stamp" of identity.
// ─────────────────────────────────────────────────────────────
function ResOrnament({ color, size = 14, opacity = 0.55, style }) {
  const c = color || 'currentColor';
  return (
    <svg width={size * 5} height={size} viewBox="0 0 100 20" style={{ opacity, ...style }}>
      <path d="M0 10 L36 10" stroke={c} strokeWidth="0.6" />
      <path d="M64 10 L100 10" stroke={c} strokeWidth="0.6" />
      <path d="M50 4 L56 10 L50 16 L44 10 Z" fill={c} />
      <circle cx="40" cy="10" r="1.2" fill={c} />
      <circle cx="60" cy="10" r="1.2" fill={c} />
    </svg>
  );
}

function ProgressBar({ step, total, theme }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '0 20px', marginBottom: 18 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i <= step ? theme.primary : theme.line,
          transition: 'background 280ms ease',
        }}/>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 1 — party size
// ─────────────────────────────────────────────────────────────
const MAX_PARTY = 22;

function GuestDots({ n, color, max = 8 }) {
  // tiny silhouette dots, scaled to current party size
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 6 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: 2,
          background: color, opacity: i < n ? 1 : 0.22,
          transition: 'opacity 200ms ease',
        }}/>
      ))}
    </div>
  );
}

function StepParty({ theme, t, value, onChange, onNext }) {
  const largeOn = value > 8;
  const stepperVal = largeOn ? value : 9;
  const dec = () => onChange(Math.max(9, stepperVal - 1));
  const inc = () => onChange(Math.min(MAX_PARTY, stepperVal + 1));
  return (
    <div>
      <PageHeader theme={theme} title={t.res_q_party} sub={t.res_q_party_sub} hideChrome/>
      <div style={{ padding: '8px 20px 100px' }}>
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 22,
          color: theme.primary,
        }}>
          <ResOrnament color={theme.primary}/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[1,2,3,4,5,6,7,8].map(n => {
            const on = n === value;
            return (
              <button key={n} onClick={() => onChange(n)} style={{
                appearance: 'none', border: 'none', cursor: 'pointer',
                aspectRatio: '1',
                background: on ? theme.primary : theme.surface,
                color: on ? theme.primaryInk : theme.ink,
                borderRadius: 18,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4,
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 38, fontWeight: 600,
                boxShadow: on
                  ? `0 10px 24px ${theme.primary}40, inset 0 0 0 1px ${theme.primary}`
                  : '0 1px 3px rgba(0,0,0,0.04)',
                transform: on ? 'translateY(-1px)' : 'none',
                transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
                position: 'relative',
              }}>
                <span style={{ lineHeight: 0.9 }}>{n}</span>
                <GuestDots n={n} color={on ? theme.primaryInk : theme.inkSoft}/>
              </button>
            );
          })}
        </div>

        {/* Larger party stepper (9–22) */}
        <div
          onClick={() => onChange(stepperVal)}
          role="button"
          style={{
            width: '100%', cursor: 'pointer',
            marginTop: 14, padding: '14px 14px 14px 20px',
            background: largeOn ? theme.primary : theme.surface,
            color: largeOn ? theme.primaryInk : theme.ink,
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12,
            boxShadow: largeOn
              ? `0 10px 24px ${theme.primary}40, inset 0 0 0 1px ${theme.primary}`
              : '0 1px 3px rgba(0,0,0,0.04)',
            transform: largeOn ? 'translateY(-1px)' : 'none',
            transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 11, fontWeight: 500, letterSpacing: 0.6, textTransform: 'uppercase',
              opacity: 0.75, whiteSpace: 'nowrap',
            }}>{t.res_larger_party}</div>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 32, fontWeight: 600, lineHeight: 1,
              whiteSpace: 'nowrap',
            }}>
              {largeOn ? value : '9\u201322'}<span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase',
                opacity: 0.75, marginLeft: 8,
              }}>{t.res_guests}</span>
            </div>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dec}
              disabled={!largeOn || stepperVal <= 9}
              aria-label="decrease"
              style={{
                appearance: 'none', border: 'none',
                cursor: largeOn && stepperVal > 9 ? 'pointer' : 'default',
                width: 40, height: 40, borderRadius: 999,
                background: largeOn ? 'rgba(255,255,255,0.18)' : theme.bg,
                color: largeOn ? theme.primaryInk : theme.ink,
                opacity: !largeOn || stepperVal <= 9 ? 0.45 : 1,
                fontFamily: '"DM Sans", sans-serif', fontSize: 22, fontWeight: 500, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease',
              }}
            >−</button>
            <button
              onClick={inc}
              disabled={largeOn && stepperVal >= MAX_PARTY}
              aria-label="increase"
              style={{
                appearance: 'none', border: 'none',
                cursor: largeOn && stepperVal >= MAX_PARTY ? 'default' : 'pointer',
                width: 40, height: 40, borderRadius: 999,
                background: largeOn ? 'rgba(255,255,255,0.18)' : theme.bg,
                color: largeOn ? theme.primaryInk : theme.ink,
                opacity: largeOn && stepperVal >= MAX_PARTY ? 0.45 : 1,
                fontFamily: '"DM Sans", sans-serif', fontSize: 22, fontWeight: 500, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 150ms ease',
              }}
            >+</button>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <PrimaryButton theme={theme} onClick={onNext}>{t.next}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 2 — calendar
// ─────────────────────────────────────────────────────────────
function StepDate({ theme, t, value, onChange, onNext, lang }) {
  const today = new Date();
  const todayMid = new Date(today.toDateString());
  // Check whether today still has any bookable slots (used to disable today in calendar + "Tonight" chip)
  const _todayStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');
  const todayStillOpen = [...timeSlots(_todayStr, 'lunch'), ...timeSlots(_todayStr, 'dinner')].some(s => s.available);
  const [view, setView] = React.useState({
    year: today.getFullYear(), month: today.getMonth(),
  });
  const days = monthDays(view.year, view.month);
  const dayNames = lang === 'fr'
    ? ['L', 'M', 'M', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const max = new Date();
  max.setDate(max.getDate() + 60);

  const goMonth = (d) => {
    const m = view.month + d;
    const y = view.year + Math.floor(m / 12);
    setView({ year: y, month: ((m % 12) + 12) % 12 });
  };

  // Quick chips: Tonight / Tomorrow / This weekend (next Sat or Sun, whichever first)
  const tonight = new Date(todayMid); // today is "tonight" if not Sunday
  const tomorrow = new Date(todayMid); tomorrow.setDate(tomorrow.getDate() + 1);
  let weekend = null;
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayMid); d.setDate(d.getDate() + i);
    if ((d.getDay() === 6) && d > todayMid) { weekend = d; break; }
  }
  if (!weekend) {
    for (let i = 0; i < 14; i++) {
      const d = new Date(todayMid); d.setDate(d.getDate() + i);
      if (d.getDay() === 6 && d > todayMid) { weekend = d; break; }
    }
  }
  const quickChips = [
    { id: 'tonight', label: t.res_tonight, date: (tonight.getDay() === 0 || !todayStillOpen) ? null : tonight },
    { id: 'tomorrow', label: t.res_tomorrow, date: tomorrow.getDay() === 0 ? null : tomorrow },
    { id: 'weekend', label: t.res_weekend, date: weekend },
  ].filter(c => c.date);

  const jumpTo = (d) => {
    setView({ year: d.getFullYear(), month: d.getMonth() });
    onChange(d);
  };

  return (
    <div>
      <PageHeader theme={theme} title={t.res_q_date} sub={t.res_q_date_sub} hideChrome/>
      <div style={{ padding: '0 20px 100px' }}>
        {/* Quick chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {quickChips.map(c => {
            const on = value && isSameDay(c.date, value);
            return (
              <button key={c.id} onClick={() => jumpTo(c.date)} style={{
                appearance: 'none', border: 'none', cursor: 'pointer',
                padding: '9px 14px', borderRadius: 999,
                background: on ? theme.primary : theme.surface,
                color: on ? theme.primaryInk : theme.ink,
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 13, fontWeight: 500,
                boxShadow: on ? `0 4px 12px ${theme.primary}30` : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 180ms ease',
              }}>{c.label}</button>
            );
          })}
        </div>

        <Card theme={theme} padding={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <button onClick={() => goMonth(-1)} style={{
              appearance: 'none', border: 'none', background: theme.bg, cursor: 'pointer',
              width: 32, height: 32, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.inkSoft,
            }}><Icon name="arrow-left" size={18}/></button>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 22, fontWeight: 600, color: theme.ink,
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}>{fmtMonth(new Date(view.year, view.month, 1), lang)}</div>
            <button onClick={() => goMonth(1)} style={{
              appearance: 'none', border: 'none', background: theme.bg, cursor: 'pointer',
              width: 32, height: 32, borderRadius: 999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.inkSoft,
            }}><Icon name="arrow-right" size={18}/></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {dayNames.map((d, i) => (
              <div key={i} style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 11, color: theme.inkMute, textAlign: 'center',
                fontWeight: 500, letterSpacing: 0.4,
              }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {days.map((d, i) => {
              if (!d) return <div key={i}/>;
              const isPast = d < todayMid;
              const isMax = d > max;
              const isClosed = d.getDay() === 0; // Sundays closed
              const isToday = isSameDay(d, today);
              const dis = isPast || isMax || isClosed || (isToday && !todayStillOpen);
              const isSel = value && isSameDay(d, value);
              const isWeekend = d.getDay() === 6;
              return (
                <button key={i} onClick={dis ? null : () => onChange(d)} style={{
                  appearance: 'none', border: 'none',
                  cursor: dis ? 'default' : 'pointer',
                  aspectRatio: '1',
                  background: isSel ? theme.primary : (isToday && !dis ? theme.bg : 'transparent'),
                  color: dis ? theme.inkMute : (isSel ? theme.primaryInk : theme.ink),
                  borderRadius: 999,
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 15, fontWeight: isSel ? 600 : (isWeekend && !dis ? 600 : 500),
                  opacity: dis ? 0.32 : 1,
                  textDecoration: isClosed ? 'line-through' : 'none',
                  position: 'relative',
                  transition: 'all 180ms ease',
                  boxShadow: isSel ? `0 6px 14px ${theme.primary}40` : 'none',
                }}>
                  {d.getDate()}
                  {isToday && !isSel && (
                    <span style={{
                      position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
                      width: 4, height: 4, borderRadius: 2, background: theme.primary,
                    }}/>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: `1px solid ${theme.line}`,
            display: 'flex', gap: 14, alignItems: 'center',
            fontSize: 11, color: theme.inkMute,
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: 0.3,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: theme.primary }}/>
              {lang === 'fr' ? 'Aujourd\u2019hui' : lang === 'nl' ? 'Vandaag' : 'Today'}
            </span>
            <span>·</span>
            <span>{lang === 'fr' ? 'Dimanche fermé' : lang === 'nl' ? 'Zondag gesloten' : 'Sundays closed'}</span>
          </div>
        </Card>
        <div style={{ marginTop: 24 }}>
          <PrimaryButton theme={theme} disabled={!value} onClick={onNext}>{t.next}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 3 — time
// ─────────────────────────────────────────────────────────────
function diffHours(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em - sh * 60 - sm) / 60;
}

function fmtDuration(hours, lang) {
  if (hours <= 0) return '';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const hLabel = lang === 'fr' ? 'h' : lang === 'nl' ? 'u' : 'h';
  const mLabel = 'min';
  if (h && m) return `${h}${hLabel} ${m}${mLabel}`;
  if (h) return `${h}${hLabel}`;
  return `${m} ${mLabel}`;
}

const CAPACITY = 22;

function StepTime({ theme, t, date, value, endValue, mealId, onChange, onEndChange, onMeal, onNext, lang, availability, availLoading, party }) {
  const slots = timeSlots(date.toISOString().slice(0,10), mealId);
  const isSat = date.getDay() === 6;
  const [capacityWarning, setCapacityWarning] = React.useState(false);

  // Auto-switch to dinner on Saturdays (no lunch service)
  React.useEffect(() => {
    if (isSat && mealId === 'lunch') onMeal('dinner');
  }, [isSat, mealId]);

  const seatsLeft = (slotTime) => {
    if (!availability) return CAPACITY;
    return availability[slotTime] ?? CAPACITY;
  };

  const handlePick = (s) => {
    if (!s.available) return;
    if (seatsLeft(s.time) < party) return;
    setCapacityWarning(false);
    if (!value) { onChange(s.time); onEndChange(null); return; }
    if (value && !endValue) {
      if (s.time > value) {
        // Ensure every 30-min slot in [start, end) has enough seats
        const rangeSlots = slots.filter(sl => sl.time >= value && sl.time < s.time);
        const minLeft = rangeSlots.length > 0
          ? Math.min(...rangeSlots.map(sl => seatsLeft(sl.time)))
          : seatsLeft(value);
        if (minLeft < party) { setCapacityWarning(true); return; }
        onEndChange(s.time);
      } else {
        onChange(s.time); onEndChange(null);
      }
      return;
    }
    onChange(s.time); onEndChange(null);
  };

  const inRange = (time) => {
    if (!value) return false;
    if (!endValue) return time === value;
    return time >= value && time <= endValue;
  };

  const hasRange = value && endValue;
  const hasStart = value && !endValue;
  const duration = hasRange ? diffHours(value, endValue) : 0;

  return (
    <div>
      <PageHeader theme={theme} title={t.res_q_time} sub={fmtFullDate(date, lang)} hideChrome/>
      <div style={{ padding: '0 20px 100px' }}>
        {/* meal toggle */}
        <div style={{
          display: 'flex', background: theme.surfaceAlt, borderRadius: 14,
          padding: 4, marginBottom: 14,
        }}>
          {['lunch', 'dinner'].map(m => {
            const on = m === mealId;
            const dis = isSat && m === 'lunch';
            return (
              <button key={m} onClick={dis ? null : () => onMeal(m)} style={{
                appearance: 'none', border: 'none', cursor: dis ? 'default' : 'pointer',
                flex: 1, padding: '10px 0',
                background: on ? theme.surface : 'transparent',
                color: dis ? theme.inkMute : (on ? theme.ink : theme.inkSoft),
                borderRadius: 11,
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 14, fontWeight: on ? 600 : 500,
                boxShadow: on ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                opacity: dis ? 0.5 : 1,
                textDecoration: dis ? 'line-through' : 'none',
                transition: 'all 180ms ease',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Icon name={m === 'lunch' ? 'sun' : 'star'} size={14} color={dis ? theme.inkMute : (on ? theme.ink : theme.inkSoft)}/>
                {m === 'lunch' ? t.res_lunch : t.res_dinner}
              </button>
            );
          })}
        </div>

        {/* Selected range display — collapses to thin caption when nothing picked */}
        <div style={{
          background: hasRange ? theme.primary : (hasStart ? theme.surface : 'transparent'),
          color: hasRange ? theme.primaryInk : theme.ink,
          borderRadius: 16,
          padding: hasStart || hasRange ? '12px 16px' : '0 4px',
          marginBottom: 16,
          minHeight: hasStart || hasRange ? 64 : 26,
          boxShadow: hasRange ? `0 8px 22px ${theme.primary}40` : 'none',
          border: hasStart && !hasRange ? `1px dashed ${theme.line}` : 'none',
          transition: 'all 220ms ease',
          display: 'flex', alignItems: 'center',
        }}>
          {!hasStart && !hasRange && (
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12, fontWeight: 500, color: theme.inkSoft,
              letterSpacing: 0.4, textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>{t.res_range_pick_start}</div>
          )}
          {hasStart && !hasRange && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', gap: 12,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 10, fontWeight: 600, letterSpacing: 0.6,
                  textTransform: 'uppercase', color: theme.inkMute,
                  whiteSpace: 'nowrap',
                }}>{t.res_range_pick_end}</div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 28, fontWeight: 600, color: theme.ink,
                  lineHeight: 1.1, marginTop: 2,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}>{value}<span style={{
                  fontSize: 18, color: theme.inkMute, marginLeft: 8,
                }}>→ ?</span></div>
              </div>
              <button onClick={() => { onChange(null); onEndChange(null); }} style={{
                appearance: 'none', border: 'none', background: 'transparent',
                cursor: 'pointer', color: theme.primary,
                fontFamily: '"DM Sans", sans-serif', fontSize: 11,
                letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 600,
                padding: '6px 4px', flexShrink: 0,
              }}>{lang === 'fr' ? 'Réinitialiser' : lang === 'nl' ? 'Wissen' : 'Reset'}</button>
            </div>
          )}
          {hasRange && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div>
                  <div style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 10, fontWeight: 600, letterSpacing: 0.6,
                    textTransform: 'uppercase', opacity: 0.7,
                  }}>{lang === 'fr' ? 'De' : lang === 'nl' ? 'Van' : 'From'}</div>
                  <div style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 26, fontWeight: 600, lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>{value}</div>
                </div>
                <div style={{
                  width: 14, height: 1, background: 'currentColor', opacity: 0.5,
                  flexShrink: 0,
                }}/>
                <div>
                  <div style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 10, fontWeight: 600, letterSpacing: 0.6,
                    textTransform: 'uppercase', opacity: 0.7,
                  }}>{lang === 'fr' ? 'À' : lang === 'nl' ? 'Tot' : 'To'}</div>
                  <div style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 26, fontWeight: 600, lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>{endValue}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 10, fontWeight: 600, letterSpacing: 0.6,
                  textTransform: 'uppercase', opacity: 0.7,
                }}>{t.res_duration}</div>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 15, fontWeight: 600, lineHeight: 1.2, marginTop: 2,
                  fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
                }}>{fmtDuration(duration, lang)}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {slots.map(s => {
            const dis = !s.available;
            const left = seatsLeft(s.time);
            const capDis = left < party;
            const isDisabled = dis || capDis;
            const isStart = s.time === value;
            const isEnd = s.time === endValue;
            const inRng = inRange(s.time);
            const on = inRng;
            const isEndpoint = (isStart || isEnd) && !isDisabled;
            const seatColor = capDis
              ? '#ef4444'
              : left <= 5 ? '#f59e0b'
              : on ? 'rgba(255,255,255,0.6)' : theme.inkMute;
            const seatLabel = availLoading
              ? '…'
              : left === 0
              ? (lang === 'fr' ? 'Complet' : lang === 'nl' ? 'Vol' : 'Full')
              : left < CAPACITY
              ? `${left} ${lang === 'fr' ? 'pl.' : lang === 'nl' ? 'vrij' : 'left'}`
              : '';
            return (
              <button key={s.time} onClick={isDisabled ? null : () => handlePick(s)} style={{
                appearance: 'none', border: 'none',
                cursor: isDisabled ? 'default' : 'pointer',
                padding: '11px 0 9px',
                background: on ? theme.primary : theme.surface,
                color: isDisabled ? theme.inkMute : (on ? theme.primaryInk : theme.ink),
                borderRadius: 12,
                fontFamily: '"DM Sans", sans-serif',
                opacity: dis ? 0.4 : capDis ? 0.55 : 1,
                textDecoration: dis ? 'line-through' : 'none',
                fontVariantNumeric: 'tabular-nums',
                position: 'relative',
                outline: isEndpoint ? `2px solid ${theme.ink}` : 'none',
                outlineOffset: isEndpoint ? -2 : 0,
                boxShadow: on ? `0 4px 12px ${theme.primary}25` : 'none',
                transition: 'all 180ms ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{s.time}</span>
                {!dis && seatLabel ? (
                  <span style={{ fontSize: 9, fontWeight: 700, color: seatColor, letterSpacing: 0.3, lineHeight: 1, textTransform: 'uppercase' }}>
                    {seatLabel}
                  </span>
                ) : <span style={{ fontSize: 9, lineHeight: 1 }}>&nbsp;</span>}
              </button>
            );
          })}
        </div>
        {capacityWarning && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 10,
            background: '#FEF3C7',
            fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#92400E', lineHeight: 1.4,
          }}>
            {lang === 'fr'
              ? `Pas assez de places disponibles pour ${party} personnes sur toute la durée choisie.`
              : lang === 'nl'
              ? `Onvoldoende plaatsen voor ${party} gasten gedurende de volledige geselecteerde periode.`
              : `Not enough seats for ${party} guests across the full selected range.`}
          </div>
        )}
        <div style={{ marginTop: 28 }}>
          <PrimaryButton theme={theme} disabled={!hasRange} onClick={onNext}>{t.next}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 4 — details
// ─────────────────────────────────────────────────────────────
function StepDetails({ theme, t, data, onChange, onNext, lang }) {
  const [errs, setErrs] = React.useState({});
  const occasions = [
    { id: 'none', label: t.res_occasion_none },
    { id: 'birthday', label: t.res_occasion_birthday },
    { id: 'anniv', label: t.res_occasion_anniv },
    { id: 'date', label: t.res_occasion_date },
    { id: 'business', label: t.res_occasion_business },
  ];
  const submit = () => {
    const e = {};
    if (!data.name || data.name.trim().length < 2) e.name = lang === 'fr' ? 'Nom requis' : lang === 'nl' ? 'Naam vereist' : 'Name required';
    if (!data.phone || data.phone.replace(/\D/g, '').length < 8) e.phone = lang === 'fr' ? 'Numéro invalide' : lang === 'nl' ? 'Telefoon vereist' : 'Phone required';
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) e.email = lang === 'fr' ? 'E-mail invalide' : lang === 'nl' ? 'Ongeldig e-mailadres' : 'Invalid email';
    setErrs(e);
    if (Object.keys(e).length === 0) onNext();
  };
  return (
    <div>
      <PageHeader theme={theme} title={t.res_q_details} sub={t.res_q_details_sub} hideChrome/>
      <div style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field theme={theme} label={t.res_name} value={data.name} onChange={(v) => onChange({ name: v })}
               placeholder={lang === 'fr' ? 'Prénom et nom' : lang === 'nl' ? 'Voor- en achternaam' : 'First & last name'}
               icon="user" required error={errs.name}/>
        <Field theme={theme} label={t.res_phone} value={data.phone} onChange={(v) => onChange({ phone: v })}
               placeholder="+32 …" type="tel" icon="phone" required error={errs.phone}/>
        <Field theme={theme} label={t.res_email} value={data.email} onChange={(v) => onChange({ email: v })}
               placeholder="you@example.com" type="email" icon="mail" required error={errs.email}/>
        <div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12, fontWeight: 500, color: theme.inkSoft,
            letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>{t.res_occasion}</span>
            <span style={{ color: theme.inkMute, textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>{lang === 'fr' ? 'facultatif' : lang === 'nl' ? 'optioneel' : 'optional'}</span>
          </div>
          <ChipRow theme={theme} options={occasions} value={data.occasion} onChange={(v) => onChange({ occasion: v })}/>
        </div>
        <Field theme={theme} label={t.res_notes} value={data.notes} onChange={(v) => onChange({ notes: v })}
               placeholder={t.res_notes_ph} multiline/>
        <Field theme={theme} label={t.res_special} value={data.specialRequests}
               onChange={(v) => onChange({ specialRequests: v })}
               placeholder={t.res_special_ph} multiline icon="sparkle"/>
        <div style={{ marginTop: 12 }}>
          <PrimaryButton theme={theme} onClick={submit}>{t.next}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 5 — review and confirm
// ─────────────────────────────────────────────────────────────
const REVIEW_HERO_IMG = 'img/chefs-dish.webp';

function StepReview({ theme, t, data, onConfirm, lang, loading, error }) {
  const occasionLabel = {
    none: t.res_occasion_none, birthday: t.res_occasion_birthday,
    anniv: t.res_occasion_anniv, business: t.res_occasion_business, date: t.res_occasion_date,
  }[data.occasion] || t.res_occasion_none;
  const occasionIcon = {
    birthday: 'gift', anniv: 'heart', date: 'sparkle', business: 'cards', none: 'star',
  }[data.occasion];
  return (
    <div>
      <PageHeader theme={theme} title={t.res_review} sub={t.res_review_sub} hideChrome/>
      <div style={{ padding: '0 20px 120px' }}>
        {/* Ticket-style hero card with image background */}
        <div style={{
          borderRadius: 22, overflow: 'hidden',
          boxShadow: '0 18px 36px rgba(26,36,25,0.18)',
          position: 'relative',
          background: theme.primary,
        }}>
          {/* image with overlay */}
          <div style={{
            position: 'relative',
            backgroundImage: `linear-gradient(135deg, ${theme.primary}F6 0%, ${theme.primary}F0 55%, ${theme.primary}FA 100%), url(${REVIEW_HERO_IMG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: theme.primaryInk,
            padding: '22px 22px 20px',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              marginBottom: 14,
            }}>
              <div style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase',
                opacity: 0.8, fontWeight: 600,
              }}>{lang === 'fr' ? 'Votre réservation' : lang === 'nl' ? 'Uw reservering' : 'Your reservation'}</div>
              <Wordmark color={theme.primaryInk} size={11}/>
            </div>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 44, fontWeight: 600, lineHeight: 0.98,
              letterSpacing: -0.5,
            }}>{data.party} <span style={{
              fontSize: 22, fontWeight: 500, opacity: 0.85, marginLeft: 4,
            }}>{data.party === 1 ? t.res_guest : t.res_guests}</span></div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, marginTop: 12, opacity: 0.92,
              textTransform: 'capitalize', fontWeight: 500,
            }}>{fmtFullDate(data.date, lang)}</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginTop: 6,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, opacity: 0.88,
              fontVariantNumeric: 'tabular-nums',
            }}>
              <Icon name="clock" size={14} color={theme.primaryInk}/>
              {data.time}{data.endTime ? ` → ${data.endTime}` : ''}
              {data.endTime && (
                <span style={{ opacity: 0.7 }}>· {fmtDuration(diffHours(data.time, data.endTime), lang)}</span>
              )}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'center', marginTop: 16,
              color: theme.primaryInk,
            }}>
              <ResOrnament color={theme.primaryInk} opacity={0.45}/>
            </div>
          </div>

          {/* Perforated divider */}
          <div style={{ position: 'relative', height: 18, background: theme.surface }}>
            <div style={{
              position: 'absolute', top: -9, left: -9,
              width: 18, height: 18, borderRadius: 9, background: theme.bg,
            }}/>
            <div style={{
              position: 'absolute', top: -9, right: -9,
              width: 18, height: 18, borderRadius: 9, background: theme.bg,
            }}/>
            <div style={{
              position: 'absolute', top: 8, left: 12, right: 12, height: 1,
              backgroundImage: `repeating-linear-gradient(to right, ${theme.line} 0 6px, transparent 6px 12px)`,
            }}/>
          </div>

          {/* Detail rows */}
          <div style={{ background: theme.surface, padding: '8px 22px 16px' }}>
            <ReviewRow theme={theme} icon="user" label={t.res_name} value={data.name}/>
            <ReviewRow theme={theme} icon="phone" label={t.res_phone} value={data.phone}/>
            <ReviewRow theme={theme} icon="mail" label={t.res_email} value={data.email}/>
            {data.occasion && data.occasion !== 'none' && (
              <ReviewRow theme={theme} icon={occasionIcon} label={t.res_occasion} value={occasionLabel}/>
            )}
            {data.notes && (
              <ReviewRow theme={theme} icon="leaf" label={t.res_notes} value={data.notes} multiline last={!data.specialRequests}/>
            )}
            {data.specialRequests && (
              <ReviewRow theme={theme} icon="sparkle" label={t.res_special} value={data.specialRequests} multiline last/>
            )}
          </div>
        </div>

        {/* Location card */}
        <div style={{
          marginTop: 14,
          padding: '14px 16px',
          background: theme.surface,
          borderRadius: 14,
          display: 'flex', gap: 12, alignItems: 'flex-start',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13, color: theme.inkSoft, lineHeight: 1.5,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: `${theme.primary}15`, color: theme.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name="pin" size={18} color={theme.primary}/>
          </div>
          <div>
            <div style={{ color: theme.ink, fontWeight: 500 }}>Bld de l\'Empereur 26, 1000 Brussels</div>
            <div style={{ color: theme.inkMute, marginTop: 2 }}>
              {lang === 'fr' ? 'Belgique · 5 min à pied de la Gare Centrale' : lang === 'nl' ? 'België · 5 min lopen van Brussel-Centraal' : 'Belgium · 5 min walk from Central Station'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <PrimaryButton theme={theme} onClick={loading ? null : onConfirm} disabled={loading}>
            {loading
              ? (lang === 'fr' ? 'Envoi en cours…' : lang === 'nl' ? 'Bezig met verzenden…' : 'Sending…')
              : t.res_confirm}
          </PrimaryButton>
        </div>
        {error && (
          <div style={{
            marginTop: 10, padding: '10px 14px', borderRadius: 10,
            background: `${theme.danger}18`, color: theme.danger,
            fontFamily: '"DM Sans", sans-serif', fontSize: 13, lineHeight: 1.5,
          }}>{error}</div>
        )}
        <div style={{
          marginTop: 12, textAlign: 'center',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, color: theme.inkMute,
        }}>{lang === 'fr' ? 'Modification ou annulation gratuite jusqu\u2019à 2 h avant' : lang === 'nl' ? 'Gratis wijzigen of annuleren tot 2 u vooraf' : 'Free changes or cancellation up to 2 h before'}</div>
      </div>
    </div>
  );
}

function ReviewRow({ theme, label, value, multiline, icon, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: multiline ? 'flex-start' : 'center',
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${theme.line}`,
      gap: 12,
    }}>
      {icon && (
        <div style={{
          width: 30, height: 30, borderRadius: 15, flexShrink: 0,
          background: theme.bg, color: theme.inkSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: multiline ? 2 : 0,
        }}>
          <Icon name={icon} size={14} color={theme.inkSoft}/>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 11, fontWeight: 500, color: theme.inkMute,
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>{label}</div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 15, color: theme.ink, fontWeight: 500,
          marginTop: 2,
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
          wordBreak: 'break-word',
        }}>{value}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Confirmation screen
// ─────────────────────────────────────────────────────────────
function ReserveConfirmed({ theme, t, data, onDone, lang, code }) {
  const codeRef = React.useRef(code || ('EW-' + String(Math.floor(Math.random() * 9000) + 1000)));
  const pending = data.party >= 7;
  const accent = pending ? theme.accent : theme.primary;
  return (
    <div style={{ minHeight: '100%' }}>
      <PageHeader theme={theme}/>
      <div style={{ padding: '0 20px 120px' }}>
        <div style={{ textAlign: 'center', marginTop: 4, marginBottom: 28, position: 'relative' }}>
          {/* Decorative scattered dots behind the icon */}
          <svg width="220" height="120" viewBox="0 0 220 120" style={{
            position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}>
            {[
              [30, 22, 2], [200, 30, 1.5], [18, 70, 1.5], [205, 78, 2],
              [50, 12, 1], [180, 12, 1], [60, 95, 1.2], [165, 100, 1.5],
              [10, 40, 1], [212, 56, 1.2],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill={accent} opacity={0.55}/>
            ))}
          </svg>
          <div style={{
            width: 84, height: 84, borderRadius: 42,
            background: accent, color: pending ? theme.ink : theme.primaryInk,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
            boxShadow: `0 14px 36px ${accent}55`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: -6, borderRadius: 48,
              border: `1px solid ${accent}55`,
            }}/>
            {pending
              ? <Icon name="clock" size={38} stroke={2.2}/>
              : <Icon name="check" size={38} stroke={2.4}/>}
          </div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 38, fontWeight: 600, color: theme.ink, lineHeight: 1.05,
            letterSpacing: -0.5,
          }}>{pending ? t.res_pending_title : t.res_done_title}</div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, color: theme.inkMute, marginTop: 10,
            padding: '0 16px', lineHeight: 1.5,
          }}>{pending ? t.res_pending_sub : t.res_done_sub}</div>
          <div style={{
            display: 'flex', justifyContent: 'center', marginTop: 16,
            color: accent,
          }}>
            <ResOrnament color={accent} opacity={0.6}/>
          </div>
        </div>

        {/* Ticket card */}
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          background: theme.surface,
          boxShadow: '0 10px 28px rgba(26,36,25,0.10)',
          position: 'relative',
        }}>
          <div style={{ padding: '18px 20px 16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingBottom: 14, marginBottom: 14, borderBottom: `1px dashed ${theme.line}`,
            }}>
              <div>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 10,
                  letterSpacing: 0.6, textTransform: 'uppercase', color: theme.inkMute,
                  fontWeight: 500,
                }}>{t.res_done_code}</div>
                <div style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 26, fontWeight: 600, color: theme.ink,
                  letterSpacing: 0.4, lineHeight: 1, marginTop: 4,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}>{codeRef.current}</div>
              </div>
              {pending ? (
                <span style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 10,
                  fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
                  background: accent, color: theme.ink,
                  padding: '6px 10px', borderRadius: 999,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: 3, background: theme.ink,
                    animation: 'pulse 1.6s ease-in-out infinite',
                  }}/>
                  {t.res_pending_badge}
                </span>
              ) : (
                <div style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 10,
                  fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
                  color: theme.primary,
                  padding: '6px 10px', borderRadius: 999,
                  background: `${theme.primary}15`,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <Icon name="check" size={11} color={theme.primary} stroke={2.6}/>
                  {lang === 'fr' ? 'Confirmé' : lang === 'nl' ? 'Bevestigd' : 'Confirmed'}
                </div>
              )}
            </div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 15, color: theme.ink,
              fontWeight: 500, textTransform: 'capitalize', lineHeight: 1.4,
            }}>{fmtFullDate(data.date, lang)}</div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.inkSoft,
              marginTop: 4, fontVariantNumeric: 'tabular-nums',
            }}>
              {data.time}{data.endTime ? ` → ${data.endTime}` : ''} · {data.party} {data.party === 1 ? t.res_guest : t.res_guests} · {data.name}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <GhostButton theme={theme}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="calendar" size={16}/>{t.res_add_calendar}</span></GhostButton>
          <GhostButton theme={theme}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="pin" size={16}/>{t.res_directions}</span></GhostButton>
        </div>
        <div style={{ marginTop: 24 }}>
          <PrimaryButton theme={theme} onClick={onDone}>{t.res_back_home}</PrimaryButton>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Master flow
// ─────────────────────────────────────────────────────────────
function ReserveFlow({ theme, t, lang, onExit, onConfirmed, initial }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState(initial || {
    party: 2, date: null, time: null, endTime: null, mealId: 'dinner',
    name: '', phone: '', email: '', occasion: 'none', notes: '', specialRequests: '',
  });
  const set = (patch) => setData(d => ({ ...d, ...patch }));
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [confirmError, setConfirmError] = React.useState(null);
  const [confirmCode, setConfirmCode] = React.useState(null);
  const [availability, setAvailability] = React.useState(null);
  const [availLoading, setAvailLoading] = React.useState(false);

  // Fetch real-time seat availability whenever the user enters the time step
  React.useEffect(() => {
    if (step !== 2 || !data.date) return;
    const dateStr = data.date.toISOString().slice(0, 10);
    setAvailLoading(true);
    setAvailability(null);
    fetch(`/.netlify/functions/availability?date=${dateStr}`)
      .then(r => r.json())
      .then(json => setAvailability(json.available || null))
      .catch(() => setAvailability(null))
      .finally(() => setAvailLoading(false));
  }, [step, data.date]);

  const handleConfirm = async () => {
    setConfirmLoading(true);
    setConfirmError(null);
    try {
      const payload = {
        ...data,
        date: data.date ? data.date.toISOString().slice(0, 10) : null,
      };
      const res = await fetch('/.netlify/functions/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload, lang }),
      });
      const json = await res.json();
      if (json.error === 'overbooking') {
        throw new Error(
          lang === 'fr'
            ? `Désolé, seulement ${json.available} place${json.available === 1 ? '' : 's'} disponible${json.available === 1 ? '' : 's'} à ${json.slot}.`
            : lang === 'nl'
            ? `Sorry, slechts ${json.available} plaats${json.available === 1 ? '' : 'en'} beschikbaar om ${json.slot}.`
            : `Sorry, only ${json.available} seat${json.available === 1 ? '' : 's'} available at ${json.slot}. Please go back and choose a different time.`
        );
      }
      if (!res.ok || !json.success) throw new Error(json.error || 'Request failed');
      setConfirmCode(json.code);
      onConfirmed({ ...data, pending: data.party >= 7 });
      setStep(5);
    } catch (err) {
      setConfirmError(err.message || 'Could not send reservation. Please try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

  if (step === 5) {
    return <ReserveConfirmed theme={theme} t={t} lang={lang} data={data} code={confirmCode} onDone={onExit}/>;
  }

  return (
    <div>
      <div style={{ padding: '12px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
          <button onClick={step === 0 ? onExit : () => setStep(s => Math.max(0, s - 1))} aria-label="back" style={{
            appearance: 'none', border: 'none', background: theme.surface,
            color: theme.ink, cursor: 'pointer',
            width: 40, height: 40, borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <Icon name="arrow-left" size={20}/>
          </button>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12, color: theme.inkMute,
            letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>{t.res_step} {step + 1} {t.res_of} 5</div>
          <div style={{ width: 40 }}/>
        </div>
      </div>
      <div style={{ paddingTop: 14 }}>
        <ProgressBar step={step} total={5} theme={theme}/>
      </div>
      {step === 0 && <StepParty theme={theme} t={t} value={data.party} onChange={(v) => set({ party: v })} onNext={() => setStep(1)}/>}
      {step === 1 && <StepDate theme={theme} t={t} lang={lang} value={data.date} onChange={(v) => set({ date: v })} onNext={() => setStep(2)}/>}
      {step === 2 && <StepTime theme={theme} t={t} lang={lang} date={data.date} value={data.time} endValue={data.endTime} mealId={data.mealId} availability={availability} availLoading={availLoading} party={data.party} onChange={(v) => set({ time: v })} onEndChange={(v) => set({ endTime: v })} onMeal={(m) => set({ mealId: m, time: null, endTime: null })} onNext={() => setStep(3)}/>}
      {step === 3 && <StepDetails theme={theme} t={t} lang={lang} data={data} onChange={set} onNext={() => setStep(4)}/>}
      {step === 4 && (
        <StepReview theme={theme} t={t} lang={lang} data={data}
          onConfirm={handleConfirm}
          loading={confirmLoading}
          error={confirmError}/>
      )}
    </div>
  );
}

Object.assign(window, { ReserveFlow });
