import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, ChevronRight, Star, Heart, Gem, MousePointer2, Calendar, Sparkles, Link2, CircleDot } from 'lucide-react';

// Teeth are numbered 1-14 left to right on each arch, matching the booking form.
// 1-2 molars, 3-4 premolars, 5 canine, 6 lateral, 7-8 centrals, 9 lateral, 10 canine, 11-12 premolars, 13-14 molars.

type Material = 'silver-moissanite' | 'silver-lab-diamond' | 'silver-plain' | '10k-gold' | '14k-gold' | '14k-white-gold';
type AddOn = 'rose-cuts' | 'starburst-cuts' | 'speciality-cut' | 'laser-design' | 'diamond-dust' | '3d-design';
type FreeStyle = 'solid' | 'open-face' | 'perm-cut' | 'diamond-cuts' | 'nugget-cut';
type ToothDesign = 'none' | 'red-jewel' | 'blue-jewel' | 'green-jewel' | 'clear-jewel' | 'star-cutout' | 'heart-cutout' | 'cross-cutout' | 'number-cutout';
type ToothKind = 'molar' | 'premolar' | 'canine' | 'lateral' | 'central';

export interface ToothLabBooking {
  teeth?: { top: number[]; bottom: number[] };
  material: string;
  cuts: string[];
  notes: string;
  serviceType: 'in-person' | 'jewelry';
}

const MATERIALS: { id: Material; name: string; prompt: string; metal: [string, string, string]; iced: boolean }[] = [
  { id: '10k-gold', name: '10K Gold Plain', prompt: '10k solid yellow gold', metal: ['#f7df91', '#d6a634', '#93691a'], iced: false },
  { id: '14k-gold', name: '14K Gold Plain', prompt: '14k solid yellow gold', metal: ['#fde7a3', '#e2b23f', '#a1761b'], iced: false },
  { id: '14k-white-gold', name: '14K White Gold', prompt: '14k solid white gold', metal: ['#ffffff', '#dcdfe4', '#969ea9'], iced: false },
  { id: 'silver-plain', name: 'Silver Plain', prompt: 'polished 925 dental silver', metal: ['#f5f6f8', '#c4c9d0', '#7b828c'], iced: false },
  { id: 'silver-moissanite', name: 'Silver Moissanite (Iced)', prompt: '925 silver fully iced with VVS moissanite stones', metal: ['#ffffff', '#d7dbe1', '#8d949e'], iced: true },
  { id: 'silver-lab-diamond', name: 'Silver Lab Diamond (Iced)', prompt: '925 silver fully iced with VVS lab diamonds', metal: ['#ffffff', '#e1e4e9', '#9aa1ab'], iced: true },
];

const FREE_STYLES: { id: FreeStyle; name: string }[] = [
  { id: 'solid', name: 'Solid' },
  { id: 'perm-cut', name: 'Perm Cut' },
  { id: 'open-face', name: 'Open Face' },
  { id: 'diamond-cuts', name: 'Diamond Cuts' },
  { id: 'nugget-cut', name: 'Nugget Cut' },
];

const PREMIUM_ADDONS: { id: AddOn; name: string; price: number; suffix?: string }[] = [
  { id: 'diamond-dust', name: 'Diamond Dust', price: 5 },
  { id: 'rose-cuts', name: 'Rose Cuts', price: 7 },
  { id: 'starburst-cuts', name: 'Starburst Cuts', price: 7 },
  { id: 'speciality-cut', name: 'Speciality Open Face', price: 20 },
  { id: 'laser-design', name: 'Laser Design', price: 25 },
  { id: '3d-design', name: '3D Design', price: 85, suffix: 'and up' },
];

const TOOTH_DESIGNS: { id: ToothDesign; name: string; price: number; icon: React.ReactNode }[] = [
  { id: 'none', name: 'Add / Remove Tooth', price: 0, icon: <MousePointer2 className="w-4 h-4" /> },
  { id: 'red-jewel', name: 'Red Jewel', price: 50, icon: <Gem className="w-4 h-4 text-red-500 fill-red-500" /> },
  { id: 'blue-jewel', name: 'Blue Jewel', price: 50, icon: <Gem className="w-4 h-4 text-blue-500 fill-blue-500" /> },
  { id: 'green-jewel', name: 'Green Jewel', price: 50, icon: <Gem className="w-4 h-4 text-green-500 fill-green-500" /> },
  { id: 'clear-jewel', name: 'Clear Jewel', price: 50, icon: <Gem className="w-4 h-4 text-white fill-white" /> },
  { id: 'star-cutout', name: 'Star Cutout', price: 20, icon: <Star className="w-4 h-4 fill-current" /> },
  { id: 'heart-cutout', name: 'Heart Cutout', price: 20, icon: <Heart className="w-4 h-4 fill-current" /> },
  { id: 'cross-cutout', name: 'Cross Cutout', price: 20, icon: <span className="font-black text-sm leading-none">✝</span> },
  { id: 'number-cutout', name: 'Number Cutout', price: 20, icon: <span className="font-black font-serif text-sm leading-none">7</span> },
];

const JEWEL_COLORS: Partial<Record<ToothDesign, string>> = {
  'red-jewel': '#e11d48', 'blue-jewel': '#2563eb', 'green-jewel': '#16a34a', 'clear-jewel': '#f8fafc',
};

const TOOTH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const toothKind = (n: number): ToothKind => {
  const d = n <= 7 ? 7 - n : n - 8; // 0 = central
  return (['central', 'lateral', 'canine', 'premolar', 'premolar', 'molar', 'molar'] as ToothKind[])[d];
};

const KIND_LABEL: Record<ToothKind, string> = { central: 'Central', lateral: 'Lateral', canine: 'Canine', premolar: 'Premolar', molar: 'Molar' };

