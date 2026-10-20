import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Sparkles, Upload, Image as ImageIcon, Loader2, Calendar, 
  ExternalLink, Copy, Check, Share2, HelpCircle, Layers, CheckCircle2, 
  Trash2, RefreshCw, Gem, ShieldCheck, ChevronRight, AlertCircle, Info, X
} from 'lucide-react';

interface AILabProps {
  onBack: () => void;
  initialIdea?: string;
  onOpenToothLab?: () => void;
  onBookConsultation?: (data: {
    notes: string;
    serviceType: 'in-person' | 'mail-order' | 'jewelry' | 'adjustment';
    material?: string;
    teeth?: { top: number[]; bottom: number[] };
    cuts?: string[];
    attachedMockupImage?: string;
    geminiShareLink?: string;
  }) => void;
}

const PRESET_PROMPTS = [
  {
    id: 'gold-8-perm',
    title: '8-Tooth 14K Gold Deep Perm Cuts',
    category: 'Grillz',
    prompt: 'A photorealistic studio macro photo of custom 8-tooth top grillz in 14k solid yellow gold with deep perm cuts and mirror polish. Placed on black velvet luxury jewelry display. Ultra-sharp details, high-end hip-hop jewelry style, cinematic studio lighting, 8k resolution.'
  },
  {
    id: 'moissanite-fangs',
    title: 'Silver Moissanite VVS Canine Fangs',
    category: 'Grillz',
    prompt: 'A hyper-realistic 3D render of custom canine fangs grillz in 925 sterling silver encrusted with round brilliant VVS moissanite stones that pass diamond testers. Extreme fire, rainbow brilliance, black reflective surface, macro jewelry photography.'
  },
  {
    id: 'open-face-dust',
    title: 'Top 6 Open Face 14K White Gold & Diamond Dust',
    category: 'Grillz',
    prompt: 'A photorealistic commercial render of top 6 open-face grillz in 14k solid white gold with textured diamond dust frosted borders and high polish rims. Clean luxury aesthetic, studio spotlighting.'
  },
  {
    id: 'lion-pendant',
    title: '3D Sculpted Medallion Pendant & Iced Bail',
    category: 'Jewelry',
    prompt: 'A luxury photorealistic 3D jewelry render of a heavy solid 14k yellow gold lion head medallion pendant with micro-pave VS1 diamond eyes and an oversized iced-out rope bail. Clean black obsidian backdrop, professional jeweler showcase.'
  },
  {
    id: 'bottom-8-clean',
    title: 'Bottom 8 Solid 10K Gold Clean Caps',
    category: 'Grillz',
    prompt: 'A photorealistic product render of a bottom 8-tooth solid 10k yellow gold grill with seamless dental fit and mirror-shine gloss. Pure, clean, minimalist Dallas Texas luxury grillz style.'
  }
];

const MATERIAL_OPTIONS = [
  { id: '10k-gold', label: '10K Solid Yellow Gold', desc: '$95/tooth (Most Popular)' },
  { id: '14k-gold', label: '14K Solid Yellow Gold', desc: '$115/tooth' },
  { id: '14k-white-gold', label: '14K Solid White Gold', desc: '$115/tooth' },
  { id: 'silver-moissanite', label: 'Silver Moissanite (VVS)', desc: 'Passes Diamond Testers' },
  { id: 'silver-lab-diamond', label: 'Silver Lab Diamond (VVS)', desc: 'Colorless D-F Certified' },
  { id: 'silver-plain', label: '925 Dental Silver', desc: '$40/tooth (Budget Classic)' },
  { id: '18k-natural', label: '18K Gold / Natural Diamonds', desc: 'Bespoke Consultation' }
];

