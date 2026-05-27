// Takeaway flow — menu browse → item detail → cart → pickup → pay → confirm
// + order tracking screen

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function dishById(id) {
  for (const cat of Object.keys(MENU)) {
    const d = MENU[cat].find(d => d.id === id);
    if (d) return { ...d, cat };
  }
  return null;
}

function cartTotals(cart) {
  let subtotal = 0;
  cart.forEach(line => {
    const d = dishById(line.id);
    if (!d) return;
    let p = d.price;
    if (line.extras) line.extras.forEach(e => { p += e.price; });
    subtotal += p * line.qty;
  });
  const tax = subtotal * 0.12;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function tagLabel(tag, lang, full = false) {
  if (tag === 'v')  return full
    ? (lang === 'fr' ? 'Végan' : lang === 'nl' ? 'Vegan' : 'Vegan')
    : (lang === 'fr' ? 'Vég.' : lang === 'nl' ? 'Veg.' : 'Veg');
  if (tag === 'gf') return lang === 'fr' ? 'Sans gluten' : lang === 'nl' ? 'Glutenvrij' : 'GF';
  return tag;
}

// ─────────────────────────────────────────────────────────────
// Menu landing — category tiles + popular
// ─────────────────────────────────────────────────────────────
function MenuLanding({ theme, t, lang, cart, onCategory, onDish, onCart }) {
  const [query, setQuery] = React.useState('');
  const popularIds = ['lamb', 'hummus', 'arayes', 'taouk', 'baklava'];
  const popular = popularIds.map(dishById).filter(Boolean);

  const allItems = Object.values(MENU).flat();
  const results = query.trim().length > 0
    ? allItems.filter(d => dishName(d, lang).toLowerCase().includes(query.toLowerCase()) || dishDesc(d, lang).toLowerCase().includes(query.toLowerCase()) || d.name.toLowerCase().includes(query.toLowerCase()))
    : null;

  const cartCount = cart.reduce((a, l) => a + l.qty, 0);
  const totals = cartTotals(cart);

  return (
    <div>
      <PageHeader theme={theme} title={t.ord_title}
                  sub={lang === 'fr' ? 'Prêt à retirer en 25 min' : lang === 'nl' ? 'Klaar om af te halen in 25 min' : 'Ready for pickup in 25 min'}/>
      {/* Search */}
      <div style={{ padding: '6px 20px 18px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: theme.surface, borderRadius: 14,
          padding: '0 14px', height: 46,
          border: `1px solid ${theme.line}`,
        }}>
          <Icon name="search" size={18} color={theme.inkMute}/>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={t.ord_search}
            style={{
              appearance: 'none', border: 'none', outline: 'none',
              background: 'transparent', flex: 1, color: theme.ink,
              fontFamily: '"DM Sans", sans-serif', fontSize: 15,
            }}/>
          {query && (
            <button onClick={() => setQuery('')} style={{
              appearance: 'none', border: 'none', background: 'transparent',
              cursor: 'pointer', color: theme.inkMute, padding: 4,
            }}><Icon name="x" size={16}/></button>
          )}
        </div>
      </div>

      {results ? (
        <div style={{ padding: '0 20px 140px' }}>
          {results.length === 0 ? (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              fontFamily: '"DM Sans", sans-serif', color: theme.inkMute, fontSize: 14,
            }}>{lang === 'fr' ? 'Aucun résultat' : lang === 'nl' ? 'Geen resultaten' : 'No results'}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map(d => <DishRow key={d.id} dish={d} theme={theme} t={t} lang={lang} onClick={() => onDish(d.id)}/>)}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Categories */}
          <div style={{ padding: '0 20px 4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {CATEGORIES.map(c => (
                <CategoryTile key={c.id} cat={c} theme={theme} t={t} onClick={() => onCategory(c.id)}/>
              ))}
            </div>
          </div>
          <div style={{ height: 120 }}/>
        </>
      )}

      {cartCount > 0 && (
        <StickyDock>
          <ViewBasketBar theme={theme} t={t} count={cartCount} total={totals.total} onClick={onCart}/>
        </StickyDock>
      )}
    </div>
  );
}

// Shared floating "view basket" bar
function ViewBasketBar({ theme, t, count, total, onClick }) {
  return (
    <div style={{ padding: '0 16px 10px' }}>
      <div style={{
        background: theme.primary, color: theme.primaryInk,
        borderRadius: 16, padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: `0 10px 30px ${theme.primary}48`,
      }} onClick={onClick}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: 13,
            fontFamily: '"DM Sans", sans-serif',
          }}>{count}</div>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 600 }}>{t.ord_view_cart}</span>
        </div>
        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>€{total.toFixed(2)}</div>
      </div>
    </div>
  );
}

