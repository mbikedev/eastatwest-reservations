// Home + Account screens

// ─────────────────────────────────────────────────────────────
// Home
// ─────────────────────────────────────────────────────────────
const HOME_HERO_IMG = 'img/chefs-dish.webp';

// 0 = Sunday, 1 = Monday … 6 = Saturday. Add closed days here.
const CLOSED_DAYS = [0]; // Sunday

function HomeScreen({ theme, t, lang, activeOrder, activeReservation, onTab, onChangeLanguage, onTrack, onViewReservation }) {
  const now = new Date();
  const hour = now.getHours();
  const isOpenToday = !CLOSED_DAYS.includes(now.getDay());
  const greet = hour < 12 ? t.greeting_morning : hour < 17 ? t.greeting_afternoon : t.greeting_evening;
  const signatures = SIGNATURE_IDS.map(id => dishById(id)).filter(Boolean);
  const closingHour = hour < 15 ? '14:00' : '22:00';
  return (
    <div>
      <HomeHero theme={theme} t={t} lang={lang} greet={greet} closing={closingHour} isOpenToday={isOpenToday} onBook={() => onTab('reserve')} onChangeLanguage={onChangeLanguage}/>

      {/* Active strip overlapping the hero curve */}
      {activeOrder && (
        <div style={{ padding: '0 20px', marginTop: -22, position: 'relative', zIndex: 3 }}>
          <ActiveOrderCard theme={theme} t={t} lang={lang} order={activeOrder} onTrack={onTrack}/>
        </div>
      )}

      {/* Quick action tiles */}
      <div style={{
        padding: activeOrder ? '16px 20px 4px' : '24px 20px 4px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        <QuickTile
          theme={theme}
          variant="light"
          title={lang === 'fr' ? 'Réserver' : lang === 'nl' ? 'Reserveren' : 'Reserve'}
          sub={t.home_book_sub}
          icon="calendar"
          onClick={() => onTab('reserve')}
        />
        <QuickTile
          theme={theme}
          variant="dark"
          title={lang === 'fr' ? 'Commander' : lang === 'nl' ? 'Bestellen' : 'Order'}
          sub={lang === 'fr' ? 'Prêt en 25 min' : lang === 'nl' ? 'Klaar in 25 min' : 'Takeaway in 25 min'}
          icon="bag"
          onClick={() => onTab('order')}
        />
      </div>

      {/* Signature dishes */}
      <SectionTitle
        theme={theme}
        sub={t.home_signature_sub}
        action={<TextButton theme={theme} onClick={() => onTab('order')}>{lang === 'fr' ? 'Tout voir' : lang === 'nl' ? 'Alles' : 'See all'}</TextButton>}
      >{t.home_signature}</SectionTitle>
      <div style={{
        display: 'flex', gap: 14, padding: '0 20px 24px',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}>
        {signatures.map((d, i) => (
          <FeaturedDishCard
            key={d.id}
            dish={d}
            theme={theme}
            t={t}
            lang={lang}
            badge={i === 0 ? (lang === 'fr' ? 'Choix du chef' : lang === 'nl' ? 'Keuze van de chef' : 'Chef\u2019s pick') : null}
            onClick={() => onTab('order')}
          />
        ))}
        {/* trailing spacer so last card breathes on the right edge */}
        <div style={{ width: 2, flexShrink: 0 }}/>
      </div>

      {/* Editorial about / location */}
      <AboutLocationBlock theme={theme} t={t} lang={lang}/>

      {/* Bottom safe area */}
      <div style={{ height: 24 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — full-bleed photo + dark gradient + wordmark + greeting
// ─────────────────────────────────────────────────────────────
function HomeHero({ theme, t, lang, greet, closing, isOpenToday, onBook, onChangeLanguage }) {
  return (
    <div style={{
      position: 'relative',
      height: 420,
      marginBottom: 0,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      overflow: 'hidden',
      background: '#1a1410',
    }}>
      {/* Photo */}
      <img
        src={HOME_HERO_IMG}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          transform: 'scale(1.04)',
        }}
      />
      {/* Layered gradient — keeps photo visible mid, darkens top + bottom for legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'linear-gradient(180deg, rgba(15,12,8,0.55) 0%, rgba(15,12,8,0.12) 28%, rgba(15,12,8,0.05) 50%, rgba(15,12,8,0.78) 100%)',
      }}/>
      {/* warm color wash to match palette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, transparent 55%, ${theme.primary}38 100%)`,
        mixBlendMode: 'multiply',
      }}/>

      {/* Top row — wordmark + lang pill + status pill */}
      <div style={{
        position: 'absolute', top: 18, left: 20, right: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 12px 7px 8px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}>
          <img src="logo-crop.png" alt="East at West" width={26} height={26}
               style={{ display: 'block', objectFit: 'contain', borderRadius: '50%' }}/>
          <Wordmark color="#fff" size={11}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <LanguagePill lang={lang} onClick={onChangeLanguage} light/>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 12px', borderRadius: 999,
            background: isOpenToday ? 'rgba(255,255,255,0.12)' : 'rgba(180,60,40,0.30)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: isOpenToday ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(220,80,60,0.40)',
            color: '#fff',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 11.5, fontWeight: 500, letterSpacing: 0.3,
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            {isOpenToday ? (
              <>
                <PulseDot color="#A7E1A4"/>
                <span style={{ whiteSpace: 'nowrap' }}>{lang === 'fr' ? 'Jusqu\u2019\u00e0' : lang === 'nl' ? 'Tot' : 'Until'} {closing}</span>
              </>
            ) : (
              <span style={{ whiteSpace: 'nowrap' }}>{lang === 'fr' ? 'Ferm\u00e9 aujourd\u2019hui' : lang === 'nl' ? 'Vandaag gesloten' : 'Closed today'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom content — greeting + subtitle + decorative ornament */}
      <div style={{
        position: 'absolute', left: 24, right: 24, bottom: 38,
        color: '#FBF6EB',
      }}>
        {/* small "tonight" eyebrow */}
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, fontWeight: 700, letterSpacing: 2,
          textTransform: 'uppercase', color: 'rgba(255,245,225,0.95)',
          marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ width: 22, height: 1, background: 'rgba(255,245,225,0.7)' }}/>
          {lang === 'fr' ? 'Bruxelles \u00b7 Cuisine libanaise' : lang === 'nl' ? 'Brussel \u00b7 Libanese keuken' : 'Brussels \u00b7 Lebanese kitchen'}
        </div>
        <div style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 38, fontWeight: 500, lineHeight: 1.05, letterSpacing: -0.5,
          color: '#FBF6EB',
        }}>
          {lang === 'fr' ? 'Bienvenue à East At West.' : lang === 'nl' ? 'Welkom bij East At West.' : 'Welcome to East At West.'}
        </div>
      </div>

      {/* decorative arabesque ornament — subtle */}
      <ArabesqueOrnament/>
    </div>
  );
}

function PulseDot({ color = '#A7E1A4' }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%', background: color,
        animation: 'eaw-pulse 1.8s ease-out infinite',
        opacity: 0.55,
      }}/>
      <span style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%', background: color,
      }}/>
      <style>{`
        @keyframes eaw-pulse {
          0%   { transform: scale(1); opacity: 0.55; }
          70%  { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

function ArabesqueOrnament() {
  return (
    <svg
      width="220" height="220" viewBox="0 0 220 220"
      style={{
        position: 'absolute', top: -50, right: -60,
        opacity: 0.10, pointerEvents: 'none',
        color: '#fff',
      }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="110" cy="110" r="90"/>
        <circle cx="110" cy="110" r="70"/>
        <circle cx="110" cy="110" r="50"/>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <g key={a} transform={`rotate(${a} 110 110)`}>
            <path d="M110 20 Q120 60 110 110 Q100 60 110 20 Z"/>
            <circle cx="110" cy="40" r="6"/>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Quick action tile (Reserve / Order)
// ─────────────────────────────────────────────────────────────
function QuickTile({ theme, variant, title, sub, icon, onClick }) {
  const dark = variant === 'dark';
  const bg = dark ? theme.primary : theme.surface;
  const fg = dark ? theme.primaryInk : theme.ink;
  const fgMute = dark ? 'rgba(255,255,255,0.72)' : theme.inkMute;
  const iconBg = dark ? 'rgba(255,255,255,0.14)' : theme.surfaceAlt;
  const iconFg = dark ? theme.primaryInk : theme.primary;
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none', border: 'none', cursor: 'pointer',
        background: bg, color: fg,
        borderRadius: 22, padding: 16,
        textAlign: 'left',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 140,
        boxShadow: dark
          ? `0 10px 30px ${theme.primary}38, 0 1px 0 rgba(255,255,255,0.08) inset`
          : '0 1px 0 rgba(255,255,255,0.6) inset, 0 6px 18px rgba(42,32,20,0.06)',
        transition: 'transform 150ms ease',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.985)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: iconBg, color: iconFg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={20}/>
        </div>
        <Icon name="arrow-right" size={18} color={fgMute} stroke={1.4}/>
      </div>
      <div>
        <div style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 24, fontWeight: 600, lineHeight: 1.05,
          letterSpacing: -0.3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{title}</div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, marginTop: 4, color: fgMute,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{sub}</div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Featured dish card — photo-led, name overlaid
// ─────────────────────────────────────────────────────────────
function FeaturedDishCard({ dish, theme, t, lang, badge, onClick }) {
  const hasPhoto = !!(dish && dish.photo);
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none', border: 'none', cursor: 'pointer',
        background: theme.surface, borderRadius: 20,
        width: 230, flexShrink: 0,
        padding: 0, textAlign: 'left', overflow: 'hidden',
        scrollSnapAlign: 'start',
        boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 20px rgba(42,32,20,0.08)',
        transition: 'transform 150ms ease',
        position: 'relative',
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.985)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ position: 'relative', height: 230, background: theme.surfaceAlt }}>
        {hasPhoto ? (
          <img src={dish.photo} alt={dishName(dish, lang)}
               style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
        ) : (
          <PlateArt id={dish.img || dish.id} size={180}/>
        )}
        {/* gradient for text legibility on bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(15,12,8,0) 35%, rgba(15,12,8,0.78) 100%)',
        }}/>

        {/* badge */}
        {badge && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            padding: '5px 9px', borderRadius: 999,
            background: theme.accent, color: '#1A1410',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 10, fontWeight: 600, letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}>{badge}</div>
        )}

        {/* price chip */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '5px 10px', borderRadius: 999,
          background: 'rgba(255,255,255,0.92)', color: '#1A1410',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}>€{dish.price.toFixed(2)}</div>

        {/* name over photo */}
        <div style={{
          position: 'absolute', left: 14, right: 14, bottom: 12,
          color: '#FBF6EB',
        }}>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 22, fontWeight: 600, lineHeight: 1.05,
            letterSpacing: -0.3,
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}>{dishName(dish, lang)}</div>
        </div>
      </div>

      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12.5, color: theme.inkSoft, lineHeight: 1.45,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          minHeight: 36,
        }}>{dishDesc(dish, lang)}</div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// About / Location — editorial quote + address + actions
// ─────────────────────────────────────────────────────────────
function AboutLocationBlock({ theme, t, lang }) {
  return (
    <div style={{ padding: '4px 20px 16px' }}>
      <Card theme={theme} padding={0} style={{ overflow: 'hidden' }}>
        {/* Top — editorial quote */}
        <div style={{ padding: '22px 22px 18px', position: 'relative' }}>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 64, lineHeight: 0.6,
            color: theme.primary, opacity: 0.22,
            position: 'absolute', top: 18, left: 16,
            pointerEvents: 'none',
          }}>“</div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 10.5, fontWeight: 600, letterSpacing: 2.4,
            textTransform: 'uppercase', color: theme.inkMute,
            marginBottom: 10, marginLeft: 28,
          }}>{t.home_about}</div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 19, lineHeight: 1.35, color: theme.ink,
            marginLeft: 28, marginRight: 4,
            fontWeight: 500,
            textWrap: 'pretty',
          }}>{t.home_about_text}</div>
        </div>

        {/* divider */}
        <div style={{ height: 1, background: theme.line, margin: '0 22px' }}/>

        {/* Address row */}
        <div style={{
          padding: '16px 22px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: theme.surfaceAlt, color: theme.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name="pin" size={20}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, fontWeight: 600, color: theme.ink,
              lineHeight: 1.3,
            }}>{t.home_about_addr_l1}</div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12.5, color: theme.inkMute, marginTop: 1,
            }}>{t.home_about_addr_l2}</div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12.5, color: theme.inkMute, marginTop: 1,
            }}>+32 465 20 60 24</div>
          </div>
        </div>

        {/* Action row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderTop: `1px solid ${theme.line}`,
        }}>
          <AboutAction theme={theme} icon="pin" label={t.res_directions} href="https://maps.google.com/?q=Bld+de+l'Empereur+26,+1000+Brussels" />
          <AboutAction theme={theme} icon="phone" label={lang === 'fr' ? 'Appeler' : lang === 'nl' ? 'Bellen' : 'Call us'} href="tel:+32465206024" divider />
        </div>
      </Card>
    </div>
  );
}

function AboutAction({ theme, icon, label, divider, href }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} target={href ? '_blank' : undefined} rel={href ? 'noopener noreferrer' : undefined} style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      background: 'transparent', textDecoration: 'none',
      padding: '14px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      color: theme.ink,
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 14, fontWeight: 500,
      borderLeft: divider ? `1px solid ${theme.line}` : 'none',
    }}>
      <Icon name={icon} size={16} color={theme.primary}/>
      {label}
    </Tag>
  );
}

function ActiveOrderCard({ theme, t, lang, order, onTrack }) {
  const stageLabel = {
    received: t.track_status_received,
    prep: t.track_status_prep,
    ready: t.track_status_ready,
    collected: t.track_status_collected,
  }[order.status];
  return (
    <Card theme={theme} padding={0} style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '14px 18px',
        background: theme.olive, color: '#fff',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 19,
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="bag" size={20}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: 11,
            letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.85,
          }}>{t.active_order} · #{order.code}</div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 20, fontWeight: 600, lineHeight: 1.2,
          }}>{stageLabel} · {t.track_eta} {order.eta}</div>
        </div>
        <button onClick={onTrack} style={{
          appearance: 'none', border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.22)',
          color: '#fff',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13, fontWeight: 600,
          padding: '8px 14px', borderRadius: 999,
        }}>{t.track}</button>
      </div>
    </Card>
  );
}

function ActiveReservationCard({ theme, t, lang, res, onView }) {
  return (
    <Card theme={theme} padding={0} style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '14px 18px',
        background: theme.primary, color: theme.primaryInk,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 19,
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="calendar" size={20}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: 11,
            letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.85,
          }}>{t.active_reservation}</div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 20, fontWeight: 600, lineHeight: 1.2,
          }}>{res.time} · {res.party} {res.party === 1 ? t.res_guest : t.res_guests}</div>
        </div>
        <button onClick={onView} style={{
          appearance: 'none', border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.22)',
          color: theme.primaryInk,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13, fontWeight: 600,
          padding: '8px 14px', borderRadius: 999,
        }}>{t.view}</button>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Account
// ─────────────────────────────────────────────────────────────
function AccountScreen({ theme, t, lang, onChangeLanguage, onTheme, isDark }) {
  const savedUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('eaw_user') || 'null'); } catch { return null; }
  }, []);

  const name = savedUser?.name || (lang === 'fr' ? 'Invité' : lang === 'nl' ? 'Gast' : 'Guest');
  const email = savedUser?.email || '';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const [reservations, setReservations] = React.useState(null);
  React.useEffect(() => {
    if (!email) { setReservations([]); return; }
    fetch(`/.netlify/functions/my-reservations?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => setReservations(Array.isArray(data) ? data : []))
      .catch(() => setReservations([]));
  }, [email]);

  const themeLabel = isDark
    ? (lang === 'fr' ? 'Sombre' : lang === 'nl' ? 'Donker' : 'Dark')
    : (lang === 'fr' ? 'Clair' : lang === 'nl' ? 'Licht' : 'Light');

  return (
    <div>
      <PageHeader theme={theme} title={t.acc_title}/>
      <div style={{ padding: '0 20px 140px' }}>

        {/* Profile card */}
        <Card theme={theme} padding={18} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, flexShrink: 0,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.olive})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Cormorant Garamond", serif', fontSize: 22, fontWeight: 600,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 22, fontWeight: 600, color: theme.ink, lineHeight: 1.1,
            }}>{name}</div>
            {email ? (
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.inkMute, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
            ) : (
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.inkMute, marginTop: 3 }}>
                {lang === 'fr' ? 'Faites une réservation pour créer votre profil' : lang === 'nl' ? 'Maak een reservering om uw profiel aan te maken' : 'Make a reservation to set up your profile'}
              </div>
            )}
          </div>
        </Card>

        {/* Past reservations */}
        <SectionStripTitle theme={theme}>{t.acc_reservations}</SectionStripTitle>
        {reservations === null ? (
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.inkMute, padding: '10px 4px' }}>
            {lang === 'fr' ? 'Chargement…' : lang === 'nl' ? 'Laden…' : 'Loading…'}
          </div>
        ) : reservations.length === 0 ? (
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.inkMute, padding: '10px 4px' }}>
            {lang === 'fr' ? 'Aucune réservation pour le moment.' : lang === 'nl' ? 'Nog geen reserveringen.' : 'No reservations yet.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {reservations.map(r => (
              <SupabaseReservationRow key={r.invoice_number} res={r} theme={theme} lang={lang}/>
            ))}
          </div>
        )}

        {/* Settings */}
        <SectionStripTitle theme={theme}>{t.acc_settings}</SectionStripTitle>
        <Card theme={theme} padding={0} style={{ overflow: 'hidden' }}>
          <SettingsRow theme={theme} icon="globe"
            label={t.acc_lang}
            value={lang === 'fr' ? 'Français' : lang === 'nl' ? 'Nederlands' : 'English'}
            onClick={onChangeLanguage}/>
          <SettingsRow theme={theme} icon="sun"
            label={lang === 'fr' ? 'Thème' : lang === 'nl' ? 'Thema' : 'Theme'}
            value={themeLabel}
            onClick={onTheme}
            last/>
        </Card>
      </div>
    </div>
  );
}

