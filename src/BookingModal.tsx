import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, Check, Sparkles, AlertCircle, Phone, 
  Mail, MessageSquare, ChevronRight, User, ShieldCheck, ArrowRight,
  Printer, Share2, Gem, Layers, HelpCircle
} from 'lucide-react';

export interface BookingData {
  id: string;
  serviceType: 'in-person' | 'mail-order' | 'jewelry' | 'adjustment';
  clientName: string;
  phone: string;
  email: string;
  instagram?: string;
  contactMethod: 'text' | 'call' | 'instagram' | 'email';
  appointmentDate: string;
  appointmentTime: string;
  selectedTopTeeth: number[];
  selectedBottomTeeth: number[];
  material: string;
  cuts: string[];
  customNotes: string;
  estimatedPrice: string;
  createdAt: string;
  status: 'confirmed' | 'pending';
  attachedMockupImage?: string;
  geminiShareLink?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreset?: {
    teeth?: { top: number[]; bottom: number[] };
    material?: string;
    cuts?: string[];
    notes?: string;
    serviceType?: 'in-person' | 'mail-order' | 'jewelry' | 'adjustment';
    attachedMockupImage?: string;
    geminiShareLink?: string;
  };
}

const MATERIAL_OPTIONS = [
  { id: '10k-gold', name: '10K Solid Yellow Gold', priceInfo: '$95/tooth (Most Popular)', color: '#e5b840' },
  { id: '14k-gold', name: '14K Solid Yellow Gold', priceInfo: '$115/tooth', color: '#d4af37' },
  { id: '14k-white-gold', name: '14K Solid White Gold', priceInfo: '$115/tooth', color: '#f1f5f9' },
  { id: 'silver-moissanite', name: 'Silver Moissanite (VVS)', priceInfo: 'Passes Diamond Testers', color: '#f8fafc' },
  { id: 'silver-lab-diamond', name: 'Silver Lab Diamond (VVS)', priceInfo: 'Colorless D-F Certified', color: '#ffffff' },
  { id: 'silver-plain', name: '925 Dental Silver', priceInfo: '$40/tooth (Budget Classic)', color: '#cbd5e1' },
  { id: '18k-natural', name: '18K Gold / Natural Diamonds', priceInfo: 'Bespoke Private Consultation', color: '#f59e0b' },
  { id: 'jewelry-only', name: 'Custom Jewelry / Chain / Watch', priceInfo: 'Price on Consultation', color: '#a855f7' }
];

const CUT_OPTIONS = [
  { id: 'solid', name: 'Solid Caps (Free)' },
  { id: 'perm-cut', name: 'Deep Perm Cut (Free)' },
  { id: 'open-face', name: 'Open Face (Free)' },
  { id: 'diamond-cuts', name: 'Diamond Cuts (Free)' },
  { id: 'nugget-cut', name: 'Nugget Cut (Free)' },
  { id: 'diamond-dust', name: 'Diamond Dust (+$5/tooth)' },
  { id: 'rose-cuts', name: 'Rose Cuts (+$7/tooth)' },
  { id: 'starburst-cuts', name: 'Starburst Cuts (+$7/tooth)' },
  { id: 'speciality-cut', name: 'Speciality Open Face (+$20/tooth)' },
  { id: '3d-design', name: '3D Sculpted Design (+$85/tooth)' },
];

const TIME_SLOTS = [
  '10:30 AM', '11:45 AM', '1:00 PM', '2:15 PM', '3:30 PM', '4:45 PM', '6:00 PM', '7:15 PM'
];

