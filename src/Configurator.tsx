import React, { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Star, Heart, Gem, MousePointer2, Calendar, Sparkles, Link2, CircleDot, Share2, RotateCcw } from 'lucide-react';
import {
  StudioDesign, GrillzDesign, JewelryDesign, ToothDesign, AddOn,
  MATERIALS, FREE_STYLES, PREMIUM_ADDONS, TOOTH_DESIGN_INFO, DEFAULT_DESIGN,
  JEWELRY_TYPES, JEWELRY_METALS, JEWELRY_STONES, PENDANT_STYLES, PENDANT_SIZES,
  CHAIN_STYLES, CHAIN_WIDTHS, CHAIN_LENGTHS, RING_STYLES, RING_SIZES,
  presetTeeth, grillzEstimate, toothDesignList, jewelryDetails, jewelryMetalName, jewelryStoneName, designShareUrl,
} from './design/designModel';
import { MouthPreview, JewelryPreview } from './design/DesignPreviews';
import FlowSteps from './design/FlowSteps';

export const STUDIO_STEPS = ['Design', 'AI Preview (optional)', 'Book'];

const TOOL_ICONS: Record<ToothDesign, React.ReactNode> = {
  'none': <MousePointer2 className="w-4 h-4" />,
  'red-jewel': <Gem className="w-4 h-4 text-red-500 fill-red-500" />,
  'blue-jewel': <Gem className="w-4 h-4 text-blue-500 fill-blue-500" />,
  'green-jewel': <Gem className="w-4 h-4 text-green-500 fill-green-500" />,
  'clear-jewel': <Gem className="w-4 h-4 text-white fill-white" />,
  'star-cutout': <Star className="w-4 h-4 fill-current" />,
  'heart-cutout': <Heart className="w-4 h-4 fill-current" />,
  'cross-cutout': <span className="font-black text-sm leading-none">✝</span>,
  'number-cutout': <span className="font-black font-serif text-sm leading-none">7</span>,
};

const pillClass = (active: boolean) =>
  `px-3 py-2 text-xs font-bold rounded-sm border transition-all ${
    active ? 'bg-[#D4D4D8] text-black border-[#D4D4D8]' : 'bg-zinc-900/60 text-zinc-300 border-white/10 hover:border-white/30'
  }`;

const optionCardClass = (active: boolean) =>
  `p-3 border rounded-sm flex items-center gap-3 text-left transition-all ${active ? 'border-[#D4D4D8] bg-[#D4D4D8]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}`;