function CategoryTile({ cat, theme, t, onClick }) {
  // Pick a representative dish photo for each category — category-level photo
  // override (e.g. Sandwiches has no per-dish images, but we still want a
  // photo on the category tile) takes precedence; otherwise first dish with
  // a photo; otherwise the swatch gradient.
  const items = MENU[cat.id] || [];
  const heroPhoto = cat.photo || (items.find(d => d.photo) || {}).photo;
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      background: theme.surface, borderRadius: 16,
      padding: 0, textAlign: 'left',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: '100%', aspectRatio: '4 / 3',
        background: theme.surfaceAlt, position: 'relative', overflow: 'hidden',
      }}>
        {heroPhoto ? (
          <img src={heroPhoto} alt={t[cat.name_key]} loading="lazy"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
            }}/>
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, ${cat.swatch[0]}, ${cat.swatch[1]})`,
          }}/>
        )}
        {/* subtle bottom shade so the title corner has weight */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%)',
          pointerEvents: 'none',
        }}/>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 20, fontWeight: 600, color: theme.ink,
          lineHeight: 1.1,
        }}>{t[cat.name_key]}</div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, color: theme.inkMute, marginTop: 2,
        }}>{items.length} {items.length === 1 ? t.ord_item : t.ord_items}</div>
      </div>
    </button>
  );
}

function SignatureCard({ dish, theme, t, lang, onClick }) {
  const hasPhoto = !!(dish && dish.photo);
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      background: theme.surface, borderRadius: 16,
      width: 180, flexShrink: 0,
      padding: 0, textAlign: 'left', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {hasPhoto && (
        <div style={{ background: theme.surfaceAlt }}>
          <DishImage dish={dish} size={180} theme={theme}/>
        </div>
      )}
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {dish.tags?.includes('v') && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5v-5.3C9.5 10.8 8 9 8 7c2.2 0 4 1.3 4.7 3.2C13.4 8.3 15.2 7 17.4 7c0 2-1.5 3.8-3 4.2v5.3h-2l-.4.5-.4-.5z" fill="#1F5C2E"/>
              <path d="M12 2C7 2 3 6 3 11c0 2.8 1.2 5.3 3.1 7l.9-1C5.3 15.4 4.2 13.3 4.2 11c0-4.3 3.5-7.8 7.8-7.8 4.3 0 7.8 3.5 7.8 7.8 0 2.3-1 4.4-2.7 5.9l.9 1C20 16.3 21.2 13.8 21.2 11 21.2 6 17.2 2 12.2 2H12z" fill="#1F5C2E" opacity="0.3"/>
            </svg>
          )}
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 18, fontWeight: 600, color: theme.ink,
            lineHeight: 1.15,
          }}>{dishName(dish, lang)}</div>
        </div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, color: theme.inkMute, marginTop: 2,
          lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>{dishDesc(dish, lang)}</div>
        <div style={{
          marginTop: 8,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 15, fontWeight: 600, color: theme.primary,
          fontVariantNumeric: 'tabular-nums',
        }}>€{dish.price.toFixed(2)}</div>
      </div>
    </button>
  );
}

function DishRow({ dish, theme, t, lang, onClick }) {
  const hasPhoto = !!(dish && dish.photo);
  return (
    <button onClick={onClick} style={{
      appearance: 'none', border: 'none', cursor: 'pointer',
      background: theme.surface, borderRadius: 14,
      padding: 12, textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12,
      width: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {hasPhoto && (
        <div style={{
          width: 64, height: 64, borderRadius: 12,
          background: theme.surfaceAlt, flexShrink: 0,
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DishImage dish={dish} size={64} theme={theme}/>
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            flex: 1, minWidth: 0,
          }}>
            {dish.tags?.includes('v') && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5v-5.3C9.5 10.8 8 9 8 7c2.2 0 4 1.3 4.7 3.2C13.4 8.3 15.2 7 17.4 7c0 2-1.5 3.8-3 4.2v5.3h-2l-.4.5-.4-.5z" fill="#1F5C2E"/>
                <path d="M12 2C7 2 3 6 3 11c0 2.8 1.2 5.3 3.1 7l.9-1C5.3 15.4 4.2 13.3 4.2 11c0-4.3 3.5-7.8 7.8-7.8 4.3 0 7.8 3.5 7.8 7.8 0 2.3-1 4.4-2.7 5.9l.9 1C20 16.3 21.2 13.8 21.2 11 21.2 6 17.2 2 12.2 2H12z" fill="#1F5C2E" opacity="0.3"/>
              </svg>
            )}
            <span style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 18, fontWeight: 600, color: theme.ink, lineHeight: 1.15,
            }}>{dishName(dish, lang)}</span>
          </span>
          <span style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 600,
            color: theme.ink, fontVariantNumeric: 'tabular-nums', flexShrink: 0,
            lineHeight: 1.4,
          }}>€{dish.price.toFixed(2)}</span>
        </div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 12, color: theme.inkMute, marginTop: 3, lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
        }}>{dishDesc(dish, lang)}</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
          {dish.tags.map(tg => <Tag key={tg} theme={theme}>{tagLabel(tg, lang)}</Tag>)}
          {dish.spice && <Tag theme={theme} color={theme.danger}><Icon name="flame" size={11}/></Tag>}
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Category browse
// ─────────────────────────────────────────────────────────────
function CategoryView({ theme, t, lang, catId, onBack, onDish, cart, onCart }) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const items = React.useMemo(() => {
    const arr = (MENU[catId] || []).slice();
    // Photos first, no-photo last; stable within each group
    arr.sort((a, b) => (a.photo ? 0 : 1) - (b.photo ? 0 : 1));
    return arr;
  }, [catId]);
  const totals = cartTotals(cart);
  const cartCount = cart.reduce((a, l) => a + l.qty, 0);
  return (
    <div>
      <PageHeader theme={theme} onBack={onBack} title={t[cat.name_key]}
                  sub={`${items.length} ${lang === 'fr' ? 'plats' : lang === 'nl' ? 'gerechten' : 'dishes'}`}/>
      <div style={{ padding: '8px 20px 160px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(d => <DishRow key={d.id} dish={d} theme={theme} t={t} lang={lang} onClick={() => onDish(d.id)}/>)}
      </div>
      {cartCount > 0 && (
        <StickyDock>
          <ViewBasketBar theme={theme} t={t} count={cartCount} total={totals.total} onClick={onCart}/>
        </StickyDock>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dish detail
// ─────────────────────────────────────────────────────────────
const EXTRAS = {
  default: [
    { id: 'pita', name: { en: 'Extra pita', fr: 'Pita suppl.', nl: 'Extra pita' }, price: 1.5 },
    { id: 'toum', name: { en: 'Garlic toum', fr: 'Toum à l’ail', nl: 'Knoflook-toum' }, price: 1.0 },
    { id: 'hummus', name: { en: 'Side of hummus', fr: 'Hummus en accomp.', nl: 'Hummus erbij' }, price: 3.5 },
    { id: 'salad', name: { en: 'Cabbage salad', fr: 'Salade de chou', nl: 'Koolsalade' }, price: 2.5 },
  ],
};

function DishDetail({ theme, t, lang, dishId, onBack, onAdd }) {
  const dish = dishById(dishId);
  const [qty, setQty] = React.useState(1);
  const [spice, setSpice] = React.useState(dish.spice ? 'med' : null);
  const [extras, setExtras] = React.useState([]);
  const [adding, setAdding] = React.useState(false);

  const toggleExtra = (e) => {
    setExtras(arr => arr.find(x => x.id === e.id) ? arr.filter(x => x.id !== e.id) : [...arr, e]);
  };
  const total = (dish.price + extras.reduce((a, e) => a + e.price, 0)) * qty;

  const add = () => {
    setAdding(true);
    setTimeout(() => {
      onAdd({ id: dish.id, qty, spice, extras });
      setAdding(false);
    }, 380);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* hero with floating back */}
      <div style={{ position: 'relative' }}>
        {dish.photo ? (
          <div style={{ background: theme.surfaceAlt }}>
            <DishHero dish={dish} w={420} h={280} theme={theme}/>
          </div>
        ) : (
          <div style={{ height: 64 }}/>
        )}
        <button onClick={onBack} aria-label="back" style={{
          position: 'absolute', top: 16, left: 16, zIndex: 5,
          width: 40, height: 40, borderRadius: 20,
          background: theme.surface, color: theme.ink,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }}>
          <Icon name="arrow-left" size={20}/>
        </button>
      </div>
      <div style={{
        marginTop: -28, padding: '24px 20px 24px',
        background: theme.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0 }}>
            {dish.tags?.includes('v') && (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5v-5.3C9.5 10.8 8 9 8 7c2.2 0 4 1.3 4.7 3.2C13.4 8.3 15.2 7 17.4 7c0 2-1.5 3.8-3 4.2v5.3h-2l-.4.5-.4-.5z" fill="#1F5C2E"/>
                <path d="M12 2C7 2 3 6 3 11c0 2.8 1.2 5.3 3.1 7l.9-1C5.3 15.4 4.2 13.3 4.2 11c0-4.3 3.5-7.8 7.8-7.8 4.3 0 7.8 3.5 7.8 7.8 0 2.3-1 4.4-2.7 5.9l.9 1C20 16.3 21.2 13.8 21.2 11 21.2 6 17.2 2 12.2 2H12z" fill="#1F5C2E" opacity="0.3"/>
              </svg>
            )}
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 30, fontWeight: 600, color: theme.ink, lineHeight: 1.1,
              letterSpacing: -0.3,
            }}>{dishName(dish, lang)}</div>
          </div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 22, fontWeight: 600, color: theme.primary,
            fontVariantNumeric: 'tabular-nums', flexShrink: 0,
            lineHeight: 1.4,
          }}>€{dish.price.toFixed(2)}</div>
        </div>
        <div style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 14, color: theme.inkSoft, marginTop: 8, lineHeight: 1.5,
        }}>{dishDesc(dish, lang)}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          {dish.tags.map(tg => <Tag key={tg} theme={theme}>{tagLabel(tg, lang, true)}</Tag>)}
          {dish.spice && <Tag theme={theme} color={theme.danger}><Icon name="flame" size={11}/> {t.ord_spice}</Tag>}
        </div>

        {dish.spice && (
          <div style={{ marginTop: 26 }}>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 12, fontWeight: 500, color: theme.inkSoft,
              letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10,
            }}>{t.ord_spice}</div>
            <ChipRow theme={theme} value={spice} onChange={setSpice} options={[
              { id: 'mild', label: t.ord_spice_mild },
              { id: 'med',  label: t.ord_spice_med },
              { id: 'hot',  label: t.ord_spice_hot },
            ]}/>
          </div>
        )}

        <div style={{ height: 100 }}/>
      </div>

      {/* sticky add bar */}
      <StickyDock><div style={{ padding: '0 16px 10px' }}>
      <div style={{
        background: theme.surface, borderRadius: 16,
        padding: 10, display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 12px 30px rgba(42,32,20,0.22), 0 0 0 0.5px rgba(0,0,0,0.04)',
      }}>
        <Stepper theme={theme} value={qty} onChange={setQty}/>
        <button onClick={add} disabled={adding} style={{
          appearance: 'none', border: 'none',
          cursor: adding ? 'default' : 'pointer',
          flex: 1, height: 48, borderRadius: 12,
          background: adding ? theme.success : theme.primary,
          color: theme.primaryInk,
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 600, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 240ms ease',
        }}>
          {adding ? <><Icon name="check" size={18} stroke={2.4}/> {t.ord_added}</> : <>{t.ord_add_to_cart} · €{total.toFixed(2)}</>}
        </button>
      </div>
      </div></StickyDock>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────────────────────
function CartView({ theme, t, lang, cart, onBack, onUpdate, onRemove, onContinue }) {
  const totals = cartTotals(cart);
  if (cart.length === 0) {
    return (
      <div>
        <PageHeader theme={theme} onBack={onBack} title={t.ord_cart}/>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            background: theme.surface, color: theme.inkMute,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}><Icon name="bag" size={28}/></div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 22, fontWeight: 600, color: theme.ink,
          }}>{t.ord_empty}</div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, color: theme.inkMute, marginTop: 6,
          }}>{t.ord_empty_sub}</div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <PageHeader theme={theme} onBack={onBack} title={t.ord_cart}/>
      <div style={{ padding: '0 20px 200px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cart.map((line, i) => {
            const d = dishById(line.id);
            if (!d) return null;
            let lp = d.price;
            if (line.extras) line.extras.forEach(e => { lp += e.price; });
            return (
              <Card key={i} theme={theme} padding={14}>
                <div style={{ display: 'flex', gap: 12 }}>
                  {d.photo && (
                    <div style={{
                      width: 56, height: 56, borderRadius: 10,
                      background: theme.surfaceAlt, flexShrink: 0,
                      overflow: 'hidden',
                    }}>
                      <DishImage dish={d} size={56} theme={theme}/>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 17, fontWeight: 600, color: theme.ink, lineHeight: 1.2,
                      }}>{dishName(d, lang)}</span>
                      <span style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 14, fontWeight: 600, color: theme.ink,
                        fontVariantNumeric: 'tabular-nums', flexShrink: 0,
                      }}>€{(lp * line.qty).toFixed(2)}</span>
                    </div>
                    {(line.spice || (line.extras && line.extras.length > 0)) && (
                      <div style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 12, color: theme.inkMute, marginTop: 3, lineHeight: 1.4,
                      }}>
                        {line.spice && (line.spice === 'mild' ? t.ord_spice_mild : line.spice === 'med' ? t.ord_spice_med : t.ord_spice_hot)}
                        {line.spice && line.extras && line.extras.length > 0 && ' · '}
                        {line.extras && line.extras.map(e => e.name[lang]).join(', ')}
                      </div>
                    )}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      marginTop: 10,
                    }}>
                      <Stepper theme={theme} value={line.qty} size="sm" min={0}
                               onChange={(v) => v === 0 ? onRemove(i) : onUpdate(i, v)}/>
                      <button onClick={() => onRemove(i)} style={{
                        appearance: 'none', border: 'none', background: 'transparent',
                        cursor: 'pointer', color: theme.inkMute,
                        fontFamily: '"DM Sans", sans-serif', fontSize: 13,
                      }}>{t.cancel}</button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {/* Totals */}
        <Card theme={theme} style={{ marginTop: 16 }} padding={16}>
          <Totals totals={totals} theme={theme} t={t}/>
        </Card>
      </div>
      {/* sticky continue */}
      <StickyDock>
        <div style={{ padding: '0 16px 10px' }}>
          <PrimaryButton theme={theme} onClick={onContinue}>{t.ord_continue} · €{totals.total.toFixed(2)}</PrimaryButton>
        </div>
      </StickyDock>
    </div>
  );
}

function Totals({ totals, theme, t }) {
  const row = (label, value, bold) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '6px 0',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: bold ? 17 : 14,
      fontWeight: bold ? 600 : 500,
      color: bold ? theme.ink : theme.inkSoft,
      fontVariantNumeric: 'tabular-nums',
    }}>
      <span>{label}</span>
      <span>€{value.toFixed(2)}</span>
    </div>
  );
  return (
    <div>
      {row(t.ord_subtotal, totals.subtotal)}
      {row(t.ord_tax, totals.tax)}
      <div style={{ height: 1, background: theme.line, margin: '8px 0' }}/>
      {row(t.ord_total, totals.total, true)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pickup / Delivery fulfillment selector
// ─────────────────────────────────────────────────────────────
function FulfillmentView({ theme, t, lang, value, onChange, onBack, onContinue, deliveryType, onDeliveryType, deliveryAddress, onDeliveryAddress }) {
  const { lunchSlots, dinnerSlots, isAsapAvailable } = React.useMemo(() => {
    const now = new Date();
    const minMins = now.getHours() * 60 + now.getMinutes() + 25;

    const toLabel = (h, m) => {
      const d = new Date(); d.setHours(h, m, 0, 0);
      return d.toLocaleTimeString(lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
    const genSlots = (startH, startM, endH, endM) => {
      const slots = [];
      const end = endH * 60 + endM;
      for (let mins = startH * 60 + startM; mins <= end; mins += 15) {
        if (mins >= minMins) slots.push(toLabel(Math.floor(mins / 60), mins % 60));
      }
      return slots;
    };
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const isAsapAvailable = (nowMins >= 11 * 60 + 30 && nowMins <= 13 * 60 + 5)
                          || (nowMins >= 18 * 60 && nowMins <= 21 * 60 + 5);
    return { lunchSlots: genSlots(11, 30, 13, 30), dinnerSlots: genSlots(18, 0, 21, 30), isAsapAvailable };
  }, [lang]);

  const noSlots = lunchSlots.length === 0 && dinnerSlots.length === 0 && !isAsapAvailable;
  const isDelivery = deliveryType === 'delivery';
  const asapEta = isDelivery ? 40 : 25;
  const canContinue = !!value && !(isDelivery && !deliveryAddress.trim());

  const SlotGrid = ({ slots }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 22 }}>
      {slots.map(s => {
        const on = s === value;
        return (
          <button key={s} onClick={() => onChange(s)} style={{
            appearance: 'none', border: 'none', cursor: 'pointer',
            padding: '12px 0', borderRadius: 10,
            background: on ? theme.primary : theme.surface,
            color: on ? theme.primaryInk : theme.ink,
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
            transition: 'all 180ms ease',
          }}>{s}</button>
        );
      })}
    </div>
  );

  return (
    <div>
      <PageHeader theme={theme} onBack={onBack}
        title={lang === 'fr' ? 'Retrait ou livraison' : lang === 'nl' ? 'Afhalen of levering' : 'Pickup or delivery'}
        sub={lang === 'fr' ? 'Choisissez votre mode de réception' : lang === 'nl' ? 'Kies uw leveringswijze' : 'Choose how to receive your order'}/>
      <div style={{ padding: '0 20px 160px' }}>

        {/* Method toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { id: 'pickup',   icon: 'bag', label: lang === 'fr' ? 'Retrait'   : lang === 'nl' ? 'Afhalen' : 'Pickup',   sub: lang === 'fr' ? 'Venez chercher'    : lang === 'nl' ? 'Kom ophalen'      : 'Come & collect' },
            { id: 'delivery', icon: 'pin', label: lang === 'fr' ? 'Livraison' : lang === 'nl' ? 'Levering' : 'Delivery', sub: lang === 'fr' ? 'À votre adresse'   : lang === 'nl' ? 'Naar uw adres'    : 'To your address' },
          ].map(opt => {
            const on = deliveryType === opt.id;
            return (
              <button key={opt.id} onClick={() => onDeliveryType(opt.id)} style={{
                appearance: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                border: `2px solid ${on ? theme.primary : 'transparent'}`,
                background: on ? theme.primary : theme.surface,
                color: on ? theme.primaryInk : theme.ink,
                borderRadius: 16, padding: '16px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                boxShadow: on ? `0 8px 24px ${theme.primary}44` : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 200ms ease',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 18,
                  background: on ? 'rgba(255,255,255,0.25)' : theme.surfaceAlt,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={opt.icon} size={18}/>
                </div>
                <div>
                  <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{opt.label}</div>
                  <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, opacity: 0.78, marginTop: 2 }}>{opt.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Delivery address */}
        {isDelivery && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500, color: theme.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>
              {lang === 'fr' ? 'Adresse de livraison' : lang === 'nl' ? 'Leveringsadres' : 'Delivery address'}
            </div>
            <input
              value={deliveryAddress}
              onChange={e => onDeliveryAddress(e.target.value)}
              placeholder={lang === 'fr' ? 'Rue, numéro, ville' : lang === 'nl' ? 'Straat, nummer, stad' : 'Street, number, city'}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: theme.surface, border: `1.5px solid ${theme.line}`,
                borderRadius: 12, padding: '13px 14px',
                fontFamily: '"DM Sans", sans-serif', fontSize: 15, color: theme.ink,
                outline: 'none', appearance: 'none',
              }}
            />
          </div>
        )}

        {/* ASAP */}
        {isAsapAvailable && (
          <button onClick={() => onChange('asap')} style={{
            appearance: 'none', border: 'none', cursor: 'pointer',
            width: '100%', textAlign: 'left',
            background: value === 'asap' ? theme.primary : theme.surface,
            color: value === 'asap' ? theme.primaryInk : theme.ink,
            borderRadius: 16, padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 22,
            transition: 'all 200ms ease',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 20,
              background: value === 'asap' ? 'rgba(255,255,255,0.2)' : theme.surfaceAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name="flame" size={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 600 }}>
                {lang === 'fr' ? 'Dès que possible' : lang === 'nl' ? 'Zo snel mogelijk' : 'As soon as possible'}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, opacity: 0.8, marginTop: 2 }}>~{asapEta} min</div>
            </div>
          </button>
        )}

        {/* Lunch slots */}
        {lunchSlots.length > 0 && (
          <>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500, color: theme.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>
              {lang === 'fr' ? 'Déjeuner · 11h30 – 13h30' : lang === 'nl' ? 'Lunch · 11u30 – 13u30' : 'Lunch · 11:30 – 13:30'}
            </div>
            <SlotGrid slots={lunchSlots}/>
          </>
        )}

        {/* Dinner slots */}
        {dinnerSlots.length > 0 && (
          <>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500, color: theme.inkSoft, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 }}>
              {lang === 'fr' ? 'Dîner · 18h00 – 21h30' : lang === 'nl' ? 'Diner · 18u00 – 21u30' : 'Dinner · 18:00 – 21:30'}
            </div>
            <SlotGrid slots={dinnerSlots}/>
          </>
        )}

        {noSlots && (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: theme.inkMute, lineHeight: 1.7 }}>
            {lang === 'fr'
              ? 'Aucun créneau disponible pour le moment.\nCommandes : 11h30–13h30 et 18h00–21h30.'
              : lang === 'nl'
              ? 'Geen tijdsloten beschikbaar.\nBestellingen : 11u30–13u30 en 18u00–21u30.'
              : 'No slots available right now.\nOrders accepted: 11:30–13:30 and 18:00–21:30.'}
          </div>
        )}
      </div>

      <StickyDock>
        <div style={{ padding: '0 16px 10px' }}>
          <PrimaryButton theme={theme} disabled={!canContinue} onClick={onContinue}>{t.next}</PrimaryButton>
        </div>
      </StickyDock>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Payment
// ─────────────────────────────────────────────────────────────
function ConfirmView({ theme, t, lang, cart, totals, pickup, deliveryType, deliveryAddress, onBack, onConfirm, loading, error }) {
  const savedUser = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('eaw_user') || 'null'); } catch { return null; }
  }, []);
  const [name, setName] = React.useState(savedUser?.name || '');
  const [phone, setPhone] = React.useState(savedUser?.phone || '');
  const [email, setEmail] = React.useState(savedUser?.email || '');
  const [errs, setErrs] = React.useState({});

  const inputStyle = (err) => ({
    width: '100%', boxSizing: 'border-box',
    background: theme.surface, border: `1.5px solid ${err ? '#ef4444' : theme.line}`,
    borderRadius: 12, padding: '13px 14px',
    fontFamily: '"DM Sans", sans-serif', fontSize: 15, color: theme.ink,
    outline: 'none', appearance: 'none',
  });

  const submit = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = true;
    if (!phone.replace(/\D/g, '') || phone.replace(/\D/g, '').length < 7) e.phone = true;
    if (Object.keys(e).length) { setErrs(e); return; }
    setErrs({});
    onConfirm({ name: name.trim(), phone: phone.trim(), email: email.trim() });
  };

  const pickupLabel = pickup === 'asap'
    ? (lang === 'fr' ? 'Dès que possible (~25 min)' : lang === 'nl' ? 'Zo snel mogelijk (~25 min)' : 'As soon as possible (~25 min)')
    : pickup;

  return (
    <div>
      <PageHeader theme={theme} onBack={onBack}
        title={lang === 'fr' ? 'Confirmer la commande' : lang === 'nl' ? 'Bestelling bevestigen' : 'Confirm order'}
        sub={deliveryType === 'delivery'
          ? (lang === 'fr' ? 'Livraison · paiement en espèces à la porte' : lang === 'nl' ? 'Levering · contante betaling aan de deur' : 'Delivery — cash payment at the door')
          : (lang === 'fr' ? 'Paiement à la collecte — aucune carte requise' : lang === 'nl' ? 'Betaling bij afhaling — geen kaart nodig' : 'Pay at pickup — no card needed')}/>
      <div style={{ padding: '0 20px 180px' }}>

        {/* Fulfillment badge */}
        <div style={{ background: theme.surfaceAlt, borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: theme.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon name={deliveryType === 'delivery' ? 'pin' : 'bag'} size={18} color={theme.primaryInk}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 600, color: theme.ink }}>
                {deliveryType === 'delivery'
                  ? (lang === 'fr' ? 'Livraison · espèces' : lang === 'nl' ? 'Levering · contant' : 'Delivery · cash')
                  : (lang === 'fr' ? 'Paiement sur place' : lang === 'nl' ? 'Betalen bij afhaling' : 'Pay on pickup')}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: theme.inkMute, marginTop: 1 }}>
                {deliveryType === 'delivery'
                  ? (lang === 'fr' ? `Livraison : ${pickupLabel}` : lang === 'nl' ? `Levering: ${pickupLabel}` : `Delivery: ${pickupLabel}`)
                  : (lang === 'fr' ? `Retrait : ${pickupLabel}` : lang === 'nl' ? `Afhalen: ${pickupLabel}` : `Pickup: ${pickupLabel}`)}
              </div>
            </div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 17, fontWeight: 700, color: theme.primary }}>
              €{totals.total.toFixed(2)}
            </div>
          </div>
          {deliveryType === 'delivery' && deliveryAddress && (
            <div style={{
              marginTop: 10, paddingTop: 10, borderTop: `1px solid ${theme.line}`,
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: theme.inkSoft,
            }}>
              <Icon name="pin" size={14} color={theme.inkMute}/>{deliveryAddress}
            </div>
          )}
        </div>

        {/* Customer details */}
        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, color: theme.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>
          {lang === 'fr' ? 'Vos coordonnées' : lang === 'nl' ? 'Uw gegevens' : 'Your details'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder={t.res_name}
            style={inputStyle(errs.name)}
          />
          <input
            value={phone} onChange={e => setPhone(e.target.value)}
            placeholder={t.res_phone}
            type="tel"
            style={inputStyle(errs.phone)}
          />
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder={`${t.res_email} (${lang === 'fr' ? 'facultatif' : lang === 'nl' ? 'optioneel' : 'optional'})`}
            type="email"
            style={inputStyle(false)}
          />
        </div>
        {Object.keys(errs).length > 0 && (
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#ef4444', marginTop: 8 }}>
            {lang === 'fr' ? 'Veuillez remplir tous les champs obligatoires.' : lang === 'nl' ? 'Vul alle verplichte velden in.' : 'Please fill in all required fields.'}
          </div>
        )}
        {error && (
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#ef4444', marginTop: 10 }}>{error}</div>
        )}

        {/* Order summary */}
        <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, color: theme.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, margin: '20px 0 10px' }}>
          {lang === 'fr' ? 'Récapitulatif' : lang === 'nl' ? 'Overzicht' : 'Summary'}
        </div>
        <Card theme={theme} padding={16}><Totals totals={totals} theme={theme} t={t}/></Card>
      </div>

      <StickyDock>
        <div style={{ padding: '0 16px 10px' }}>
          <button onClick={loading ? null : submit} style={{
            appearance: 'none', border: 'none',
            cursor: loading ? 'default' : 'pointer',
            width: '100%', height: 54, borderRadius: 14,
            background: theme.primary, color: theme.primaryInk,
            fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? <Spinner/> : (lang === 'fr' ? 'Passer la commande' : lang === 'nl' ? 'Bestelling plaatsen' : 'Place order')}
          </button>
        </div>
      </StickyDock>
    </div>
  );
}

function Spinner({ color = '#fff' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.25" strokeWidth="2.5"/>
      <path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth="2.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite"/>
      </path>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Order placed / confirmation
// ─────────────────────────────────────────────────────────────
function OrderPlaced({ theme, t, lang, code, eta, total, onTrack, onDone }) {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <PageHeader theme={theme}/>
      <div style={{ padding: '0 20px 120px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 24 }}>
          <div style={{
            width: 76, height: 76, borderRadius: 38,
            background: theme.olive, color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18,
            boxShadow: `0 12px 30px ${theme.olive}55`,
          }}>
            <Icon name="check" size={36} stroke={2.4}/>
          </div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 36, fontWeight: 600, color: theme.ink, lineHeight: 1.05,
            letterSpacing: -0.4,
          }}>{t.ord_done_title}</div>
          <div style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 14, color: theme.inkMute, marginTop: 8, padding: '0 16px',
          }}>{t.ord_done_sub}</div>
        </div>
        {/* Pickup code "ticket" */}
        <Card theme={theme} padding={0} style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{
            padding: '22px 24px',
            background: theme.surface,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 11,
              letterSpacing: 0.6, textTransform: 'uppercase', color: theme.inkMute,
            }}>{t.res_done_code}</div>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 64, fontWeight: 600, color: theme.primary,
              letterSpacing: 4, lineHeight: 1, marginTop: 4,
            }}>{code}</div>
          </div>
          {/* perforated divider */}
          <div style={{
            position: 'relative', height: 18,
            background: theme.surfaceAlt,
          }}>
            <div style={{
              position: 'absolute', left: -8, top: 0, bottom: 0,
              width: 16, borderRadius: 8, background: theme.bg,
            }}/>
            <div style={{
              position: 'absolute', right: -8, top: 0, bottom: 0,
              width: 16, borderRadius: 8, background: theme.bg,
            }}/>
            <div style={{
              position: 'absolute', left: 18, right: 18, top: '50%', height: 1,
              background: `repeating-linear-gradient(to right, ${theme.inkMute} 0 4px, transparent 4px 10px)`,
              opacity: 0.4,
            }}/>
          </div>
          <div style={{ padding: '16px 22px 20px', background: theme.surface }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 12,
                color: theme.inkMute, letterSpacing: 0.4, textTransform: 'uppercase',
              }}>{t.ord_done_eta}</span>
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 14,
                color: theme.ink, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
              }}>{eta}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 12,
                color: theme.inkMute, letterSpacing: 0.4, textTransform: 'uppercase',
              }}>{t.track_total_paid}</span>
              <span style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 14,
                color: theme.ink, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
              }}>€{total.toFixed(2)}</span>
            </div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13, color: theme.inkSoft, marginTop: 12,
              padding: '12px 0 0', borderTop: `1px solid ${theme.line}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon name="pin" size={14}/>{t.ord_done_addr}
            </div>
          </div>
        </Card>
        <div style={{ flex: 1, minHeight: 16 }}/>
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostButton theme={theme} onClick={onDone}>{t.res_back_home}</GhostButton>
          <PrimaryButton theme={theme} onClick={onTrack}>{t.ord_track_order}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Order tracking
