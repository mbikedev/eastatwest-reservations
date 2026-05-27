// Menu data, signature dishes, mock orders/reservations

// Each dish has:
//   name          — default (English / transliteration) name
//   name_fr / name_nl — optional overrides per language (use dishName helper)
//   desc          — { en, fr, nl } description
// Names that are transliterated Arabic (Hummus, Moutabal, Falafel, …) or brand
// names (Coca-Cola, Leffe, …) stay identical across languages, so they have no
// override. Only English-language phrases get translated.

const MENU = {
  sets: [
    { id: 'menu_eaw',    name: 'Menu East at West',
      desc: {
        en: 'Fattoush, Hummus, Moutabal, Zahra, Falafel, 2× Kibbeh, 2× Kabab skewers, 2× Chich taouk, 2× Dessert',
        fr: 'Fattoush, Houmous, Moutabal, Zahra, Falafel, 2× Kibbeh, 2× Brochettes kabab, 2× Chich taouk, 2× Dessert',
        nl: 'Fattoush, Hummus, Moutabal, Zahra, Falafel, 2× Kibbeh, 2× Kabab-spiesjes, 2× Chich taouk, 2× Dessert',
      },
      price: 67.50, spice: false, tags: [], img: 'set1', photo: 'img/menu-east-at-west.webp' },
    { id: 'menu_lazeez', name: 'Menu Lazeez',
      desc: {
        en: 'Tabouleh, Hummus, Moutabal, Muhammara, Warak Enab, Moussaka, Foul Moudamas, 2× Falafel, 2× Dessert',
        fr: 'Taboulé, Houmous, Moutabal, Muhammara, Warak Enab, Moussaka, Foul Moudamas, 2× Falafel, 2× Dessert',
        nl: 'Tabouleh, Hummus, Moutabal, Muhammara, Warak Enab, Moussaka, Foul Moudamas, 2× Falafel, 2× Dessert',
      },
      price: 65.50, spice: false, tags: ['v'], img: 'set2', photo: 'img/menu-lazeez.webp' },
    { id: 'menu_sahten', name: 'Menu Sahten',
      desc: {
        en: 'Tabouleh, Hummus, Toshka, Sujuk, Chicken liver, 2× Kibbeh, 2× Skewers, 2× Dessert',
        fr: 'Taboulé, Houmous, Toshka, Sujuk, Foie de poulet, 2× Kibbeh, 2× Brochettes, 2× Dessert',
        nl: 'Tabouleh, Hummus, Toshka, Sujuk, Kippenlever, 2× Kibbeh, 2× Spiesjes, 2× Dessert',
      },
      price: 84.00, spice: false, tags: [], img: 'set3', photo: 'img/menu-sahten.webp' },
    { id: 'menu_vegan',  name: 'Menu Vegan', name_fr: 'Menu Végan', name_nl: 'Menu Vegan',
      desc: {
        en: 'Fattoush, Hummus, Moutabal, Moussaka, Itch, Zahra, 2× Falafel, Batata Harra, 2× Dessert',
        fr: 'Fattoush, Houmous, Moutabal, Moussaka, Itch, Zahra, 2× Falafel, Batata Harra, 2× Dessert',
        nl: 'Fattoush, Hummus, Moutabal, Moussaka, Itch, Zahra, 2× Falafel, Batata Harra, 2× Dessert',
      },
      price: 64.50, spice: false, tags: ['v'], img: 'set4', photo: 'img/menu-vegan.webp' },
  ],
  mezze: [
    { id: 'warak_enab', name: 'Warak Enab',
      desc: {
        en: 'Vine leaves stuffed with rice, herbs, marinated in olive oil, mint and pomegranate molasses',
        fr: 'Feuilles de vigne farcies au riz, herbes, marinées à l\'huile d\'olive, menthe et mélasse de grenade',
        nl: 'Wijnbladeren gevuld met rijst, kruiden, gemarineerd in olijfolie, munt en granaatappelmelasse',
      },
      price: 7.00, spice: false, tags: ['v','gf'], img: 'm5', photo: 'img/warak-enab.webp' },
    { id: 'zahra',      name: 'Zahra',
      desc: {
        en: 'Cooked cauliflower, marinated in a homemade sauce (tomato, garlic and lemon), topped with lemon tahini sauce',
        fr: 'Chou-fleur cuit, mariné dans une sauce maison (tomate, ail et citron), nappé de sauce tahini citron',
        nl: 'Bloemkool, gemarineerd in huisgemaakte saus (tomaat, knoflook en citroen), met citroen-tahinisaus',
      },
      price: 7.50, spice: false, tags: ['v','gf'], img: 'm7', photo: 'img/zahra.webp' },
    { id: 'iche',       name: 'Itch',
      desc: {
        en: 'Bulgur cooked in tomato sauce with peppers, onion, parsley and pomegranate molasses',
        fr: 'Boulgour cuit dans une sauce tomate avec poivrons, oignon, persil et mélasse de grenade',
        nl: 'Bulgur gekookt in tomatensaus met paprika, ui, peterselie en granaatappelmelasse',
      },
      price: 7.50, spice: false, tags: ['v'], img: 'm4', photo: 'img/iche.webp' },
    { id: 'hummus',     name: 'Hummus',
      desc: {
        en: 'Chickpea puree with tahini (sesame paste)',
        fr: 'Purée de pois chiches au tahini (pâte de sésame)',
        nl: 'Kikkererwtenpuree met tahini (sesampasta)',
      },
      price: 7.50, spice: false, tags: ['v','gf'], img: 'm1', photo: 'img/houmos.webp' },
    { id: 'mousaka',    name: 'Moussaka',
      desc: {
        en: 'Eggplant, onion, chickpeas and tomato',
        fr: 'Aubergine, oignon, pois chiches et tomate',
        nl: 'Aubergine, ui, kikkererwten en tomaat',
      },
      price: 7.50, spice: false, tags: ['v'], img: 'm8', photo: 'img/mousaka.webp' },
    { id: 'muhamara',   name: 'Muhammara',
      desc: {
        en: 'Grilled red pepper dip, pomegranate molasses and walnuts',
        fr: 'Dip de poivron rouge grillé, mélasse de grenade et noix',
        nl: 'Gegrilde rode-peperdip, granaatappelmelasse en walnoten',
      },
      price: 8.00, spice: true,  tags: ['v'], img: 'm3', photo: 'img/mouhamara.webp' },
    { id: 'makdous',    name: 'Makdous',
      desc: {
        en: 'Baby eggplants stuffed with walnuts and peppers marinated in olive oil',
        fr: 'Aubergines bébés farcies aux noix et poivrons marinés à l\'huile d\'olive',
        nl: 'Baby-aubergines gevuld met walnoten en paprika gemarineerd in olijfolie',
      },
      price: 8.00, spice: false, tags: ['v','gf'], img: 'm6', photo: 'img/makdous.webp' },
    { id: 'moutabal',   name: 'Moutabal',
      desc: {
        en: 'Grilled eggplant caviar with tahini (sesame paste)',
        fr: 'Caviar d\'aubergine grillée au tahini (pâte de sésame)',
        nl: 'Gegrilde auberginecaviar met tahini (sesampasta)',
      },
      price: 8.00, spice: false, tags: ['v','gf'], img: 'm2', photo: 'img/moutabal.webp' },
  ],
  hot: [
    { id: 'falafel',      name: 'Falafel (2 pcs)', name_fr: 'Falafel (2 pcs)', name_nl: 'Falafel (2 st.)',
      desc: {
        en: 'Fried chickpea balls served with tahini sauce',
        fr: 'Boulettes de pois chiches frites, servies avec sauce tahini',
        nl: 'Gefrituurde kikkererwtenballen geserveerd met tahinisaus',
      },
      price: 4.00, spice: false, tags: ['v'], img: 'g6', photo: 'img/falafel-salad.webp' },
    { id: 'kibbeh',       name: 'Kibbeh (2 pcs)', name_fr: 'Kibbeh (2 pcs)', name_nl: 'Kibbeh (2 st.)',
      desc: {
        en: 'Fried bulgur croquettes stuffed with minced meat, onion and walnuts',
        fr: 'Croquettes de boulgour farcies à la viande hachée, oignon et noix',
        nl: 'Gefrituurde bulgurkroketten gevuld met gehakt, ui en walnoten',
      },
      price: 7.00, spice: false, tags: [], img: 'g7c', photo: 'img/kebbe.webp' },
    { id: 'fatteh',       name: 'Fatteh',
      desc: {
        en: 'Cooked chickpeas, fried Lebanese bread, garlic and homemade lemon tahini sauce',
        fr: 'Pois chiches cuits, pain libanais frit, ail et sauce tahini citron maison',
        nl: 'Gekookte kikkererwten, gefrituurd Libanees brood, knoflook en huisgemaakte citroen-tahinisaus',
      },
      price: 7.50, spice: false, tags: ['v'], img: 'g7b', photo: 'img/fatteh.webp' },
    { id: 'batata',       name: 'Batata Harra',
      desc: {
        en: 'Fried potato cubes with red peppers, coriander and garlic',
        fr: 'Cubes de pommes de terre frits avec poivrons rouges, coriandre et ail',
        nl: 'Gebakken aardappelblokjes met rode paprika, koriander en knoflook',
      },
      price: 7.50, spice: true,  tags: ['v','gf'], img: 'g8', photo: 'img/batata-hara.webp' },
    { id: 'foul',         name: 'Foul Moudamas',
      desc: {
        en: 'Fava beans marinated with lemon juice, tomatoes, cumin, garlic, olive oil and tahini sauce',
        fr: 'Fèves marinées au jus de citron, tomates, cumin, ail, huile d\'olive et sauce tahini',
        nl: 'Tuinbonen gemarineerd met citroensap, tomaten, komijn, knoflook, olijfolie en tahinisaus',
      },
      price: 8.00, spice: false, tags: ['v','gf'], img: 'g7', photo: 'img/foul-moudamas.webp' },
    { id: 'grilled_cheese', name: 'Grilled Syrian Cheese', name_fr: 'Fromage syrien grillé', name_nl: 'Gegrilde Syrische kaas',
      desc: {
        en: 'Grilled Syrian cheese',
        fr: 'Fromage syrien grillé',
        nl: 'Gegrilde Syrische kaas',
      },
      price: 10.00, spice: false, tags: [], img: 'g5b', photo: 'img/grilled-cheese.webp' },
    { id: 'arayes',       name: 'Arayes Cheese', name_fr: 'Arayes au fromage', name_nl: 'Arayes met kaas',
      desc: {
        en: 'Oven-baked Lebanese bread stuffed with Syrian cheese',
        fr: 'Pain libanais cuit au four, farci au fromage syrien',
        nl: 'In de oven gebakken Libanees brood gevuld met Syrische kaas',
      },
      price: 10.00, spice: false, tags: [], img: 'ga', photo: 'img/arayes-cheese.webp' },
    { id: 'chicken_liver', name: 'Chicken Liver', name_fr: 'Foie de volaille', name_nl: 'Kippenlevertjes',
      desc: {
        en: 'Chicken liver cooked with onion and special spices. Served with pomegranate sauce',
        fr: 'Foie de volaille cuit à l\'oignon et aux épices spéciales. Servi avec sauce grenade',
        nl: 'Kippenlevertjes met ui en bijzondere kruiden. Geserveerd met granaatappelsaus',
      },
      price: 11.50, spice: false, tags: ['gf'], img: 'g9b', photo: 'img/chicken-liver.webp' },
    { id: 'sujuk',        name: 'Sujuk',
      desc: {
        en: 'Oven-baked Lebanese bread stuffed with seasoned minced meat, tomato and pickles',
        fr: 'Pain libanais cuit au four, farci de viande hachée épicée, tomate et pickles',
        nl: 'In de oven gebakken Libanees brood gevuld met gekruid gehakt, tomaat en pickles',
      },
      price: 12.50, spice: true,  tags: [], img: 'g9', photo: 'img/sujuk.webp' },
    { id: 'toshka_hot',   name: 'Toshka',
      desc: {
        en: 'Oven-baked Lebanese bread stuffed with minced meat and Syrian cheese',
        fr: 'Pain libanais cuit au four, farci de viande hachée et fromage syrien',
        nl: 'In de oven gebakken Libanees brood gevuld met gehakt en Syrische kaas',
      },
      price: 12.50, spice: false, tags: [], img: 'l2', photo: 'img/sujuk.webp' },
    { id: 'sheikh',       name: 'Oriental Eggplant', name_fr: 'Aubergine orientale', name_nl: 'Oosterse aubergine',
      desc: {
        en: 'Grilled eggplant topped with minced meat cooked with onion, tomato and pepper',
        fr: 'Aubergine grillée garnie de viande hachée cuite avec oignon, tomate et poivron',
        nl: 'Gegrilde aubergine met gehakt, gekookt met ui, tomaat en paprika',
      },
      price: 13.50, spice: false, tags: ['gf'], img: 'g8c', photo: 'img/oriental-eggplant.webp' },
    { id: 'chef_mezze',   name: "Chef\'s Mezze", name_fr: 'Mezze du chef', name_nl: 'Mezze van de chef',
      desc: {
        en: 'Grilled minced meat with mushrooms, onion, lemon tahini sauce and parsley',
        fr: 'Viande hachée grillée aux champignons, oignon, sauce tahini citron et persil',
        nl: 'Gegrild gehakt met champignons, ui, citroen-tahinisaus en peterselie',
      },
      price: 13.50, spice: false, tags: [], img: 'g8b', photo: 'img/mezze-chef.webp' },
  ],
  salads: [
    { id: 'taboule',       name: 'Taboule',
      desc: {
        en: 'Traditional parsley salad with tomatoes, mint, bulgur and lemon dressing',
        fr: 'Salade traditionnelle au persil, tomates, menthe, boulgour et vinaigrette citron',
        nl: 'Traditionele peterseliesalade met tomaat, munt, bulgur en citroendressing',
      },
      price: 8.00, spice: false, tags: ['v'], img: 'sl1', photo: 'img/salad-taboule.webp' },
    { id: 'falafel_salad', name: 'Falafel Salad', name_fr: 'Salade de falafel', name_nl: 'Falafelsalade',
      desc: {
        en: 'Fresh mixed greens with crispy falafel and tahini dressing',
        fr: 'Salade de jeunes pousses, falafels croustillants, sauce tahini',
        nl: 'Verse gemengde sla met krokante falafel en tahinidressing',
      },
      price: 13.50, spice: false, tags: ['v'], img: 'sl2', photo: 'img/falafel-vegan-salad.webp' },
    { id: 'fattoush',      name: 'Fattoush Salad', name_fr: 'Salade fattoush', name_nl: 'Fattoushsalade',
      desc: {
        en: 'Tomatoes, lettuce, red cabbage, radish, cucumber, onion, fried bread with pomegranate molasses',
        fr: 'Tomates, laitue, chou rouge, radis, concombre, oignon, pain frit et mélasse de grenade',
        nl: 'Tomaat, sla, rode kool, radijs, komkommer, ui, gebakken brood met granaatappelmelasse',
      },
      price: 8.00, spice: false, tags: ['v'], img: 'sl3', photo: 'img/salad-fatoush.webp' },
  ],
  lunch: [
    { id: 'mix_break_vegan', name: 'Mix Break Vegan', name_fr: 'Mix Break Végan', name_nl: 'Mix Break Vegan',
      desc: {
        en: 'Hummus, warak eneb, itch (bulgur), cauliflower, fattouch',
        fr: 'Houmous, warak eneb, itch (boulgour), chou-fleur, fattouch',
        nl: 'Hummus, warak eneb, itch (bulgur), bloemkool, fattouch',
      },
      price: 14.50, spice: false, tags: ['v'], img: 'l0', photo: 'img/falafel-plate.webp' },
    { id: 'mix_break',       name: 'Mix Break',
      desc: {
        en: 'Hummus, itch (bulgur), kabab/chich taouk, cauliflower, fattouch',
        fr: 'Houmous, itch (boulgour), kabab/chich taouk, chou-fleur, fattouch',
        nl: 'Hummus, itch (bulgur), kabab/chich taouk, bloemkool, fattouch',
      },
      price: 16.50, spice: false, tags: [], img: 'l8', photo: 'img/mix-grill.webp' },
    { id: 'falafel_plate',   name: 'Falafel', name_fr: 'Falafel', name_nl: 'Falafel',
      desc: {
        en: '4 pieces falafel + hummus, moutabal, Fattoush, tahini sauce, pickles',
        fr: '4 falafels + houmous, moutabal, fattoush, sauce tahini, pickles',
        nl: '4 falafels + hummus, moutabal, fattoush, tahinisaus, pickles',
      },
      price: 18.00, spice: false, tags: ['v'], img: 'l3', photo: 'img/falafel-plate.webp' },
    { id: 'shish_taouk',     name: 'Chich Taouk', name_fr: 'Chich Taouk', name_nl: 'Chich Taouk',
      desc: {
        en: '2 chicken skewers + hummus, itch (bulgur), fattoush, pickles, garlic sauce',
        fr: '2 brochettes de poulet + houmous, itch (boulgour), fattoush, pickles, sauce à l\'ail',
        nl: '2 kippenspiezen + hummus, itch (bulgur), fattoush, pickles, knoflooksaus',
      },
      price: 19.00, spice: false, tags: [], img: 'l7', photo: 'img/shish-taouk.webp' },
    { id: 'mix_grill',       name: 'Mix Grill',
      desc: {
        en: '1 kebab and 1 chich taouk + hummus, itch (bulgur), fattoush',
        fr: '1 kebab et 1 chich taouk + houmous, itch (boulgour), fattoush',
        nl: '1 kebab en 1 chich taouk + hummus, itch (bulgur), fattoush',
      },
      price: 19.00, spice: false, tags: [], img: 'l6', photo: 'img/mix-grill.webp' },
    { id: 'kebab_dish',      name: 'Kebab', name_fr: 'Kebab', name_nl: 'Kebab',
      desc: {
        en: '2 seasoned minced meat skewers + hummus, fattoush',
        fr: '2 brochettes de viande hachée épicée + houmous, fattoush',
        nl: '2 gegrilde gehaktspiezen + hummus, fattoush',
      },
      price: 19.00, spice: false, tags: [], img: 'l1', photo: 'img/kebab-dish.webp' },
    { id: 'sujuk_dish',      name: 'Sujuk', name_fr: 'Sujuk', name_nl: 'Sujuk',
      desc: {
        en: 'Lebanese bread stuffed with minced meat, tomato, pickles + hummus, moutabal, Fattoush',
        fr: 'Pain libanais farci de viande hachée, tomate, pickles + houmous, moutabal, fattoush',
        nl: 'Libanees brood gevuld met gehakt, tomaat, pickles + hummus, moutabal, fattoush',
      },
      price: 20.80, spice: true,  tags: [], img: 'l4', photo: 'img/sujuk.webp' },
    { id: 'toshka',          name: 'Toshka',
      desc: {
        en: 'Lebanese bread stuffed with minced meat and Syrian cheese + hummus, moutabal, Fattoush',
        fr: 'Pain libanais farci de viande hachée et fromage syrien + houmous, moutabal, fattoush',
        nl: 'Libanees brood gevuld met gehakt en Syrische kaas + hummus, moutabal, fattoush',
      },
      price: 20.80, spice: false, tags: [], img: 'l2', photo: 'img/sujuk.webp' },
    { id: 'chefs_dish',      name: "Chef\'s Dish", name_fr: 'Plat du chef', name_nl: 'Gerecht van de chef',
      desc: {
        en: '1 kebab, 1 chich taouk, warak eneb, kibbeh, cauliflower, muhammara, fattouch',
        fr: '1 kebab, 1 chich taouk, warak eneb, kibbeh, chou-fleur, muhammara, fattouch',
        nl: '1 kebab, 1 chich taouk, warak eneb, kibbeh, bloemkool, muhammara, fattouch',
      },
      price: 23.50, spice: false, tags: [], img: 'l5', photo: 'img/chefs-dish.webp' },
  ],
  sandwiches: [
    { id: 'sw_taouk', name: 'Shish Taouk Sandwich', name_fr: 'Sandwich Shish Taouk', name_nl: 'Shish Taouk sandwich',
      desc: {
        en: 'Grilled marinated chicken breast in pita with garlic sauce and vegetables',
        fr: 'Blanc de poulet mariné grillé en pita, sauce à l\'ail et légumes',
        nl: 'Gegrilde gemarineerde kipfilet in pita met knoflooksaus en groenten',
      },
      price: 7.00, spice: false, tags: [], img: 'sw1' },
    { id: 'sw_hummus', name: 'Hummus Sandwich', name_fr: 'Sandwich houmous', name_nl: 'Hummussandwich',
      desc: {
        en: 'Fresh pita bread filled with creamy hummus, vegetables and herbs',
        fr: 'Pita frais garni de houmous crémeux, légumes et herbes',
        nl: 'Verse pita gevuld met romige hummus, groenten en kruiden',
      },
      price: 6.50, spice: false, tags: ['v'], img: 'sw2' },
    { id: 'sw_kebab', name: 'Kebab Sandwich', name_fr: 'Sandwich kebab', name_nl: 'Kebabsandwich',
      desc: {
        en: 'Grilled kebab meat in pita with garlic sauce and fresh vegetables',
        fr: 'Viande de kebab grillée en pita, sauce à l\'ail et légumes frais',
        nl: 'Gegrild kebabvlees in pita met knoflooksaus en verse groenten',
      },
      price: 7.00, spice: false, tags: [], img: 'sw3' },
    { id: 'sw_toshka', name: 'Toshka Sandwich', name_fr: 'Sandwich Toshka', name_nl: 'Toshka sandwich',
      desc: {
        en: 'Traditional spiced meat sandwich with yogurt sauce and vegetables',
        fr: 'Sandwich traditionnel à la viande épicée, sauce yaourt et légumes',
        nl: 'Traditionele gekruide vleessandwich met yoghurtsaus en groenten',
      },
      price: 7.00, spice: false, tags: [], img: 'sw4' },
    { id: 'sw_falafel', name: 'Falafel Sandwich', name_fr: 'Sandwich falafel', name_nl: 'Falafelsandwich',
      desc: {
        en: 'Crispy falafel balls in pita with tahini sauce, salad and pickles',
        fr: 'Boulettes de falafel croustillantes en pita, sauce tahini, salade et pickles',
        nl: 'Krokante falafelballetjes in pita met tahinisaus, salade en pickles',
      },
      price: 7.00, spice: false, tags: ['v'], img: 'sw5' },
    { id: 'sw_moutabal', name: 'Moutabal Sandwich', name_fr: 'Sandwich moutabal', name_nl: 'Moutabalsandwich',
      desc: {
        en: 'Smoky grilled eggplant dip with tahini in fresh pita bread',
        fr: 'Caviar d\'aubergine grillée fumée au tahini dans un pita frais',
        nl: 'Gerookte gegrilde auberginedip met tahini in verse pita',
      },
      price: 6.50, spice: false, tags: ['v'], img: 'sw6' },
    { id: 'sw_cheese', name: 'Cheese Sandwich', name_fr: 'Sandwich au fromage', name_nl: 'Kaassandwich',
      desc: {
        en: 'Grilled cheese with Mediterranean herbs in crispy pita bread',
        fr: 'Fromage grillé aux herbes méditerranéennes en pita croustillant',
        nl: 'Geroosterde kaas met mediterrane kruiden in krokante pita',
      },
      price: 6.50, spice: false, tags: [], img: 'sw7' },
  ],
  desserts: [
    { id: 'aish_saraya', name: 'Aish el Saraya',
      desc: {
        en: 'Sweetened biscuit, vegan pudding, orange blossom water and pistachio',
        fr: 'Biscuit sucré, pudding végan, eau de fleur d\'oranger et pistache',
        nl: 'Gezoete koek, vegan pudding, oranjebloesemwater en pistache',
      },
      price: 3.50, spice: false, tags: ['v'], img: 'dt1', photo: 'img/aish-el-saraya.webp' },
  ],
  drinks: [
    { id: 'leffe_blonde', name: 'Leffe Blonde Beer 33cl', name_fr: 'Bière Leffe Blonde 33cl', name_nl: 'Leffe Blond 33cl',
      desc: { en: 'Leffe Blonde Beer 33cl', fr: 'Bière Leffe Blonde 33cl', nl: 'Leffe Blond bier 33cl' },
      price: 5.00, spice: false, tags: [], img: 'd_b4', photo: 'img/drink-leffe-blonde.webp' },
    { id: 'leffe_00',     name: 'Leffe Alcohol Free 33cl', name_fr: 'Leffe sans alcool 33cl', name_nl: 'Leffe Alcoholvrij 33cl',
      desc: { en: 'Leffe Alcohol Free 33cl', fr: 'Bière Leffe sans alcool 33cl', nl: 'Leffe alcoholvrij bier 33cl' },
      price: 5.00, spice: false, tags: [], img: 'd_b2', photo: 'img/drink-leffe-00.webp' },
    { id: 'leffe_kriek',  name: 'Cherry Beer', name_fr: 'Bière à la cerise', name_nl: 'Kriekbier',
      desc: { en: 'Cherry Beer', fr: 'Bière à la cerise', nl: 'Kriekbier' },
      price: 5.00, spice: false, tags: [], img: 'd_b3', photo: 'img/drink-leffe-kriek.webp' },
    { id: 'leffe_brune',  name: 'Leffe Brown Beer 33cl', name_fr: 'Leffe brune 33cl', name_nl: 'Leffe Bruin 33cl',
      desc: { en: 'Leffe Brown Beer 33cl', fr: 'Bière Leffe brune 33cl', nl: 'Leffe bruin bier 33cl' },
      price: 5.00, spice: false, tags: [], img: 'd_b5', photo: 'img/drink-leffe-brune.webp' },
    { id: 'hoegaarden',   name: 'Hoegaarden White Beer', name_fr: 'Hoegaarden blanche', name_nl: 'Hoegaarden witbier',
      desc: { en: 'Belgian wheat beer', fr: 'Bière blanche belge', nl: 'Belgisch witbier' },
      price: 4.50, spice: false, tags: [], img: 'd_b6', photo: 'img/drink-hoegaarden.webp' },
    { id: 'jupiler',      name: 'Jupiler Beer', name_fr: 'Bière Jupiler', name_nl: 'Jupiler bier',
      desc: { en: 'Belgian lager', fr: 'Lager belge', nl: 'Belgische pils' },
      price: 3.50, spice: false, tags: [], img: 'd_b7', photo: 'img/drink-jupiler.webp' },
    { id: 'leb_beer',     name: 'Lebanese Beer', name_fr: 'Bière libanaise', name_nl: 'Libanees bier',
      desc: { en: 'Lebanese lager', fr: 'Lager libanaise', nl: 'Libanese pils' },
      price: 5.00, spice: false, tags: [], img: 'd_b8', photo: 'img/drink-lebanese-beer.webp' },
    { id: 'wine_prieure', name: 'Le Prieuré',
      desc: { en: 'Lebanese red wine — bottle', fr: 'Vin rouge libanais — bouteille', nl: 'Libanese rode wijn — fles' },
      price: 29.00, spice: false, tags: [], img: 'd_w3' },
    { id: 'wine_reserve', name: 'Réserve du Couvent',
      desc: { en: 'Lebanese red wine — bottle', fr: 'Vin rouge libanais — bouteille', nl: 'Libanese rode wijn — fles' },
      price: 33.00, spice: false, tags: [], img: 'd_w4' },
    { id: 'wine_bret_red', name: 'Bretèche Red',
      desc: { en: 'Lebanese red wine — bottle', fr: 'Vin rouge libanais — bouteille', nl: 'Libanese rode wijn — fles' },
      price: 36.00, spice: false, tags: [], img: 'd_w5' },
    { id: 'ksara',        name: 'Blanc de l\'Observatoire',
      desc: { en: 'Lebanese white wine — bottle', fr: 'Vin blanc libanais — bouteille', nl: 'Libanese witte wijn — fles' },
      price: 29.00, spice: false, tags: [], img: 'd_w2', photo: 'img/drink-ksara.webp' },
    { id: 'wine_blanc_blancs', name: 'Blanc de Blancs',
      desc: { en: 'Lebanese white wine — bottle', fr: 'Vin blanc libanais — bouteille', nl: 'Libanese witte wijn — fles' },
      price: 36.00, spice: false, tags: [], img: 'd_w6' },
    { id: 'wine_bret_white', name: 'Bretèche White',
      desc: { en: 'Lebanese white wine — bottle', fr: 'Vin blanc libanais — bouteille', nl: 'Libanese witte wijn — fles' },
      price: 36.00, spice: false, tags: [], img: 'd_w7' },
    { id: 'wine_ksara_rose', name: 'Château Ksara Rosé',
      desc: { en: 'Lebanese rosé wine — bottle', fr: 'Vin rosé libanais — bouteille', nl: 'Libanese roséwijn — fles' },
      price: 30.00, spice: false, tags: [], img: 'd_w8' },
    { id: 'rose_damascus', name: 'Rose Damascus',
      desc: { en: 'Rose (glass)', fr: 'Rosé (verre)', nl: 'Rosé (glas)' },
      price: 5.00, spice: false, tags: [], img: 'd_r1', photo: 'img/drink-rose-damascus.webp' },
    { id: 'coke',         name: 'Coca-Cola',
      desc: { en: 'Soft drink', fr: 'Boisson gazeuse', nl: 'Frisdrank' },
      price: 3.50, spice: false, tags: [], img: 'd_s1' },
    { id: 'coke_zero',    name: 'Coca-Cola Zero',
      desc: { en: 'Sugar-free soft drink', fr: 'Boisson gazeuse sans sucre', nl: 'Suikervrije frisdrank' },
      price: 3.50, spice: false, tags: [], img: 'd_s2' },
    { id: 'sprite',       name: 'Sprite',
      desc: { en: 'Lemon-lime soft drink', fr: 'Boisson gazeuse citron-lime', nl: 'Citroen-limoenfrisdrank' },
      price: 3.50, spice: false, tags: [], img: 'd_s3' },
    { id: 'fanta',        name: 'Fanta Orange',
      desc: { en: 'Orange soft drink', fr: 'Boisson gazeuse à l\'orange', nl: 'Sinaasappelfrisdrank' },
      price: 3.50, spice: false, tags: [], img: 'd_s4' },
    { id: 'schweppes_agrumes', name: 'Schweppes Agrumes',
      desc: { en: 'Citrus sparkling drink', fr: 'Boisson pétillante aux agrumes', nl: 'Citrusbruisdrank' },
      price: 4.00, spice: false, tags: [], img: 'd_s5' },
    { id: 'schweppes_mojito', name: 'Schweppes Virgin Mojito',
      desc: { en: 'Non-alcoholic mojito sparkling drink', fr: 'Mojito sans alcool pétillant', nl: 'Mojito-bruisdrank zonder alcohol' },
      price: 4.00, spice: false, tags: [], img: 'd_s6' },
    { id: 'indian_tonic', name: 'Schweppes Indian Tonic',
      desc: { en: 'Tonic water', fr: 'Eau tonique', nl: 'Tonic water' },
      price: 4.00, spice: false, tags: [], img: 'd_t1', photo: 'img/drink-indian-tonic.webp' },
    { id: 'spa',          name: 'Water Spa', name_fr: 'Eau Spa', name_nl: 'Spa water',
      desc: { en: 'Still water', fr: 'Eau plate', nl: 'Plat water' },
      price: 3.50, spice: false, tags: ['gf'], img: 'd_w1', photo: 'img/drink-spa.webp' },
    { id: 'ayran',        name: 'Ayran',
      desc: { en: 'Traditional yogurt drink', fr: 'Boisson au yaourt traditionnelle', nl: 'Traditionele yoghurtdrank' },
      price: 3.50, spice: false, tags: ['gf'], img: 'd_a1', photo: 'img/drink-ayran.webp' },
  ],
};