function SupabaseReservationRow({ res, theme, lang }) {
  const statusColor = res.status === 'confirmed' ? theme.success : res.status === 'pending' ? theme.accent : theme.inkMute;
  const statusLabel = res.status === 'confirmed'
    ? (lang === 'fr' ? 'Confirmée' : lang === 'nl' ? 'Bevestigd' : 'Confirmed')
    : res.status === 'pending'
    ? (lang === 'fr' ? 'En attente' : lang === 'nl' ? 'In behandeling' : 'Pending')
    : (lang === 'fr' ? 'Annulée' : lang === 'nl' ? 'Geannuleerd' : 'Cancelled');
  const dateStr = res.date
    ? new Date(res.date + 'T12:00:00').toLocaleDateString(
        lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
    : res.date;
  return (
    <Card theme={theme} padding={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: theme.surfaceAlt, color: theme.olive,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="calendar" size={20}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 500, color: theme.ink }}>
            {dateStr} · {res.start_time}{res.end_time ? ` → ${res.end_time}` : ''}
          </div>
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.inkMute, marginTop: 2 }}>
            {res.guests} {res.guests === 1
              ? (lang === 'fr' ? 'personne' : lang === 'nl' ? 'gast' : 'guest')
              : (lang === 'fr' ? 'personnes' : lang === 'nl' ? 'gasten' : 'guests')
            } · {res.invoice_number}
          </div>
        </div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600,
          color: statusColor, textTransform: 'uppercase', letterSpacing: 0.4, flexShrink: 0,
        }}>{statusLabel}</div>
      </div>
    </Card>
  );
}

