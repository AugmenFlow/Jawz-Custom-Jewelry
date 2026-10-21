import React, { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Calendar, Share2, RotateCcw, X } from 'lucide-react';
import {
  StudioDesign, GrillzDesign, AddOn,
  METALS, GOLD_COLORS, STONES, STONE_STYLES, FREE_STYLES, PREMIUM_ADDONS, DEFAULT_DESIGN,
  presetTeeth, grillzEstimate, grillzMetalName, grillzStoneName, metalShades, designShareUrl,
  toothKey, toothLabel, toothNoteList,
} from './design/designModel';
import { MouthPreview } from './design/DesignPreviews';
import FlowSteps from './design/FlowSteps';

export const STUDIO_STEPS = ['Design', 'Book'];

const pillClass = (active: boolean) =>
  `px-3 py-2 text-xs font-bold rounded-sm border transition-all ${
    active ? 'bg-[#D4D4D8] text-black border-[#D4D4D8]' : 'bg-zinc-900/60 text-zinc-300 border-white/10 hover:border-white/30'
  }`;

const swatch = (shades: [string, string, string]) => `linear-gradient(135deg, ${shades[0]}, ${shades[1]}, ${shades[2]})`;

const optionCardClass = (active: boolean) =>
  `p-3 border rounded-sm flex items-center gap-3 text-left transition-all ${active ? 'border-[#D4D4D8] bg-[#D4D4D8]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}`;

