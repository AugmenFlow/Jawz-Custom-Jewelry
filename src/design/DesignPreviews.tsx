import React, { useId } from 'react';
import {
  GrillzDesign, JewelryDesign, MetalShades, ToothDesign, ToothKind,
  MATERIALS, JEWELRY_METALS, CHAIN_WIDTHS, TOOTH_NUMBERS, KIND_LABEL, toothKind, jewelryDetails,
} from './designModel';

const JEWEL_COLORS: Partial<Record<ToothDesign, string>> = {
  'red-jewel': '#e11d48', 'blue-jewel': '#2563eb', 'green-jewel': '#16a34a', 'clear-jewel': '#f8fafc',
};

// Front-view sizes for each tooth type (upper arch is larger than lower)
const UPPER_SIZE: Record<ToothKind, [number, number]> = { central: [48, 92], lateral: [38, 80], canine: [36, 88], premolar: [32, 72], molar: [30, 62] };
const LOWER_SIZE: Record<ToothKind, [number, number]> = { central: [32, 66], lateral: [34, 68], canine: [36, 76], premolar: [34, 62], molar: [33, 54] };

const VIEW_W = 560;
const CENTER_X = VIEW_W / 2;
const ARCH_CURVE = 0.0011;
const UPPER_GUM_Y = 96;
const LOWER_GUM_Y = 306;
const GUM_DEPTH = 34;

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
    const tooth = { n, kind, x, w, h, gumY: (isTop ? UPPER_GUM_Y : LOWER_GUM_Y) - lift };
    x += w + 2;
    return tooth;
  });
};

const UPPER_ARCH = layoutArch(true);
const LOWER_ARCH = layoutArch(false);

const gumPath = (arch: ToothLayout[], isTop: boolean) => {
  const first = arch[0];
  const last = arch[arch.length - 1];
  const out = isTop ? -GUM_DEPTH : GUM_DEPTH;
  const inner = isTop ? 6 : -6;
  const left = first.x - 8;
  const right = last.x + last.w + 8;
  const outer = arch.map(t => `${t.x + t.w / 2},${t.gumY + out}`).join(' L');
  const edge = [...arch].reverse().map(t => `${t.x + t.w / 2},${t.gumY + inner}`).join(' L');
  return `M${left},${first.gumY + out} L${outer} L${right},${last.gumY + out} L${right},${last.gumY + inner} L${edge} L${left},${first.gumY + inner} Z`;
};

export const MetalGradient = ({ id, metal }: { id: string; metal: MetalShades }) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor={metal[0]} />
    <stop offset="45%" stopColor={metal[1]} />
    <stop offset="100%" stopColor={metal[2]} />
  </linearGradient>
);

/** SVG ids must be unique on the page; React's useId contains colons, which break url(#...) references. */
const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, '');

interface MouthPreviewProps {
  design: GrillzDesign;
  /** Leave out to show a picture that can't be clicked. */
  onToothClick?: (n: number, isTop: boolean) => void;
  className?: string;
}

