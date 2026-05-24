// Shared UI primitives + icons for East@West app

// ─────────────────────────────────────────────────────────────
// Icons — minimal line set drawn in single stroke
// ─────────────────────────────────────────────────────────────
const Icon = ({ name, size = 22, stroke = 1.6, color = 'currentColor', fill = 'none' }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill, stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return <svg {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>;
    case 'calendar':
      return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'bag':
      return <svg {...p}><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>;
    case 'user':
      return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>;
    case 'search':
      return <svg {...p}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'arrow-left':
      return <svg {...p}><path d="M15 5l-7 7 7 7M8 12h13"/></svg>;
    case 'arrow-right':
      return <svg {...p}><path d="M9 5l7 7-7 7M16 12H3"/></svg>;
    case 'plus':
      return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus':
      return <svg {...p}><path d="M5 12h14"/></svg>;
    case 'check':
      return <svg {...p}><path d="M5 12.5 10 17.5 19.5 7"/></svg>;
    case 'x':
      return <svg {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case 'clock':
      return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>;
    case 'phone':
      return <svg {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>;
    case 'mail':
      return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>;
    case 'gift':
      return <svg {...p}><rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8s-2-4-4.5-4S5 6 5 7s.5 1 2 1h5zm0 0s2-4 4.5-4S19 6 19 7s-.5 1-2 1h-5z"/></svg>;
    case 'heart':
      return <svg {...p}><path d="M12 20s-7-4.5-9-9c-1-2.5.5-6 3.5-6S12 7 12 9c0-2 2.5-4 5.5-4s4.5 3.5 3.5 6c-2 4.5-9 9-9 9z"/></svg>;
    case 'star':
      return <svg {...p}><path d="m12 4 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 17.5l-5.3 2.8 1-5.9L3.5 10.2l5.9-.8L12 4z"/></svg>;
    case 'pin':
      return <svg {...p}><path d="M12 21s-7-6-7-12a7 7 0 1 1 14 0c0 6-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case 'flame':
      return <svg {...p}><path d="M12 21c-4 0-7-2.5-7-6 0-3 2-4 2-7 0-1.5 1-2 1-2s1 2 3 3c2.5 1 4 3 4 6 0 1-.5 2-1.5 2.5 0 0 .5-2-1-3 0 2-2 2-2 4 0 1 1 2.5 1.5 2.5z"/></svg>;
    case 'leaf':
      return <svg {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19c2-5 6-9 11-11"/></svg>;
    case 'wheat':
      return <svg {...p}><path d="M12 3v18M8 6c0 2 2 4 4 4M16 6c0 2-2 4-4 4M8 11c0 2 2 4 4 4M16 11c0 2-2 4-4 4M8 16c0 2 2 4 4 4M16 16c0 2-2 4-4 4"/></svg>;
    case 'sparkle':
      return <svg {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.5 5.5l4 4M14.5 14.5l4 4M18.5 5.5l-4 4M9.5 14.5l-4 4"/></svg>;
    case 'cards':
      return <svg {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></svg>;
    case 'bell':
      return <svg {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case 'globe':
      return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/></svg>;
    case 'logout':
      return <svg {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4M6 12h12"/></svg>;
    case 'sun':
      return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5"/></svg>;
    case 'chevron-right':
      return <svg {...p}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chevron-down':
      return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    default:
      return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
};

// ─────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────
const Logo = ({ size = 32 }) => (
  <img src="logo-crop.png" alt="East at West" width={size} height={size}
       style={{ display: 'block', objectFit: 'contain' }}/>
);

// Small horizontal wordmark for headers (uses logo image)
const LogoChip = ({ size = 22 }) => (
  <img src="logo-crop.png" alt="East at West" width={size} height={size}
       style={{ display: 'block', objectFit: 'contain' }}/>
);

// Wordmark — small caps Cormorant (fallback typeset)
const Wordmark = ({ color = 'currentColor', size = 14 }) => (
  <span style={{
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 500, letterSpacing: '0.32em',
    fontSize: size, color, textTransform: 'uppercase',
    fontFeatureSettings: '"smcp"',
    whiteSpace: 'nowrap',
  }}>East <span style={{ fontStyle: 'italic', letterSpacing: '0.18em' }}>@</span> West</span>
);

// ─────────────────────────────────────────────────────────────
// Procedural food art — used as image placeholders
// Stylised plates rendered with SVG so the screens never look "empty".
// img keys map to a hash that varies hue + shape.
// ─────────────────────────────────────────────────────────────
function PlateArt({ id, size = 84, ring = '#B85535', plate = '#F2EADB' }) {
  // hash a 2-char id into deterministic params
  const h = (id || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const variant = h % 6;
  const accent1 = ['#C66B3C', '#7A3520', '#5A6A3F', '#D9A14F', '#A88B3E', '#9C5B30'][h % 6];
  const accent2 = ['#5A6A3F', '#3D4828', '#7A3520', '#C2B484', '#3E1A0E', '#D8B66A'][(h * 3) % 6];
  const garnish = ['#5A6A3F', '#9CAF77', '#C66B3C', '#D9A14F'][(h * 7) % 4];
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id={`pl-${id}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor={plate}/>
          <stop offset="100%" stopColor={ring} stopOpacity="0.18"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#pl-${id})`} stroke={ring} strokeOpacity="0.18" strokeWidth="0.6"/>
      <circle cx="50" cy="50" r="34" fill="none" stroke={ring} strokeOpacity="0.12" strokeWidth="0.5"/>
      {variant === 0 && (
        <g>
          <ellipse cx="50" cy="52" rx="24" ry="22" fill={accent1}/>
          <ellipse cx="50" cy="48" rx="12" ry="9" fill={accent2}/>
          <circle cx="42" cy="42" r="2.5" fill={garnish}/>
          <circle cx="58" cy="44" r="2" fill={garnish}/>
        </g>
      )}
      {variant === 1 && (
        <g>
          {[0,1,2,3,4].map(i => (
            <ellipse key={i} cx={28 + i * 11} cy={50 + (i%2?-3:3)} rx="6" ry="4.5" fill={accent1}/>
          ))}
          <path d="M30 60 Q50 70 70 60" stroke={garnish} strokeWidth="1.5" fill="none"/>
        </g>
      )}
      {variant === 2 && (
        <g>
          <path d="M28 70 Q28 35 50 30 Q72 35 72 70 Z" fill={accent1}/>
          <path d="M40 55 L60 55 L58 68 L42 68 Z" fill={accent2} opacity="0.7"/>
          <circle cx="50" cy="40" r="2.5" fill={garnish}/>
        </g>
      )}
      {variant === 3 && (
        <g>
          <rect x="26" y="40" width="48" height="24" rx="3" fill={accent1}/>
          <rect x="32" y="36" width="36" height="6" rx="2" fill={accent2}/>
          <line x1="32" y1="48" x2="68" y2="48" stroke={ring} strokeOpacity="0.3" strokeWidth="0.8"/>
          <line x1="32" y1="56" x2="68" y2="56" stroke={ring} strokeOpacity="0.3" strokeWidth="0.8"/>
        </g>
      )}
      {variant === 4 && (
        <g>
          <circle cx="40" cy="48" r="11" fill={accent1}/>
          <circle cx="58" cy="52" r="9" fill={accent2}/>
          <circle cx="50" cy="62" r="6" fill={accent1} opacity="0.8"/>
          <circle cx="38" cy="42" r="1.5" fill={garnish}/>
          <circle cx="62" cy="48" r="1.5" fill={garnish}/>
        </g>
      )}
      {variant === 5 && (
        <g>
          <path d="M28 50 Q50 28 72 50 Q50 72 28 50 Z" fill={accent1}/>
          <path d="M40 50 Q50 42 60 50 Q50 58 40 50 Z" fill={accent2}/>
          <circle cx="50" cy="50" r="2.5" fill={garnish}/>
        </g>
      )}
    </svg>
  );
}

// Wider hero plate for dish detail
function HeroPlate({ id, w = 360, h = 220, ring = '#B85535', bg = '#EFE5D0' }) {
  return (
    <div style={{
      width: w, height: h, background: bg, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <PlateArt id={id} size={Math.min(h, w) * 0.92} ring={ring} plate={bg}/>
      {/* subtle vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.12) 100%)',
        pointerEvents: 'none',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Renders a real photo when dish.photo is set, otherwise a clean blank tile.
function DishImage({ dish, size, theme, lang = 'en' }) {
  if (dish && dish.photo) {
    return (
      <img src={dish.photo} alt={dishName(dish, lang)}
        style={{
          width: size, height: size,
          objectFit: 'cover', display: 'block',
        }}/>
    );
  }
  return (
    <div style={{
      width: size, height: size,
      background: theme.surfaceAlt,
    }}/>
  );
}

// Wider hero for dish detail.
function DishHero({ dish, w, h, theme, lang = 'en' }) {
  if (dish && dish.photo) {
    return (
      <div style={{ width: w, height: h, background: theme.surfaceAlt, overflow: 'hidden', position: 'relative' }}>
        <img src={dish.photo} alt={dishName(dish, lang)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%)',
          pointerEvents: 'none',
        }}/>
      </div>
    );
  }
  return (
    <div style={{ width: w, height: h, background: theme.surfaceAlt }}/>
  );
}

// Buttons
// ─────────────────────────────────────────────────────────────
function PrimaryButton({ children, onClick, disabled, full = true, theme }) {
  return (
    <button
      onClick={disabled ? null : onClick}
      style={{
        appearance: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer',
        background: disabled ? theme.surfaceAlt : theme.primary,
        color: disabled ? theme.inkMute : theme.primaryInk,
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontWeight: 600, fontSize: 16, letterSpacing: 0.1,
        height: 54, borderRadius: 14, padding: '0 20px',
        width: full ? '100%' : 'auto',
        transition: 'transform 120ms ease, background 200ms ease',
        boxShadow: disabled ? 'none' : `0 1px 0 rgba(0,0,0,0.04), 0 6px 18px ${theme.primary}33`,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.985)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  );
}

function GhostButton({ children, onClick, theme, full = true }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: 'pointer',
      background: 'transparent', color: theme.ink,
      border: `1px solid ${theme.line}`,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontWeight: 500, fontSize: 15,
      height: 50, borderRadius: 14, padding: '0 18px',
      width: full ? '100%' : 'auto',
    }}>{children}</button>
  );
}

function TextButton({ children, onClick, theme, color }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: 'pointer', background: 'transparent',
      border: 'none', color: color || theme.primary,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      fontWeight: 500, fontSize: 15, padding: 0,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Card / panel containers
// ─────────────────────────────────────────────────────────────
function Card({ children, theme, padding = 16, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: theme.surface, borderRadius: 18,
      padding, boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.04)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stepper (qty)
// ─────────────────────────────────────────────────────────────
function Stepper({ value, onChange, min = 1, max = 20, theme, size = 'md' }) {
  const sz = size === 'sm' ? 28 : 36;
  const btn = (icon, fn, dis) => (
    <button onClick={dis ? null : fn} style={{
      width: sz, height: sz, borderRadius: sz / 2, border: 'none',
      background: theme.surfaceAlt, color: dis ? theme.inkMute : theme.ink,
      cursor: dis ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{icon}</button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {btn(<Icon name="minus" size={16}/>, () => onChange(value - 1), value <= min)}
      <div style={{
        minWidth: 22, textAlign: 'center', fontWeight: 600,
        fontFamily: '"DM Sans", sans-serif',
        fontSize: size === 'sm' ? 15 : 17, color: theme.ink,
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      {btn(<Icon name="plus" size={16}/>, () => onChange(value + 1), value >= max)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tag pill
// ─────────────────────────────────────────────────────────────
function Tag({ children, theme, color, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999,
      background: bg || theme.surfaceAlt,
      color: color || theme.inkSoft,
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 11, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase',
    }}>{children}</span>
  );
}

// Small "info chip" — used in headers
function InfoChip({ icon, label, theme }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 999,
      background: theme.surfaceAlt, color: theme.inkSoft,
      fontSize: 12, fontWeight: 500,
      fontFamily: '"DM Sans", sans-serif',
    }}>
      {icon && <Icon name={icon} size={14}/>}
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────────────────────
function SectionTitle({ children, sub, theme, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px', marginTop: 8, marginBottom: 12, gap: 12 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 24, fontWeight: 600, color: theme.ink,
          letterSpacing: -0.2, lineHeight: 1.1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{children}</div>
        {sub && <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13, color: theme.inkMute, marginTop: 2,
        }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// Page header (in-app, not nav)
function PageHeader({ onBack, title, theme, right, sub, dark, hideChrome }) {
  const showChrome = !hideChrome;
  return (
    <div style={{ padding: '12px 20px 8px' }}>
      {showChrome && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, minHeight: 40 }}>
          {onBack ? (
            <button onClick={onBack} aria-label="back" style={{
              appearance: 'none', border: 'none', background: theme.surface,
              color: theme.ink, cursor: 'pointer',
              width: 40, height: 40, borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <Icon name="arrow-left" size={20}/>
            </button>
          ) : <div style={{ width: 40 }}/>}
          <LogoChip size={28}/>
          {right || <div style={{ width: 40 }}/>}
        </div>
      )}
      {title && (
        <div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 34, fontWeight: 600, color: theme.ink,
            lineHeight: 1.05, letterSpacing: -0.4,
          }}>{title}</div>
          {sub && <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, color: theme.inkMute, marginTop: 6,
          }}>{sub}</div>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom nav (tab bar)
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onChange, theme, platform, t }) {
  const items = [
    { id: 'home',    icon: 'home',     label: t.tab_home },
    { id: 'reserve', icon: 'calendar', label: t.tab_reserve },
    { id: 'order',   icon: 'bag',      label: t.tab_order },
    { id: 'account', icon: 'user',     label: t.tab_account },
  ];
  const isIOS = platform === 'ios';
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: isIOS ? 28 : 26,
      paddingTop: 8, paddingLeft: 12, paddingRight: 12,
      background: `linear-gradient(180deg, transparent, ${theme.bg} 22%)`,
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        background: theme.surface,
        borderRadius: 24,
        padding: '6px 4px',
        boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 30px rgba(42,32,20,0.14), 0 0 0 0.5px ' + theme.line,
        pointerEvents: 'auto',
      }}>
        {items.map(it => {
          const on = it.id === active;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              appearance: 'none', border: 'none', background: 'transparent',
              cursor: 'pointer', padding: '8px 6px',
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: on ? theme.primary : theme.inkMute,
              transition: 'color 200ms ease',
            }}>
              <Icon name={it.icon} size={22} stroke={on ? 2 : 1.6}/>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 10.5, fontWeight: on ? 600 : 500, letterSpacing: 0.1,
              }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Field (text input)
// ─────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, theme, error, type = 'text', multiline, icon, required }) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 12, fontWeight: 500, color: theme.inkSoft,
        letterSpacing: 0.4, textTransform: 'uppercase',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        {!required && <span style={{ color: theme.inkMute, textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>optional</span>}
      </div>
      <div style={{
        position: 'relative',
        background: theme.surface,
        borderRadius: 12,
        border: `1px solid ${error ? theme.danger : (focus ? theme.primary : theme.line)}`,
        transition: 'border-color 160ms ease',
      }}>
        {icon && <div style={{ position: 'absolute', left: 14, top: multiline ? 14 : '50%', transform: multiline ? 'none' : 'translateY(-50%)', color: theme.inkMute }}>
          <Icon name={icon} size={18}/>
        </div>}
        <Tag
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          rows={multiline ? 3 : undefined}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none', border: 'none', outline: 'none',
            width: '100%', background: 'transparent', color: theme.ink,
            fontFamily: '"DM Sans", sans-serif', fontSize: 16,
            padding: multiline ? '12px 14px 12px ' + (icon ? '40px' : '14px') : ('0 14px 0 ' + (icon ? '40px' : '14px')),
            height: multiline ? 'auto' : 50,
            resize: 'none',
            boxSizing: 'border-box',
          }}/>
      </div>
      {error && <div style={{ fontSize: 12, color: theme.danger, fontFamily: '"DM Sans", sans-serif' }}>{error}</div>}
    </div>
  );
}

// Selectable chip (radio-style)
function ChipRow({ options, value, onChange, theme }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const on = o.id === value;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            appearance: 'none', border: 'none', cursor: 'pointer',
            background: on ? theme.ink : theme.surface,
            color: on ? theme.bg : theme.ink,
            fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 500,
            padding: '10px 14px', borderRadius: 999,
            boxShadow: on ? 'none' : `0 0 0 1px ${theme.line} inset`,
            transition: 'all 200ms ease',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  Icon, Logo, LogoChip, Wordmark, PlateArt, HeroPlate, DishImage, DishHero,
  PrimaryButton, GhostButton, TextButton, Card,
  Stepper, Tag, InfoChip, SectionTitle, PageHeader,
  BottomNav, Field, ChipRow,
  LanguageSheet, LanguagePill,
});

// ─────────────────────────────────────────────────────────────
// Language picker — bottom sheet + small pill button
// ─────────────────────────────────────────────────────────────
function LanguageSheet({ theme, currentLang, onPick, onClose }) {
  // Slide-up animation via state
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const handleClose = () => {
    setEntered(false);
    setTimeout(onClose, 220);
  };
  const handlePick = (id) => {
    setEntered(false);
    setTimeout(() => onPick(id), 180);
  };
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      {/* scrim */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15,12,8,0.42)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: entered ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      />
      {/* sheet */}
      <div style={{
        position: 'relative',
        background: theme.surface,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '14px 18px 28px',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.18)',
        transform: entered ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 260ms cubic-bezier(0.22, 0.61, 0.36, 1)',
      }}>
        {/* grabber */}
        <div style={{
          width: 44, height: 5, borderRadius: 3,
          background: theme.line,
          margin: '0 auto 16px',
        }}/>
        <div style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 22, fontWeight: 600, color: theme.ink,
          letterSpacing: -0.2,
          padding: '0 4px 4px',
        }}>
          {currentLang === 'fr' ? 'Choisir la langue' : currentLang === 'nl' ? 'Taal kiezen' : 'Choose language'}
        </div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13, color: theme.inkMute,
          padding: '0 4px 14px',
        }}>
          {currentLang === 'fr' ? 'Nous parlons trois langues \u00e0 East@West.' :
           currentLang === 'nl' ? 'Bij East@West spreken we drie talen.' :
           'We speak three languages at East@West.'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LANGS.map(l => {
            const on = l.id === currentLang;
            return (
              <button
                key={l.id}
                onClick={() => handlePick(l.id)}
                style={{
                  appearance: 'none', border: 'none', cursor: 'pointer',
                  background: on ? theme.surfaceAlt : 'transparent',
                  borderRadius: 14,
                  padding: '14px 14px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  textAlign: 'left',
                  transition: 'background 160ms ease',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: on ? theme.primary : theme.surfaceAlt,
                  color: on ? theme.primaryInk : theme.inkSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 13, fontWeight: 700, letterSpacing: 0.6,
                  flexShrink: 0,
                  transition: 'background 160ms ease, color 160ms ease',
                }}>{l.short}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 20, fontWeight: 600, color: theme.ink,
                    lineHeight: 1.1, letterSpacing: -0.2,
                  }}>{l.label}</div>
                  <div style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 12, color: theme.inkMute, marginTop: 2,
                  }}>{
                    l.id === 'en' ? 'English' :
                    l.id === 'fr' ? 'Fran\u00e7ais' :
                    'Nederlands'
                  }</div>
                </div>
                {on ? (
                  <div style={{
                    width: 24, height: 24, borderRadius: 12,
                    background: theme.primary, color: theme.primaryInk,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="check" size={14} stroke={2.4}/>
                  </div>
                ) : (
                  <Icon name="chevron-right" size={18} color={theme.inkMute}/>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Small "EN" / "FR" / "NL" pill — used in hero
function LanguagePill({ lang, onClick, light }) {
  const cur = LANGS.find(l => l.id === lang);
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none', border: 'none', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 12px 7px 10px',
        borderRadius: 999,
        background: light ? 'rgba(255,255,255,0.12)' : 'rgba(15,12,8,0.06)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: light ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(15,12,8,0.06)',
        color: light ? '#fff' : 'inherit',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 11.5, fontWeight: 600, letterSpacing: 0.6,
      }}
    >
      <Icon name="globe" size={13} stroke={1.6}/>
      <span>{cur ? cur.short : 'EN'}</span>
      <Icon name="chevron-down" size={12} stroke={1.8}/>
    </button>
  );
}
