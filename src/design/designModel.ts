// Shared design model for the Design Studio, AI Preview and booking form.
//
// Teeth are numbered 1-14 left to right on each arch (as you look at the customer):
// 1-2 molars, 3-4 premolars, 5 canine, 6 lateral, 7-8 centrals, 9 lateral, 10 canine, 11-12 premolars, 13-14 molars.

export type Material = 'silver-moissanite' | 'silver-lab-diamond' | 'silver-plain' | '10k-gold' | '14k-gold' | '14k-white-gold';
export type AddOn = 'rose-cuts' | 'starburst-cuts' | 'speciality-cut' | 'laser-design' | 'diamond-dust' | '3d-design';
export type FreeStyle = 'solid' | 'open-face' | 'perm-cut' | 'diamond-cuts' | 'nugget-cut';
export type ToothDesign = 'none' | 'red-jewel' | 'blue-jewel' | 'green-jewel' | 'clear-jewel' | 'star-cutout' | 'heart-cutout' | 'cross-cutout' | 'number-cutout';
export type ToothKind = 'molar' | 'premolar' | 'canine' | 'lateral' | 'central';
export type JewelryType = 'pendant' | 'chain' | 'ring';
export type MetalShades = [string, string, string];

export interface GrillzDesign {
  material: Material;
  baseStyle: FreeStyle;
  addons: AddOn[];
  top: number[];
  bottom: number[];
  topDesigns: Record<number, ToothDesign>;
  bottomDesigns: Record<number, ToothDesign>;
  notes: string;
}

export interface JewelryDesign {
  type: JewelryType;
  metal: string;
  stones: string;
  text: string;
  pendantStyle: string;
  pendantSize: string;
  chainStyle: string;
  chainWidth: string;
  chainLength: string;
  ringStyle: string;
  ringSize: string;
  notes: string;
}

export interface StudioDesign {
  mode: 'grillz' | 'jewelry';
  grillz: GrillzDesign;
  jewelry: JewelryDesign;
}

export const MATERIALS: { id: Material; name: string; prompt: string; metal: MetalShades; iced: boolean }[] = [
  { id: '10k-gold', name: '10K Gold Plain', prompt: '10k solid yellow gold', metal: ['#f7df91', '#d6a634', '#93691a'], iced: false },
  { id: '14k-gold', name: '14K Gold Plain', prompt: '14k solid yellow gold', metal: ['#fde7a3', '#e2b23f', '#a1761b'], iced: false },
  { id: '14k-white-gold', name: '14K White Gold', prompt: '14k solid white gold', metal: ['#ffffff', '#dcdfe4', '#969ea9'], iced: false },
  { id: 'silver-plain', name: 'Silver Plain', prompt: 'polished 925 dental silver', metal: ['#f5f6f8', '#c4c9d0', '#7b828c'], iced: false },
  { id: 'silver-moissanite', name: 'Silver Moissanite (Iced)', prompt: '925 silver fully iced with VVS moissanite stones', metal: ['#ffffff', '#d7dbe1', '#8d949e'], iced: true },
  { id: 'silver-lab-diamond', name: 'Silver Lab Diamond (Iced)', prompt: '925 silver fully iced with VVS lab diamonds', metal: ['#ffffff', '#e1e4e9', '#9aa1ab'], iced: true },
];

export const FREE_STYLES: { id: FreeStyle; name: string }[] = [
  { id: 'solid', name: 'Solid' },
  { id: 'perm-cut', name: 'Perm Cut' },
  { id: 'open-face', name: 'Open Face' },
  { id: 'diamond-cuts', name: 'Diamond Cuts' },
  { id: 'nugget-cut', name: 'Nugget Cut' },
];

export const PREMIUM_ADDONS: { id: AddOn; name: string; price: number; suffix?: string }[] = [
  { id: 'diamond-dust', name: 'Diamond Dust', price: 5 },
  { id: 'rose-cuts', name: 'Rose Cuts', price: 7 },
  { id: 'starburst-cuts', name: 'Starburst Cuts', price: 7 },
  { id: 'speciality-cut', name: 'Speciality Open Face', price: 20 },
  { id: 'laser-design', name: 'Laser Design', price: 25 },
  { id: '3d-design', name: '3D Design', price: 85, suffix: 'and up' },
];

