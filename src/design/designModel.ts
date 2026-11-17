// Shared design model for the Design Studio and booking form.
//
// Teeth are numbered 1-14 left to right on each arch (as you look at the customer):
// 1-2 molars, 3-4 premolars, 5 canine, 6 lateral, 7-8 centrals, 9 lateral, 10 canine, 11-12 premolars, 13-14 molars.

/** Price-list tiers. Every other combination is quoted by Jeremy. */
export type Material = 'silver-moissanite' | 'silver-lab-diamond' | 'silver-plain' | '10k-gold' | '14k-gold' | '14k-white-gold' | 'script';
export type Metal = 'silver' | 'npg' | '10k' | '14k' | '18k' | '22k' | '24k';
export type GoldColor = 'yellow' | 'white' | 'rose';
/** 'natural-diamond' is SI clarity; 'natural-vs' is VS clarity. */
export type Stone = 'moissanite' | 'lab-diamond' | 'natural-diamond' | 'natural-vs';
export type StoneStyle = 'honeycomb' | 'honeymoon' | 'jumbo' | 'galaxy' | 'emerald' | 'mosaic' | 'hybrid' | 'gallery' | 'invisible' | 'other';
export type AddOn = 'rose-cuts' | 'starburst-cuts' | 'speciality-cut' | 'laser-design' | 'diamond-dust' | '3d-design';
export type FreeStyle = 'solid' | 'open-face' | 'perm-cut' | 'diamond-cuts' | 'nugget-cut' | 'script';
export type ToothKind = 'molar' | 'premolar' | 'canine' | 'lateral' | 'central';
export type MetalShades = [string, string, string];

export interface GrillzDesign {
  metal: Metal;
  /** Only used for gold. */
  color: GoldColor;
  stones: boolean;
  stone: Stone;
  stoneStyle: StoneStyle;
  baseStyle: FreeStyle;
  addons: AddOn[];
  top: number[];
  bottom: number[];
  /** What the customer wants on specific teeth, keyed by `toothKey` (e.g. "top-7"). */
  toothNotes: Record<string, string>;
  notes: string;
}

export interface StudioDesign {
  grillz: GrillzDesign;
}

export const METALS: { id: Metal; name: string }[] = [
  { id: 'silver', name: '925 Silver' },
  { id: 'npg', name: 'NPG (Dental Gold)' },
  { id: '10k', name: '10K Gold' },
  { id: '14k', name: '14K Gold' },
  { id: '18k', name: '18K Gold' },
  { id: '22k', name: '22K Gold' },
  { id: '24k', name: '24K Gold' },
];

export const GOLD_COLORS: { id: GoldColor; name: string; metal: MetalShades }[] = [
  { id: 'yellow', name: 'Yellow', metal: ['#fde7a3', '#e2b23f', '#a1761b'] },
  { id: 'white', name: 'White', metal: ['#ffffff', '#dcdfe4', '#969ea9'] },
  { id: 'rose', name: 'Rose', metal: ['#f9d4c4', '#d9947a', '#9a5a45'] },
];

/** Every metal can be finished in any color. */
export const goldColorsFor = (_metal: Metal) => GOLD_COLORS;

/** Switches metal, keeping the chosen color. */
export const withMetal = (g: Pick<GrillzDesign, 'color'>, metal: Metal): Pick<GrillzDesign, 'metal' | 'color'> =>
  ({ metal, color: g.color });

const SILVER_SHADES: MetalShades = ['#f5f6f8', '#c4c9d0', '#7b828c'];

export const STONES: { id: Stone; name: string }[] = [
  { id: 'moissanite', name: 'Moissanite' },
  { id: 'lab-diamond', name: 'Lab Diamond' },
  { id: 'natural-diamond', name: 'Natural Diamond (SI)' },
  { id: 'natural-vs', name: 'Natural Diamond (VS)' },
];

/** Standard sets (the price list prices) come in these settings. */
export const STANDARD_STYLES: StoneStyle[] = ['honeymoon', 'honeycomb', 'jumbo', 'galaxy', 'mosaic'];

