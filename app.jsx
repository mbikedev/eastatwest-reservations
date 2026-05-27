// Main App — shell, routing, state, tweaks

function useIsMobile() {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 520);
  React.useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 520);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

function detectPlatform() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios' : 'android';
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "platform": "ios",
  "lang": "en",
  "palette": "eastatwest",
  "dark": false
}/*EDITMODE-END*/;

// Sticky dock context — lets screens portal their floating CTAs above the bottom nav
const DockContext = React.createContext(null);
function StickyDock({ children }) {
  const target = React.useContext(DockContext);
  if (!target) return null;
  return ReactDOM.createPortal(children, target);
}

// ─────────────────────────────────────────────────────────────
// Phone shell — own status bar + scroll area + nav overlay
// (Doesn\'t use IOSDevice\'s children slot — gives us a real positioned overlay zone)
// ─────────────────────────────────────────────────────────────
function PhoneShell({ platform, theme, dark, children, bottomNav, sheet, t, tabKey }) {
  const dockRef = React.useRef(null);
  const [dockEl, setDockEl] = React.useState(null);
  React.useEffect(() => { setDockEl(dockRef.current); }, []);

  const scrollRef = React.useRef(null);
  // reset scroll when key changes
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tabKey]);

  const isIOS = platform === 'ios';
  const w = isIOS ? 402 : 412;
  const h = isIOS ? 874 : 892;
  const borderRadius = isIOS ? 48 : 18;
  const statusBarH = isIOS ? 56 : 40;
  const bottomReserve = 110;

  return (
    <div style={{
      width: w, height: h, borderRadius, overflow: 'hidden',
      position: 'relative',
      background: theme.bg,
      boxShadow: '0 40px 80px rgba(42,32,20,0.22), 0 0 0 1px rgba(42,32,20,0.08)',
      border: isIOS ? 'none' : `8px solid rgba(116,119,117,0.5)`,
      boxSizing: 'border-box',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      color: theme.ink,
    }}>
      {/* Status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, color: dark ? '#fff' : theme.ink }}>
        {isIOS
          ? <IOSStatusBar dark={dark}/>
          : <AndroidStatusBar dark={dark}/>}
      </div>
      {/* iOS dynamic island */}
      {isIOS && (
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
        }}/>
      )}
      {/* Scrollable content */}
      <div ref={scrollRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        <div style={{
          paddingTop: statusBarH, paddingBottom: bottomReserve,
          minHeight: '100%', position: 'relative',
        }}>
          <DockContext.Provider value={dockEl}>
            {children}
          </DockContext.Provider>
        </div>
      </div>
      {/* Dock zone (overlay): floating CTAs + bottom nav, positioned outside scroll */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', zIndex: 40,
      }}>
        <div ref={dockRef} style={{ pointerEvents: 'auto' }}/>
        <div style={{ pointerEvents: 'auto' }}>{bottomNav}</div>
      </div>
      {/* Home indicator / nav handle */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 70,
        height: isIOS ? 34 : 24, pointerEvents: 'none',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: isIOS ? 8 : 10,
      }}>
        <div style={{
          width: isIOS ? 139 : 108, height: isIOS ? 5 : 4, borderRadius: 100,
          background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.32)',
        }}/>
      </div>
      {/* Sheet overlay — covers whole phone interior */}
      {sheet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
          {sheet}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Update screens to use StickyDock for floating CTAs
// We patch MenuLanding/CategoryView/CartView/PickupView/PayView/DishDetail to
// portal their sticky bars through StickyDock instead of position:absolute.
// We\'ll do it via a wrapping HOC that intercepts the original screen output…
// but easier: re-export new versions. Already components use position:absolute.
// Instead, just inject CSS that converts absolute fixed-anchor → StickyDock by
// wrapping. We\'ll override by patching specific places: replace the screens'
// floating elements with a small "DockedCTA" helper rendered via StickyDock.
// Since we wrote the screens already, we\'ll add a global overlay class.
// Simplest: wrap our screens to detect any `data-dock` elements and portal them.
// Skipping that complexity — instead, the floating elements remain absolutely
// positioned within the scroll area, but with position: sticky bottom: 100px to
// pin to viewport. We\'ll do that via a small style injector here.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// Mobile shell — full-viewport, no device frame, safe-area aware
// ─────────────────────────────────────────────────────────────
function MobileShell({ theme, children, bottomNav, sheet, tabKey }) {
  const dockRef = React.useRef(null);
  const [dockEl, setDockEl] = React.useState(null);
  React.useEffect(() => { setDockEl(dockRef.current); }, []);

  const scrollRef = React.useRef(null);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tabKey]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: theme.bg,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      color: theme.ink,
    }}>
      <div ref={scrollRef} style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 110,
          minHeight: '100%', position: 'relative',
        }}>
          <DockContext.Provider value={dockEl}>
            {children}
          </DockContext.Provider>
        </div>
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', zIndex: 40,
      }}>
        <div ref={dockRef} style={{ pointerEvents: 'auto' }}/>
        <div style={{ pointerEvents: 'auto' }}>{bottomNav}</div>
      </div>
      {sheet && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
          {sheet}
        </div>
      )}
    </div>
  );
}