const CATEGORIES = [
  { id: 'sets',     name_key: 'ord_cat_sets',     swatch: ['#3F7841', '#1F5C2E'] },
  { id: 'lunch',    name_key: 'ord_cat_lunch',    swatch: ['#D9A93A', '#A37B22'], photo: 'img/mix-grill.webp' },
  { id: 'mezze',    name_key: 'ord_cat_mezze',    swatch: ['#C2B484', '#9C8B5E'] },
  { id: 'salads',   name_key: 'ord_cat_salads',   swatch: ['#9CAF77', '#5A6A3F'] },
  { id: 'hot',      name_key: 'ord_cat_hot',      swatch: ['#C66B3C', '#8B4523'], photo: 'img/batata-hara.webp' },
  { id: 'sandwiches', name_key: 'ord_cat_sandwiches', swatch: ['#C68B3F', '#7E5520'], photo: 'img/cheese-veget.webp' },
  { id: 'desserts', name_key: 'ord_cat_desserts', swatch: ['#D4A65A', '#8E6126'] },
  { id: 'drinks',   name_key: 'ord_cat_drinks',   swatch: ['#5A6A3F', '#3D4828'] },
];

// Signature dishes (subset for home page)
const SIGNATURE_IDS = ['menu_eaw', 'kebab_dish', 'chefs_dish', 'mousaka', 'foul'];