export default function Configurator({
  design,
  onChange,
  onBack,
  onBook,
  onOpenAIPreview,
}: {
  design: StudioDesign;
  onChange: (design: StudioDesign) => void;
  onBack: () => void;
  onBook: () => void;
  onOpenAIPreview: () => void;
}) {
  const [activeTool, setActiveTool] = useState<ToothDesign>('none');
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const { mode, grillz, jewelry } = design;
  const setMode = (m: StudioDesign['mode']) => onChange({ ...design, mode: m });
  const setGrillz = (patch: Partial<GrillzDesign>) => onChange({ ...design, grillz: { ...grillz, ...patch } });
  const setJewelry = (patch: Partial<JewelryDesign>) => onChange({ ...design, jewelry: { ...jewelry, ...patch } });

  const mat = MATERIALS.find(m => m.id === grillz.material)!;
  const estimate = grillzEstimate(grillz);
  const designList = toothDesignList(grillz);

  const toggleTooth = (n: number, isTop: boolean) => {
    const teeth = new Set(isTop ? grillz.top : grillz.bottom);
    const designs = { ...(isTop ? grillz.topDesigns : grillz.bottomDesigns) };

    if (activeTool === 'none') {
      if (teeth.has(n)) {
        teeth.delete(n);
        delete designs[n];
      } else {
        teeth.add(n);
      }
    } else {
      teeth.add(n);
      if (designs[n] === activeTool) delete designs[n];
      else designs[n] = activeTool;
    }
    const sorted = [...teeth].sort((a, b) => a - b);
    setGrillz(isTop ? { top: sorted, topDesigns: designs } : { bottom: sorted, bottomDesigns: designs });
  };

  const toggleAddon = (id: AddOn) =>
    setGrillz({ addons: grillz.addons.includes(id) ? grillz.addons.filter(a => a !== id) : [...grillz.addons, id] });

  const setArch = (isTop: boolean, teeth: number[]) =>
    setGrillz(isTop ? { top: teeth, topDesigns: {} } : { bottom: teeth, bottomDesigns: {} });

  const handleShare = async () => {
    const url = designShareUrl(design);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Jawz custom design', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareStatus('Link copied. Paste it in a text or Instagram DM.');
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setShareStatus(`Copy this link: ${url}`);
    }
    setTimeout(() => setShareStatus(null), 6000);
  };

  const canContinue = mode === 'jewelry' || estimate.count > 0;

  const actions = (
    <>
      <button
        type="button"
        disabled={!canContinue}
        onClick={onBook}
        className="w-full bg-[#D4D4D8] text-black hover:bg-white font-black px-6 py-4 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(212,212,216,0.35)] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
      >
        <Calendar className="w-4 h-4" /> {mode === 'grillz' ? 'Book With This Design' : 'Book a Jewelry Consultation'} <ChevronRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        disabled={!canContinue}
        onClick={onOpenAIPreview}
        className="w-full mt-3 border border-white/20 text-white hover:border-[#D4D4D8] font-bold px-6 py-3 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
      >
        <Sparkles className="w-4 h-4" /> See It Realistic in AI Preview
      </button>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button type="button" onClick={handleShare} className="border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 font-bold px-3 py-2.5 text-[11px] tracking-widest uppercase rounded-sm flex justify-center items-center gap-2">
          <Share2 className="w-3.5 h-3.5" /> Share Design
        </button>
        <button type="button" onClick={() => onChange({ ...DEFAULT_DESIGN, mode })} className="border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 font-bold px-3 py-2.5 text-[11px] tracking-widest uppercase rounded-sm flex justify-center items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5" /> Start Over
        </button>
      </div>
      {shareStatus && <p role="status" className="text-[11px] text-[#D4D4D8] mt-3 break-all">{shareStatus}</p>}
      <p className="text-[11px] text-zinc-500 text-center mt-3">No payment today. Your design is saved on this device and sent with your booking.</p>
    </>
  );

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
              <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight">Design Studio</h1>
              <p className="text-sm text-zinc-400">Design your grillz or custom jewelry, see it realistic in AI Preview, then book it.</p>
            </div>
          </div>
          <FlowSteps steps={STUDIO_STEPS} active={0} />
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist">
          {[{ id: 'grillz' as const, label: 'Grillz', icon: <CircleDot className="w-4 h-4" /> }, { id: 'jewelry' as const, label: 'Pendants, Chains & Rings', icon: <Link2 className="w-4 h-4" /> }].map(tab => (
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
              <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-lg p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-xs tracking-widest text-zinc-400 uppercase font-bold">Live Preview • Tap teeth to cover them</h3>
                  <span className="text-xs text-[#D4D4D8] font-bold">{grillz.top.length} top • {grillz.bottom.length} bottom</span>
                </div>

                <MouthPreview design={grillz} onToothClick={toggleTooth} />

                {/* Design tools */}
                <div className="mt-4 bg-black/60 border border-white/10 rounded-md p-3">
                  <span className="text-[10px] tracking-widest text-[#D4D4D8] uppercase font-bold block mb-2">
                    Tool: {TOOTH_DESIGN_INFO.find(t => t.id === activeTool)?.name}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TOOTH_DESIGN_INFO.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        title={`${tool.name}${tool.price ? ` (+$${tool.price}/tooth)` : ''}`}
                        aria-label={tool.name}
                        aria-pressed={activeTool === tool.id}
                        className={`w-10 h-10 rounded-md border flex items-center justify-center transition-colors ${activeTool === tool.id ? 'border-[#D4D4D8] bg-[#D4D4D8]/20 text-[#D4D4D8]' : 'border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/30 hover:text-white'}`}
                      >
                        {TOOL_ICONS[tool.id]}
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
                        <button key={c} onClick={() => setArch(isTop, presetTeeth(c))} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4D4D8] transition-colors rounded-sm">{c}</button>
                      ))}
                      <button onClick={() => setArch(isTop, [])} className="flex-1 py-2 bg-black border border-white/10 text-xs text-zinc-500 hover:text-white transition-colors rounded-sm">
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
                    <button key={m.id} onClick={() => setGrillz({ material: m.id })} className={optionCardClass(grillz.material === m.id)}>
                      <span className="w-5 h-5 rounded-full shrink-0 border border-white/20" style={{ background: `linear-gradient(135deg, ${m.metal[0]}, ${m.metal[1]}, ${m.metal[2]})`, boxShadow: m.iced ? '0 0 10px rgba(255,255,255,0.7)' : 'none' }} />
                      <span className="text-xs font-bold flex-1">{m.name}</span>
                      {grillz.material === m.id && <Check className="w-4 h-4 text-[#D4D4D8]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">2. Style <span className="text-[#D4D4D8] text-[10px]">Included free</span></h3>
                <div className="flex flex-wrap gap-2">
                  {FREE_STYLES.map(s => (
                    <button key={s.id} onClick={() => setGrillz({ baseStyle: s.id })} className={pillClass(grillz.baseStyle === s.id)}>{s.name}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">3. Add-Ons</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PREMIUM_ADDONS.map(a => {
                    const active = grillz.addons.includes(a.id);
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
                <label htmlFor="grillz-notes" className="text-sm font-heading font-black tracking-widest uppercase mb-3 block">4. Notes for Jeremy</label>
                <textarea
                  id="grillz-notes"
                  value={grillz.notes}
                  onChange={e => setGrillz({ notes: e.target.value })}
                  placeholder="E.g. put my initials on the left canine, or fang tips on the canines..."
                  className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] h-20 resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-zinc-900 border border-white/10 rounded-sm p-5">
                <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-zinc-400">Your Grill</h3>
                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between"><span>{mat.name} × {estimate.count} teeth</span><span>${estimate.base.toLocaleString()}</span></div>
                  <div className="flex justify-between text-zinc-400"><span>Style: {FREE_STYLES.find(s => s.id === grillz.baseStyle)?.name}</span><span className="text-[#D4D4D8]">Free</span></div>
                  {grillz.addons.map(id => {
                    const a = PREMIUM_ADDONS.find(x => x.id === id)!;
                    return <div key={id} className="flex justify-between text-zinc-300"><span>+ {a.name}</span><span>${(a.price * estimate.count).toLocaleString()}</span></div>;
                  })}
                  {estimate.designs > 0 && <div className="flex justify-between text-zinc-300"><span>+ Jewels & cutouts ({designList.length})</span><span>${estimate.designs.toLocaleString()}</span></div>}
                </div>
                <div className="flex justify-between items-end mb-5 pt-4 border-t border-white/10">
                  <span className="text-xs uppercase tracking-widest font-bold">Estimate</span>
                  <span className="text-3xl font-heading font-black text-[#D4D4D8]">${estimate.total.toLocaleString()}</span>
                </div>
                {actions}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-lg p-6 min-h-[380px] flex flex-col items-center justify-center">
                <h3 className="self-start text-xs tracking-widest text-zinc-400 uppercase font-bold mb-4">Live Preview</h3>
                <JewelryPreview design={jewelry} />
                <p className="text-sm text-zinc-300 mt-4 text-center">{jewelryDetails(jewelry)} • {jewelryMetalName(jewelry)} • {jewelryStoneName(jewelry)}</p>
              </div>
              <p className="text-xs text-zinc-500 font-light leading-relaxed mt-4">
                The preview is a simple sketch. For a realistic picture of your piece, send it to AI Preview. Jewelry is quoted by Jeremy at your consultation.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-7">
              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">1. Piece</h3>
                <div className="flex flex-wrap gap-2">
                  {JEWELRY_TYPES.map(t => <button key={t.id} onClick={() => setJewelry({ type: t.id })} className={pillClass(jewelry.type === t.id)}>{t.name}</button>)}
                </div>
              </div>

              {jewelry.type === 'pendant' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-heading font-black tracking-widest uppercase mb-3 block" htmlFor="pendant-text">2. Name or Text</label>
                    <input id="pendant-text" value={jewelry.text} maxLength={14} onChange={e => setJewelry({ text: e.target.value })} className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#D4D4D8]" />
                  </div>
                  <div className="flex flex-wrap gap-2">{PENDANT_STYLES.map(s => <button key={s} onClick={() => setJewelry({ pendantStyle: s })} className={pillClass(jewelry.pendantStyle === s)}>{s}</button>)}</div>
                  <div className="flex flex-wrap gap-2">{PENDANT_SIZES.map(s => <button key={s} onClick={() => setJewelry({ pendantSize: s })} className={pillClass(jewelry.pendantSize === s)}>{s}</button>)}</div>
                </div>
              )}
              {jewelry.type === 'chain' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-heading font-black tracking-widest uppercase">2. Chain Style</h3>
                  <div className="flex flex-wrap gap-2">{CHAIN_STYLES.map(s => <button key={s} onClick={() => setJewelry({ chainStyle: s })} className={pillClass(jewelry.chainStyle === s)}>{s}</button>)}</div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block pt-2">Width</span>
                  <div className="flex flex-wrap gap-2">{CHAIN_WIDTHS.map(s => <button key={s} onClick={() => setJewelry({ chainWidth: s })} className={pillClass(jewelry.chainWidth === s)}>{s}</button>)}</div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block pt-2">Length</span>
                  <div className="flex flex-wrap gap-2">{CHAIN_LENGTHS.map(s => <button key={s} onClick={() => setJewelry({ chainLength: s })} className={pillClass(jewelry.chainLength === s)}>{s}</button>)}</div>
                </div>
              )}
              {jewelry.type === 'ring' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-heading font-black tracking-widest uppercase">2. Ring Style</h3>
                  <div className="flex flex-wrap gap-2">{RING_STYLES.map(s => <button key={s} onClick={() => setJewelry({ ringStyle: s })} className={pillClass(jewelry.ringStyle === s)}>{s}</button>)}</div>
                  {(jewelry.ringStyle === 'Signet' || jewelry.ringStyle === 'Custom Name Ring') && (
                    <input aria-label="Ring initials or name" value={jewelry.text} maxLength={6} onChange={e => setJewelry({ text: e.target.value })} placeholder="Initials or name" className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#D4D4D8]" />
                  )}
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block pt-2">Ring Size</span>
                  <div className="flex flex-wrap gap-2">{RING_SIZES.map(s => <button key={s} onClick={() => setJewelry({ ringSize: s })} className={pillClass(jewelry.ringSize === s)}>{s}</button>)}</div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">3. Metal</h3>
                <div className="grid grid-cols-2 gap-2">
                  {JEWELRY_METALS.map(m => (
                    <button key={m.id} onClick={() => setJewelry({ metal: m.id })} className={optionCardClass(jewelry.metal === m.id)}>
                      <span className="w-5 h-5 rounded-full shrink-0 border border-white/20" style={{ background: `linear-gradient(135deg, ${m.metal[0]}, ${m.metal[1]}, ${m.metal[2]})` }} />
                      <span className="text-xs font-bold">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">4. Stones</h3>
                <div className="flex flex-wrap gap-2">{JEWELRY_STONES.map(s => <button key={s.id} onClick={() => setJewelry({ stones: s.id })} className={pillClass(jewelry.stones === s.id)}>{s.name}</button>)}</div>
              </div>

              <div>
                <label htmlFor="jewelry-notes" className="text-sm font-heading font-black tracking-widest uppercase mb-3 block">5. Notes for Jeremy</label>
                <textarea id="jewelry-notes" value={jewelry.notes} onChange={e => setJewelry({ notes: e.target.value })} placeholder="Budget, font ideas, stone sizes, deadline..." className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] h-20 resize-none" />
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-sm p-5">
                <div className="flex justify-between items-end mb-5">
                  <span className="text-xs uppercase tracking-widest font-bold">Estimate</span>
                  <span className="text-base font-heading font-black text-[#D4D4D8]">Quoted at consultation</span>
                </div>
                {actions}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