export const STONE_STYLES: { id: StoneStyle; name: string }[] = [
  { id: 'honeycomb', name: 'Honeycomb' },
  { id: 'honeymoon', name: 'Honeymoon' },
  { id: 'jumbo', name: 'Jumbo' },
  { id: 'galaxy', name: 'Galaxy' },
  { id: 'emerald', name: 'Emerald' },
  { id: 'mosaic', name: 'Mosaic' },
  { id: 'hybrid', name: 'Hybrid' },
  { id: 'gallery', name: 'Gallery' },
  { id: 'invisible', name: 'Invisible Set' },
  { id: 'other', name: 'Other' },
];

export const FREE_STYLES: { id: FreeStyle; name: string }[] = [
  { id: 'solid', name: 'Solid' },
  { id: 'perm-cut', name: 'Perm Cut' },
  { id: 'open-face', name: 'Open Face' },
  { id: 'diamond-cuts', name: 'Diamond Cuts' },
  { id: 'nugget-cut', name: 'Nugget Cut' },
  // Not free: Script has its own price-list tier ($690 for 8 on 8 in silver)
  { id: 'script', name: 'Script' },
];

export const PREMIUM_ADDONS: { id: AddOn; name: string; price: number; suffix?: string }[] = [
  { id: 'diamond-dust', name: 'Diamond Dust', price: 5 },
  { id: 'rose-cuts', name: 'Rose Cuts', price: 7 },
  { id: 'starburst-cuts', name: 'Starburst Cuts', price: 7 },
  { id: 'speciality-cut', name: 'Speciality Open Face', price: 20 },
  { id: 'laser-design', name: 'Laser Design', price: 25 },
  { id: '3d-design', name: '3D Design', price: 85, suffix: 'and up' },
];

export const TOOTH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export const toothKey = (isTop: boolean, n: number) => `${isTop ? 'top' : 'bottom'}-${n}`;
/** Short code Jeremy uses to tell the arches apart, e.g. "T7" (top) or "B7" (bottom). */
export const toothCode = (isTop: boolean, n: number) => `${isTop ? 'T' : 'B'}${n}`;
export const toothLabel = (isTop: boolean, n: number) => `${isTop ? 'Top' : 'Bottom'} ${toothCode(isTop, n)}`;

/** Tooth notes for covered teeth, top arch first, in tooth order. */
export const toothNoteList = (g: GrillzDesign) =>
  [true, false].flatMap(isTop =>
    [...(isTop ? g.top : g.bottom)].sort((a, b) => a - b)
      .map(n => ({ isTop, n, label: toothLabel(isTop, n), note: (g.toothNotes[toothKey(isTop, n)] || '').trim() }))
      .filter(t => t.note),
  );

export const toothKind = (n: number): ToothKind => {
  const d = n <= 7 ? 7 - n : n - 8; // 0 = central
  return (['central', 'lateral', 'canine', 'premolar', 'premolar', 'molar', 'molar'] as ToothKind[])[d];
};

export const KIND_LABEL: Record<ToothKind, string> = { central: 'Central', lateral: 'Lateral', canine: 'Canine', premolar: 'Premolar', molar: 'Molar' };

/** The front `count` teeth of an arch, centred on 7 and 8 (6 = canine to canine). */
export const presetTeeth = (count: number) => {
  const start = 8 - count / 2;
  return Array.from({ length: count }, (_, i) => start + i);
};

// ---------------------------------------------------------------- Price list
// All prices are for complete sets. Every combination not listed is quoted by Jeremy.

/** Plain grillz sizes are total teeth. */
export const PLAIN_SIZES = [4, 6, 8, 10];
export const PLAIN_PRICES: { metal: Metal; label: string; prices: number[] }[] = [
  { metal: 'silver', label: 'Silver', prices: [240, 240, 320, 400] },
  { metal: 'npg', label: 'NPG (Dental Gold)', prices: [220, 225, 300, 375] },
  { metal: '10k', label: '10K Gold', prices: [420, 570, 760, 950] },
  { metal: '14k', label: '14K Gold', prices: [520, 690, 920, 1150] },
  { metal: '18k', label: '18K Gold', prices: [900, 1350, 1800, 2250] },
  { metal: '22k', label: '22K Gold', prices: [1050, 1550, 2100, 2600] },
];

/** Iced grillz sizes: 6 on 6, 8 on 8 and 10 on 10 (total teeth). */
export const ICED_SIZES = [12, 16, 20];
export const ICED_SIZE_LABELS = ['6 on 6', '8 on 8', '10 on 10'];