// Front-view sizes for each tooth type (upper arch is larger than lower)
const UPPER_SIZE: Record<ToothKind, [number, number]> = { central: [48, 92], lateral: [38, 80], canine: [36, 88], premolar: [32, 72], molar: [30, 62] };
const LOWER_SIZE: Record<ToothKind, [number, number]> = { central: [32, 66], lateral: [34, 68], canine: [36, 76], premolar: [34, 62], molar: [33, 54] };

const VIEW_W = 560;
const CENTER_X = VIEW_W / 2;
const ARCH_CURVE = 0.0011;
const UPPER_GUM_Y = 96;
const LOWER_GUM_Y = 306;

// Tooth outline in local coordinates: gum line at y=0, biting edge at y=h
const toothPath = (kind: ToothKind, w: number, h: number) => {
  if (kind === 'canine') return `M0,0 H${w} V${h * 0.62} Q${w},${h * 0.82} ${w / 2},${h} Q0,${h * 0.82} 0,${h * 0.62} Z`;
  if (kind === 'molar') return `M0,0 H${w} V${h * 0.78} Q${w},${h} ${w * 0.7},${h} H${w * 0.3} Q0,${h} 0,${h * 0.78} Z`;
  if (kind === 'premolar') return `M0,0 H${w} V${h * 0.7} Q${w},${h} ${w / 2},${h} Q0,${h} 0,${h * 0.7} Z`;
  return `M0,0 H${w} V${h * 0.8} Q${w},${h} ${w * 0.82},${h} H${w * 0.18} Q0,${h} 0,${h * 0.8} Z`;
};

interface ToothLayout { n: number; kind: ToothKind; x: number; w: number; h: number; gumY: number; }

const layoutArch = (isTop: boolean): ToothLayout[] => {
  const sizes = isTop ? UPPER_SIZE : LOWER_SIZE;
  const total = TOOTH_NUMBERS.reduce((sum, n) => sum + sizes[toothKind(n)][0] + 2, 0);
  let x = CENTER_X - total / 2;
  return TOOTH_NUMBERS.map(n => {
    const kind = toothKind(n);
    const [w, h] = sizes[kind];
    const dx = x + w / 2 - CENTER_X;
    const lift = ARCH_CURVE * dx * dx;
    const tooth = { n, kind, x, w, h, gumY: isTop ? UPPER_GUM_Y - lift : LOWER_GUM_Y - lift };
    x += w + 2;
    return tooth;
  });
};

const UPPER_ARCH = layoutArch(true);
const LOWER_ARCH = layoutArch(false);

function calculateBasePrice(material: Material, count: number) {
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
  if (count <= 2) return 350;
  if (count <= 4) return 520;
  return count * 115;
}

const presetTeeth = (count: number) => {
  const start = 8 - count / 2;
  return new Set(Array.from({ length: count }, (_, i) => start + i));
};

// ---------------------------------------------------------------- Jewelry builder data
type JewelryType = 'pendant' | 'chain' | 'ring';

const JEWELRY_TYPES: { id: JewelryType; name: string }[] = [
  { id: 'pendant', name: 'Custom Pendant' },
  { id: 'chain', name: 'Chain' },
  { id: 'ring', name: 'Ring' },
];

const JEWELRY_METALS: { id: string; name: string; metal: [string, string, string] }[] = [
  { id: '925-silver', name: '925 Silver', metal: ['#f5f6f8', '#c4c9d0', '#7b828c'] },
  { id: '10k-yellow', name: '10K Yellow Gold', metal: ['#f7df91', '#d6a634', '#93691a'] },
  { id: '14k-yellow', name: '14K Yellow Gold', metal: ['#fde7a3', '#e2b23f', '#a1761b'] },
  { id: '14k-white', name: '14K White Gold', metal: ['#ffffff', '#dcdfe4', '#969ea9'] },
  { id: '14k-rose', name: '14K Rose Gold', metal: ['#f9d4c4', '#d9947a', '#9a5a45'] },
];

const JEWELRY_STONES = [
  { id: 'none', name: 'No Stones (Polished)' },
  { id: 'moissanite', name: 'VVS Moissanite' },
  { id: 'lab-diamond', name: 'Lab Diamonds' },
  { id: 'natural-diamond', name: 'Natural Diamonds' },
];

const PENDANT_STYLES = ['Script Name', 'Block Letters', 'Initial', 'Logo / Custom Shape', 'Photo Medallion'];
const PENDANT_SIZES = ['1 inch', '1.5 inches', '2 inches', '3 inches'];
const CHAIN_STYLES = ['Cuban Link', 'Rope', 'Tennis', 'Franco', 'Figaro'];
const CHAIN_WIDTHS = ['3mm', '5mm', '8mm', '12mm', '15mm'];
const CHAIN_LENGTHS = ['18"', '20"', '22"', '24"', '26"'];
const RING_STYLES = ['Solitaire Engagement', 'Wedding Band', 'Signet', 'Cluster / Pinky', 'Custom Name Ring'];
const RING_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12', 'Not Sure'];

const pillClass = (active: boolean) =>
  `px-3 py-2 text-xs font-bold rounded-sm border transition-all ${
    active ? 'bg-[#D4D4D8] text-black border-[#D4D4D8]' : 'bg-zinc-900/60 text-zinc-300 border-white/10 hover:border-white/30'
  }`;

const MetalDefs = ({ id, metal }: { id: string; metal: [string, string, string] }) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor={metal[0]} />
    <stop offset="45%" stopColor={metal[1]} />
    <stop offset="100%" stopColor={metal[2]} />
  </linearGradient>
);