export default function Configurator({
  design,
  onChange,
  onBack,
  onBook,
}: {
  design: StudioDesign;
  onChange: (design: StudioDesign) => void;
  onBack: () => void;
  onBook: () => void;
}) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  // The covered tooth whose design is being written, e.g. "top-7"
  const [noteTooth, setNoteTooth] = useState<string | null>(null);

  const { grillz } = design;
  const setGrillz = (patch: Partial<GrillzDesign>) => onChange({ ...design, grillz: { ...grillz, ...patch } });

  const estimate = grillzEstimate(grillz);
  const isGold = grillz.metal !== 'silver';
  const stepNumber = (() => { let n = 0; return () => ++n; })();

  const toggleTooth = (n: number, isTop: boolean) => {
    const teeth = new Set(isTop ? grillz.top : grillz.bottom);
    if (teeth.has(n)) teeth.delete(n);
    else teeth.add(n);
    const sorted = [...teeth].sort((a, b) => a - b);
    setGrillz(isTop ? { top: sorted } : { bottom: sorted });
  };

  const toggleAddon = (id: AddOn) =>
    setGrillz({ addons: grillz.addons.includes(id) ? grillz.addons.filter(a => a !== id) : [...grillz.addons, id] });

  const setArch = (isTop: boolean, teeth: number[]) =>
    setGrillz(isTop ? { top: teeth } : { bottom: teeth });

  const setToothNote = (key: string, note: string) => {
    const toothNotes = { ...grillz.toothNotes };
    if (note) toothNotes[key] = note;
    else delete toothNotes[key];
    setGrillz({ toothNotes });
  };

  // Notes are only kept for teeth that are still covered
  const coveredTeeth = [true, false].flatMap(isTop =>
    [...(isTop ? grillz.top : grillz.bottom)].sort((a, b) => a - b).map(n => ({ key: toothKey(isTop, n), label: toothLabel(isTop, n) })),
  );
  const activeNoteTooth = coveredTeeth.find(t => t.key === noteTooth) || null;
  const toothNotes = toothNoteList(grillz);

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

  const canContinue = estimate.count > 0;

  const actions = (
    <>
      <button
        type="button"
        disabled={!canContinue}
        onClick={onBook}
        className="w-full bg-[#D4D4D8] text-black hover:bg-white font-black px-6 py-4 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(212,212,216,0.35)] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
      >
        <Calendar className="w-4 h-4" /> Book With This Design <ChevronRight className="w-4 h-4" />
      </button>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button type="button" onClick={handleShare} className="border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 font-bold px-3 py-2.5 text-[11px] tracking-widest uppercase rounded-sm flex justify-center items-center gap-2">
          <Share2 className="w-3.5 h-3.5" /> Share Design
        </button>
        <button type="button" onClick={() => onChange(DEFAULT_DESIGN)} className="border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 font-bold px-3 py-2.5 text-[11px] tracking-widest uppercase rounded-sm flex justify-center items-center gap-2">
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
              <p className="text-sm text-zinc-400">Design your grillz, see a live price, then book it.</p>
            </div>
          </div>
          <FlowSteps steps={STUDIO_STEPS} active={0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Mouth Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-lg p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="text-xs tracking-widest text-zinc-400 uppercase font-bold">Live Preview • Tap numbered teeth to cover them</h3>
                <span className="text-xs text-[#D4D4D8] font-bold">{grillz.top.length} top • {grillz.bottom.length} bottom</span>
              </div>

              <MouthPreview design={grillz} onToothClick={toggleTooth} />
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
            {/* Designs on specific teeth */}
            <div className="bg-zinc-900 border border-white/5 rounded-lg p-4">
              <h4 className="text-xs tracking-widest uppercase text-zinc-400 mb-1">Designs on Specific Teeth <span className="text-zinc-600 normal-case tracking-normal">(optional)</span></h4>
              <p className="text-[11px] text-zinc-500 mb-3">Each tooth is numbered on the preview: T for top, B for bottom. Pick a covered tooth and tell Jeremy what you want on it, like a stone, initials, a cutout or a fang tip.</p>
              {coveredTeeth.length === 0 ? (
                <p className="text-xs text-zinc-500">Cover some teeth first.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose a tooth">
                    {coveredTeeth.map(t => {
                      const hasNote = Boolean(grillz.toothNotes[t.key]?.trim());
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setNoteTooth(noteTooth === t.key ? null : t.key)}
                          aria-pressed={noteTooth === t.key}
                          className={`px-2.5 py-1.5 text-[11px] font-bold rounded-sm border transition-all ${
                            noteTooth === t.key ? 'bg-[#D4D4D8] text-black border-[#D4D4D8]' : hasNote ? 'border-[#D4D4D8]/60 text-[#D4D4D8] bg-[#D4D4D8]/10' : 'border-white/10 text-zinc-300 bg-black hover:border-white/30'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                  {activeNoteTooth && (
                    <div className="mt-3">
                      <label htmlFor="tooth-note" className="text-[10px] uppercase tracking-widest text-[#D4D4D8] font-bold block mb-1.5">Design for {activeNoteTooth.label}</label>
                      <input
                        id="tooth-note"
                        autoFocus
                        value={grillz.toothNotes[activeNoteTooth.key] || ''}
                        maxLength={120}
                        onChange={e => setToothNote(activeNoteTooth.key, e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') setNoteTooth(null); }}
                        placeholder="E.g. single moissanite stone, letter J cutout, fang tip..."
                        className="w-full bg-black border border-white/10 rounded-sm p-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8]"
                      />
                    </div>
                  )}
                  {toothNotes.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-xs">
                      {toothNotes.map(t => (
                        <li key={t.label} className="flex items-start justify-between gap-3 bg-black/60 border border-white/5 rounded-sm px-2.5 py-2">
                          <span><span className="font-bold text-[#D4D4D8]">{t.label}:</span> <span className="text-zinc-300">{t.note}</span></span>
                          <button type="button" onClick={() => setToothNote(toothKey(t.isTop, t.n), '')} aria-label={`Remove the design for ${t.label}`} className="text-zinc-500 hover:text-red-400 shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-[11px] text-zinc-500 mt-3">Jeremy confirms any extra cost for tooth-specific designs at your consultation.</p>
                </>
              )}
            </div>

            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              The preview is an approximation. Every grill is hand-made to the shape of your teeth, and the final quote is confirmed with Jeremy once your mold is taken.
            </p>
          </div>

          {/* Options */}
          <div className="lg:col-span-5 flex flex-col space-y-7">
            <div>
              <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">{stepNumber()}. Metal</h3>
              <div className="grid grid-cols-2 gap-2">
                {METALS.map(m => (
                  <button key={m.id} onClick={() => setGrillz({ metal: m.id })} aria-pressed={grillz.metal === m.id} className={optionCardClass(grillz.metal === m.id)}>
                    <span className="w-5 h-5 rounded-full shrink-0 border border-white/20" style={{ background: swatch(metalShades({ ...grillz, metal: m.id })) }} />
                    <span className="text-xs font-bold flex-1">{m.name}</span>
                    {grillz.metal === m.id && <Check className="w-4 h-4 text-[#D4D4D8]" />}
                  </button>
                ))}
              </div>
            </div>

            {isGold && (
              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">{stepNumber()}. Gold Color</h3>
                <div className="grid grid-cols-3 gap-2">
                  {GOLD_COLORS.map(c => (
                    <button key={c.id} onClick={() => setGrillz({ color: c.id })} aria-pressed={grillz.color === c.id} className={optionCardClass(grillz.color === c.id)}>
                      <span className="w-5 h-5 rounded-full shrink-0 border border-white/20" style={{ background: swatch(c.metal) }} />
                      <span className="text-xs font-bold">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">{stepNumber()}. Stones</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setGrillz({ stones: true })} aria-pressed={grillz.stones} className={pillClass(grillz.stones)}>Yes, iced out</button>
                <button onClick={() => setGrillz({ stones: false })} aria-pressed={!grillz.stones} className={pillClass(!grillz.stones)}>No stones</button>
              </div>
              {grillz.stones && (
                <div className="mt-4 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Stone</span>
                    <div className="flex flex-wrap gap-2">
                      {STONES.map(st => (
                        <button key={st.id} onClick={() => setGrillz({ stone: st.id })} aria-pressed={grillz.stone === st.id} className={pillClass(grillz.stone === st.id)}>{st.name}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Setting Style <span className="text-[#D4D4D8]">Same price for every style</span></span>
                    <div className="flex flex-wrap gap-2">
                      {STONE_STYLES.map(st => (
                        <button key={st.id} onClick={() => setGrillz({ stoneStyle: st.id })} aria-pressed={grillz.stoneStyle === st.id} className={pillClass(grillz.stoneStyle === st.id)}>{st.name}</button>
                      ))}
                    </div>
                    {grillz.stoneStyle === 'other' && <p className="text-[11px] text-zinc-500 mt-2">Describe the setting you want in the Notes for Jeremy below.</p>}
                  </div>
                </div>
              )}
            </div>

            {!grillz.stones && (
              <div>
                <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">{stepNumber()}. Style <span className="text-[#D4D4D8] text-[10px]">Included free</span></h3>
                <div className="flex flex-wrap gap-2">
                  {FREE_STYLES.map(s => (
                    <button key={s.id} onClick={() => setGrillz({ baseStyle: s.id })} aria-pressed={grillz.baseStyle === s.id} className={pillClass(grillz.baseStyle === s.id)}>{s.name}</button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-heading font-black tracking-widest uppercase mb-3">{stepNumber()}. Add-Ons</h3>
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
              <label htmlFor="grillz-notes" className="text-sm font-heading font-black tracking-widest uppercase mb-3 block">{stepNumber()}. Notes for Jeremy</label>
              <textarea
                id="grillz-notes"
                value={grillz.notes}
                onChange={e => setGrillz({ notes: e.target.value })}
                placeholder="Anything else, like your budget, deadline or a reference photo you'll send..."
                className="w-full bg-black border border-white/10 rounded-sm p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] h-20 resize-none"
              />
            </div>

            {/* Summary */}
            <div className="bg-zinc-900 border border-white/10 rounded-sm p-5">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-zinc-400">Your Grill</h3>
              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between gap-3"><span>{grillzMetalName(grillz)} × {estimate.count} teeth</span><span className="shrink-0">{estimate.base === null ? 'Quoted' : `$${estimate.base.toLocaleString()}`}</span></div>
                <div className="flex justify-between text-zinc-400"><span>{grillz.stones ? grillzStoneName(grillz) : `Style: ${FREE_STYLES.find(s => s.id === grillz.baseStyle)?.name}`}</span>{!grillz.stones && <span className="text-[#D4D4D8]">Free</span>}</div>
                {grillz.addons.map(id => {
                  const a = PREMIUM_ADDONS.find(x => x.id === id)!;
                  return <div key={id} className="flex justify-between text-zinc-300"><span>+ {a.name}</span><span>${(a.price * estimate.count).toLocaleString()}</span></div>;
                })}
                {toothNotes.length > 0 && <div className="flex justify-between text-zinc-300"><span>+ Tooth designs ({toothNotes.length})</span><span className="text-zinc-400">Quoted</span></div>}
              </div>
              <div className="flex justify-between items-end mb-5 pt-4 border-t border-white/10">
                <span className="text-xs uppercase tracking-widest font-bold">Estimate</span>
                {estimate.total === null
                  ? <span className="text-base font-heading font-black text-[#D4D4D8] text-right">Quoted at consultation</span>
                  : <span className="text-3xl font-heading font-black text-[#D4D4D8]">${estimate.total.toLocaleString()}</span>}
              </div>
              {actions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
