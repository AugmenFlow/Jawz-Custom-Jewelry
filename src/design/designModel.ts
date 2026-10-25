// Shared design model for the Design Studio and booking form.
//
// Teeth are numbered 1-14 left to right on each arch (as you look at the customer):
// 1-2 molars, 3-4 premolars, 5 canine, 6 lateral, 7-8 centrals, 9 lateral, 10 canine, 11-12 premolars, 13-14 molars.

/** Price-list tiers. Every other combination is quoted by Jeremy. */
export type Material = 'silver-moissanite' | 'silver-lab-diamond' | 'silver-plain' | '10k-gold' | '14k-gold' | '14k-white-gold' | 'script';
export type Metal = 'silver' | '10k' | '14k' | '18k' | '22k' | '24k';
export type GoldColor = 'yellow' | 'white' | 'rose';
export type Stone = 'moissanite' | 'lab-diamond' | 'natural-diamond';
export type StoneStyle = 'honeycomb' | 'honeymoon' | 'jumbo' | 'galaxy' | 'emerald' | 'mosaic' | 'hybrid' | 'other';
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
  { id: 'natural-diamond', name: 'Natural Diamond' },
];

/** Setting styles are all the same price; only the metal and stone change it. */
export const STONE_STYLES: { id: StoneStyle; name: string }[] = [
  { id: 'honeycomb', name: 'Honeycomb' },
  { id: 'honeymoon', name: 'Honeymoon' },
  { id: 'jumbo', name: 'Jumbo' },
  { id: 'galaxy', name: 'Galaxy' },
  { id: 'emerald', name: 'Emerald' },
  { id: 'mosaic', name: 'Mosaic' },
  { id: 'hybrid', name: 'Hybrid' },
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

export function grillzBasePrice(material: string, count: number): number | null {
  if (count === 0) return 0;
  if (material === 'silver-moissanite') {
    if (count === 12) return 1175;
    if (count === 16) return 1550;
    if (count === 20) return 1900;
    return count * 98;
  }
  if (material === 'silver-lab-diamond') {
    if (count === 12) return 1900;
    if (count === 16) return 2550;
    if (count === 20) return 3180;
    return count * 159;
  }
  if (material === 'script') return count === 16 ? 690 : null;
  if (material === 'silver-plain') {
    if (count <= 2) return 225;
    if (count <= 4) return count * 45;
    return count * 40;
  }
  if (material === '10k-gold') {
    if (count <= 2) return 275;
    if (count <= 4) return 420;
    return count * 95;
  }
  if (material === '14k-gold' || material === '14k-white-gold') {
    if (count <= 2) return 350;
    if (count <= 4) return 520;
    return count * 115;
  }
  return null;
}

export const addonsPrice = (addons: string[], count: number) =>
  addons.reduce((sum, id) => sum + (PREMIUM_ADDONS.find(a => a.id === id)?.price || 0) * count, 0);

/** Which price-list tier a design falls in, or null when it's quoted at consultation. */
export function priceTier(g: GrillzDesign): Material | null {
  if (g.metal === 'silver') {
    if (!g.stones) return g.baseStyle === 'script' ? 'script' : 'silver-plain';
    if (g.stone === 'moissanite') return 'silver-moissanite';
    if (g.stone === 'lab-diamond') return 'silver-lab-diamond';
    return null;
  }
  if (g.stones || g.baseStyle === 'script') return null;
  if (g.metal === '10k') return '10k-gold';
  if (g.metal === '14k') return '14k-gold';
  return null;
}

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

/** Price-list rate per tooth (for a full set) for this metal and stone, or null when it's quoted. */
export function perToothRate(g: Pick<GrillzDesign, 'metal' | 'color' | 'stones' | 'stone'>): number | null {
  const tier = priceTier({ ...DEFAULT_DESIGN.grillz, ...g, baseStyle: 'solid' });
  const base = tier ? grillzBasePrice(tier, 8) : null;
  return base === null ? null : base / 8;
}

export function grillzEstimate(g: GrillzDesign) {
  const count = g.top.length + g.bottom.length;
  const tier = priceTier(g);
  const base = tier ? grillzBasePrice(tier, count) : null;
  const addons = addonsPrice(g.addons, count);
  return { count, base, addons, total: base === null ? null : base + addons };
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
    est.total === null ? 'Estimate: quoted at consultation.' : `Estimate: $${est.total.toLocaleString()}.`,
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