// Inject runtime CSS to convert legacy floating bars to sticky positioning so
// they pin to the phone\'s visible bottom inside the scroll container.
const __APP_CSS = `
  .phone-app { font-family: "DM Sans", system-ui, sans-serif; }
  /* style scrollbars subtle in scroll area */
  *::-webkit-scrollbar { width: 0; height: 0; }
  /* drag-prevent on buttons */
  button { -webkit-tap-highlight-color: transparent; }
  /* image-mode disable */
  input, textarea { font-family: inherit; }
  /* Headings inherit family from inline styles */
`;

// ─────────────────────────────────────────────────────────────
// Top-level app
// ─────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = PALETTES[t.palette][t.dark ? 'dark' : 'light'];
  const lang = t.lang;
  const tt = T[lang];
  const platform = t.platform;
  const isMobile = useIsMobile();
  const mobilePlatform = React.useMemo(() => detectPlatform(), []);
  const effectivePlatform = isMobile ? mobilePlatform : platform;

  // First-launch language detection: use browser locale once, then persist.
  React.useEffect(() => {
    try {
      if (!localStorage.getItem('eaw_lang_init')) {
        const detected = detectLang();
        if (detected && detected !== lang) setTweak('lang', detected);
        localStorage.setItem('eaw_lang_init', '1');
      }
    } catch (e) { /* localStorage unavailable */ }
    // eslint-disable-next-line
  }, []);

  // Language picker sheet visibility (shared between hero & account)
  const [langSheetOpen, setLangSheetOpen] = React.useState(false);

  // Always start on the home page so the user can pick their language first
  const [tab, setTab] = React.useState('home'); // home | reserve | order | account | track
  const [cart, setCart] = React.useState([]);
  const [activeOrder, setActiveOrder] = React.useState(null);
  const [activeReservation, setActiveReservation] = React.useState({
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: '20:00',
    party: 2,
    name: 'Nour Karam',
  });
  const [trackingOrder, setTrackingOrder] = React.useState(null);
  // Demo: simulate order progress
  React.useEffect(() => {
    if (!activeOrder) return;
    const STAGES = ['received', 'prep', 'ready', 'collected'];
    const idx = STAGES.indexOf(activeOrder.status);
    if (idx < STAGES.length - 1) {
      const tm = setTimeout(() => {
        setActiveOrder(o => o ? { ...o, status: STAGES[idx + 1] } : o);
      }, 7000); // advance every 7s
      return () => clearTimeout(tm);
    }
  }, [activeOrder?.status]);

  const renderScreen = () => {
    if (tab === 'home') {
      return <HomeScreen theme={theme} t={tt} lang={lang}
        activeOrder={activeOrder} activeReservation={activeReservation}
        onTab={setTab}
        onChangeLanguage={() => setLangSheetOpen(true)}
        onTrack={() => { setTrackingOrder(activeOrder); setTab('track'); }}
        onViewReservation={() => setTab('account')}
        dark={t.dark}
        onTheme={() => setTweak('dark', !t.dark)}/>;
    }
    if (tab === 'reserve') {
      return <ReserveFlow theme={theme} t={tt} lang={lang}
        onExit={() => setTab('home')}
        onConfirmed={(data) => {
          setActiveReservation({
            date: data.date, time: data.time, party: data.party, name: data.name,
          });
          try {
            localStorage.setItem('eaw_user', JSON.stringify({
              name: data.name, email: data.email, phone: data.phone,
            }));
          } catch (_) {}
        }}/>;
    }
    if (tab === 'order') {
      return <TakeawayFlow theme={theme} t={tt} lang={lang} platform={effectivePlatform}
        cart={cart} setCart={setCart}
        onPlaceOrder={(order) => setActiveOrder(order)}
        onTrack={() => { setTrackingOrder(activeOrder); setTab('track'); }}
        exitTab={() => setTab('home')}/>;
    }
    if (tab === 'account') {
      return <AccountScreen theme={theme} t={tt} lang={lang}
        isDark={t.dark}
        onChangeLanguage={() => setLangSheetOpen(true)}
        onTheme={() => setTweak('dark', !t.dark)}/>;
    }
    if (tab === 'track') {
      const order = trackingOrder || activeOrder;
      if (!order) {
        setTab('home');
        return null;
      }
      return <OrderTracking theme={theme} t={tt} lang={lang} order={order}
        onBack={() => setTab('home')}
        onAdvance={() => {
          const STAGES = ['received', 'prep', 'ready', 'collected'];
          const idx = STAGES.indexOf(order.status);
          if (idx < STAGES.length - 1) {
            const nextStatus = STAGES[idx + 1];
            setTrackingOrder({ ...order, status: nextStatus });
            if (activeOrder && activeOrder.code === order.code) {
              setActiveOrder({ ...activeOrder, status: nextStatus });
            }
          }
        }}/>;
    }
    return null;
  };

  const bottomNav = (tab !== 'track') ? (
    <BottomNav theme={theme} platform={effectivePlatform} t={tt}
      active={tab === 'track' ? 'home' : tab}
      onChange={(id) => setTab(id)}
      mobile={isMobile}/>
  ) : null;

  const langSheet = langSheetOpen ? (
    <LanguageSheet
      theme={theme}
      currentLang={lang}
      onPick={(id) => {
        setTweak('lang', id);
        setLangSheetOpen(false);
        try { localStorage.setItem('eaw_lang_init', '1'); } catch (e) {}
      }}
      onClose={() => setLangSheetOpen(false)}
    />
  ) : null;

  if (isMobile) {
    return (
      <div className="phone-app">
        <style>{__APP_CSS}</style>
        <MobileShell theme={theme} dark={t.dark} bottomNav={bottomNav} tabKey={tab} sheet={langSheet}>
          {renderScreen()}
        </MobileShell>
      </div>
    );
  }

  return (
    <div className="phone-app" style={{
      minHeight: '100vh', width: '100vw',
      background: t.dark ? '#080F0A' : '#D6DCC4',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 20px 60px',
      boxSizing: 'border-box',
      backgroundImage: t.dark
        ? 'radial-gradient(circle at 30% 20%, rgba(91,165,114,0.10), transparent 60%), radial-gradient(circle at 70% 80%, rgba(229,189,85,0.06), transparent 60%)'
        : 'radial-gradient(circle at 30% 20%, rgba(31,92,46,0.06), transparent 50%), radial-gradient(circle at 70% 80%, rgba(217,169,58,0.06), transparent 50%)',
    }}>
      <style>{__APP_CSS}</style>
      <PhoneShell platform={platform} theme={theme} dark={t.dark} t={tt} bottomNav={bottomNav} tabKey={tab}
        sheet={langSheet}>
        {renderScreen()}
      </PhoneShell>

      <TweaksPanel>
        <TweakSection label="Device"/>
        <TweakRadio label="Platform" value={platform}
          options={[{ value: 'ios', label: 'iOS' }, { value: 'android', label: 'Android' }]}
          onChange={(v) => setTweak('platform', v)}/>
        <TweakRadio label="Language" value={lang}
          options={[{ value: 'en', label: 'EN' }, { value: 'fr', label: 'FR' }, { value: 'nl', label: 'NL' }]}
          onChange={(v) => setTweak('lang', v)}/>
        <TweakToggle label="Dark mode" value={t.dark}
          onChange={(v) => setTweak('dark', v)}/>
        <TweakSection label="Palette"/>
        <TweakColor label="Theme" value={t.palette}
          options={['eastatwest', 'terracotta', 'olive', 'saffron'].map(k => ({ value: k, label: k }))}
          onChange={(v) => v && v.value && setTweak('palette', v.value)}/>
        <PaletteSwatchRow palette={t.palette} setPalette={(v) => setTweak('palette', v)}/>
        <TweakSection label="Demo"/>
        <TweakButton label="Jump to Reserve flow" onClick={() => setTab('reserve')}/>
        <TweakButton label="Jump to Order flow" onClick={() => setTab('order')} secondary/>
        <TweakButton label="Simulate active order" onClick={() => {
          setActiveOrder({
            code: '47', eta: '19:45', total: 38.5,
            items: [{ id: 'taouk', qty: 1 }, { id: 'hummus', qty: 1 }, { id: 'baklava', qty: 1 }],
            status: 'prep',
          });
          setTab('home');
        }} secondary/>
        <TweakButton label="Clear active order" onClick={() => { setActiveOrder(null); setTrackingOrder(null); }} secondary/>
      </TweaksPanel>
    </div>
  );
}