function SectionStripTitle({ children, theme }) {
  return (
    <div style={{
      fontFamily: '"DM Sans", sans-serif',
      fontSize: 11, fontWeight: 500, color: theme.inkMute,
      letterSpacing: 0.6, textTransform: 'uppercase',
      padding: '24px 4px 8px',
    }}>{children}</div>
  );
}

function PastOrderRow({ order, theme, t, lang }) {
  return (
    <Card theme={theme} padding={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: theme.surfaceAlt, color: theme.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="bag" size={20}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, fontWeight: 500, color: theme.ink,
          }}>{order.items.map(it => `${it.qty}× ${dishName(dishById(it.id), lang)}`).join(' · ')}</div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12, color: theme.inkMute, marginTop: 2,
          }}>{new Date(order.date).toLocaleDateString(_localeFor(lang), { day: 'numeric', month: 'long' })} · #{order.id}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, fontWeight: 600, color: theme.ink,
            fontVariantNumeric: 'tabular-nums',
          }}>€{order.total.toFixed(2)}</div>
          <button style={{
            appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
            color: theme.primary,
            fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500,
            padding: 0, marginTop: 4,
          }}>{t.acc_reorder}</button>
        </div>
      </div>
    </Card>
  );
}

function PastReservationRow({ res, theme, t, lang }) {
  const d = new Date(res.date);
  return (
    <Card theme={theme} padding={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: theme.surfaceAlt, color: theme.olive,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 9, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase',
            color: theme.inkMute, lineHeight: 1,
          }}>{d.toLocaleDateString(_localeFor(lang), { month: 'short' })}</span>
          <span style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 18, fontWeight: 600, color: theme.olive, lineHeight: 1.1,
          }}>{d.getDate()}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, fontWeight: 500, color: theme.ink,
          }}>{res.time} · {res.party} {res.party === 1 ? t.res_guest : t.res_guests}</div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12, color: theme.inkMute, marginTop: 2,
          }}>{
            res.occasion === 'birthday' ? t.res_occasion_birthday :
            res.occasion === 'business' ? t.res_occasion_business :
            res.occasion === 'anniv' ? t.res_occasion_anniv :
            t.res_occasion_none
          } · #{res.id}</div>
        </div>
        <Icon name="chevron-right" size={18} color={theme.inkMute}/>
      </div>
    </Card>
  );
}

function SettingsRow({ theme, icon, label, value, last, onClick }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      width: '100%', background: 'transparent',
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      textAlign: 'left',
      borderBottom: last ? 'none' : `1px solid ${theme.line}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: theme.surfaceAlt, color: theme.inkSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={icon} size={16}/>
      </div>
      <span style={{
        flex: 1, fontFamily: '"DM Sans", sans-serif',
        fontSize: 15, color: theme.ink, fontWeight: 500,
      }}>{label}</span>
      <span style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: 13, color: theme.inkMute,
      }}>{value}</span>
      <Icon name="chevron-right" size={16} color={theme.inkMute}/>
    </button>
  );
}

Object.assign(window, { HomeScreen, AccountScreen });