// ─────────────────────────────────────────────────────────────
function OrderTracking({ theme, t, lang, order, onBack, onAdvance }) {
  const stages = [
    { id: 'received', label: t.track_status_received, icon: 'check' },
    { id: 'prep',     label: t.track_status_prep,     icon: 'flame' },
    { id: 'ready',    label: t.track_status_ready,    icon: 'bag' },
    { id: 'collected',label: t.track_status_collected,icon: 'star' },
  ];
  const idx = stages.findIndex(s => s.id === order.status);

  return (
    <div>
      <PageHeader theme={theme} onBack={onBack} title={t.track_title}
                  sub={`#${order.code}`}/>
      <div style={{ padding: '0 20px 140px' }}>
        {/* Status big card */}
        <Card theme={theme} padding={0} style={{ overflow: 'hidden' }}>
          <div style={{
            background: theme.olive, color: '#fff',
            padding: '24px 22px',
          }}>
            <div style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: 11,
              letterSpacing: 0.6, textTransform: 'uppercase', opacity: 0.8,
            }}>{lang === 'fr' ? 'Statut' : lang === 'nl' ? 'Status' : 'Status'}</div>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 32, fontWeight: 600, marginTop: 4, lineHeight: 1.1,
            }}>{stages[idx].label}</div>
            <div style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 14, marginTop: 8, opacity: 0.92,
            }}>{t.track_eta} <strong>{order.eta}</strong></div>
          </div>
          {/* Stage timeline */}
          <div style={{ padding: '18px 22px 4px' }}>
            {stages.map((s, i) => {
              const done = i < idx;
              const active = i === idx;
              const future = i > idx;
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  paddingBottom: 14,
                  position: 'relative',
                }}>
                  {/* connector */}
                  {i < stages.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 13, top: 28, bottom: 0,
                      width: 2,
                      background: i < idx ? theme.olive : theme.line,
                    }}/>
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: done ? theme.olive : (active ? theme.primary : theme.surfaceAlt),
                    color: done || active ? '#fff' : theme.inkMute,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, zIndex: 1,
                    boxShadow: active ? `0 0 0 4px ${theme.bg}, 0 0 0 6px ${theme.primary}33` : 'none',
                    transition: 'all 280ms ease',
                  }}>
                    {done ? <Icon name="check" size={16} stroke={2.5}/> : <Icon name={s.icon} size={14}/>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 15, fontWeight: active ? 600 : 500,
                      color: future ? theme.inkMute : theme.ink,
                    }}>{s.label}</div>
                    {active && (
                      <div style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: 12, color: theme.inkSoft, marginTop: 2,
                      }}>
                        {s.id === 'prep' && (lang === 'fr' ? 'Le chef prépare votre commande' : lang === 'nl' ? 'Onze chef bereidt uw bestelling' : 'Our chef is preparing your order')}
                        {s.id === 'received' && (lang === 'fr' ? 'Commande reçue, paiement confirmé' : lang === 'nl' ? 'Bestelling ontvangen, betaling bevestigd' : 'Order received, payment confirmed')}
                        {s.id === 'ready' && (lang === 'fr' ? 'Passez la récupérer !' : lang === 'nl' ? 'Kom het ophalen!' : 'Come collect it!')}
                        {s.id === 'collected' && (lang === 'fr' ? 'Merci, à bientôt' : lang === 'nl' ? 'Bedankt, tot ziens' : 'Thank you, see you soon')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        {/* Pickup code mini */}
        <Card theme={theme} style={{ marginTop: 14 }} padding={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: 11,
                letterSpacing: 0.6, textTransform: 'uppercase', color: theme.inkMute,
              }}>{t.res_done_code}</div>
              <div style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 28, fontWeight: 600, color: theme.primary,
                letterSpacing: 3, lineHeight: 1.1,
              }}>{order.code}</div>
            </div>
            <div style={{
              padding: '8px 14px', borderRadius: 8,
              background: theme.surfaceAlt, color: theme.inkSoft,
              fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 500,
              letterSpacing: 0.4, textTransform: 'uppercase',
            }}>{t.ord_done_eta} {order.eta}</div>
          </div>
        </Card>
        {/* Items summary */}
        <Card theme={theme} style={{ marginTop: 14 }} padding={16}>
          <div style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: 11,
            letterSpacing: 0.6, textTransform: 'uppercase', color: theme.inkMute,
            marginBottom: 10,
          }}>{t.track_items}</div>
          {order.items.map((line, i) => {
            const d = dishById(line.id);
            if (!d) return null;
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0',
                fontFamily: '"DM Sans", sans-serif', fontSize: 14,
                color: theme.ink,
              }}>
                <span><span style={{ color: theme.inkMute, marginRight: 8 }}>{line.qty}×</span>{dishName(d, lang)}</span>
                <span style={{ color: theme.inkSoft, fontVariantNumeric: 'tabular-nums' }}>€{(d.price * line.qty).toFixed(2)}</span>
              </div>
            );
          })}
          <div style={{ height: 1, background: theme.line, margin: '10px 0' }}/>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: '"DM Sans", sans-serif', fontSize: 16, fontWeight: 600,
            color: theme.ink, fontVariantNumeric: 'tabular-nums',
          }}>
            <span>{t.track_total_paid}</span><span>€{order.total.toFixed(2)}</span>
          </div>
        </Card>
        {/* call + cancel */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <GhostButton theme={theme}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="phone" size={16}/>{t.track_call}</span></GhostButton>
          {idx < 2 && <GhostButton theme={theme}><span style={{ color: theme.danger }}>{t.track_cancel}</span></GhostButton>}
        </div>

        {/* Demo: advance status button (visible to demonstrate prototype) */}
        {idx < stages.length - 1 && (
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <TextButton theme={theme} onClick={onAdvance}>
              {lang === 'fr' ? 'Démo : passer à l’étape suivante' : lang === 'nl' ? 'Demo: ga naar volgende fase' : 'Demo: advance to next stage'} →
            </TextButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main takeaway flow controller
// ─────────────────────────────────────────────────────────────
function TakeawayFlow({ theme, t, lang, platform, cart, setCart, onPlaceOrder, onTrack, exitTab }) {
  const [view, setView] = React.useState('menu'); // menu, category, dish, cart, pickup, confirm, placed
  const [categoryId, setCategoryId] = React.useState(null);
  const [dishId, setDishId] = React.useState(null);
  const [pickup, setPickup] = React.useState(null);
  const [deliveryType, setDeliveryType] = React.useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [placedOrder, setPlacedOrder] = React.useState(null);
  const [orderLoading, setOrderLoading] = React.useState(false);
  const [orderError, setOrderError] = React.useState(null);
  const totals = cartTotals(cart);

  const reset = () => {
    setView('menu'); setCategoryId(null); setDishId(null); setPickup(null);
    setDeliveryType('pickup'); setDeliveryAddress('');
    setOrderError(null);
  };

  const handleConfirm = async (customer) => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const items = cart.map(line => {
        const dish = dishById(line.id);
        let price = dish ? dish.price : 0;
        if (line.extras) line.extras.forEach(e => { price += e.price; });
        return { id: line.id, qty: line.qty, name: dish ? dishName(dish, lang) : line.id, lineTotal: price * line.qty };
      });
      const res = await fetch('/.netlify/functions/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, items, totals, pickup, lang, deliveryType, deliveryAddress }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Could not place order');
      // Save user info for the You page
      try { localStorage.setItem('eaw_user', JSON.stringify(customer)); } catch (_) {}
      const order = {
        code: json.code, eta: json.eta, total: totals.total,
        items: cart.map(c => ({ id: c.id, qty: c.qty })),
        status: 'received',
      };
      setPlacedOrder(order);
      onPlaceOrder(order);
      setView('placed');
    } catch (err) {
      setOrderError(err.message || 'Could not place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (view === 'category') {
    return <CategoryView theme={theme} t={t} lang={lang} catId={categoryId} cart={cart}
      onBack={() => setView('menu')}
      onDish={(id) => { setDishId(id); setView('dish'); }}
      onCart={() => setView('cart')}/>;
  }
  if (view === 'dish') {
    return <DishDetail theme={theme} t={t} lang={lang} dishId={dishId}
      onBack={() => setView(categoryId ? 'category' : 'menu')}
      onAdd={(line) => {
        setCart(c => [...c, line]);
        setTimeout(() => setView(categoryId ? 'category' : 'menu'), 280);
      }}/>;
  }
  if (view === 'cart') {
    return <CartView theme={theme} t={t} lang={lang} cart={cart}
      onBack={() => setView('menu')}
      onUpdate={(i, qty) => setCart(c => c.map((l, j) => j === i ? { ...l, qty } : l))}
      onRemove={(i) => setCart(c => c.filter((_, j) => j !== i))}
      onContinue={() => setView('pickup')}/>;
  }
  if (view === 'pickup') {
    return <FulfillmentView theme={theme} t={t} lang={lang} value={pickup} onChange={setPickup}
      deliveryType={deliveryType} onDeliveryType={setDeliveryType}
      deliveryAddress={deliveryAddress} onDeliveryAddress={setDeliveryAddress}
      onBack={() => setView('cart')}
      onContinue={() => setView('confirm')}/>;
  }
  if (view === 'confirm') {
    return <ConfirmView theme={theme} t={t} lang={lang} cart={cart} totals={totals} pickup={pickup}
      deliveryType={deliveryType} deliveryAddress={deliveryAddress}
      onBack={() => setView('pickup')}
      onConfirm={handleConfirm}
      loading={orderLoading}
      error={orderError}/>;
  }
  if (view === 'placed') {
    return <OrderPlaced theme={theme} t={t} lang={lang}
      code={placedOrder.code} eta={placedOrder.eta} total={placedOrder.total}
      onTrack={() => { onTrack(); reset(); setCart([]); }}
      onDone={() => { reset(); setCart([]); exitTab(); }}/>;
  }
  // default — menu
  return <MenuLanding theme={theme} t={t} lang={lang} cart={cart}
    onCategory={(id) => { setCategoryId(id); setView('category'); }}
    onDish={(id) => { setDishId(id); setView('dish'); }}
    onCart={() => setView('cart')}/>;
}

Object.assign(window, { TakeawayFlow, OrderTracking, dishById, cartTotals });
