import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, ChevronRight, Info, Star, Heart, Gem, MousePointer2, Calendar } from 'lucide-react';

type Material = 'silver-moissanite' | 'silver-lab-diamond' | 'silver-plain' | '10k-gold' | '14k-gold';
type AddOn = 'rose-cuts' | 'starburst-cuts' | 'speciality-open-face' | 'laser-design' | 'diamond-dust' | '3d-design';
type FreeStyle = 'solid' | 'open-face' | 'perm-cut' | 'diamond-cuts' | 'nugget-cut';

type ToothDesign = 'none' | 'red-jewel' | 'blue-jewel' | 'green-jewel' | 'clear-jewel' | 'star-cutout' | 'heart-cutout' | 'cross-cutout' | 'number-cutout';

const MATERIALS: { id: Material; name: string; color: string }[] = [
  { id: 'silver-moissanite', name: 'Silver Moissanite Grillz', color: '#f8fafc' },
  { id: 'silver-lab-diamond', name: 'Silver Lab Diamond Grillz', color: '#ffffff' },
  { id: 'silver-plain', name: 'Silver Plain Grillz', color: '#e2e8f0' },
  { id: '10k-gold', name: '10K Gold Plain Grillz', color: '#e5b840' },
  { id: '14k-gold', name: '14K Gold Plain Grillz', color: '#d4af37' },
];

const FREE_STYLES: { id: FreeStyle; name: string }[] = [
  { id: 'solid', name: 'Solid (Default)' },
  { id: 'open-face', name: 'Open Face' },
  { id: 'perm-cut', name: 'Perm Cut' },
  { id: 'diamond-cuts', name: 'Diamond Cuts' },
  { id: 'nugget-cut', name: 'Nugget Cut' },
];

const PREMIUM_ADDONS: { id: AddOn; name: string; price: number; perTooth: boolean; isLabelSuffix?: string }[] = [
  { id: 'rose-cuts', name: 'Rose Cuts', price: 7, perTooth: true },
  { id: 'starburst-cuts', name: 'Starburst Cuts', price: 7, perTooth: true },
  { id: 'speciality-open-face', name: 'Speciality Cut Open Face', price: 20, perTooth: true },
  { id: 'laser-design', name: 'Laser Design', price: 25, perTooth: true },
  { id: 'diamond-dust', name: 'Diamond Dust', price: 5, perTooth: true },
  { id: '3d-design', name: '3D Design', price: 85, perTooth: true, isLabelSuffix: 'and up' },
];

const TOOTH_DESIGNS: { id: ToothDesign; name: string; price: number; icon: React.ReactNode }[] = [
  { id: 'none', name: 'Select/Deselect', price: 0, icon: <MousePointer2 className="w-4 h-4" /> },
  { id: 'red-jewel', name: 'Red Jewel', price: 50, icon: <Gem className="w-4 h-4 text-red-500 fill-red-500" /> },
  { id: 'blue-jewel', name: 'Blue Jewel', price: 50, icon: <Gem className="w-4 h-4 text-blue-500 fill-blue-500" /> },
  { id: 'green-jewel', name: 'Green Jewel', price: 50, icon: <Gem className="w-4 h-4 text-green-500 fill-green-500" /> },
  { id: 'clear-jewel', name: 'Clear Jewel', price: 50, icon: <Gem className="w-4 h-4 text-white fill-white" /> },
  { id: 'star-cutout', name: 'Star Cutout', price: 20, icon: <Star className="w-4 h-4 text-zinc-800 fill-zinc-800" /> },
  { id: 'heart-cutout', name: 'Heart Cutout', price: 20, icon: <Heart className="w-4 h-4 text-zinc-800 fill-zinc-800" /> },
  { id: 'cross-cutout', name: 'Cross Cutout', price: 20, icon: <svg className="w-4 h-4 text-zinc-800 fill-current" viewBox="0 0 24 24"><path d="M10.5 2H13.5V8.5H20V11.5H13.5V22H10.5V11.5H4V8.5H10.5V2Z"/></svg> },
  { id: 'number-cutout', name: 'Number Cutout', price: 20, icon: <span className="text-zinc-800 font-black font-serif text-[14px] leading-none text-center">7</span> },
];

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
  
  if (material === '14k-gold') {
    if (count <= 2) return 350;
    if (count <= 4) return 520;
    return count * 115;
  }
  
  return 0;
}