export default function AILab({ onBack, onBookConsultation, initialIdea, onOpenToothLab }: AILabProps) {
  // Mode: Gemini Workflow (Primary) vs In-Studio Fast Generator
  const [activeTab, setActiveTab] = useState<'gemini' | 'in-app'>('gemini');

  // GEMINI WORKFLOW STATE
  const [selectedPromptPreset, setSelectedPromptPreset] = useState<string>(PRESET_PROMPTS[0].id);
  const [customPromptIdea, setCustomPromptIdea] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Dynamic Prompt Builder fields
  const [builderMetal, setBuilderMetal] = useState<string>('14k solid yellow gold');
  const [builderPiece, setBuilderPiece] = useState<string>('8-tooth top grillz');
  const [builderCut, setBuilderCut] = useState<string>('deep perm cuts');

  // SUBMIT BACK STATE
  const [geminiImage, setGeminiImage] = useState<string | null>(null);
  const [geminiShareUrl, setGeminiShareUrl] = useState<string>('');
  const [designCategory, setDesignCategory] = useState<'grillz' | 'pendant' | 'chain' | 'ring'>('grillz');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('10k-gold');
  const [teethSelectionType, setTeethSelectionType] = useState<'top-6' | 'top-8' | 'bottom-6' | 'bottom-8' | 'full-16' | 'custom'>('top-8');
  const [submissionNotes, setSubmissionNotes] = useState<string>('');
  const [servicePreference, setServicePreference] = useState<'in-person' | 'mail-order' | 'jewelry'>('in-person');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);

  const fileDropRef = useRef<HTMLInputElement>(null);

  // IN-APP GENERATOR STATE
  const [inAppDescription, setInAppDescription] = useState('');
  const [inAppReferenceImage, setInAppReferenceImage] = useState<string | null>(null);
  const [isInAppGenerating, setIsInAppGenerating] = useState(false);
  const [inAppGeneratedUrl, setInAppGeneratedUrl] = useState<string | null>(null);
  const inAppFileInputRef = useRef<HTMLInputElement>(null);

  // A design sent over from the Tooth Lab fills in both generators
  useEffect(() => {
    if (initialIdea) {
      setCustomPromptIdea(initialIdea);
      setInAppDescription(`A photorealistic studio photo of ${initialIdea}. Dark background, luxury jewelry lighting.`);
      setSubmissionNotes(`Designed in the Tooth Lab: ${initialIdea}`);
    }
  }, [initialIdea]);

  // Compute active prompt for Gemini
  const activePromptText = React.useMemo(() => {
    if (customPromptIdea.trim()) {
      return `A photorealistic studio macro product photo of a custom luxury ${builderPiece} in ${builderMetal} with ${builderCut}. Client custom details: ${customPromptIdea}. Shot with 85mm macro lens, high-contrast black velvet background, realistic dental/jewelry shine and gemstone brilliance, 8k resolution.`;
    }
    const preset = PRESET_PROMPTS.find(p => p.id === selectedPromptPreset);
    return preset ? preset.prompt : PRESET_PROMPTS[0].prompt;
  }, [customPromptIdea, builderMetal, builderPiece, builderCut, selectedPromptPreset]);

  // Copy Prompt handler
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(activePromptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Image Upload handler for Gemini submission
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setGeminiImage(event.target?.result as string);
      setNoticeMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setGeminiImage(event.target?.result as string);
        setNoticeMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Gemini Design Back to Site / Booking
  const handleSubmitDesignToBooking = () => {
    if (!geminiImage && !geminiShareUrl.trim() && !submissionNotes.trim()) {
      setNoticeMessage({
        text: 'Please upload your Gemini design image, paste a Gemini share link, or add design notes to submit.',
        type: 'error'
      });
      return;
    }

    setNoticeMessage(null);
    setIsSubmitting(true);

    // Compute preset teeth if grillz
    // Teeth are numbered 1-14 left to right; 7 and 8 are the front teeth
    const SIX = [5, 6, 7, 8, 9, 10];
    const EIGHT = [4, 5, 6, 7, 8, 9, 10, 11];
    let teethPreset: { top: number[]; bottom: number[] } = { top: SIX, bottom: [] };
    if (teethSelectionType === 'top-8') {
      teethPreset = { top: EIGHT, bottom: [] };
    } else if (teethSelectionType === 'bottom-6') {
      teethPreset = { top: [], bottom: SIX };
    } else if (teethSelectionType === 'bottom-8') {
      teethPreset = { top: [], bottom: EIGHT };
    } else if (teethSelectionType === 'full-16') {
      teethPreset = { top: EIGHT, bottom: EIGHT };
    }

    const notePayload = `Gemini AI Mockup Submission:\nCategory: ${designCategory.toUpperCase()}\n${geminiShareUrl ? `Gemini Link: ${geminiShareUrl}\n` : ''}${submissionNotes ? `Client Notes: ${submissionNotes}` : 'Design submitted via Gemini AI Studio.'}`;

    if (onBookConsultation) {
      onBookConsultation({
        notes: notePayload,
        serviceType: designCategory === 'grillz' ? servicePreference : 'jewelry',
        material: selectedMaterial,
        teeth: designCategory === 'grillz' ? teethPreset : undefined,
        attachedMockupImage: geminiImage || undefined,
        geminiShareLink: geminiShareUrl.trim() || undefined
      });
    }

    setIsSubmitting(false);
    setSubmittedSuccess(true);
  };

  // In-App generator handler
  const handleInAppGenerate = async () => {
    if (!inAppDescription.trim()) {
      setNoticeMessage({
        text: 'Please provide a description for your custom piece.',
        type: 'error'
      });
      return;
    }

    setNoticeMessage(null);
    setIsInAppGenerating(true);
    setInAppGeneratedUrl(null);

    try {
      let fullPrompt = `A premium quality photorealistic image of a custom designed jewelry piece (pendant, chain, or grillz) in silver or gold with diamonds or plain. Product photography style, clean dark or neutral background, 8k resolution. Client description: ${inAppDescription}`;
      if (inAppReferenceImage) {
        fullPrompt += `. The design should be inspired by the uploaded logo or picture.`;
      }

      const payload: any = { prompt: fullPrompt };
      if (inAppReferenceImage) {
        const [mime, data] = inAppReferenceImage.split(',');
        const mimeType = mime.split(';')[0].split(':')[1];
        payload.image = { mimeType, data };
      }

      const response = await fetch('/api/generate-mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setNoticeMessage({
          text: 'Server took too long to respond. You can use the Google Gemini Studio tab above for instant, limitless generation!',
          type: 'info'
        });
        return;
      }

      const data = await response.json();
      if (data.imageUrl) {
        setInAppGeneratedUrl(data.imageUrl);
        setNoticeMessage({
          text: 'Custom concept generated! You can book an appointment with this render attached.',
          type: 'success'
        });
      } else {
        setNoticeMessage({
          text: data.error || 'Failed to generate mockup.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      setNoticeMessage({
        text: 'Network error while generating mockup. Try the Google Gemini workflow tab!',
        type: 'error'
      });
    } finally {
      setIsInAppGenerating(false);
    }
  };

  return (
    <div className="flex-1 bg-[#050505] text-white py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notice Banner */}
        {noticeMessage && (
          <div className={`mb-6 p-4 rounded-md border flex items-center justify-between gap-3 text-xs tracking-wide transition-all shadow-lg ${
            noticeMessage.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : noticeMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-zinc-900 border-[#D4D4D8]/40 text-[#D4D4D8]'
          }`}>
            <div className="flex items-center gap-2.5">
              {noticeMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              ) : noticeMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 shrink-0 text-[#D4D4D8]" />
              )}
              <span>{noticeMessage.text}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setNoticeMessage(null)}
              className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack} 
              className="flex items-center text-xs uppercase font-bold tracking-widest text-zinc-400 hover:text-[#D4D4D8] transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-sm border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#D4D4D8]/20 text-[#D4D4D8] border border-[#D4D4D8]/50 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4D4D8]" /> Powered by Google Gemini
                </span>
                <span className="hidden sm:inline text-xs text-zinc-500 font-mono">• Est. 2023 Arlington TX</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight text-white mt-1">
                AI Design Lab & Gemini Studio
              </h1>
            </div>
          </div>

          {/* Quick Contact & Studio info */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {onOpenToothLab && (
              <button
                onClick={onOpenToothLab}
                className="px-3.5 py-1.5 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-wider hover:bg-white rounded-sm transition-colors"
              >
                Design in the Tooth Lab
              </button>
            )}
            <a 
              href="tel:4694875734" 
              className="px-3.5 py-1.5 bg-black border border-white/20 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white hover:border-[#D4D4D8] rounded-sm transition-colors"
            >
              Direct Jeweler Line: (469) 487-5734
            </a>
          </div>
        </div>

        {/* Workflow Overview Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#D4D4D8]/40 rounded-lg p-5 sm:p-6 mb-10 shadow-[0_0_30px_rgba(212,212,216,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4D4D8] font-bold">
                How It Works • 2-Step Custom Creation
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-heading">
                Mock Up Your Concept in Gemini, Then Submit Back Here
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Google Gemini delivers studio-grade photorealistic image generation for grillz, iced-out medallions, and custom jewelry. Mock up your piece with our copy-and-paste prompts in Gemini, save your favorite render, and submit it below to schedule your custom mold fitting.
              </p>
            </div>

            {/* Quick 2-Step Badge Navigator */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a 
                href="#step-1-gemini"
                className="px-4 py-3 bg-black/80 border border-white/20 hover:border-[#D4D4D8] rounded-sm flex items-center gap-3 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[#D4D4D8] text-black text-xs font-black flex items-center justify-center shrink-0">1</span>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">Step 1</span>
                  <span className="text-xs font-bold text-white uppercase">Mock Up in Gemini</span>
                </div>
              </a>

              <ChevronRight className="w-4 h-4 text-zinc-600 hidden sm:block" />

              <a 
                href="#step-2-submit"
                className="px-4 py-3 bg-[#D4D4D8]/10 border border-[#D4D4D8]/60 hover:bg-[#D4D4D8]/20 rounded-sm flex items-center gap-3 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-white text-black text-xs font-black flex items-center justify-center shrink-0">2</span>
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-[#D4D4D8] block font-semibold">Step 2</span>
                  <span className="text-xs font-bold text-white uppercase">Submit Design Back</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {initialIdea && (
          <div className="mb-8 p-4 bg-[#D4D4D8]/10 border border-[#D4D4D8]/50 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black text-[#D4D4D8] block">Your Tooth Lab design is loaded</span>
              <p className="text-xs text-zinc-300 mt-1">{initialIdea}</p>
            </div>
            {onOpenToothLab && (
              <button onClick={onOpenToothLab} className="px-4 py-2 border border-white/20 text-xs font-bold uppercase tracking-wider text-white hover:border-[#D4D4D8] rounded-sm shrink-0">
                Edit in Tooth Lab
              </button>
            )}
          </div>
        )}

        {/* Tab Switcher: Gemini Studio vs In-App Generator */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'gemini'
                ? 'bg-[#D4D4D8] text-black shadow-[0_0_15px_rgba(212,212,216,0.3)] font-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Google Gemini Studio (Recommended)</span>
          </button>

          <button
            onClick={() => setActiveTab('in-app')}
            className={`px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'in-app'
                ? 'bg-[#D4D4D8] text-black shadow-[0_0_15px_rgba(212,212,216,0.3)] font-black'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Quick In-Site Generator</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PRIMARY VIEW: GOOGLE GEMINI LINK & SUBMIT BACK WORKFLOW            */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'gemini' && (
          <div className="space-y-12">
            
            {/* STEP 1: MOCK UP ON GEMINI */}
            <section id="step-1-gemini" className="bg-zinc-950 border border-white/10 rounded-lg p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D4D4D8]/10 via-purple-600/5 to-transparent pointer-events-none rounded-bl-full"></div>

              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#D4D4D8] text-black font-black text-sm flex items-center justify-center">1</span>
                  <div>
                    <h3 className="text-xl font-heading font-black uppercase text-white tracking-wide">
                      Step 1: Mock Up in Google Gemini
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Copy a custom prompt, open Gemini, and visualize your piece with photorealistic jewelry lighting.
                    </p>
                  </div>
                </div>

                {/* Direct Launch Button */}
                <a 
                  href="https://gemini.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#D4D4D8] hover:bg-[#ffffff] text-black text-xs font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-2.5 shadow-[0_0_20px_rgba(212,212,216,0.35)]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Google Gemini</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Ready-to-Copy Prompt Templates */}
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest font-bold text-[#D4D4D8]">
                  Select a Curated Prompt Preset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PRESET_PROMPTS.map((p) => {
                    const isSelected = selectedPromptPreset === p.id && !customPromptIdea.trim();
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPromptPreset(p.id);
                          setCustomPromptIdea('');
                        }}
                        className={`text-left p-4 rounded-sm border transition-all ${
                          isSelected
                            ? 'bg-black border-[#D4D4D8] shadow-[0_0_15px_rgba(212,212,216,0.2)]'
                            : 'bg-zinc-900/70 border-white/10 hover:border-zinc-500'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">{p.category}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D4D4D8]" />}
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase">{p.title}</h4>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Prompt Customizer */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-widest font-bold text-zinc-300 flex items-center gap-1.5">
                    <Gem className="w-3.5 h-3.5 text-[#D4D4D8]" />
                    <span>Or Customize Your Custom Gemini Prompt:</span>
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">Real-Time Prompt Generator</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Piece:</span>
                    <select
                      value={builderPiece}
                      onChange={(e) => setBuilderPiece(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#D4D4D8]"
                    >
                      <option value="6-tooth top grillz">6-Tooth Top Grillz</option>
                      <option value="8-tooth top grillz">8-Tooth Top Grillz</option>
                      <option value="6-tooth bottom grillz">6-Tooth Bottom Grillz</option>
                      <option value="8-tooth bottom grillz">8-Tooth Bottom Grillz</option>
                      <option value="full 16-tooth top & bottom grillz set">Full 16-Tooth Set</option>
                      <option value="heavy 3D custom medallion pendant">Custom Medallion Pendant</option>
                      <option value="diamond Cuban link chain">Diamond Cuban Link Chain</option>
                      <option value="custom signet ring with micro-pave diamonds">Custom Signet Ring</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Metal:</span>
                    <select
                      value={builderMetal}
                      onChange={(e) => setBuilderMetal(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#D4D4D8]"
                    >
                      <option value="10k solid yellow gold">10K Solid Yellow Gold</option>
                      <option value="14k solid yellow gold">14K Solid Yellow Gold</option>
                      <option value="14k solid white gold">14K Solid White Gold</option>
                      <option value="14k solid rose gold">14K Solid Rose Gold</option>
                      <option value="925 sterling dental silver with VVS moissanite stones">925 Silver + VVS Moissanite</option>
                      <option value="solid 925 sterling silver">Solid 925 Silver</option>
                      <option value="18k yellow gold with colorless natural VS diamonds">18K Gold + Natural Diamonds</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Style & Cuts:</span>
                    <select
                      value={builderCut}
                      onChange={(e) => setBuilderCut(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#D4D4D8]"
                    >
                      <option value="deep permanent perm cuts with high gloss mirror polish">Deep Perm Cuts</option>
                      <option value="open face fangs and iced-out diamond caps">Open Face Fangs</option>
                      <option value="diamond dust frosted shimmer borders and high-polish center">Diamond Dust Borders</option>
                      <option value="starburst cuts with micro-pave round brilliant diamonds">Starburst Cuts</option>
                      <option value="custom 3D sculpted textures and high-relief detailing">3D Sculpted</option>
                      <option value="clean solid mirror-polished dental caps">Clean Solid Caps</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">Additional details or personal touches (optional):</span>
                  <input
                    type="text"
                    value={customPromptIdea}
                    onChange={(e) => setCustomPromptIdea(e.target.value)}
                    placeholder="e.g., initial 'J' in baguette diamonds on the canine, thick textured bail, fang tips..."
                    className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8]"
                  />
                </div>

                {/* Prompt Preview & Copy Button */}
                <div className="bg-black border border-white/20 rounded-md p-4 relative group">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                      Your Formatted Gemini Prompt:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="px-4 py-1.5 bg-[#D4D4D8] hover:bg-[#ffffff] text-black text-[11px] font-black uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-black" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono leading-relaxed select-all">
                    "{activePromptText}"
                  </p>
                </div>

                {/* 3 Step Instructions */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
                  <div className="bg-zinc-900/60 p-3 rounded-sm border border-white/5">
                    <span className="text-[#D4D4D8] font-bold block mb-1">1. Copy & Launch</span>
                    Click <strong>Copy Prompt</strong> above, then click <strong>Open Google Gemini</strong> to open in a new tab.
                  </div>
                  <div className="bg-zinc-900/60 p-3 rounded-sm border border-white/5">
                    <span className="text-[#D4D4D8] font-bold block mb-1">2. Generate & Refine</span>
                    Paste in Gemini. Ask it to tweak metals or add diamonds until you love your mockup.
                  </div>
                  <div className="bg-zinc-900/60 p-3 rounded-sm border border-white/5">
                    <span className="text-[#D4D4D8] font-bold block mb-1">3. Save & Submit</span>
                    Save your image (or copy Gemini share link), come back to this tab, and upload below in Step 2!
                  </div>
                </div>

              </div>
            </section>

            {/* STEP 2: SUBMIT DESIGN BACK TO SITE */}
            <section id="step-2-submit" className="bg-zinc-950 border-2 border-[#D4D4D8]/50 rounded-lg p-6 sm:p-8 relative shadow-[0_0_40px_rgba(212,212,216,0.12)]">
              
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-white text-black font-black text-sm flex items-center justify-center">2</span>
                <div>
                  <h3 className="text-xl font-heading font-black uppercase text-white tracking-wide">
                    Step 2: Submit Your Gemini Design Back to Jawz
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Upload your saved image or paste your Gemini link. We will review this render during your fitting.
                  </p>
                </div>
              </div>

              {submittedSuccess && (
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-md mb-6 flex items-center gap-3 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-bold uppercase">Design Mockup Successfully Submitted!</strong>
                    <span>Your design has been attached to your booking request. Select your fitting slot on the booking screen.</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left: Image Upload & Link */}
                <div className="space-y-6">
                  
                  {/* File Dropzone */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-[#D4D4D8] mb-2">
                      Upload Your Gemini Generated Mockup:
                    </label>
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileDropRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />

                    {geminiImage ? (
                      <div className="bg-black border-2 border-[#D4D4D8] rounded-md p-4 flex flex-col items-center relative group">
                        <img 
                          src={geminiImage} 
                          alt="Gemini Custom Mockup" 
                          className="w-full max-h-72 object-contain rounded-md shadow-2xl bg-zinc-900" 
                        />
                        <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
                          <span className="text-[#D4D4D8] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-[#D4D4D8]" /> Mockup Attached
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => fileDropRef.current?.click()}
                              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[11px] font-semibold"
                            >
                              Replace Image
                            </button>
                            <button
                              type="button"
                              onClick={() => setGeminiImage(null)}
                              className="px-3 py-1 bg-red-950/80 text-red-300 hover:bg-red-900 rounded text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileDropRef.current?.click()}
                        className="w-full h-56 border-2 border-dashed border-white/20 hover:border-[#D4D4D8] rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-black/50 hover:bg-zinc-900/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#D4D4D8]/20 flex items-center justify-center mb-3 transition-colors text-zinc-400 group-hover:text-[#D4D4D8]">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                          Drop Gemini Image Here or Click to Upload
                        </span>
                        <p className="text-xs text-zinc-500 mt-1">
                          Accepts PNG, JPG, WEBP, or device screenshot
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Optional Gemini Link */}
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-zinc-300 mb-1.5">
                      Or Paste Gemini Conversation / Share Link (Optional):
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={geminiShareUrl}
                        onChange={(e) => setGeminiShareUrl(e.target.value)}
                        placeholder="https://gemini.google.com/share/..."
                        className="w-full bg-black border border-white/20 rounded-sm p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] font-mono"
                      />
                      <Share2 className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                </div>

                {/* Right: Customization Specs & Booking Action */}
                <div className="space-y-5 flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    
                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-[#D4D4D8] mb-2">
                        What Are You Having Crafted?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'grillz', label: 'Custom Grillz' },
                          { id: 'pendant', label: 'Pendant / Medallion' },
                          { id: 'chain', label: 'Chain / Link' },
                          { id: 'ring', label: 'Ring / Watch' }
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setDesignCategory(cat.id as any)}
                            className={`p-2.5 text-xs font-bold uppercase rounded-sm border transition-all text-center ${
                              designCategory === cat.id
                                ? 'bg-[#D4D4D8] text-black border-[#D4D4D8] font-black shadow-sm'
                                : 'bg-black text-zinc-400 border-white/10 hover:border-zinc-500'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grillz Teeth Preset (if category is grillz) */}
                    {designCategory === 'grillz' && (
                      <div>
                        <label className="block text-xs uppercase tracking-widest font-bold text-zinc-300 mb-2">
                          Teeth Configuration:
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {[
                            { id: 'top-6', label: 'Top 6' },
                            { id: 'top-8', label: 'Top 8' },
                            { id: 'bottom-6', label: 'Bottom 6' },
                            { id: 'bottom-8', label: 'Bottom 8' },
                            { id: 'full-16', label: 'Full 16' },
                            { id: 'custom', label: 'Custom' }
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTeethSelectionType(t.id as any)}
                              className={`py-2 px-1 text-xs font-bold uppercase rounded-sm border transition-all text-center ${
                                teethSelectionType === t.id
                                  ? 'bg-white text-black border-white font-black'
                                  : 'bg-black text-zinc-400 border-white/10 hover:border-zinc-500'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Preferred Material */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-zinc-300 mb-2">
                        Preferred Metal & Quality:
                      </label>
                      <select
                        value={selectedMaterial}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#D4D4D8]"
                      >
                        {MATERIAL_OPTIONS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label} — {m.desc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Service Type Preference */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-zinc-300 mb-2">
                        Fitting Preference:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setServicePreference('in-person')}
                          className={`p-2.5 text-xs text-left rounded-sm border transition-all ${
                            servicePreference === 'in-person'
                              ? 'bg-zinc-900 border-[#D4D4D8] text-white font-bold'
                              : 'bg-black border-white/10 text-zinc-400'
                          }`}
                        >
                          <span className="block font-bold text-[#D4D4D8]">Arlington Studio Mold</span>
                          <span className="text-[10px] text-zinc-400">In-person private impression</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setServicePreference('mail-order')}
                          className={`p-2.5 text-xs text-left rounded-sm border transition-all ${
                            servicePreference === 'mail-order'
                              ? 'bg-zinc-900 border-[#D4D4D8] text-white font-bold'
                              : 'bg-black border-white/10 text-zinc-400'
                          }`}
                        >
                          <span className="block font-bold text-white">Mail-Order Mold Kit</span>
                          <span className="text-[10px] text-zinc-400">Shipped anywhere in the US</span>
                        </button>
                      </div>
                    </div>

                    {/* Custom Notes */}
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-bold text-[#D4D4D8] mb-1.5 flex items-center justify-between">
                        <span>Notes For Jeremy (The Jeweler):</span>
                        <span className="text-[10px] text-zinc-500 lowercase">Dimensions, cuts, or budget</span>
                      </label>
                      <textarea
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="e.g. In Gemini I mocked up deep perm cuts with open fangs. Want to know exact price for 14k vs 10k, and whether we can do expedited casting for an event next month."
                        rows={3}
                        className="w-full bg-black border border-white/20 rounded-sm p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] resize-none"
                      />
                    </div>

                  </div>

                  {/* Submit Action Button */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <button
                      type="button"
                      onClick={handleSubmitDesignToBooking}
                      disabled={isSubmitting}
                      className="w-full py-4 bg-[#D4D4D8] hover:bg-[#ffffff] text-black font-black uppercase tracking-widest text-xs rounded-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,212,216,0.4)] disabled:opacity-50"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Submit Gemini Design & Book Fitting Slot</span>
                    </button>
                    <p className="text-[11px] text-center text-zinc-500">
                      Zero upfront charge on website • 60% deposit taken only upon taking your physical mold impression.
                    </p>
                  </div>

                </div>

              </div>

            </section>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* SECONDARY VIEW: FAST IN-APP AI GENERATOR (OPTIONAL)                */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'in-app' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-zinc-950 p-6 sm:p-8 rounded-lg border border-white/10">
            
            {/* Controls */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-heading font-black uppercase text-white mb-1">
                  Quick In-Site AI Generator
                </h3>
                <p className="text-xs text-zinc-400">
                  Generate a quick 3D jewelry render right inside this page using the Google GenAI backend.
                </p>
              </div>

              {/* Description */}
              <div className="bg-zinc-900 border border-white/10 rounded-lg p-5">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#D4D4D8] mb-2">
                  1. Describe Your Design
                </label>
                <textarea 
                  value={inAppDescription}
                  onChange={(e) => setInAppDescription(e.target.value)}
                  placeholder="e.g. A 14k yellow gold 8-tooth grill with deep permanent cuts and two open face canines with VS1 round brilliant diamonds. Mirror polish, dark background."
                  className="w-full bg-black border border-white/10 rounded-md p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#D4D4D8] h-28 resize-none"
                />
              </div>

              {/* Optional Reference Upload */}
              <div className="bg-zinc-900 border border-white/10 rounded-lg p-5">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#D4D4D8] mb-1">
                  2. Reference Image or Logo (Optional)
                </label>
                <p className="text-[11px] text-zinc-500 mb-3">Upload a sketch, logo, or existing grillz photo to guide generation.</p>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={inAppFileInputRef} 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setInAppReferenceImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }} 
                  className="hidden" 
                />

                {inAppReferenceImage ? (
                  <div className="relative inline-block group">
                    <img src={inAppReferenceImage} alt="Reference" className="h-28 object-contain rounded-md border border-white/20 bg-black" />
                    <button 
                      onClick={() => setInAppReferenceImage(null)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => inAppFileInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-zinc-500 hover:border-[#D4D4D8] hover:text-[#D4D4D8] transition-colors"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold tracking-wider">Click to Upload Reference</span>
                  </button>
                )}
              </div>

              {/* Generate Button */}
              <button 
                type="button"
                onClick={handleInAppGenerate}
                disabled={isInAppGenerating || !inAppDescription.trim()}
                className="w-full bg-[#D4D4D8] text-black font-black uppercase tracking-widest py-4 rounded-sm hover:bg-[#ffffff] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs shadow-[0_0_20px_rgba(212,212,216,0.3)]"
              >
                {isInAppGenerating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating Photorealistic Mockup...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate In-Studio AI Mockup</>
                )}
              </button>

            </div>

            {/* In-App Result Canvas */}
            <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center min-h-[460px]">
              {isInAppGenerating ? (
                <div className="text-center flex flex-col items-center animate-pulse">
                  <Sparkles className="w-12 h-12 text-[#D4D4D8] mb-4" />
                  <p className="text-zinc-300 font-bold tracking-widest uppercase text-sm">Rendering 3D Jewelry Concept...</p>
                  <p className="text-xs text-zinc-500 mt-2">Computing gold reflections and gemstone fire.</p>
                </div>
              ) : inAppGeneratedUrl ? (
                <div className="w-full flex-1 flex flex-col items-center">
                  <img 
                    src={inAppGeneratedUrl} 
                    alt="Generated Mockup" 
                    className="w-full h-auto max-h-[380px] object-contain rounded-md shadow-[0_0_40px_rgba(212,212,216,0.2)] border border-[#D4D4D8]/40 bg-black" 
                  />
                  
                  <div className="mt-6 w-full bg-black/70 p-5 rounded-md border border-[#D4D4D8]/30 text-center space-y-3">
                    <h4 className="text-[#D4D4D8] font-bold uppercase tracking-widest text-xs">Concept Render Ready</h4>
                    <p className="text-xs text-zinc-400">
                      Book a private fitting session at our Arlington, TX studio or order a mail kit to start casting this design.
                    </p>
                    <button 
                      type="button"
                      onClick={() => {
                        if (onBookConsultation) {
                          onBookConsultation({
                            notes: `In-Studio AI Concept: "${inAppDescription}"`,
                            serviceType: 'in-person',
                            material: '14k-gold',
                            attachedMockupImage: inAppGeneratedUrl
                          });
                        }
                      }}
                      className="px-6 py-3 bg-[#D4D4D8] text-black text-xs uppercase tracking-widest font-black hover:bg-[#ffffff] transition-all inline-flex items-center justify-center gap-2 rounded-sm shadow-[0_0_15px_rgba(212,212,216,0.3)]"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Fitting With This Render</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center flex flex-col items-center opacity-40">
                  <ImageIcon className="w-16 h-16 text-zinc-500 mb-3" />
                  <p className="text-xs uppercase tracking-widest font-bold text-zinc-400">Your render will appear here</p>
                  <p className="text-[11px] text-zinc-600 mt-1 max-w-xs">
                    Or switch to the Google Gemini tab above for limitless generations directly on gemini.google.com!
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