type IcedCategory = 'standard-moissanite' | 'standard-lab' | 'invisible-moissanite' | 'si' | 'vs' | 'invisible-lab' | 'invisible-si';
export const ICED_PRICES: { id: IcedCategory; label: string; note?: string; rows: { metal: Metal; prices: number[] }[] }[] = [
  { id: 'standard-moissanite', label: 'Standard Moissanite', rows: [{ metal: 'silver', prices: [1175, 1550, 1900] }] },
  { id: 'standard-lab', label: 'Standard Lab Diamond', rows: [{ metal: 'silver', prices: [1900, 2550, 3180] }] },
  { id: 'invisible-moissanite', label: 'Silver Invisible Set Moissanite', rows: [{ metal: 'silver', prices: [2400, 3150, 3900] }] },
  {
    id: 'si', label: 'SI', note: 'Natural', rows: [
      { metal: 'silver', prices: [5300, 6500, 8200] },
      { metal: '10k', prices: [6140, 8120, 9600] },
      { metal: '14k', prices: [7240, 8920, 11100] },
      { metal: '18k', prices: [7960, 9880, 12300] },
      { metal: '22k', prices: [9520, 12460, 15400] },
    ],
  },
  {
    id: 'vs', label: 'VS', note: 'Natural', rows: [
      { metal: 'silver', prices: [6500, 8600, 10200] },
      { metal: '10k', prices: [7840, 9720, 12100] },
      { metal: '14k', prices: [8560, 11180, 13300] },
      { metal: '18k', prices: [9520, 12460, 15400] },
      { metal: '22k', prices: [10740, 13420, 16600] },
    ],
  },
  {
    id: 'invisible-lab', label: 'Invisible Set CVD', note: 'Lab', rows: [
      { metal: 'silver', prices: [3850, 5000, 6200] },
      { metal: '10k', prices: [6200, 8600, 10200] },
      { metal: '14k', prices: [7100, 9800, 12200] },
      { metal: '18k', prices: [8000, 11500, 13700] },
      { metal: '22k', prices: [8900, 12700, 15700] },
    ],
  },
  {
    id: 'invisible-si', label: 'Invisible Set SI', note: 'Natural', rows: [
      { metal: 'silver', prices: [7600, 9400, 11700] },
      { metal: '10k', prices: [9100, 11900, 14200] },
      { metal: '14k', prices: [10000, 13100, 16200] },
      { metal: '18k', prices: [11400, 14300, 17700] },
      { metal: '22k', prices: [12300, 16000, 19200] },
    ],
  },
];

/** Script is its own tier: $690 for 8 on 8 in silver. */
const SCRIPT_PRICE = 690;

interface PriceList {
  sizes: number[];
  prices: number[];
  /** Quote sets smaller than the smallest listed size. */
  quoteBelow?: boolean;
  /** Only the listed sizes have a price. */
  exactOnly?: boolean;
}

const ICED_CATEGORY: Record<string, IcedCategory> = {
  'moissanite': 'standard-moissanite',
  'lab-diamond': 'standard-lab',
  'natural-diamond': 'si',
  'natural-vs': 'vs',
  'invisible:moissanite': 'invisible-moissanite',
  'invisible:lab-diamond': 'invisible-lab',
  'invisible:natural-diamond': 'invisible-si',
};

/** The price-list row for this design, or null when it's quoted at consultation. */
export function priceList(g: Pick<GrillzDesign, 'metal' | 'stones' | 'stone' | 'stoneStyle' | 'baseStyle'>): PriceList | null {
  if (g.stones) {
    const id = ICED_CATEGORY[g.stoneStyle === 'invisible' ? `invisible:${g.stone}` : g.stone];
    const row = ICED_PRICES.find(c => c.id === id)?.rows.find(r => r.metal === g.metal);
    return row ? { sizes: ICED_SIZES, prices: row.prices } : null;
  }
  if (g.baseStyle === 'script') return g.metal === 'silver' ? { sizes: [16], prices: [SCRIPT_PRICE], exactOnly: true } : null;
  const row = PLAIN_PRICES.find(r => r.metal === g.metal);
  return row ? { sizes: PLAIN_SIZES, prices: row.prices, quoteBelow: true } : null;
}