export const TOOTH_DESIGN_INFO: { id: ToothDesign; name: string; price: number }[] = [
  { id: 'none', name: 'Add / Remove Tooth', price: 0 },
  { id: 'red-jewel', name: 'Red Jewel', price: 50 },
  { id: 'blue-jewel', name: 'Blue Jewel', price: 50 },
  { id: 'green-jewel', name: 'Green Jewel', price: 50 },
  { id: 'clear-jewel', name: 'Clear Jewel', price: 50 },
  { id: 'star-cutout', name: 'Star Cutout', price: 20 },
  { id: 'heart-cutout', name: 'Heart Cutout', price: 20 },
  { id: 'cross-cutout', name: 'Cross Cutout', price: 20 },
  { id: 'number-cutout', name: 'Number Cutout', price: 20 },
];

export const TOOTH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

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

export const toothDesignList = (g: GrillzDesign) => [
  ...Object.entries(g.topDesigns).map(([n, d]) => ({ arch: 'Top', n: Number(n), d })),
  ...Object.entries(g.bottomDesigns).map(([n, d]) => ({ arch: 'Bottom', n: Number(n), d })),
];

export function grillzEstimate(g: GrillzDesign) {
  const count = g.top.length + g.bottom.length;
  const base = grillzBasePrice(g.material, count) || 0;
  const addons = addonsPrice(g.addons, count);
  const designs = toothDesignList(g).reduce((sum, { d }) => sum + (TOOTH_DESIGN_INFO.find(t => t.id === d)?.price || 0), 0);
  return { count, base, addons, designs, total: base + addons + designs };
}

export const materialName = (id: string) => MATERIALS.find(m => m.id === id)?.name || id;
export const styleName = (id: string) => FREE_STYLES.find(s => s.id === id)?.name || id;
export const addonName = (id: string) => PREMIUM_ADDONS.find(a => a.id === id)?.name || id;
export const toothDesignName = (id: string) => TOOTH_DESIGN_INFO.find(t => t.id === id)?.name || id;

// ---------------------------------------------------------------- Jewelry

export const JEWELRY_TYPES: { id: JewelryType; name: string }[] = [
  { id: 'pendant', name: 'Custom Pendant' },
  { id: 'chain', name: 'Chain' },
  { id: 'ring', name: 'Ring' },
];

export const JEWELRY_METALS: { id: string; name: string; metal: MetalShades }[] = [
  { id: '925-silver', name: '925 Silver', metal: ['#f5f6f8', '#c4c9d0', '#7b828c'] },
  { id: '10k-yellow', name: '10K Yellow Gold', metal: ['#f7df91', '#d6a634', '#93691a'] },
  { id: '14k-yellow', name: '14K Yellow Gold', metal: ['#fde7a3', '#e2b23f', '#a1761b'] },
  { id: '14k-white', name: '14K White Gold', metal: ['#ffffff', '#dcdfe4', '#969ea9'] },
  { id: '14k-rose', name: '14K Rose Gold', metal: ['#f9d4c4', '#d9947a', '#9a5a45'] },
];

export const JEWELRY_STONES = [
  { id: 'none', name: 'No Stones (Polished)' },
  { id: 'moissanite', name: 'VVS Moissanite' },
  { id: 'lab-diamond', name: 'Lab Diamonds' },
  { id: 'natural-diamond', name: 'Natural Diamonds' },
];

export const PENDANT_STYLES = ['Script Name', 'Block Letters', 'Initial', 'Logo / Custom Shape', 'Photo Medallion'];
export const PENDANT_SIZES = ['1 inch', '1.5 inches', '2 inches', '3 inches'];
export const CHAIN_STYLES = ['Cuban Link', 'Rope', 'Tennis', 'Franco', 'Figaro'];
export const CHAIN_WIDTHS = ['3mm', '5mm', '8mm', '12mm', '15mm'];
export const CHAIN_LENGTHS = ['18"', '20"', '22"', '24"', '26"'];
export const RING_STYLES = ['Solitaire Engagement', 'Wedding Band', 'Signet', 'Cluster / Pinky', 'Custom Name Ring'];
export const RING_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12', 'Not Sure'];

export const jewelryMetalName = (j: JewelryDesign) => JEWELRY_METALS.find(m => m.id === j.metal)?.name || j.metal;
export const jewelryStoneName = (j: JewelryDesign) => JEWELRY_STONES.find(s => s.id === j.stones)?.name || j.stones;

export function jewelryDetails(j: JewelryDesign) {
  if (j.type === 'pendant') return `${j.pendantStyle} pendant reading "${j.text || '—'}", ${j.pendantSize}`;
  if (j.type === 'chain') return `${j.chainWidth} ${j.chainStyle} chain, ${j.chainLength} long`;
  const lettering = (j.ringStyle === 'Signet' || j.ringStyle === 'Custom Name Ring') && j.text ? ` with "${j.text}"` : '';
  return `${j.ringStyle} ring${lettering}, size ${j.ringSize}`;
}