export default function Configurator({ 
  onBack, 
  onBookAppointment 
}: { 
  onBack: () => void; 
  onBookAppointment: (data: { teeth: { top: number[]; bottom: number[] }; material: string; cuts: string[]; notes: string }) => void;
}) {
  const [material, setMaterial] = useState<Material>('14k-gold');
  const [baseStyle, setBaseStyle] = useState<FreeStyle>('solid');
  const [selectedAddons, setSelectedAddons] = useState<Set<AddOn>>(new Set());
  
  const [activeTool, setActiveTool] = useState<ToothDesign>('none');
  
  const [selectedTopTeeth, setSelectedTopTeeth] = useState<Set<number>>(new Set([4, 5, 6, 7, 8, 9]));
  const [selectedBottomTeeth, setSelectedBottomTeeth] = useState<Set<number>>(new Set());
  
  const [topDesigns, setTopDesigns] = useState<Record<number, ToothDesign>>({});
  const [bottomDesigns, setBottomDesigns] = useState<Record<number, ToothDesign>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleTooth = (index: number, isTop: boolean) => {
    const selected = isTop ? selectedTopTeeth : selectedBottomTeeth;
    const setSelected = isTop ? setSelectedTopTeeth : setSelectedBottomTeeth;
    const designs = isTop ? topDesigns : bottomDesigns;
    const setDesigns = isTop ? setTopDesigns : setBottomDesigns;

    if (activeTool === 'none') {
      const newSet = new Set(selected);
      if (newSet.has(index)) {
        newSet.delete(index);
        const newDesigns = { ...designs };
        delete newDesigns[index];
        setDesigns(newDesigns);
      } else {
        newSet.add(index);
      }
      setSelected(newSet);
    } else {
      const newSet = new Set(selected);
      newSet.add(index);
      setSelected(newSet);
      
      const newDesigns = { ...designs };
      if (newDesigns[index] === activeTool) {
        delete newDesigns[index];
      } else {
        newDesigns[index] = activeTool;
      }
      setDesigns(newDesigns);
    }
  };

  const toggleAddon = (id: AddOn) => {
    const newSet = new Set(selectedAddons);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAddons(newSet);
  };

  const selectPreset = (count: number, isTop: boolean) => {
    const exactSet = new Set<number>();
    const startIdx = 7 - (count / 2);
    for (let i = 0; i < count; i++) {
        exactSet.add(startIdx + i);
    }

    if (isTop) {
      setSelectedTopTeeth(exactSet);
      setTopDesigns({});
    } else {
      setSelectedBottomTeeth(exactSet);
      setBottomDesigns({});
    }
  };

  const totalTeeth = selectedTopTeeth.size + selectedBottomTeeth.size;

  const getDesignTotal = () => {
    let total = 0;
    const allDesigns = [...Object.values(topDesigns), ...Object.values(bottomDesigns)];
    allDesigns.forEach(d => {
      const designConfig = TOOTH_DESIGNS.find(td => td.id === d);
      if (designConfig) total += designConfig.price;
    });
    return total;
  };

  const totalPrice = useMemo(() => {
    const base = calculateBasePrice(material, totalTeeth);
    let addonsTotal = 0;
    selectedAddons.forEach(id => {
      const addon = PREMIUM_ADDONS.find(a => a.id === id);
      if (addon) {
        addonsTotal += addon.perTooth ? (addon.price * totalTeeth) : addon.price;
      }
    });
    return base + addonsTotal + getDesignTotal();
  }, [selectedTopTeeth, selectedBottomTeeth, material, selectedAddons, topDesigns, bottomDesigns]);

  const renderTeethRow = (isTop: boolean) => {
    const teeth = Array.from({ length: 14 }).map((_, i) => i);
    const selected = isTop ? selectedTopTeeth : selectedBottomTeeth;
    const designs = isTop ? topDesigns : bottomDesigns;
    const matColor = MATERIALS.find(m => m.id === material)?.color || '#fff';
    const isIced = material === 'silver-moissanite' || material === 'silver-lab-diamond';
    
    return (
      <div className={`flex justify-center -space-x-1 ${!isTop ? 'mt-4 rotate-180' : ''}`}>
        {teeth.map(t => {
          const isSelected = selected.has(t);
          const tDesign = designs[t];
          const isCenter = t === 6 || t === 7;
          const isMid = t === 5 || t === 8;
          const isCanine = t === 4 || t === 9;
          
          let heightClass = 'h-10';
          let mtClass = 'mt-4';
          if (isCenter) { heightClass = 'h-14'; mtClass = 'mt-0'; }
          else if (isMid) { heightClass = 'h-12'; mtClass = 'mt-2'; }
          else if (isCanine) { heightClass = 'h-[3.25rem]'; mtClass = 'mt-3'; }
          
          let styleProps: any = {};
          if (isSelected) {
              styleProps = { 
                  backgroundColor: matColor,
                  boxShadow: isIced ? 'inset 0 0 10px rgba(255,255,255,0.8), 0 0 5px rgba(255,255,255,0.5)' : 'inset -2px -2px 10px rgba(0,0,0,0.5), inset 2px 2px 10px rgba(255,255,255,0.5)'
              };
              
              if (baseStyle === 'open-face' || selectedAddons.has('speciality-open-face')) {
                  styleProps = {
                      ...styleProps,
                      backgroundColor: 'transparent',
                      border: `3px solid ${matColor}`,
                      boxShadow: 'none'
                  }
              }
          }

          return (
            <button
              key={t}
              onClick={() => toggleTooth(t, isTop)}
              className={`w-8 ${heightClass} ${mtClass} rounded-b-xl border border-zinc-800 transition-all duration-300 relative group overflow-hidden
                ${!isSelected ? 'bg-zinc-900 hover:bg-zinc-800' : ''}
              `}
              style={styleProps}
            >
              {isSelected && isIced && baseStyle !== 'open-face' && !selectedAddons.has('speciality-open-face') && (
                  <div className="absolute inset-0 opacity-60 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
              )}
              {isSelected && tDesign && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none ${!isTop ? 'rotate-180' : ''}`}>
                  {tDesign === 'red-jewel' && <span className="drop-shadow-lg scale-150"><Gem className="w-3 h-3 text-red-500 fill-red-600" /></span>}
                  {tDesign === 'blue-jewel' && <span className="drop-shadow-lg scale-150"><Gem className="w-3 h-3 text-blue-500 fill-blue-600" /></span>}
                  {tDesign === 'green-jewel' && <span className="drop-shadow-lg scale-150"><Gem className="w-3 h-3 text-green-500 fill-green-600" /></span>}
                  {tDesign === 'clear-jewel' && <span className="drop-shadow-lg scale-150"><Gem className="w-3 h-3 text-white fill-white" /></span>}
                  {tDesign === 'star-cutout' && <Star className="w-4 h-4 text-[#0a0a09] fill-[#0a0a09]" />}
                  {tDesign === 'heart-cutout' && <Heart className="w-4 h-4 text-[#0a0a09] fill-[#0a0a09]" />}
                  {tDesign === 'cross-cutout' && <svg className="w-4 h-4 text-[#0a0a09] fill-current" viewBox="0 0 24 24"><path d="M10.5 2H13.5V8.5H20V11.5H13.5V22H10.5V11.5H4V8.5H10.5V2Z"/></svg>}
                  {tDesign === 'number-cutout' && <span className="text-[#0a0a09] font-black font-serif text-[14px] leading-none text-center">7</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-[#0a0a09] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center mb-8 pb-8 border-b border-white/10">
          <button onClick={onBack} className="flex items-center text-zinc-400 hover:text-white transition-colors mr-8">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <div>
            <h1 className="text-3xl font-heading font-black uppercase tracking-tight">Tooth Lab</h1>
            <p className="text-sm text-zinc-400">Interactive Grillz Configurator • Select teeth, cuts & materials with real-time pricing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Interactive Viewer */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-zinc-950 border border-white/10 rounded-lg p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden mb-6">
                
                {/* Visualizer Environment */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-600 via-black to-black"></div>
                
                <h3 className="absolute top-6 left-6 text-xs tracking-widest text-zinc-500 uppercase font-bold">Interactive Preview</h3>
                
                {/* Design Tools */}
                <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-20 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                    <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold mb-1 px-1">Design Tools</span>
                    <div className="flex gap-2">
                        {TOOTH_DESIGNS.map(tool => (
                            <button 
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                title={`${tool.name} ${tool.price > 0 ? `(+$${tool.price})` : ''}`}
                                className={`w-10 h-10 rounded-md border flex items-center justify-center transition-colors
                                  ${activeTool === tool.id ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]' : 'border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/30 hover:text-white'}
                                `}
                            >
                                {tool.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-lg mt-16">
                    {renderTeethRow(true)}
                    
                    {/* Mouth Gap */}
                    <div className="h-6 w-full flex items-center justify-center"></div>
                    
                    {renderTeethRow(false)}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-white/5 rounded-lg p-4">
                    <h4 className="text-xs tracking-widest uppercase text-zinc-400 mb-3">Top Selection</h4>
                    <div className="flex gap-2">
                        <button onClick={() => selectPreset(6, true)} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4AF37] transition-colors">6 TOP</button>
                        <button onClick={() => selectPreset(8, true)} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4AF37] transition-colors">8 TOP</button>
                        <button onClick={() => selectPreset(10, true)} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4AF37] transition-colors">10 TOP</button>
                        <button onClick={() => { setSelectedTopTeeth(new Set()); setTopDesigns({}); }} className="flex-1 py-2 bg-black border border-white/10 text-xs text-zinc-500 hover:text-white transition-colors">CLEAR</button>
                    </div>
                </div>
                <div className="bg-zinc-900 border border-white/5 rounded-lg p-4">
                    <h4 className="text-xs tracking-widest uppercase text-zinc-400 mb-3">Bottom Selection</h4>
                    <div className="flex gap-2">
                        <button onClick={() => selectPreset(6, false)} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4AF37] transition-colors">6 BOT</button>
                        <button onClick={() => selectPreset(8, false)} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4AF37] transition-colors">8 BOT</button>
                        <button onClick={() => selectPreset(10, false)} className="flex-1 py-2 bg-black border border-white/10 text-xs font-bold hover:border-[#D4AF37] transition-colors">10 BOT</button>
                        <button onClick={() => { setSelectedBottomTeeth(new Set()); setBottomDesigns({}); }} className="flex-1 py-2 bg-black border border-white/10 text-xs text-zinc-500 hover:text-white transition-colors">CLEAR</button>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-zinc-900 border border-white/5 rounded-lg p-6">
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                   * Our interactive preview provides an approximate representation. Real products are hand-crafted to fit the distinct shape of your teeth. Final quotes will be confirmed upon receiving your mold. Click individual teeth on the diagram above to add or remove them.
                   <br/><br/>
                   <span className="text-[#D4AF37] font-semibold">Tip: Select a design tool (like a red jewel or heart cutout) from the top right panel, then click on the specific teeth you want to customize!</span>
                </p>
            </div>
          </div>

          {/* Configurator Panel */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            
            {/* 1. Material */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-heading font-black tracking-widest uppercase">1. Material</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {MATERIALS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m.id as Material)}
                    className={`p-4 border rounded-sm flex items-center transition-all relative overflow-hidden
                      ${material === m.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}
                    `}
                  >
                    <span 
                      className="w-5 h-5 rounded-full mr-4 shadow-sm border border-white/20 shrink-0" 
                      style={{ 
                          backgroundColor: m.color,
                          boxShadow: (m.id === 'silver-moissanite' || m.id === 'silver-lab-diamond') ? '0 0 10px rgba(255,255,255,0.8)' : 'none'
                      }}>
                    </span>
                    <span className="text-sm font-bold flex-1 text-left">{m.name}</span>
                    {material === m.id && <Check className="w-4 h-4 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Free Base Styles */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-heading font-black tracking-widest uppercase">2. Base Style (Included)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FREE_STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setBaseStyle(s.id as FreeStyle)}
                    className={`p-4 border rounded-sm flex flex-col transition-all text-left
                      ${baseStyle === s.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}
                    `}
                  >
                    <span className="text-sm font-bold">{s.name}</span>
                    <span className="text-xs text-[#D4AF37] mt-1">FREE</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Premium Add-Ons */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-heading font-black tracking-widest uppercase">3. Premium Add-Ons</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PREMIUM_ADDONS.map(a => {
                    const isSelected = selectedAddons.has(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAddon(a.id)}
                        className={`p-4 border rounded-sm flex flex-col transition-all text-left relative
                          ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 hover:border-white/30 bg-zinc-900/50'}
                        `}
                      >
                        {isSelected && <Check className="absolute top-3 right-3 w-4 h-4 text-[#D4AF37]" />}
                        <span className="text-sm font-bold pr-5">{a.name}</span>
                        <span className="text-xs text-zinc-400 mt-1">+\${a.price}{a.perTooth ? '/tooth' : ''} {a.isLabelSuffix || ''}</span>
                      </button>
                    )
                })}
              </div>
            </div>

            {/* 4. Special Instructions */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-heading font-black tracking-widest uppercase">4. Special Instructions</h3>
              </div>
              <div className="bg-zinc-900/50 border border-white/10 rounded-sm p-4 hover:border-white/30 transition-all">
                 <textarea 
                   value={specialInstructions}
                   onChange={(e) => setSpecialInstructions(e.target.value)}
                   placeholder="E.g., Put my name 'KING' on the top right tooth, or use a special font for cutouts..."
                   className="w-full bg-black border border-white/5 rounded-md p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37] h-24 resize-none transition-colors"
                 />
                 <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-2">Optional • Write down any custom engraving or design requests</p>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 bg-zinc-900 border border-white/10 rounded-sm p-6">
               <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-zinc-400">Build Summary</h3>
               
               <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-sm">
                       <span>{MATERIALS.find(m => m.id === material)?.name} x {totalTeeth} teeth</span>
                       <span>\${calculateBasePrice(material, totalTeeth).toLocaleString()}</span>
                   </div>
                   {baseStyle !== 'solid' && (
                       <div className="flex justify-between text-sm text-zinc-400">
                           <span>Base Style: {FREE_STYLES.find(s => s.id === baseStyle)?.name}</span>
                           <span className="text-[#D4AF37]">FREE</span>
                       </div>
                   )}
                   {selectedAddons.size > 0 && Array.from(selectedAddons).map(id => {
                       const addon = PREMIUM_ADDONS.find(a => a.id === id)!;
                       const cost = addon.perTooth ? (addon.price * totalTeeth) : addon.price;
                       return (
                           <div key={id} className="flex justify-between text-sm text-zinc-300">
                               <span>+ {addon.name}</span>
                               <span>\${cost.toLocaleString()}</span>
                           </div>
                       );
                   })}
                   
                   {/* Specific Customizations */}
                   {getDesignTotal() > 0 && (
                       <div className="flex justify-between text-sm text-zinc-300 border-t border-white/5 pt-3">
                           <span>+ Per-Tooth Interventions (Jewels/Cutouts)</span>
                           <span>\${getDesignTotal().toLocaleString()}</span>
                       </div>
                   )}

                   <div className="flex justify-between text-sm text-zinc-500 pt-3 border-t border-white/10">
                       <span>Custom Fit Mold Kit</span>
                       <span className="text-[#D4AF37]">FREE</span>
                   </div>
               </div>

               <div className="flex justify-between items-end mb-6">
                   <span className="text-sm uppercase tracking-widest font-bold">Total Estimated Price</span>
                   <span className="text-3xl font-heading font-black text-[#D4AF37]">\${totalPrice.toLocaleString()}</span>
               </div>
               
               <button 
                 type="button"
                 onClick={() => {
                   if (totalTeeth > 0) {
                     onBookAppointment({
                       teeth: {
                         top: Array.from(selectedTopTeeth),
                         bottom: Array.from(selectedBottomTeeth)
                       },
                       material,
                       cuts: Array.from(selectedAddons),
                       notes: `Configured in Tooth Lab: Base style ${FREE_STYLES.find(s => s.id === baseStyle)?.name || 'Solid'}. ${specialInstructions ? `Notes: ${specialInstructions}` : ''}`
                     });
                   }
                 }}
                 disabled={totalTeeth === 0}
                 className="w-full bg-[#D4AF37] text-black hover:bg-[#ffe175] font-black px-6 py-4 text-xs tracking-widest uppercase transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.35)] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
               >
                 <Calendar className="w-4 h-4" />
                 <span>Book Fitting With This Design</span>
                 <ChevronRight className="w-4 h-4" />
               </button>
               <p className="text-[11px] text-zinc-400 text-center mt-3 font-light leading-relaxed">
                 No payment charged today. Choose in-person Arlington studio fitting or express mail-order mold kit.
               </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