export default function BookingModal({ isOpen, onClose, initialPreset }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Customization & Teeth, 2: Date & Contact, 3: Confirmed
  
  // Customization state
  const [serviceType, setServiceType] = useState<'in-person' | 'mail-order' | 'jewelry' | 'adjustment'>('in-person');
  const [selectedTopTeeth, setSelectedTopTeeth] = useState<Set<number>>(new Set([4, 5, 6, 7, 8, 9]));
  const [selectedBottomTeeth, setSelectedBottomTeeth] = useState<Set<number>>(new Set());
  const [material, setMaterial] = useState<string>('10k-gold');
  const [selectedCuts, setSelectedCuts] = useState<string[]>(['perm-cut']);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [attachedMockupImage, setAttachedMockupImage] = useState<string | null>(null);
  const [geminiShareLink, setGeminiShareLink] = useState<string>('');
  
  // Date & Contact State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('1:00 PM');
  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [contactMethod, setContactMethod] = useState<'text' | 'call' | 'instagram' | 'email'>('text');
  
  // Confirmed booking ref
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Apply initial preset when passed
  useEffect(() => {
    if (initialPreset) {
      if (initialPreset.teeth) {
        setSelectedTopTeeth(new Set(initialPreset.teeth.top));
        setSelectedBottomTeeth(new Set(initialPreset.teeth.bottom));
      }
      if (initialPreset.material) {
        setMaterial(initialPreset.material);
      }
      if (initialPreset.cuts) {
        setSelectedCuts(initialPreset.cuts);
      }
      if (initialPreset.notes) {
        setCustomNotes(initialPreset.notes);
      }
      if (initialPreset.serviceType) {
        setServiceType(initialPreset.serviceType);
      }
      if (initialPreset.attachedMockupImage) {
        setAttachedMockupImage(initialPreset.attachedMockupImage);
      }
      if (initialPreset.geminiShareLink) {
        setGeminiShareLink(initialPreset.geminiShareLink);
      }
    }
  }, [initialPreset, isOpen]);

  if (!isOpen) return null;

  const totalTeethCount = selectedTopTeeth.size + selectedBottomTeeth.size;

  const toggleTopTooth = (num: number) => {
    const next = new Set(selectedTopTeeth);
    if (next.has(num)) next.delete(num);
    else next.add(num);
    setSelectedTopTeeth(next);
  };

  const toggleBottomTooth = (num: number) => {
    const next = new Set(selectedBottomTeeth);
    if (next.has(num)) next.delete(num);
    else next.add(num);
    setSelectedBottomTeeth(next);
  };

  const setPresetTeeth = (type: 'top-6' | 'top-8' | 'bottom-6' | 'bottom-8' | 'full-8-8' | 'clear') => {
    if (type === 'top-6') {
      setSelectedTopTeeth(new Set([4, 5, 6, 7, 8, 9]));
      setSelectedBottomTeeth(new Set());
    } else if (type === 'top-8') {
      setSelectedTopTeeth(new Set([3, 4, 5, 6, 7, 8, 9, 10]));
      setSelectedBottomTeeth(new Set());
    } else if (type === 'bottom-6') {
      setSelectedTopTeeth(new Set());
      setSelectedBottomTeeth(new Set([4, 5, 6, 7, 8, 9]));
    } else if (type === 'bottom-8') {
      setSelectedTopTeeth(new Set());
      setSelectedBottomTeeth(new Set([3, 4, 5, 6, 7, 8, 9, 10]));
    } else if (type === 'full-8-8') {
      setSelectedTopTeeth(new Set([3, 4, 5, 6, 7, 8, 9, 10]));
      setSelectedBottomTeeth(new Set([3, 4, 5, 6, 7, 8, 9, 10]));
    } else if (type === 'clear') {
      setSelectedTopTeeth(new Set());
      setSelectedBottomTeeth(new Set());
    }
  };

  const toggleCut = (cutId: string) => {
    if (selectedCuts.includes(cutId)) {
      setSelectedCuts(selectedCuts.filter(c => c !== cutId));
    } else {
      setSelectedCuts([...selectedCuts, cutId]);
    }
  };

  // Estimate calculation
  const calculateEstimate = () => {
    if (serviceType === 'jewelry') return 'Custom Jewelry Quote upon Consultation';
    if (serviceType === 'adjustment') return '$50 - $120 (Fit depending)';
    if (totalTeethCount === 0) return 'Select teeth above';

    if (material === '10k-gold') {
      if (totalTeethCount <= 2) return '$275';
      if (totalTeethCount <= 4) return '$420';
      return `$${totalTeethCount * 95} ($95/tooth)`;
    }
    if (material === '14k-gold' || material === '14k-white-gold') {
      if (totalTeethCount <= 2) return '$350';
      if (totalTeethCount <= 4) return '$520';
      return `$${totalTeethCount * 115} ($115/tooth)`;
    }
    if (material === 'silver-moissanite') {
      if (totalTeethCount === 12) return '$1,175';
      if (totalTeethCount === 16) return '$1,550';
      if (totalTeethCount === 20) return '$1,900';
      return `$${totalTeethCount * 98} est.`;
    }
    if (material === 'silver-lab-diamond') {
      if (totalTeethCount === 12) return '$1,900';
      if (totalTeethCount === 16) return '$2,550';
      if (totalTeethCount === 20) return '$3,180';
      return `$${totalTeethCount * 159} est.`;
    }
    if (material === 'silver-plain') {
      if (totalTeethCount <= 2) return '$225';
      if (totalTeethCount <= 4) return `$${totalTeethCount * 45}`;
      return `$${totalTeethCount * 40} ($40/tooth)`;
    }
    return 'Custom Quoted on Confirmation';
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim()) {
      setFormError('Please provide your full name and phone number so we can confirm your appointment.');
      return;
    }
    setFormError(null);

    const bookingId = `JAWZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingData = {
      id: bookingId,
      serviceType,
      clientName,
      phone,
      email,
      instagram,
      contactMethod,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      selectedTopTeeth: Array.from<number>(selectedTopTeeth).sort((a, b) => a - b),
      selectedBottomTeeth: Array.from<number>(selectedBottomTeeth).sort((a, b) => a - b),
      material,
      cuts: selectedCuts,
      customNotes,
      estimatedPrice: calculateEstimate(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      attachedMockupImage: attachedMockupImage || undefined,
      geminiShareLink: geminiShareLink || undefined
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('jawz_customer_bookings') || '[]');
      existing.unshift(newBooking);
      localStorage.setItem('jawz_customer_bookings', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setConfirmedBooking(newBooking);
    setStep(3);
  };

  // Google Calendar link builder
  const getGoogleCalendarUrl = (booking: BookingData) => {
    const title = encodeURIComponent(`Jawz Jewelry Appointment - ${booking.clientName}`);
    const location = encodeURIComponent('1201 N Watson Rd, Arlington, TX 76006, United States');
    const details = encodeURIComponent(
      `Appointment with Jawz Jewelry\nRef: ${booking.id}\nService: ${booking.serviceType}\nTeeth: ${booking.selectedTopTeeth.length} Top, ${booking.selectedBottomTeeth.length} Bottom\nMaterial: ${booking.material}\nNotes: ${booking.customNotes || 'None'}\nStudio Phone: (469) 487-5734\nStrictly by appointment only.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}`;
  };

  // SMS draft for quick texting owner
  const getSmsDraft = (booking: BookingData) => {
    const text = encodeURIComponent(
      `Hi Jeremy! I just booked an appointment on your site (Ref ${booking.id}). Name: ${booking.clientName}, Date: ${booking.appointmentDate} at ${booking.appointmentTime}. Looking for: ${booking.selectedTopTeeth.length} top / ${booking.selectedBottomTeeth.length} bottom teeth in ${booking.material}. Notes: ${booking.customNotes || 'None'}.`
    );
    return `sms:+14694875734?body=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl bg-[#0d0d0d] border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-black via-zinc-900 to-black px-6 py-4 border-b border-[#D4AF37]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black uppercase tracking-wider text-white font-heading">
                  Book Custom Appointment
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-red-950/80 text-red-400 border border-red-800/50 rounded">
                  By Appt Only
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Studio: 1201 N Watson Rd, Arlington, TX 76006 • Mail Order Kits Available
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-[#121212] px-6 py-3 border-b border-white/5 flex items-center justify-between text-xs uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={() => step !== 3 && setStep(1)}
              className={`flex items-center gap-2 font-bold ${step === 1 ? 'text-[#D4AF37]' : 'text-zinc-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-zinc-400'}`}>1</span>
              <span>Teeth & Design</span>
            </button>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            <button 
              onClick={() => step !== 3 && setStep(2)}
              className={`flex items-center gap-2 font-bold ${step === 2 ? 'text-[#D4AF37]' : 'text-zinc-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-zinc-400'}`}>2</span>
              <span>Date & Contact</span>
            </button>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            <div className={`flex items-center gap-2 font-bold ${step === 3 ? 'text-[#D4AF37]' : 'text-zinc-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-zinc-500'}`}>3</span>
              <span>Confirmation</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#D4AF37]">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Perfect Fit</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* STEP 1: Customization & Interactive Tooth Selection */}
          {step === 1 && (
            <div className="space-y-6">

              {/* Attached Gemini / AI Design Banner */}
              {attachedMockupImage && (
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-2 border-[#D4AF37]/60 rounded-md p-4 flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={attachedMockupImage} 
                      alt="Gemini AI Mockup" 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border-2 border-[#D4AF37] shadow-lg shrink-0 bg-black" 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider rounded-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Gemini AI Design Attached
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">Custom 3D Concept</span>
                      </div>
                      <p className="text-xs text-white font-semibold mt-1">
                        Your custom design mockup is attached to this appointment.
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Jeremy will review this exact render during your fitting session to match teeth contours, metal karats, and gemstone cuts.
                      </p>
                      {geminiShareLink && (
                        <a 
                          href={geminiShareLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] text-[#D4AF37] underline hover:text-white mt-1 inline-flex items-center gap-1"
                        >
                          <span>View Gemini Source Link</span> &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setAttachedMockupImage(null);
                      setGeminiShareLink('');
                    }}
                    className="text-zinc-500 hover:text-red-400 text-xs px-2 py-1 shrink-0 rounded hover:bg-white/5 transition-colors"
                    title="Remove attached mockup"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Service Type Selector */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2">
                  Select Appointment & Service Type:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { 
                      id: 'in-person', 
                      title: 'Arlington Studio Mold', 
                      desc: 'Private 1-on-1 In-Person Impression in Arlington, TX',
                      badge: 'By Appt Only'
                    },
                    { 
                      id: 'mail-order', 
                      title: 'Mail-Order Mold Kit', 
                      desc: 'Free 2-day priority kit express shipped to your door',
                      badge: 'Nationwide'
                    },
                    { 
                      id: 'jewelry', 
                      title: 'Custom Jewelry & Watches', 
                      desc: 'Bespoke chains, rings, pendants, and watch settings',
                      badge: 'Bespoke'
                    },
                    { 
                      id: 'adjustment', 
                      title: 'Clean & Fit Adjustment', 
                      desc: 'Tighten, polish or restore your existing grillz',
                      badge: 'Maintenance'
                    }
                  ].map((srv) => (
                    <div 
                      key={srv.id}
                      onClick={() => setServiceType(srv.id as any)}
                      className={`cursor-pointer p-3 border rounded-sm transition-all ${
                        serviceType === srv.id 
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                          : 'border-white/10 bg-[#121212] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">{srv.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-[#D4AF37] border border-[#D4AF37]/30">
                          {srv.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-light leading-snug">{srv.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE TOOTH SELECTOR (As requested: "have the option to select their teeth like we have in the design lab now") */}
              {serviceType !== 'jewelry' && (
                <div className="bg-[#111] border border-white/10 rounded-sm p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                          Select Your Teeth Map
                        </h3>
                        <span className="text-xs px-2 py-0.5 bg-[#D4AF37] text-black font-black uppercase rounded-sm">
                          {totalTeethCount} {totalTeethCount === 1 ? 'Tooth' : 'Teeth'} Selected
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Click individual teeth below or pick a popular preset.
                      </p>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        type="button" 
                        onClick={() => setPresetTeeth('top-6')} 
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-sm"
                      >
                        Top 6
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPresetTeeth('top-8')} 
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-sm"
                      >
                        Top 8
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPresetTeeth('bottom-6')} 
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-sm"
                      >
                        Bottom 6
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPresetTeeth('full-8-8')} 
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-sm"
                      >
                        Full 8 on 8
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setPresetTeeth('clear')} 
                        className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Upper Teeth Arch */}
                  <div className="bg-black/60 p-4 rounded border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Upper Arch (Top Teeth)
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        {selectedTopTeeth.size} Selected
                      </span>
                    </div>

                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-1 sm:gap-1.5 justify-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((toothNum) => {
                        const isSelected = selectedTopTeeth.has(toothNum);
                        const isCanine = toothNum === 4 || toothNum === 11;
                        const isCenter = toothNum === 7 || toothNum === 8;
                        return (
                          <button
                            key={`top-${toothNum}`}
                            type="button"
                            onClick={() => toggleTopTooth(toothNum)}
                            className={`flex flex-col items-center justify-between p-1.5 h-16 sm:h-20 rounded border transition-all ${
                              isSelected
                                ? 'bg-[#D4AF37] text-black border-[#ffe175] shadow-[0_0_12px_rgba(212,175,55,0.5)] scale-105 z-10'
                                : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:border-zinc-500 hover:bg-zinc-800'
                            }`}
                            title={`Top Tooth #${toothNum}`}
                          >
                            <span className="text-[9px] font-mono font-bold">{toothNum}</span>
                            <div className="w-full flex items-center justify-center my-auto">
                              <div className={`w-3 sm:w-4 h-6 sm:h-8 rounded-t-sm ${isSelected ? 'bg-black/20' : 'bg-white/10'} border ${isSelected ? 'border-black/30' : 'border-white/20'}`}></div>
                            </div>
                            <span className="text-[8px] tracking-tighter truncate w-full text-center font-semibold">
                              {isCenter ? 'Center' : isCanine ? 'Canine' : toothNum <= 3 || toothNum >= 12 ? 'Molar' : 'Premolar'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lower Teeth Arch */}
                  <div className="bg-black/60 p-4 rounded border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                        Lower Arch (Bottom Teeth)
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        {selectedBottomTeeth.size} Selected
                      </span>
                    </div>

                    <div className="grid grid-cols-7 sm:grid-cols-14 gap-1 sm:gap-1.5 justify-center">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((toothNum) => {
                        const isSelected = selectedBottomTeeth.has(toothNum);
                        const isCanine = toothNum === 4 || toothNum === 11;
                        const isCenter = toothNum === 7 || toothNum === 8;
                        return (
                          <button
                            key={`bottom-${toothNum}`}
                            type="button"
                            onClick={() => toggleBottomTooth(toothNum)}
                            className={`flex flex-col items-center justify-between p-1.5 h-16 sm:h-20 rounded border transition-all ${
                              isSelected
                                ? 'bg-[#D4AF37] text-black border-[#ffe175] shadow-[0_0_12px_rgba(212,175,55,0.5)] scale-105 z-10'
                                : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:border-zinc-500 hover:bg-zinc-800'
                            }`}
                            title={`Bottom Tooth #${toothNum}`}
                          >
                            <span className="text-[8px] tracking-tighter truncate w-full text-center font-semibold">
                              {isCenter ? 'Center' : isCanine ? 'Canine' : toothNum <= 3 || toothNum >= 12 ? 'Molar' : 'Premolar'}
                            </span>
                            <div className="w-full flex items-center justify-center my-auto">
                              <div className={`w-3 sm:w-4 h-6 sm:h-8 rounded-b-sm ${isSelected ? 'bg-black/20' : 'bg-white/10'} border ${isSelected ? 'border-black/30' : 'border-white/20'}`}></div>
                            </div>
                            <span className="text-[9px] font-mono font-bold">{toothNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Material & Metal Selection */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2">
                  Select Preferred Metal / Purity:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {MATERIAL_OPTIONS.map((mat) => (
                    <div
                      key={mat.id}
                      onClick={() => setMaterial(mat.id)}
                      className={`cursor-pointer p-3 border rounded-sm transition-all flex items-start gap-2.5 ${
                        material === mat.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-white/10 bg-[#121212] hover:border-zinc-700'
                      }`}
                    >
                      <div 
                        className="w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 border border-black/50" 
                        style={{ backgroundColor: mat.color }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white uppercase tracking-wider truncate">{mat.name}</div>
                        <div className="text-[10px] text-zinc-400 font-medium">{mat.priceInfo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuts & Design Add-ons */}
              {serviceType !== 'jewelry' && (
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2">
                    Cuts, Open Face & Custom Styling (Multiple Select):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CUT_OPTIONS.map((cut) => {
                      const active = selectedCuts.includes(cut.id);
                      return (
                        <button
                          key={cut.id}
                          type="button"
                          onClick={() => toggleCut(cut.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                            active
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                              : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-zinc-500'
                          }`}
                        >
                          {active && <Check className="w-3 h-3 inline mr-1" />}
                          {cut.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CUSTOMIZATION NOTES (As requested: "be able to add notes for their customization") */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-[#D4AF37] mb-1.5 flex items-center justify-between">
                  <span>Customization Notes & Instructions:</span>
                  <span className="text-[10px] text-zinc-400 font-normal lowercase tracking-normal">Tell the jeweler your vision</span>
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g., I want an open face on tooth 7 & 8, perm cuts throughout, starburst cut on left canine. Also please let me know diamond tester results. Budget around $1,200..."
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors placeholder:text-zinc-600 font-sans"
                />
              </div>

              {/* Action to Step 2 */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400">Estimated Total:</span>
                  <span className="text-xl font-black text-[#D4AF37] font-heading">{calculateEstimate()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffe175] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] rounded-sm"
                >
                  <span>Select Date & Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Appointment Date, Time & Contact Info */}
          {step === 2 && (
            <form onSubmit={handleConfirmBooking} className="space-y-6">

              {/* Location & Appointment Notice */}
              <div className="bg-[#121212] border-l-4 border-[#D4AF37] p-4 rounded-r-sm space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Physical Studio: 1201 N Watson Rd, Arlington, TX 76006</span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Strictly by appointment only. We schedule private 1-on-1 slots so you get dedicated jeweler attention. For mail orders, kit is shipped following phone consultation.
                </p>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>Select Appointment Date:</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                  <div className="flex gap-2 mt-2">
                    {[
                      { label: 'Tomorrow', offset: 1 },
                      { label: '+2 Days', offset: 2 },
                      { label: 'This Weekend', offset: 3 },
                    ].map((item, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + item.offset);
                      const str = d.toISOString().split('T')[0];
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDate(str)}
                          className={`text-[10px] px-2 py-1 rounded border uppercase tracking-wider ${
                            selectedDate === str ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]' : 'bg-zinc-900 text-zinc-400 border-white/10'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span>Select Time Slot:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 text-xs font-bold rounded-sm border transition-all ${
                          selectedTime === slot
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-zinc-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-[#111] border border-white/10 p-5 rounded-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/5 pb-2">
                  Client Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Marcus Turner"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      Cell Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(469) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="marcus@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      Instagram Handle (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="@marcus_dallas"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-2">
                    Preferred Confirmation Method:
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'text', label: 'SMS Text Message' },
                      { id: 'call', label: 'Phone Call' },
                      { id: 'instagram', label: 'Instagram DM' },
                      { id: 'email', label: 'Email' }
                    ].map((m) => (
                      <label key={m.id} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="radio"
                          name="contactMethod"
                          value={m.id}
                          checked={contactMethod === m.id}
                          onChange={() => setContactMethod(m.id as any)}
                          className="accent-[#D4AF37]"
                        />
                        <span>{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Policy & Deposit Notice */}
              <div className="bg-black border border-[#D4AF37]/30 p-4 rounded-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-300 space-y-1">
                  <p className="font-bold uppercase tracking-wider text-white">
                    Official Studio Deposit Policy
                  </p>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    60% deposit is required upon taking your mold impression or dispatching your custom mold kit. Deposits are strictly non-refundable once materials are cast. Balance is due within 21 days of completion.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="bg-red-950/70 border border-red-500/50 text-red-200 text-xs p-3.5 rounded-sm flex items-center gap-2.5 animate-pulse">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white rounded-sm"
                >
                  Back to Teeth
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffe175] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] rounded-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Lock Appointment</span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: Booking Confirmed Screen */}
          {step === 3 && confirmedBooking && (
            <div className="py-6 px-4 text-center space-y-6">
              
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#D4AF37] font-bold">
                  Appointment Reference: #{confirmedBooking.id}
                </span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight font-heading mt-1">
                  You're Booked with Jawz Jewelry!
                </h3>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto mt-2 font-light">
                  Thank you, <strong className="text-white">{confirmedBooking.clientName}</strong>. We look forward to fitting you on{' '}
                  <strong className="text-[#D4AF37]">{confirmedBooking.appointmentDate}</strong> at{' '}
                  <strong className="text-[#D4AF37]">{confirmedBooking.appointmentTime}</strong>.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="max-w-xl mx-auto bg-[#111] border border-white/10 rounded-sm p-6 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Service:</span>
                  <span className="text-white font-bold uppercase">{confirmedBooking.serviceType}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Teeth Configured:</span>
                  <span className="text-[#D4AF37] font-bold">
                    {confirmedBooking.selectedTopTeeth.length} Upper Teeth • {confirmedBooking.selectedBottomTeeth.length} Lower Teeth ({confirmedBooking.selectedTopTeeth.length + confirmedBooking.selectedBottomTeeth.length} Total)
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Metal / Material:</span>
                  <span className="text-white font-bold capitalize">{confirmedBooking.material.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Estimated Total:</span>
                  <span className="text-[#D4AF37] font-bold font-heading text-sm">{confirmedBooking.estimatedPrice}</span>
                </div>
                {confirmedBooking.attachedMockupImage && (
                  <div className="border-b border-white/5 pb-3 pt-1">
                    <span className="text-zinc-500 uppercase tracking-wider font-semibold block mb-2 text-xs">Attached Design Mockup:</span>
                    <div className="flex items-center gap-3 bg-black/60 p-2.5 rounded border border-[#D4AF37]/30">
                      <img 
                        src={confirmedBooking.attachedMockupImage} 
                        alt="Submitted Mockup" 
                        className="w-16 h-16 object-cover rounded border border-[#D4AF37]/50 shrink-0" 
                      />
                      <div className="text-left">
                        <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Gemini 3D Concept Attached
                        </span>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Saved with appointment #{confirmedBooking.id}. Jeremy will reference this during your fitting.
                        </p>
                        {confirmedBooking.geminiShareLink && (
                          <a 
                            href={confirmedBooking.geminiShareLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-[#D4AF37] underline hover:text-white mt-1 inline-block"
                          >
                            Open Gemini Link &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {confirmedBooking.customNotes && (
                  <div className="border-b border-white/5 pb-2 text-xs">
                    <span className="text-zinc-500 uppercase tracking-wider font-semibold block mb-1">Customization Notes:</span>
                    <p className="text-zinc-300 italic bg-black/50 p-2 rounded text-[11px]">{confirmedBooking.customNotes}</p>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Studio Address:</span>
                  <span className="text-zinc-300 font-medium">1201 N Watson Rd, Arlington, TX 76006, United States</span>
                </div>
              </div>

              {/* Direct Next Step Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center max-w-xl mx-auto">
                <a
                  href={getGoogleCalendarUrl(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 border border-white/10"
                >
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add to Google Calendar</span>
                </a>

                <a
                  href={getSmsDraft(confirmedBooking)}
                  className="px-5 py-2.5 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-wider rounded-sm flex items-center gap-2 hover:bg-[#ffe175]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Text Details to Owner</span>
                </a>

                <a
                  href="tel:4694875734"
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 border border-white/10"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>Call Studio: (469) 487-5734</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white underline font-semibold"
                >
                  Close & Return to Site
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