/**
 * Set price for `count` teeth. Listed sizes use the listed price; in-between sizes use the
 * smaller set's per-tooth rate (never more than the next set up); bigger or smaller sets use
 * the nearest set's per-tooth rate.
 */
export function setPrice(list: PriceList, count: number): number | null {
  if (count === 0) return 0;
  const { sizes, prices } = list;
  const exact = sizes.indexOf(count);
  if (exact >= 0) return prices[exact];
  if (list.exactOnly || (list.quoteBelow && count < sizes[0])) return null;
  const perTooth = (i: number) => Math.round(prices[i] / sizes[i]);
  const lower = sizes.reduce((found, size, i) => (size < count ? i : found), 0);
  const upper = sizes.findIndex(size => size > count);
  const prorated = perTooth(lower) * count;
  return upper > lower ? Math.min(prorated, prices[upper]) : prorated;
}

/** Smallest listed set price for this combination, or null when it's quoted. */
export function startingPrice(g: Pick<GrillzDesign, 'metal' | 'stones' | 'stone'> & Partial<Pick<GrillzDesign, 'stoneStyle' | 'baseStyle'>>): number | null {
  const list = priceList({ stoneStyle: 'honeycomb', baseStyle: 'solid', ...g });
  return list ? list.prices[0] : null;
}

/** Note for settings outside the standard sets, e.g. Gallery. */
export function settingNote(g: Pick<GrillzDesign, 'stones' | 'stoneStyle'>): string | null {
  if (!g.stones || g.stoneStyle === 'invisible' || STANDARD_STYLES.includes(g.stoneStyle)) return null;
  return g.stoneStyle === 'other'
    ? 'Custom setting: additional charges may apply'
    : `${stoneStyleName(g.stoneStyle)} setting: additional charges may apply`;
}

export const addonsPrice = (addons: string[], count: number) =>
  addons.reduce((sum, id) => sum + (PREMIUM_ADDONS.find(a => a.id === id)?.price || 0) * count, 0);

/** Metal, colour and stones matching one of the booking form's metal choices. */
export function grillzFromMaterial(material: string): Pick<GrillzDesign, 'metal' | 'color' | 'stones' | 'stone'> {
  const base = { color: 'yellow' as GoldColor, stones: false, stone: 'moissanite' as Stone };
  if (material === 'silver-plain') return { ...base, metal: 'silver', color: 'white' };
  if (material === 'silver-moissanite') return { ...base, metal: 'silver', color: 'white', stones: true };
  if (material === 'silver-lab-diamond') return { ...base, metal: 'silver', color: 'white', stones: true, stone: 'lab-diamond' };
  if (material === '10k-gold') return { ...base, metal: '10k' };
  if (material === '14k-white-gold') return { ...base, metal: '14k', color: 'white' };
  if (material === '18k-natural') return { ...base, metal: '18k', stones: true, stone: 'natural-diamond' };
  return { ...base, metal: '14k' };
}

export function grillzEstimate(g: GrillzDesign) {
  const count = g.top.length + g.bottom.length;
  const list = priceList(g);
  const base = list ? setPrice(list, count) : null;
  const addons = addonsPrice(g.addons, count);
  return { count, base, addons, total: base === null ? null : base + addons, note: settingNote(g) };
}

export const metalShades = (g: GrillzDesign): MetalShades =>
  g.metal === 'silver' && g.color === 'white' ? SILVER_SHADES : (GOLD_COLORS.find(c => c.id === g.color) || GOLD_COLORS[0]).metal;

/** E.g. "14K Rose Gold", "925 Silver" or "925 Silver (Yellow)". */
export function grillzMetalName(g: Pick<GrillzDesign, 'metal' | 'color'>) {
  const color = GOLD_COLORS.find(c => c.id === g.color)?.name || '';
  if (g.metal === 'silver') return g.color === 'white' ? '925 Silver' : `925 Silver (${color})`;
  return `${g.metal.toUpperCase()} ${color} Gold`;
}

/** E.g. "Moissanite, Honeycomb setting" or "No stones". */
export function grillzStoneName(g: GrillzDesign) {
  if (!g.stones) return 'No stones';
  if (g.stoneStyle === 'other') return `${stoneName(g.stone)}, custom setting (see notes)`;
  return `${stoneName(g.stone)}, ${stoneStyleName(g.stoneStyle)} setting`;
}