// ─────────────────────────────────────────────────────────────
// i18n helpers for menu data
// ─────────────────────────────────────────────────────────────
function dishName(d, lang) {
  if (!d) return '';
  const k = 'name_' + lang;
  return d[k] || d.name;
}

function dishDesc(d, lang) {
  if (!d || !d.desc) return '';
  return d.desc[lang] || d.desc.en || '';
}

// Mock active order
const MOCK_ACTIVE_ORDER = null; // null when no active order

// Mock past orders
const MOCK_PAST_ORDERS = [
  { id: 'EW-3401', date: '2026-05-09', total: 47.50, items: [{ id: 'hummus', qty: 1 }, { id: 'taouk', qty: 1 }, { id: 'baklava', qty: 2 }] },
  { id: 'EW-3287', date: '2026-04-22', total: 64.00, items: [{ id: 'mixed', qty: 1 }, { id: 'tabbouleh', qty: 1 }, { id: 'jallab', qty: 2 }] },
  { id: 'EW-3104', date: '2026-03-30', total: 32.00, items: [{ id: 'falafel', qty: 1 }, { id: 'fattoush', qty: 1 }, { id: 'lemon', qty: 1 }] },
];

const MOCK_PAST_RESERVATIONS = [
  { id: 'R-892', date: '2026-04-14', time: '20:00', party: 4, occasion: 'birthday' },
  { id: 'R-855', date: '2026-02-08', time: '13:00', party: 2, occasion: 'none' },
  { id: 'R-803', date: '2025-12-22', time: '19:30', party: 6, occasion: 'business' },
];