export default function Configurator({
  onBack,
  onBookAppointment,
  onOpenAILab,
}: {
  onBack: () => void;
  onBookAppointment: (data: ToothLabBooking) => void;
  onOpenAILab?: (idea: string) => void;
}) {
  const [mode, setMode] = useState<'grillz' | 'jewelry'>('grillz');

  // Grillz state
  const [material, setMaterial] = useState<Material>('14k-gold');
  const [baseStyle, setBaseStyle] = useState<FreeStyle>('perm-cut');
  const [selectedAddons, setSelectedAddons] = useState<Set<AddOn>>(new Set());
  const [activeTool, setActiveTool] = useState<ToothDesign>('none');
  const [selectedTopTeeth, setSelectedTopTeeth] = useState<Set<number>>(presetTeeth(6));
  const [selectedBottomTeeth, setSelectedBottomTeeth] = useState<Set<number>>(new Set());
  const [topDesigns, setTopDesigns] = useState<Record<number, ToothDesign>>({});
  const [bottomDesigns, setBottomDesigns] = useState<Record<number, ToothDesign>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Jewelry state
  const [jewelryType, setJewelryType] = useState<JewelryType>('pendant');
  const [jewelryMetal, setJewelryMetal] = useState(JEWELRY_METALS[0].id);
  const [jewelryStones, setJewelryStones] = useState('moissanite');
  const [pendantText, setPendantText] = useState('JAWZ');
  const [pendantStyle, setPendantStyle] = useState(PENDANT_STYLES[0]);
  const [pendantSize, setPendantSize] = useState(PENDANT_SIZES[1]);
  const [chainStyle, setChainStyle] = useState(CHAIN_STYLES[0]);
  const [chainWidth, setChainWidth] = useState(CHAIN_WIDTHS[2]);
  const [chainLength, setChainLength] = useState(CHAIN_LENGTHS[1]);
  const [ringStyle, setRingStyle] = useState(RING_STYLES[0]);
  const [ringSize, setRingSize] = useState(RING_SIZES[8]);
  const [jewelryNotes, setJewelryNotes] = useState('');

  const mat = MATERIALS.find(m => m.id === material)!;
  const isOpenFace = baseStyle === 'open-face' || selectedAddons.has('speciality-cut');
  const totalTeeth = selectedTopTeeth.size + selectedBottomTeeth.size;

  const toggleTooth = (n: number, isTop: boolean) => {
    const selected = isTop ? selectedTopTeeth : selectedBottomTeeth;
    const setSelected = isTop ? setSelectedTopTeeth : setSelectedBottomTeeth;
    const designs = isTop ? topDesigns : bottomDesigns;
    const setDesigns = isTop ? setTopDesigns : setBottomDesigns;
    const nextSet = new Set(selected);
    const nextDesigns = { ...designs };

    if (activeTool === 'none') {
      if (nextSet.has(n)) {
        nextSet.delete(n);
        delete nextDesigns[n];
      } else {
        nextSet.add(n);
      }
    } else {
      nextSet.add(n);
      if (nextDesigns[n] === activeTool) delete nextDesigns[n];
      else nextDesigns[n] = activeTool;
    }
    setSelected(nextSet);
    setDesigns(nextDesigns);
  };

  const toggleAddon = (id: AddOn) => {
    const next = new Set(selectedAddons);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAddons(next);
  };

  const selectPreset = (count: number, isTop: boolean) => {
    if (isTop) { setSelectedTopTeeth(presetTeeth(count)); setTopDesigns({}); }
    else { setSelectedBottomTeeth(presetTeeth(count)); setBottomDesigns({}); }
  };

  const designList = useMemo(() => [
    ...Object.entries(topDesigns).map(([n, d]) => ({ arch: 'Top', n: Number(n), d })),
    ...Object.entries(bottomDesigns).map(([n, d]) => ({ arch: 'Bottom', n: Number(n), d })),
  ], [topDesigns, bottomDesigns]);

  const designTotal = designList.reduce((sum, { d }) => sum + (TOOTH_DESIGNS.find(t => t.id === d)?.price || 0), 0);
  const basePrice = calculateBasePrice(material, totalTeeth);
  const addonsTotal = Array.from(selectedAddons).reduce((sum, id) => sum + (PREMIUM_ADDONS.find(a => a.id === id)?.price || 0) * totalTeeth, 0);
  const totalPrice = basePrice + addonsTotal + designTotal;

  const describeArch = (set: Set<number>, label: string) => (set.size ? `${set.size} ${label} (teeth #${Array.from(set).sort((a, b) => a - b).join(', ')})` : '');

  const grillzSummary = () => {
    const arches = [describeArch(selectedTopTeeth, 'top'), describeArch(selectedBottomTeeth, 'bottom')].filter(Boolean).join(' + ');
    const addons = Array.from(selectedAddons).map(id => PREMIUM_ADDONS.find(a => a.id === id)?.name).join(', ');
    const designs = designList.map(({ arch, n, d }) => `${arch} #${n}: ${TOOTH_DESIGNS.find(t => t.id === d)?.name}`).join('; ');
    return [
      `Tooth Lab grillz design: ${arches}.`,
      `Metal: ${mat.name}. Style: ${FREE_STYLES.find(s => s.id === baseStyle)?.name}.`,
      addons && `Add-ons: ${addons}.`,
      designs && `Per-tooth details: ${designs}.`,
      specialInstructions && `Notes: ${specialInstructions}`,
      `Tooth Lab estimate: $${totalPrice.toLocaleString()}.`,
    ].filter(Boolean).join('\n');
  };

  const grillzPrompt = () => {
    const arches = [selectedTopTeeth.size && `${selectedTopTeeth.size}-tooth top`, selectedBottomTeeth.size && `${selectedBottomTeeth.size}-tooth bottom`].filter(Boolean).join(' and ');
    const style = FREE_STYLES.find(s => s.id === baseStyle)?.name.toLowerCase();
    const addons = Array.from(selectedAddons).map(id => PREMIUM_ADDONS.find(a => a.id === id)?.name.toLowerCase()).join(', ');
    const designs = designList.map(({ d }) => TOOTH_DESIGNS.find(t => t.id === d)?.name.toLowerCase()).filter((v, i, a) => a.indexOf(v) === i).join(', ');
    return `custom ${arches} grillz in ${mat.prompt}, ${style} style${addons ? `, with ${addons}` : ''}${designs ? `, accented with ${designs}` : ''}${specialInstructions ? `. ${specialInstructions}` : ''}`;
  };

  const jewelryMetalName = JEWELRY_METALS.find(m => m.id === jewelryMetal)!.name;
  const jewelryStoneName = JEWELRY_STONES.find(s => s.id === jewelryStones)!.name;

  const jewelryDetails = () => {
    if (jewelryType === 'pendant') return `${pendantStyle} pendant reading "${pendantText || '—'}", ${pendantSize}`;
    if (jewelryType === 'chain') return `${chainWidth} ${chainStyle} chain, ${chainLength} long`;
    return `${ringStyle} ring, size ${ringSize}`;
  };

  const jewelrySummary = () => [
    `Tooth Lab jewelry design: ${jewelryDetails()}.`,
    `Metal: ${jewelryMetalName}. Stones: ${jewelryStoneName}.`,
    jewelryNotes && `Notes: ${jewelryNotes}`,
    'Price to be quoted at consultation.',
  ].filter(Boolean).join('\n');

  const jewelryPrompt = () =>
    `custom ${jewelryDetails()} in ${jewelryMetalName.toLowerCase()}${jewelryStones === 'none' ? ', high-polish finish' : `, iced out with ${jewelryStoneName.toLowerCase()}`}${jewelryNotes ? `. ${jewelryNotes}` : ''}`;

  // ------------------------------------------------------------ Mouth rendering
  const renderArch = (isTop: boolean) => {
    const arch = isTop ? UPPER_ARCH : LOWER_ARCH;
    const selected = isTop ? selectedTopTeeth : selectedBottomTeeth;
    const designs = isTop ? topDesigns : bottomDesigns;
    const first = arch[0];
    const last = arch[arch.length - 1];
    const gumDepth = 34;

    // Gum band that follows the arch curve
    const gumPath = isTop
      ? `M${first.x - 8},${first.gumY - gumDepth} L${arch.map(t => `${t.x + t.w / 2},${t.gumY - gumDepth}`).join(' L')} L${last.x + last.w + 8},${last.gumY - gumDepth} L${last.x + last.w + 8},${last.gumY + 6} L${[...arch].reverse().map(t => `${t.x + t.w / 2},${t.gumY + 6}`).join(' L')} L${first.x - 8},${first.gumY + 6} Z`
      : `M${first.x - 8},${first.gumY + gumDepth} L${arch.map(t => `${t.x + t.w / 2},${t.gumY + gumDepth}`).join(' L')} L${last.x + last.w + 8},${last.gumY + gumDepth} L${last.x + last.w + 8},${last.gumY - 6} L${[...arch].reverse().map(t => `${t.x + t.w / 2},${t.gumY - 6}`).join(' L')} L${first.x - 8},${first.gumY - 6} Z`;

    return (
      <g>
        {arch.map(t => {
          const isSelected = selected.has(t.n);
          const design = designs[t.n];
          const path = toothPath(t.kind, t.w, t.h);
          const transform = isTop ? `translate(${t.x},${t.gumY})` : `translate(${t.x},${t.gumY}) scale(1,-1)`;
          const cx = t.x + t.w / 2;
          const cy = isTop ? t.gumY + t.h * 0.55 : t.gumY - t.h * 0.55;
          const label = `${isTop ? 'Top' : 'Bottom'} tooth #${t.n} (${KIND_LABEL[t.kind]})${isSelected ? ' — covered' : ''}`;
          const solidFill = isSelected && !isOpenFace;
          const textured = solidFill ? (mat.iced ? 'url(#ice)' : baseStyle === 'diamond-cuts' ? 'url(#diamond-cut)' : baseStyle === 'nugget-cut' ? 'url(#nugget)' : null) : null;

          return (
            <g
              key={t.n}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={isSelected}
              onClick={() => toggleTooth(t.n, isTop)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTooth(t.n, isTop); } }}
              className="cursor-pointer outline-none group"
            >
              <title>{label}</title>
              <g transform={transform}>
                <path d={path} fill="url(#enamel)" stroke="#b9ad97" strokeWidth={1} />
                {solidFill && <path d={path} fill="url(#metal)" stroke={mat.metal[2]} strokeWidth={1.2} />}
                {textured && <path d={path} fill={textured} />}
                {solidFill && selectedAddons.has('diamond-dust') && <path d={path} fill="url(#dust)" />}
                {solidFill && (selectedAddons.has('rose-cuts') || selectedAddons.has('starburst-cuts')) && (
                  <g stroke="rgba(255,255,255,0.85)" strokeWidth={1}>
                    <line x1={t.w / 2} y1={t.h * 0.2} x2={t.w / 2} y2={t.h * 0.85} />
                    <line x1={t.w * 0.15} y1={t.h * 0.52} x2={t.w * 0.85} y2={t.h * 0.52} />
                    {selectedAddons.has('starburst-cuts') && <>
                      <line x1={t.w * 0.22} y1={t.h * 0.3} x2={t.w * 0.78} y2={t.h * 0.75} />
                      <line x1={t.w * 0.78} y1={t.h * 0.3} x2={t.w * 0.22} y2={t.h * 0.75} />
                    </>}
                  </g>
                )}
                {isSelected && isOpenFace && (
                  <path d={path} fill={mat.iced ? 'url(#ice-rim)' : 'none'} stroke="url(#metal)" strokeWidth={6} strokeLinejoin="round" />
                )}
                {solidFill && !mat.iced && (
                  <path d={`M${t.w * 0.2},${t.h * 0.12} Q${t.w * 0.28},${t.h * 0.5} ${t.w * 0.24},${t.h * 0.78}`} stroke="rgba(255,255,255,0.7)" strokeWidth={3} fill="none" strokeLinecap="round" />
                )}
                <path d={path} fill="transparent" className="group-hover:fill-white/10 group-focus-visible:fill-white/20" stroke="transparent" />
              </g>

              {isSelected && design && JEWEL_COLORS[design] && (
                <g>
                  <polygon points={`${cx},${cy - 9} ${cx + 8},${cy - 2} ${cx},${cy + 9} ${cx - 8},${cy - 2}`} fill={JEWEL_COLORS[design]} stroke="#fff" strokeWidth={1.2} />
                  <polygon points={`${cx},${cy - 9} ${cx + 3},${cy - 2} ${cx},${cy + 2} ${cx - 3},${cy - 2}`} fill="rgba(255,255,255,0.6)" />
                </g>
              )}
              {isSelected && design === 'star-cutout' && (
                <polygon fill="#111" points={Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 4 : 10; const a = -Math.PI / 2 + i * Math.PI / 5; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(' ')} />
              )}
              {isSelected && design === 'heart-cutout' && (
                <path fill="#111" d={`M${cx},${cy + 8} C${cx - 13},${cy - 1} ${cx - 7},${cy - 11} ${cx},${cy - 4} C${cx + 7},${cy - 11} ${cx + 13},${cy - 1} ${cx},${cy + 8} Z`} />
              )}
              {isSelected && design === 'cross-cutout' && (
                <path fill="#111" d={`M${cx - 2.5},${cy - 11} h5 v6 h6 v5 h-6 v11 h-5 v-11 h-6 v-5 h6 Z`} />
              )}
              {isSelected && design === 'number-cutout' && (
                <text x={cx} y={cy + 7} textAnchor="middle" fontSize={20} fontWeight={900} fontFamily="serif" fill="#111">7</text>
              )}
            </g>
          );
        })}
        <path d={gumPath} fill="url(#gum)" pointerEvents="none" />
      </g>
    );
  };

  const renderJewelryPreview = () => {
    const metal = JEWELRY_METALS.find(m => m.id === jewelryMetal)!.metal;
    const iced = jewelryStones !== 'none';
    return (
      <svg viewBox="0 0 400 320" className="w-full max-w-md" role="img" aria-label={`Preview of ${jewelryDetails()}`}>
        <defs>
          <MetalDefs id="jmetal" metal={metal} />
          <pattern id="jice" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="url(#jmetal)" />
            <circle cx="4" cy="4" r="3" fill="#fff" opacity="0.9" />
            <circle cx="3" cy="3" r="1" fill="#e0f2fe" />
          </pattern>
        </defs>
        {jewelryType === 'pendant' && (
          <g>
            <path d="M60,0 Q200,150 340,0" fill="none" stroke="url(#jmetal)" strokeWidth={6} strokeDasharray="10 4" />
            <rect x="188" y="72" width="24" height="26" rx="5" fill={iced ? 'url(#jice)' : 'url(#jmetal)'} stroke={metal[2]} />
            <text
              x="200" y="190" textAnchor="middle"
              fontSize={pendantStyle === 'Initial' ? 120 : Math.max(36, 92 - (pendantText.length * 6))}
              fontFamily={pendantStyle === 'Script Name' ? '"Alex Brush", cursive' : '"Archivo", sans-serif'}
              fontWeight={pendantStyle === 'Script Name' ? 400 : 900}
              fill={iced ? 'url(#jice)' : 'url(#jmetal)'} stroke={metal[2]} strokeWidth={1.5}
            >
              {(pendantStyle === 'Initial' ? pendantText.slice(0, 1) : pendantText) || 'JAWZ'}
            </text>
            {(pendantStyle === 'Logo / Custom Shape' || pendantStyle === 'Photo Medallion') && (
              <circle cx="200" cy="170" r="70" fill="none" stroke={iced ? 'url(#jice)' : 'url(#jmetal)'} strokeWidth={14} />
            )}
          </g>
        )}
        {jewelryType === 'chain' && (
          <g>
            {Array.from({ length: 13 }, (_, i) => {
              const t = i / 12;
              const x = 40 + t * 320;
              const y = 60 + Math.sin(t * Math.PI) * 170;
              const size = 8 + CHAIN_WIDTHS.indexOf(chainWidth) * 3;
              const angle = Math.cos(t * Math.PI) * -35;
              if (chainStyle === 'Tennis') {
                return <g key={i}><rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={2} fill="url(#jmetal)" /><circle cx={x} cy={y} r={size / 2.6} fill="#fff" /></g>;
              }
              return (
                <ellipse
                  key={i} cx={x} cy={y} rx={size * (chainStyle === 'Cuban Link' ? 1.25 : 1)} ry={size * 0.75}
                  transform={`rotate(${angle + (chainStyle === 'Rope' ? 45 : 0)} ${x} ${y})`}
                  fill="none" stroke={iced ? 'url(#jice)' : 'url(#jmetal)'} strokeWidth={size * 0.55}
                />
              );
            })}
          </g>
        )}
        {jewelryType === 'ring' && (
          <g>
            <ellipse cx="200" cy="200" rx="110" ry="70" fill="none" stroke="url(#jmetal)" strokeWidth={ringStyle === 'Wedding Band' ? 26 : 16} />
            {ringStyle === 'Wedding Band' && iced && <ellipse cx="200" cy="200" rx="110" ry="70" fill="none" stroke="url(#jice)" strokeWidth={10} />}
            {(ringStyle === 'Solitaire Engagement' || ringStyle === 'Cluster / Pinky') && (
              <g>
                <path d="M170,140 L200,95 L230,140 Z" fill="url(#jmetal)" />
                <polygon points="200,60 232,88 200,128 168,88" fill={iced ? '#f8fafc' : 'url(#jmetal)'} stroke="#cbd5e1" strokeWidth={2} />
                <polygon points="200,60 212,88 200,100 188,88" fill="rgba(186,230,253,0.8)" />
                {ringStyle === 'Cluster / Pinky' && [-38, 38].map(dx => <circle key={dx} cx={200 + dx} cy={110} r={12} fill={iced ? '#f8fafc' : 'url(#jmetal)'} stroke="#cbd5e1" />)}
              </g>
            )}
            {(ringStyle === 'Signet' || ringStyle === 'Custom Name Ring') && (
              <g>
                <rect x="140" y="90" width="120" height="70" rx="14" fill={iced ? 'url(#jice)' : 'url(#jmetal)'} stroke={metal[2]} />
                <text x="200" y="138" textAnchor="middle" fontSize="34" fontWeight={900} fontFamily='"Archivo", sans-serif' fill="#18181b" opacity="0.75">
                  {(pendantText || 'J').slice(0, ringStyle === 'Signet' ? 2 : 6)}
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="flex-1 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center text-xs uppercase font-bold tracking-widest text-zinc-400 hover:text-[#D4D4D8] transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-sm border border-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight">Tooth Lab</h1>
              <p className="text-sm text-zinc-400">Design your grillz or custom jewelry, then book it or see it rendered in the AI Lab.</p>
            </div>
          </div>

          {/* Flow: Design -> Render -> Book */}
          <ol className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" aria-label="How it works">
            <li className="px-3 py-2 rounded-sm bg-[#D4D4D8] text-black">1. Design</li>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" aria-hidden="true" />
            <li className="px-3 py-2 rounded-sm border border-white/15 text-zinc-300">2. Render in AI Lab (optional)</li>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" aria-hidden="true" />
            <li className="px-3 py-2 rounded-sm border border-white/15 text-zinc-300">3. Book</li>
          </ol>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 mb-8" role="tablist">
          {[{ id: 'grillz' as const, label: 'Grillz Designer', icon: <CircleDot className="w-4 h-4" /> }, { id: 'jewelry' as const, label: 'Pendants, Chains & Rings', icon: <Link2 className="w-4 h-4" /> }].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => setMode(tab.id)}
              className={`px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${mode === tab.id ? 'bg-[#D4D4D8] text-black shadow-[0_0_15px_rgba(212,212,216,0.3)]' : 'bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white'}`}
            >
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
        </div>

        {mode === 'grillz' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Mouth Preview */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-lg p-4 sm:p-6 relative">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-xs tracking-widest text-zinc-400 uppercase font-bold">Live Preview • Tap teeth to cover them</h3>
                  <span className="text-xs text-[#D4D4D8] font-bold">{selectedTopTeeth.size} top • {selectedBottomTeeth.size} bottom</span>
                </div>

                <svg viewBox="0 0 560 340" className="w-full h-auto select-none" role="group" aria-label="Interactive mouth. Tap a tooth to add or remove it from your grill.">
                  <defs>
                    <MetalDefs id="metal" metal={mat.metal} />
                    <linearGradient id="enamel" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fbf8f1" />
                      <stop offset="60%" stopColor="#ece4d3" />
                      <stop offset="100%" stopColor="#cfc3aa" />
                    </linearGradient>
                    <linearGradient id="gum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9f3b4a" />
                      <stop offset="100%" stopColor="#d9707c" />
                    </linearGradient>
                    <radialGradient id="mouth" cx="50%" cy="55%" r="60%">
                      <stop offset="0%" stopColor="#3b0d14" />
                      <stop offset="100%" stopColor="#120306" />
                    </radialGradient>
                    <pattern id="ice" width="7" height="7" patternUnits="userSpaceOnUse">
                      <rect width="7" height="7" fill="url(#metal)" />
                      <circle cx="3.5" cy="3.5" r="2.9" fill="#ffffff" />
                      <circle cx="2.6" cy="2.6" r="1" fill="#dbeafe" />
                    </pattern>
                    <pattern id="ice-rim" width="7" height="7" patternUnits="userSpaceOnUse">
                      <rect width="7" height="7" fill="transparent" />
                    </pattern>
                    <pattern id="diamond-cut" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <rect width="9" height="9" fill="transparent" />
                      <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4" />
                      <line x1="0" y1="0" x2="9" y2="0" stroke="rgba(0,0,0,0.35)" strokeWidth="1.4" />
                    </pattern>
                    <pattern id="nugget" width="12" height="12" patternUnits="userSpaceOnUse">
                      <rect width="12" height="12" fill="transparent" />
                      <circle cx="4" cy="4" r="3.4" fill="rgba(255,255,255,0.35)" />
                      <circle cx="10" cy="10" r="3" fill="rgba(0,0,0,0.25)" />
                    </pattern>
                    <pattern id="dust" width="5" height="5" patternUnits="userSpaceOnUse">
                      <rect width="5" height="5" fill="transparent" />
                      <circle cx="1.5" cy="1.5" r="0.7" fill="#fff" />
                      <circle cx="4" cy="3.5" r="0.5" fill="#fff" />
                    </pattern>
                  </defs>

                  {/* Inside of the mouth */}
                  <path d="M20,40 Q280,-10 540,40 L540,300 Q280,350 20,300 Z" fill="url(#mouth)" />
                  {renderArch(true)}
                  {renderArch(false)}
                </svg>

                {/* Design tools */}
                <div className="mt-4 bg-black/60 border border-white/10 rounded-md p-3">
                  <span className="text-[10px] tracking-widest text-[#D4D4D8] uppercase font-bold block mb-2">
                    Tool: {TOOTH_DESIGNS.find(t => t.id === activeTool)?.name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TOOTH_DESIGNS.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        title={`${tool.name}${tool.price ? ` (+$${tool.price}/tooth)` : ''}`}
                        aria-label={tool.name}
                        aria-pressed={activeTool === tool.id}
                        className={`w-10 h-10 rounded-md border flex items-center justify-center transition-colors ${activeTool === tool.id ? 'border-[#D4D4D8] bg-[#D4D4D8]/20 text-[#D4D4D8]' : 'border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/30 hover:text-white'}`}
                      >
                        {tool.icon}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">Pick a jewel or cutout, then tap the teeth you want it on. Tap again to remove it.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[true, false].map(isTop => (
                  <div key={String(isTop)} className="bg-zinc-900 border border-white/5 rounded-lg p-4">
                    <h4 className="text-xs tracking-widest uppercase text-zinc-400 mb-3">{isTop ? 'Top' : 'Bottom'} Quick Select</h4>
                    <div className="flex gap-2">
                      {[6, 8, 10].map(c => (
                        <button key={c} onClick={() => selectPreset(c, isTop)} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4D4D8] transition-colors rounded-sm">{c}</button>
                      ))}
                      <button
                        onClick={() => { if (isTop) { setSelectedTopTeeth(new Set()); setTopDesigns({}); } else { setSelectedBottomTeeth(new Set()); setBottomDesigns({}); } }}
                        className="flex-1 py-2 bg-black border border-white/10 text-xs text-zinc-500 hover:text-white transition-colors rounded-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                The preview is an approximation. Every grill is hand-made to the shape of your teeth, and the final quote is confirmed with Jeremy once your mold is taken.
              </p>
            </div>

            {/* Options */}
            <div className="lg:col-span-5 flex flex-col space-y-7">
              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">1. Metal</h3>
                <div className="grid grid-cols-2 gap-2">
                  {MATERIALS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMaterial(m.id)}
                      className={`p-3 border rounded-sm flex items-center gap-3 text-left transition-all ${material === m.id ? 'border-[#D4D4D8] bg-[#D4D4D8]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}`}
                    >
                      <span className="w-5 h-5 rounded-full shrink-0 border border-white/20" style={{ background: `linear-gradient(135deg, ${m.metal[0]}, ${m.metal[1]}, ${m.metal[2]})`, boxShadow: m.iced ? '0 0 10px rgba(255,255,255,0.7)' : 'none' }} />
                      <span className="text-xs font-bold flex-1">{m.name}</span>
                      {material === m.id && <Check className="w-4 h-4 text-[#D4D4D8]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">2. Style <span className="text-[#D4D4D8] text-[10px]">Included free</span></h3>
                <div className="flex flex-wrap gap-2">
                  {FREE_STYLES.map(s => (
                    <button key={s.id} onClick={() => setBaseStyle(s.id)} className={pillClass(baseStyle === s.id)}>{s.name}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">3. Add-Ons</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PREMIUM_ADDONS.map(a => {
                    const active = selectedAddons.has(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAddon(a.id)}
                        aria-pressed={active}
                        className={`p-3 border rounded-sm text-left transition-all relative ${active ? 'border-[#D4D4D8] bg-[#D4D4D8]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}`}
                      >
                        {active && <Check className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-[#D4D4D8]" />}
                        <span className="text-xs font-bold block pr-4">{a.name}</span>
                        <span className="text-[11px] text-zinc-400">+${a.price}/tooth {a.suffix || ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">4. Notes for Jeremy</h3>
                <textarea
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="E.g. put my initials on the left canine, or fang tips on the canines..."
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] h-20 resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-zinc-900 border border-white/10 rounded-sm p-5">
                <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-zinc-400">Your Grill</h3>
                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between"><span>{mat.name} × {totalTeeth} teeth</span><span>${basePrice.toLocaleString()}</span></div>
                  <div className="flex justify-between text-zinc-400"><span>Style: {FREE_STYLES.find(s => s.id === baseStyle)?.name}</span><span className="text-[#D4D4D8]">Free</span></div>
                  {Array.from(selectedAddons).map(id => {
                    const a = PREMIUM_ADDONS.find(x => x.id === id)!;
                    return <div key={id} className="flex justify-between text-zinc-300"><span>+ {a.name}</span><span>${(a.price * totalTeeth).toLocaleString()}</span></div>;
                  })}
                  {designTotal > 0 && <div className="flex justify-between text-zinc-300"><span>+ Jewels & cutouts ({designList.length})</span><span>${designTotal.toLocaleString()}</span></div>}
                </div>
                <div className="flex justify-between items-end mb-5 pt-4 border-t border-white/10">
                  <span className="text-xs uppercase tracking-widest font-bold">Estimate</span>
                  <span className="text-3xl font-heading font-black text-[#D4D4D8]">${totalPrice.toLocaleString()}</span>
                </div>

                <button
                  type="button"
                  disabled={totalTeeth === 0}
                  onClick={() => onBookAppointment({
                    teeth: { top: Array.from(selectedTopTeeth).sort((a, b) => a - b), bottom: Array.from(selectedBottomTeeth).sort((a, b) => a - b) },
                    material,
                    cuts: [baseStyle, ...Array.from(selectedAddons)],
                    notes: grillzSummary(),
                    serviceType: 'in-person',
                  })}
                  className="w-full bg-[#D4D4D8] text-black hover:bg-white font-black px-6 py-4 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(212,212,216,0.35)] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                >
                  <Calendar className="w-4 h-4" /> Book With This Design <ChevronRight className="w-4 h-4" />
                </button>
                {onOpenAILab && (
                  <button
                    type="button"
                    disabled={totalTeeth === 0}
                    onClick={() => onOpenAILab(grillzPrompt())}
                    className="w-full mt-3 border border-white/20 text-white hover:border-[#D4D4D8] font-bold px-6 py-3 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                  >
                    <Sparkles className="w-4 h-4" /> See It Rendered in the AI Lab
                  </button>
                )}
                <p className="text-[11px] text-zinc-500 text-center mt-3">No payment today. Your full design is sent with your booking.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-lg p-6 min-h-[380px] flex flex-col items-center justify-center">
                <h3 className="self-start text-xs tracking-widest text-zinc-400 uppercase font-bold mb-4">Live Preview</h3>
                {renderJewelryPreview()}
                <p className="text-sm text-zinc-300 mt-4 text-center">{jewelryDetails()} • {jewelryMetalName} • {jewelryStoneName}</p>
              </div>
              <p className="text-xs text-zinc-500 font-light leading-relaxed mt-4">
                The preview is a simple sketch. For a realistic picture of your piece, send it to the AI Lab. Jewelry is quoted by Jeremy at your consultation.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-7">
              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">1. Piece</h3>
                <div className="flex flex-wrap gap-2">
                  {JEWELRY_TYPES.map(t => <button key={t.id} onClick={() => setJewelryType(t.id)} className={pillClass(jewelryType === t.id)}>{t.name}</button>)}
                </div>
              </div>

              {jewelryType === 'pendant' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-heading font-black tracking-widest uppercase mb-3 block" htmlFor="pendant-text">2. Name or Text</label>
                    <input id="pendant-text" value={pendantText} maxLength={14} onChange={e => setPendantText(e.target.value)} className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#D4D4D8]" />
                  </div>
                  <div className="flex flex-wrap gap-2">{PENDANT_STYLES.map(s => <button key={s} onClick={() => setPendantStyle(s)} className={pillClass(pendantStyle === s)}>{s}</button>)}</div>
                  <div className="flex flex-wrap gap-2">{PENDANT_SIZES.map(s => <button key={s} onClick={() => setPendantSize(s)} className={pillClass(pendantSize === s)}>{s}</button>)}</div>
                </div>
              )}
              {jewelryType === 'chain' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-heading font-black tracking-widest uppercase">2. Chain Style</h3>
                  <div className="flex flex-wrap gap-2">{CHAIN_STYLES.map(s => <button key={s} onClick={() => setChainStyle(s)} className={pillClass(chainStyle === s)}>{s}</button>)}</div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block pt-2">Width</span>
                  <div className="flex flex-wrap gap-2">{CHAIN_WIDTHS.map(s => <button key={s} onClick={() => setChainWidth(s)} className={pillClass(chainWidth === s)}>{s}</button>)}</div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block pt-2">Length</span>
                  <div className="flex flex-wrap gap-2">{CHAIN_LENGTHS.map(s => <button key={s} onClick={() => setChainLength(s)} className={pillClass(chainLength === s)}>{s}</button>)}</div>
                </div>
              )}
              {jewelryType === 'ring' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-heading font-black tracking-widest uppercase">2. Ring Style</h3>
                  <div className="flex flex-wrap gap-2">{RING_STYLES.map(s => <button key={s} onClick={() => setRingStyle(s)} className={pillClass(ringStyle === s)}>{s}</button>)}</div>
                  {(ringStyle === 'Signet' || ringStyle === 'Custom Name Ring') && (
                    <input aria-label="Ring initials or name" value={pendantText} maxLength={6} onChange={e => setPendantText(e.target.value)} placeholder="Initials or name" className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#D4D4D8]" />
                  )}
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block pt-2">Ring Size</span>
                  <div className="flex flex-wrap gap-2">{RING_SIZES.map(s => <button key={s} onClick={() => setRingSize(s)} className={pillClass(ringSize === s)}>{s}</button>)}</div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">3. Metal</h3>
                <div className="grid grid-cols-2 gap-2">
                  {JEWELRY_METALS.map(m => (
                    <button key={m.id} onClick={() => setJewelryMetal(m.id)} className={`p-3 border rounded-sm flex items-center gap-3 text-left transition-all ${jewelryMetal === m.id ? 'border-[#D4D4D8] bg-[#D4D4D8]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}`}>
                      <span className="w-5 h-5 rounded-full shrink-0 border border-white/20" style={{ background: `linear-gradient(135deg, ${m.metal[0]}, ${m.metal[1]}, ${m.metal[2]})` }} />
                      <span className="text-xs font-bold">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">4. Stones</h3>
                <div className="flex flex-wrap gap-2">{JEWELRY_STONES.map(s => <button key={s.id} onClick={() => setJewelryStones(s.id)} className={pillClass(jewelryStones === s.id)}>{s.name}</button>)}</div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">5. Notes for Jeremy</h3>
                <textarea value={jewelryNotes} onChange={e => setJewelryNotes(e.target.value)} placeholder="Budget, font ideas, stone sizes, deadline..." className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] h-20 resize-none" />
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-sm p-5">
                <div className="flex justify-between items-end mb-5">
                  <span className="text-xs uppercase tracking-widest font-bold">Estimate</span>
                  <span className="text-base font-heading font-black text-[#D4D4D8]">Quoted at consultation</span>
                </div>
                <button
                  type="button"
                  onClick={() => onBookAppointment({ material: 'jewelry-only', cuts: [], notes: jewelrySummary(), serviceType: 'jewelry' })}
                  className="w-full bg-[#D4D4D8] text-black hover:bg-white font-black px-6 py-4 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(212,212,216,0.35)] rounded-sm"
                >
                  <Calendar className="w-4 h-4" /> Book a Jewelry Consultation <ChevronRight className="w-4 h-4" />
                </button>
                {onOpenAILab && (
                  <button
                    type="button"
                    onClick={() => onOpenAILab(jewelryPrompt())}
                    className="w-full mt-3 border border-white/20 text-white hover:border-[#D4D4D8] font-bold px-6 py-3 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 rounded-sm"
                  >
                    <Sparkles className="w-4 h-4" /> See It Rendered in the AI Lab
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