/** Front view of an open smile, with the grill drawn on the covered teeth. */
export function MouthPreview({ design, onToothClick, className = 'w-full h-auto select-none' }: MouthPreviewProps) {
  const uid = useSvgId();
  const ref = (name: string) => `url(#${uid}-${name})`;
  const mat = MATERIALS.find(m => m.id === design.material) || MATERIALS[1];
  const isOpenFace = design.baseStyle === 'open-face' || design.addons.includes('speciality-cut');
  const interactive = Boolean(onToothClick);

  const renderArch = (isTop: boolean) => {
    const arch = isTop ? UPPER_ARCH : LOWER_ARCH;
    const selected = new Set(isTop ? design.top : design.bottom);
    const designs = isTop ? design.topDesigns : design.bottomDesigns;

    return (
      <g>
        {arch.map(t => {
          const isSelected = selected.has(t.n);
          const toothDesign = designs[t.n];
          const path = toothPath(t.kind, t.w, t.h);
          const transform = isTop ? `translate(${t.x},${t.gumY})` : `translate(${t.x},${t.gumY}) scale(1,-1)`;
          const cx = t.x + t.w / 2;
          const cy = isTop ? t.gumY + t.h * 0.55 : t.gumY - t.h * 0.55;
          const label = `${isTop ? 'Top' : 'Bottom'} tooth #${t.n} (${KIND_LABEL[t.kind]})${isSelected ? ' — covered' : ''}`;
          const solidFill = isSelected && !isOpenFace;
          const texture = solidFill
            ? mat.iced ? ref('ice') : design.baseStyle === 'diamond-cuts' ? ref('diamond-cut') : design.baseStyle === 'nugget-cut' ? ref('nugget') : null
            : null;

          const handlers = interactive ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': label,
            'aria-pressed': isSelected,
            onClick: () => onToothClick!(t.n, isTop),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToothClick!(t.n, isTop); }
            },
            className: 'cursor-pointer outline-none group',
          } : {};

          return (
            <g key={t.n} {...handlers}>
              <title>{label}</title>
              <g transform={transform}>
                <path d={path} fill={ref('enamel')} stroke="#b9ad97" strokeWidth={1} />
                {solidFill && <path d={path} fill={ref('metal')} stroke={mat.metal[2]} strokeWidth={1.2} />}
                {texture && <path d={path} fill={texture} />}
                {solidFill && design.addons.includes('diamond-dust') && <path d={path} fill={ref('dust')} />}
                {solidFill && (design.addons.includes('rose-cuts') || design.addons.includes('starburst-cuts')) && (
                  <g stroke="rgba(255,255,255,0.85)" strokeWidth={1}>
                    <line x1={t.w / 2} y1={t.h * 0.2} x2={t.w / 2} y2={t.h * 0.85} />
                    <line x1={t.w * 0.15} y1={t.h * 0.52} x2={t.w * 0.85} y2={t.h * 0.52} />
                    {design.addons.includes('starburst-cuts') && <>
                      <line x1={t.w * 0.22} y1={t.h * 0.3} x2={t.w * 0.78} y2={t.h * 0.75} />
                      <line x1={t.w * 0.78} y1={t.h * 0.3} x2={t.w * 0.22} y2={t.h * 0.75} />
                    </>}
                  </g>
                )}
                {isSelected && isOpenFace && (
                  <path d={path} fill="none" stroke={ref('metal')} strokeWidth={6} strokeLinejoin="round" />
                )}
                {solidFill && !mat.iced && (
                  <path d={`M${t.w * 0.2},${t.h * 0.12} Q${t.w * 0.28},${t.h * 0.5} ${t.w * 0.24},${t.h * 0.78}`} stroke="rgba(255,255,255,0.7)" strokeWidth={3} fill="none" strokeLinecap="round" />
                )}
                {interactive && <path d={path} fill="transparent" className="group-hover:fill-white/10 group-focus-visible:fill-white/20" />}
              </g>

              {isSelected && toothDesign && JEWEL_COLORS[toothDesign] && (
                <g>
                  <polygon points={`${cx},${cy - 9} ${cx + 8},${cy - 2} ${cx},${cy + 9} ${cx - 8},${cy - 2}`} fill={JEWEL_COLORS[toothDesign]} stroke="#fff" strokeWidth={1.2} />
                  <polygon points={`${cx},${cy - 9} ${cx + 3},${cy - 2} ${cx},${cy + 2} ${cx - 3},${cy - 2}`} fill="rgba(255,255,255,0.6)" />
                </g>
              )}
              {isSelected && toothDesign === 'star-cutout' && (
                <polygon fill="#111" points={Array.from({ length: 10 }, (_, i) => { const r = i % 2 ? 4 : 10; const a = -Math.PI / 2 + i * Math.PI / 5; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(' ')} />
              )}
              {isSelected && toothDesign === 'heart-cutout' && (
                <path fill="#111" d={`M${cx},${cy + 8} C${cx - 13},${cy - 1} ${cx - 7},${cy - 11} ${cx},${cy - 4} C${cx + 7},${cy - 11} ${cx + 13},${cy - 1} ${cx},${cy + 8} Z`} />
              )}
              {isSelected && toothDesign === 'cross-cutout' && (
                <path fill="#111" d={`M${cx - 2.5},${cy - 11} h5 v6 h6 v5 h-6 v11 h-5 v-11 h-6 v-5 h6 Z`} />
              )}
              {isSelected && toothDesign === 'number-cutout' && (
                <text x={cx} y={cy + 7} textAnchor="middle" fontSize={20} fontWeight={900} fontFamily="serif" fill="#111">7</text>
              )}
            </g>
          );
        })}
        <path d={gumPath(arch, isTop)} fill={ref('gum')} pointerEvents="none" />
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 560 340"
      className={className}
      role={interactive ? 'group' : 'img'}
      aria-label={interactive ? 'Interactive mouth. Tap a tooth to add or remove it from your grill.' : `Grill design: ${design.top.length} top and ${design.bottom.length} bottom teeth`}
    >
      <defs>
        <MetalGradient id={`${uid}-metal`} metal={mat.metal} />
        <linearGradient id={`${uid}-enamel`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf8f1" />
          <stop offset="60%" stopColor="#ece4d3" />
          <stop offset="100%" stopColor="#cfc3aa" />
        </linearGradient>
        <linearGradient id={`${uid}-gum`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9f3b4a" />
          <stop offset="100%" stopColor="#d9707c" />
        </linearGradient>
        <radialGradient id={`${uid}-mouth`} cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#3b0d14" />
          <stop offset="100%" stopColor="#120306" />
        </radialGradient>
        <pattern id={`${uid}-ice`} width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill={ref('metal')} />
          <circle cx="3.5" cy="3.5" r="2.9" fill="#ffffff" />
          <circle cx="2.6" cy="2.6" r="1" fill="#dbeafe" />
        </pattern>
        <pattern id={`${uid}-diamond-cut`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(255,255,255,0.75)" strokeWidth="1.4" />
          <line x1="0" y1="0" x2="9" y2="0" stroke="rgba(0,0,0,0.35)" strokeWidth="1.4" />
        </pattern>
        <pattern id={`${uid}-nugget`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="3.4" fill="rgba(255,255,255,0.35)" />
          <circle cx="10" cy="10" r="3" fill="rgba(0,0,0,0.25)" />
        </pattern>
        <pattern id={`${uid}-dust`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.7" fill="#fff" />
          <circle cx="4" cy="3.5" r="0.5" fill="#fff" />
        </pattern>
      </defs>

      {/* Inside of the mouth */}
      <path d="M20,40 Q280,-10 540,40 L540,300 Q280,350 20,300 Z" fill={ref('mouth')} />
      {renderArch(true)}
      {renderArch(false)}
    </svg>
  );
}

/** Simple sketch of a pendant, chain or ring. */
export function JewelryPreview({ design, className = 'w-full max-w-md' }: { design: JewelryDesign; className?: string }) {
  const uid = useSvgId();
  const ref = (name: string) => `url(#${uid}-${name})`;
  const metal = (JEWELRY_METALS.find(m => m.id === design.metal) || JEWELRY_METALS[0]).metal;
  const iced = design.stones !== 'none';
  const surface = iced ? ref('ice') : ref('metal');
  const { pendantStyle, ringStyle, chainStyle } = design;
  const text = design.text;

  return (
    <svg viewBox="0 0 400 320" className={className} role="img" aria-label={`Preview of ${jewelryDetails(design)}`}>
      <defs>
        <MetalGradient id={`${uid}-metal`} metal={metal} />
        <pattern id={`${uid}-ice`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill={ref('metal')} />
          <circle cx="4" cy="4" r="3" fill="#fff" opacity="0.9" />
          <circle cx="3" cy="3" r="1" fill="#e0f2fe" />
        </pattern>
      </defs>
      {design.type === 'pendant' && (
        <g>
          <path d="M60,0 Q200,150 340,0" fill="none" stroke={ref('metal')} strokeWidth={6} strokeDasharray="10 4" />
          <rect x="188" y="72" width="24" height="26" rx="5" fill={surface} stroke={metal[2]} />
          <text
            x="200" y="190" textAnchor="middle"
            fontSize={pendantStyle === 'Initial' ? 120 : Math.max(36, 92 - text.length * 6)}
            fontFamily={pendantStyle === 'Script Name' ? '"Alex Brush", cursive' : '"Archivo", sans-serif'}
            fontWeight={pendantStyle === 'Script Name' ? 400 : 900}
            fill={surface} stroke={metal[2]} strokeWidth={1.5}
          >
            {(pendantStyle === 'Initial' ? text.slice(0, 1) : text) || 'JAWZ'}
          </text>
          {(pendantStyle === 'Logo / Custom Shape' || pendantStyle === 'Photo Medallion') && (
            <circle cx="200" cy="170" r="70" fill="none" stroke={surface} strokeWidth={14} />
          )}
        </g>
      )}
      {design.type === 'chain' && (
        <g>
          {Array.from({ length: 13 }, (_, i) => {
            const t = i / 12;
            const x = 40 + t * 320;
            const y = 60 + Math.sin(t * Math.PI) * 170;
            const size = 8 + Math.max(0, CHAIN_WIDTHS.indexOf(design.chainWidth)) * 3;
            const angle = Math.cos(t * Math.PI) * -35;
            if (chainStyle === 'Tennis') {
              return <g key={i}><rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={2} fill={ref('metal')} /><circle cx={x} cy={y} r={size / 2.6} fill="#fff" /></g>;
            }
            return (
              <ellipse
                key={i} cx={x} cy={y} rx={size * (chainStyle === 'Cuban Link' ? 1.25 : 1)} ry={size * 0.75}
                transform={`rotate(${angle + (chainStyle === 'Rope' ? 45 : 0)} ${x} ${y})`}
                fill="none" stroke={surface} strokeWidth={size * 0.55}
              />
            );
          })}
        </g>
      )}
      {design.type === 'ring' && (
        <g>
          <ellipse cx="200" cy="200" rx="110" ry="70" fill="none" stroke={ref('metal')} strokeWidth={ringStyle === 'Wedding Band' ? 26 : 16} />
          {ringStyle === 'Wedding Band' && iced && <ellipse cx="200" cy="200" rx="110" ry="70" fill="none" stroke={ref('ice')} strokeWidth={10} />}
          {(ringStyle === 'Solitaire Engagement' || ringStyle === 'Cluster / Pinky') && (
            <g>
              <path d="M170,140 L200,95 L230,140 Z" fill={ref('metal')} />
              <polygon points="200,60 232,88 200,128 168,88" fill={iced ? '#f8fafc' : ref('metal')} stroke="#cbd5e1" strokeWidth={2} />
              <polygon points="200,60 212,88 200,100 188,88" fill="rgba(186,230,253,0.8)" />
              {ringStyle === 'Cluster / Pinky' && [-38, 38].map(dx => <circle key={dx} cx={200 + dx} cy={110} r={12} fill={iced ? '#f8fafc' : ref('metal')} stroke="#cbd5e1" />)}
            </g>
          )}
          {(ringStyle === 'Signet' || ringStyle === 'Custom Name Ring') && (
            <g>
              <rect x="140" y="90" width="120" height="70" rx="14" fill={surface} stroke={metal[2]} />
              <text x="200" y="138" textAnchor="middle" fontSize="34" fontWeight={900} fontFamily='"Archivo", sans-serif' fill="#18181b" opacity="0.75">
                {(text || 'J').slice(0, ringStyle === 'Signet' ? 2 : 6)}
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