// Curated swatch picker (since TweakColor expects hex)
function PaletteSwatchRow({ palette, setPalette }) {
  const options = [
    { id: 'eastatwest', colors: ['#1F5C2E', '#EFF1E5', '#D9A93A'] },
    { id: 'terracotta', colors: ['#B85535', '#F2EADB', '#5A6A3F'] },
    { id: 'olive', colors: ['#4C5A3A', '#F7F4E4', '#C28A2A'] },
    { id: 'saffron', colors: ['#C8842A', '#FCF7EA', '#7A6638'] },
  ];
  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>Swatch</span></div>
      <div style={{ display: 'flex', gap: 8 }}>
        {options.map(o => {
          const on = palette === o.id;
          return (
            <button key={o.id} type="button" onClick={() => setPalette(o.id)}
              style={{
                flex: 1, height: 40, padding: 0, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${o.colors[0]} 0%, ${o.colors[0]} 40%, ${o.colors[1]} 40%, ${o.colors[1]} 70%, ${o.colors[2]} 70%)`,
                borderRadius: 8,
                boxShadow: on ? '0 0 0 2px #29261b, 0 0 0 4px rgba(255,255,255,0.8)' : '0 0 0 0.5px rgba(0,0,0,0.1)',
                position: 'relative', transition: 'box-shadow 160ms ease',
              }}>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App/>);