// ---------------------------------------------------------------- Defaults

export const DEFAULT_DESIGN: StudioDesign = {
  mode: 'grillz',
  grillz: {
    material: '14k-gold',
    baseStyle: 'perm-cut',
    addons: [],
    top: presetTeeth(6),
    bottom: [],
    topDesigns: {},
    bottomDesigns: {},
    notes: '',
  },
  jewelry: {
    type: 'pendant',
    metal: '925-silver',
    stones: 'moissanite',
    text: 'JAWZ',
    pendantStyle: PENDANT_STYLES[0],
    pendantSize: PENDANT_SIZES[1],
    chainStyle: CHAIN_STYLES[0],
    chainWidth: CHAIN_WIDTHS[2],
    chainLength: CHAIN_LENGTHS[1],
    ringStyle: RING_STYLES[0],
    ringSize: RING_SIZES[8],
    notes: '',
  },
};

// ---------------------------------------------------------------- Summaries

const listTeeth = (teeth: number[], label: string) =>
  teeth.length ? `${teeth.length} ${label} (teeth #${[...teeth].sort((a, b) => a - b).join(', ')})` : '';

/** Plain-text summary of the design, sent to Jeremy with the booking. */
export function designSummary(design: StudioDesign) {
  if (design.mode === 'jewelry') {
    const j = design.jewelry;
    return [
      `Jewelry: ${jewelryDetails(j)}.`,
      `Metal: ${jewelryMetalName(j)}. Stones: ${jewelryStoneName(j)}.`,
      j.notes && `Notes: ${j.notes}`,
      'Price to be quoted at consultation.',
    ].filter(Boolean).join('\n');
  }
  const g = design.grillz;
  const est = grillzEstimate(g);
  const arches = [listTeeth(g.top, 'top'), listTeeth(g.bottom, 'bottom')].filter(Boolean).join(' + ');
  const addons = g.addons.map(addonName).join(', ');
  const perTooth = toothDesignList(g).map(({ arch, n, d }) => `${arch} #${n}: ${toothDesignName(d)}`).join('; ');
  return [
    `Grillz: ${arches || 'no teeth selected'}.`,
    `Metal: ${materialName(g.material)}. Style: ${styleName(g.baseStyle)}.`,
    addons && `Add-ons: ${addons}.`,
    perTooth && `Jewels & cutouts: ${perTooth}.`,
    g.notes && `Notes: ${g.notes}`,
    `Estimate: $${est.total.toLocaleString()}.`,
  ].filter(Boolean).join('\n');
}

/** Short description used to fill in the AI Preview prompts. */
export function designPrompt(design: StudioDesign) {
  if (design.mode === 'jewelry') {
    const j = design.jewelry;
    return `custom ${jewelryDetails(j)} in ${jewelryMetalName(j).toLowerCase()}${j.stones === 'none' ? ', high-polish finish' : `, iced out with ${jewelryStoneName(j).toLowerCase()}`}${j.notes ? `. ${j.notes}` : ''}`;
  }
  const g = design.grillz;
  const mat = MATERIALS.find(m => m.id === g.material)!;
  const arches = [g.top.length && `${g.top.length}-tooth top`, g.bottom.length && `${g.bottom.length}-tooth bottom`].filter(Boolean).join(' and ');
  const addons = g.addons.map(id => addonName(id).toLowerCase()).join(', ');
  const designs = [...new Set(toothDesignList(g).map(({ d }) => toothDesignName(d).toLowerCase()))].join(', ');
  return `custom ${arches} grillz in ${mat.prompt}, ${styleName(g.baseStyle).toLowerCase()} style${addons ? `, with ${addons}` : ''}${designs ? `, accented with ${designs}` : ''}${g.notes ? `. ${g.notes}` : ''}`;
}

// ---------------------------------------------------------------- Saving & sharing

const STORAGE_KEY = 'jawz_studio_design';
const SHARE_PARAM = 'design';

const isDesign = (value: any): value is StudioDesign =>
  value && (value.mode === 'grillz' || value.mode === 'jewelry') && value.grillz && value.jewelry && Array.isArray(value.grillz.top);

const withDefaults = (d: StudioDesign): StudioDesign => ({
  mode: d.mode,
  grillz: { ...DEFAULT_DESIGN.grillz, ...d.grillz },
  jewelry: { ...DEFAULT_DESIGN.jewelry, ...d.jewelry },
});

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
  const payload = design.mode === 'grillz' ? { mode: design.mode, grillz: design.grillz } : { mode: design.mode, jewelry: design.jewelry };
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