export const stoneName = (id: string) => STONES.find(s => s.id === id)?.name || id;
export const stoneStyleName = (id: string) => STONE_STYLES.find(s => s.id === id)?.name || id;
export const styleName = (id: string) => FREE_STYLES.find(s => s.id === id)?.name || id;
export const addonName = (id: string) => PREMIUM_ADDONS.find(a => a.id === id)?.name || id;

// ---------------------------------------------------------------- Defaults

export const DEFAULT_DESIGN: StudioDesign = {
  grillz: {
    metal: '14k',
    color: 'yellow',
    stones: false,
    stone: 'moissanite',
    stoneStyle: 'honeycomb',
    baseStyle: 'perm-cut',
    addons: [],
    top: presetTeeth(6),
    bottom: [],
    toothNotes: {},
    notes: '',
  },
};

// ---------------------------------------------------------------- Summaries

const listTeeth = (teeth: number[], isTop: boolean) =>
  teeth.length ? `${teeth.length} ${isTop ? 'top' : 'bottom'} (${[...teeth].sort((a, b) => a - b).map(n => toothCode(isTop, n)).join(', ')})` : '';

/** Plain-text summary of the design, sent to Jeremy with the booking. */
export function designSummary(design: StudioDesign) {
  const g = design.grillz;
  const est = grillzEstimate(g);
  const arches = [listTeeth(g.top, true), listTeeth(g.bottom, false)].filter(Boolean).join(' + ');
  const addons = g.addons.map(addonName).join(', ');
  return [
    `Grillz: ${arches || 'no teeth selected'}.`,
    `Metal: ${grillzMetalName(g)}. Stones: ${grillzStoneName(g)}.`,
    !g.stones && `Style: ${styleName(g.baseStyle)}.`,
    addons && `Add-ons: ${addons}.`,
    ...toothNoteList(g).map(t => `${t.label}: ${t.note}`),
    g.notes && `Notes: ${g.notes}`,
    est.total === null ? 'Estimate: quoted at consultation.' : `Estimate: $${est.total.toLocaleString()}${est.note ? ` (${est.note})` : ''}.`,
  ].filter(Boolean).join('\n');
}

// ---------------------------------------------------------------- Saving & sharing

const STORAGE_KEY = 'jawz_studio_design';
const SHARE_PARAM = 'design';

const isDesign = (value: any): value is StudioDesign =>
  value && value.grillz && Array.isArray(value.grillz.top);

// Older saved designs may carry fields that no longer exist (jewelry, per-tooth jewels,
// a single `material`); those are converted or dropped so the design still opens.
const withDefaults = (d: StudioDesign): StudioDesign => {
  const { material, topDesigns, bottomDesigns, ...grillz } = d.grillz as GrillzDesign & { material?: string; topDesigns?: unknown; bottomDesigns?: unknown };
  return {
    grillz: {
      ...DEFAULT_DESIGN.grillz,
      ...(material && !('metal' in grillz) ? grillzFromMaterial(material) : {}),
      ...grillz,
    },
  };
};

export function loadSavedDesign(): StudioDesign {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (isDesign(saved)) return withDefaults(saved);
  } catch {
    // ignore unreadable saved designs
  }
  return DEFAULT_DESIGN;
}

export function saveDesign(design: StudioDesign) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(design));
  } catch {
    // storage may be full or disabled; the design still works for this visit
  }
}

const toBase64Url = (text: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromBase64Url = (code: string) => {
  const bin = atob(code.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
};

/** Link that opens the Design Studio with this exact design. */
export function designShareUrl(design: StudioDesign) {
  const payload = { grillz: design.grillz };
  return `${window.location.origin}/#${SHARE_PARAM}=${toBase64Url(JSON.stringify(payload))}`;
}

/** Reads a shared design from the page address, if there is one. */
export function readSharedDesign(): StudioDesign | null {
  const match = window.location.hash.match(new RegExp(`${SHARE_PARAM}=([A-Za-z0-9_-]+)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(match[1]));
    const design = withDefaults({ ...DEFAULT_DESIGN, ...parsed });
    return isDesign(design) ? design : null;
  } catch {
    return null;
  }
}