// Generate available time slots for a date (30-min granularity)
function timeSlots(dateStr, mealId) {
  // Parse YYYY-MM-DD safely without TZ surprises
  const [yy, mm, dd] = dateStr.split('-').map(Number);
  const date = new Date(yy, (mm || 1) - 1, dd || 1);
  const dow = date.getDay(); // 0 = Sunday, 6 = Saturday

  // Sunday: closed
  if (dow === 0) return [];
  // Saturday: dinner only — no lunch service
  if (dow === 6 && mealId === 'lunch') return [];

  // Lunch 12:00 – 14:00 (last reservation 14:00)
  const lunch = ['12:00','12:30','13:00','13:30','14:00'];
  // Dinner 18:00 – 22:00 (last reservation 22:00)
  const dinner = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'];
  const all = mealId === 'lunch' ? lunch : dinner;

  // Pseudo-randomly mark some slots as taken, seeded by the date
  const seed = yy + mm + dd;
  return all.map((t, i) => ({
    time: t,
    available: ((seed * 9301 + i * 49297) % 10) > 2,
  }));
}

// Date helpers
function monthDays(year, month) {
  const first = new Date(year, month, 1);
  const days = [];
  const startDay = (first.getDay() + 6) % 7; // Monday-start
  for (let i = 0; i < startDay; i++) days.push(null);
  const last = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= last; d++) days.push(new Date(year, month, d));
  return days;
}

function _localeFor(lang) {
  return lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB';
}

function fmtMonth(date, lang) {
  return date.toLocaleDateString(_localeFor(lang), { month: 'long', year: 'numeric' });
}

function fmtFullDate(date, lang) {
  return date.toLocaleDateString(_localeFor(lang), {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

Object.assign(window, {
  MENU, CATEGORIES, SIGNATURE_IDS,
  MOCK_ACTIVE_ORDER, MOCK_PAST_ORDERS, MOCK_PAST_RESERVATIONS,
  timeSlots, monthDays, fmtMonth, fmtFullDate, isSameDay,
  dishName, dishDesc, _localeFor,
});
