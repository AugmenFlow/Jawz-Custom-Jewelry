import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, Check, AlertCircle, Phone, 
  Mail, MessageSquare, ChevronRight, User, ShieldCheck, ArrowRight,
  Printer, Share2, Gem, Layers, HelpCircle
} from 'lucide-react';
import {
  StudioDesign, GrillzDesign, FreeStyle, AddOn, FREE_STYLES,
  presetTeeth, grillzBasePrice, addonsPrice, grillzEstimate, designSummary, designShareUrl,
  styleName, addonName, grillzMetalName, grillzStoneName, grillzFromMaterial, toothNoteList, DEFAULT_DESIGN,
} from './design/designModel';
import { MouthPreview } from './design/DesignPreviews';
import FlowSteps from './design/FlowSteps';
import DateCalendar, { toDateKey } from './design/DateCalendar';

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
  designSummary?: string;
  designLink?: string;
  /** Custom jewelry & watch requests only */
  jewelry?: { metal: string; stone: string; size: string; budget: string };
  /** Whether the booking reached the studio's inbox */
  deliveredToStudio?: boolean;
}

export const BOOKING_STEPS = ['Design', 'Date & Contact', 'Confirmed'];

const FORM_ENDPOINT = '/__forms.html';
const SLOTS_ENDPOINT = '/api/slots';

/** Times already booked on a date. Returns an empty list if the check isn't available. */
async function fetchTakenSlots(date: string): Promise<string[]> {
  try {
    const res = await fetch(`${SLOTS_ENDPOINT}?date=${encodeURIComponent(date)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.taken) ? data.taken : [];
  } catch {
    return [];
  }
}

/** Holds the time for this booking. 'taken' means someone else got it first. */
async function reserveSlot(booking: BookingData): Promise<'ok' | 'taken' | 'unavailable'> {
  try {
    const res = await fetch(SLOTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: booking.appointmentDate, time: booking.appointmentTime, bookingId: booking.id, service: booking.serviceType }),
    });
    if (res.status === 409) return 'taken';
    return res.ok ? 'ok' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

/** Sends the booking to the studio through Netlify Forms (dashboard + email notifications). */
async function sendBookingToStudio(booking: BookingData) {
  const body = new FormData();
  const fields: Record<string, string> = {
    'form-name': 'booking',
    subject: `New appointment: ${booking.clientName} on ${booking.appointmentDate} at ${booking.appointmentTime}`,
    'booking-id': booking.id,
    service: booking.serviceType,
    name: booking.clientName,
    phone: booking.phone,
    email: booking.email,
    instagram: booking.instagram || '',
    'contact-method': booking.contactMethod,
    date: booking.appointmentDate,
    time: booking.appointmentTime,
    'top-teeth': booking.selectedTopTeeth.join(', '),
    'bottom-teeth': booking.selectedBottomTeeth.join(', '),
    material: booking.material,
    cuts: booking.cuts.join(', '),
    design: booking.designSummary || '',
    'design-link': booking.designLink || '',
    notes: booking.customNotes,
    estimate: booking.estimatedPrice,
    stone: booking.jewelry?.stone || '',
    size: booking.jewelry?.size || '',
    budget: booking.jewelry?.budget || '',
  };
  Object.entries(fields).forEach(([key, value]) => body.append(key, value));


  const response = await fetch(FORM_ENDPOINT, { method: 'POST', body });
  return response.ok;
}

const formatBudget = (raw: string) => {
  const digits = raw.replace(/\D/g, '');
  return digits ? `$${Number(digits).toLocaleString()}` : '';
};

/** What the customer wants made, for calendar and text-message drafts. */
const lookingFor = (b: BookingData, sep = '\n') => b.jewelry
  ? [`Custom piece in ${b.jewelry.metal}`, `Stone: ${b.jewelry.stone}`, b.jewelry.size && `Size: ${b.jewelry.size}`, b.jewelry.budget && `Budget: ${b.jewelry.budget}`].filter(Boolean).join(sep)
  : `${b.selectedTopTeeth.length} top / ${b.selectedBottomTeeth.length} bottom teeth in ${b.material}`;

export interface BookingPreset {
  teeth?: { top: number[]; bottom: number[] };
  material?: string;
  cuts?: string[];
  notes?: string;
  serviceType?: 'in-person' | 'mail-order' | 'jewelry' | 'adjustment';
  /** A design made in the Design Studio. The form opens on a review of it instead of asking again. */
  design?: StudioDesign;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreset?: BookingPreset;
  /** Takes the customer back to the Design Studio with their design. */
  onEditDesign?: () => void;
}

const MATERIAL_OPTIONS = [
  { id: '10k-gold', name: '10K Solid Yellow Gold', priceInfo: '$95/tooth (Most Popular)', color: '#e5b840' },
  { id: '14k-gold', name: '14K Solid Yellow Gold', priceInfo: '$115/tooth', color: '#d4af37' },
  { id: '14k-white-gold', name: '14K Solid White Gold', priceInfo: '$115/tooth', color: '#f1f5f9' },
  { id: 'silver-moissanite', name: 'Silver Moissanite (VVS)', priceInfo: 'Passes Diamond Testers', color: '#f8fafc' },
  { id: 'silver-lab-diamond', name: 'Silver Lab Diamond (VVS)', priceInfo: 'Colorless D-F Certified', color: '#ffffff' },
  { id: 'silver-plain', name: '925 Dental Silver', priceInfo: '$40/tooth (Budget Classic)', color: '#cbd5e1' },
  { id: '18k-natural', name: '18K Gold / Natural Diamonds', priceInfo: 'Bespoke Private Consultation', color: '#f59e0b' },
];

// Custom jewelry & watches are quoted per piece, so no per-tooth prices here
const JEWELRY_METALS = ['10K Gold', '14K Gold', '18K Gold', '925 Sterling Silver', 'Not Sure Yet'];
const JEWELRY_STONES = ['No Stones', 'Moissanite', 'Lab Diamond', 'Natural Diamond', 'Not Sure Yet'];

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
  { id: 'laser-design', name: 'Laser Design (+$25/tooth)' },
  { id: '3d-design', name: '3D Sculpted Design (+$85/tooth)' },
];

// Studio hours are 10:00 AM – 7:30 PM, so the last 30-minute slot starts at 7:00 PM
const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
];

export default function BookingModal({ isOpen, onClose, initialPreset, onEditDesign }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Design, 2: Date & Contact, 3: Confirmed
  const [design, setDesign] = useState<StudioDesign | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  
  // Customization state
  const [serviceType, setServiceType] = useState<'in-person' | 'mail-order' | 'jewelry' | 'adjustment'>('in-person');
  const [selectedTopTeeth, setSelectedTopTeeth] = useState<Set<number>>(new Set(presetTeeth(6)));
  const [selectedBottomTeeth, setSelectedBottomTeeth] = useState<Set<number>>(new Set());
  const [material, setMaterial] = useState<string>('10k-gold');
  const [selectedCuts, setSelectedCuts] = useState<string[]>(['perm-cut']);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [jewelryMetal, setJewelryMetal] = useState(JEWELRY_METALS[0]);
  const [jewelryStone, setJewelryStone] = useState(JEWELRY_STONES[0]);
  const [jewelrySize, setJewelrySize] = useState('');
  const [jewelryBudget, setJewelryBudget] = useState('');
  
  // Date & Contact State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toDateKey(d);
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

  // Start each visit from the preset (or a blank form)
  useEffect(() => {
    if (!isOpen) return;
    const preset: BookingPreset = initialPreset || {};
    const fromStudio = preset.design || null;
    setStep(1);
    setFormError(null);
    setDesign(fromStudio);

    if (fromStudio) {
      const g = fromStudio.grillz;
      setServiceType(preset.serviceType === 'mail-order' ? 'mail-order' : 'in-person');
      setSelectedTopTeeth(new Set(g.top));
      setSelectedBottomTeeth(new Set(g.bottom));
      setMaterial(`${grillzMetalName(g)}${g.stones ? ` with ${grillzStoneName(g)}` : ''}`);
      setSelectedCuts([g.baseStyle, ...g.addons]);
    } else {
      setServiceType(preset.serviceType || 'in-person');
      setSelectedTopTeeth(new Set(preset.teeth ? preset.teeth.top : presetTeeth(6)));
      setSelectedBottomTeeth(new Set(preset.teeth ? preset.teeth.bottom : []));
      setMaterial(preset.material || '10k-gold');
      setSelectedCuts(preset.cuts || ['perm-cut']);
    }
    setCustomNotes(preset.notes || '');
    setJewelryMetal(JEWELRY_METALS[0]);
    setJewelryStone(JEWELRY_STONES[0]);
    setJewelrySize('');
    setJewelryBudget('');
  }, [initialPreset, isOpen]);

  // Hide times that are already booked for the chosen day
  useEffect(() => {
    if (!isOpen || step !== 2) return;
    let cancelled = false;
    fetchTakenSlots(selectedDate).then(taken => {
      if (cancelled) return;
      setTakenSlots(taken);
      setSelectedTime(current => (taken.includes(current) ? TIME_SLOTS.find(t => !taken.includes(t)) || current : current));
    });
    return () => { cancelled = true; };
  }, [isOpen, step, selectedDate]);

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
    const six = new Set(presetTeeth(6));
    const eight = new Set(presetTeeth(8));
    if (type === 'top-6') { setSelectedTopTeeth(six); setSelectedBottomTeeth(new Set()); }
    else if (type === 'top-8') { setSelectedTopTeeth(eight); setSelectedBottomTeeth(new Set()); }
    else if (type === 'bottom-6') { setSelectedTopTeeth(new Set()); setSelectedBottomTeeth(six); }
    else if (type === 'bottom-8') { setSelectedTopTeeth(new Set()); setSelectedBottomTeeth(eight); }
    else if (type === 'full-8-8') { setSelectedTopTeeth(eight); setSelectedBottomTeeth(new Set(eight)); }
    else { setSelectedTopTeeth(new Set()); setSelectedBottomTeeth(new Set()); }
  };

  // The booking form's own choices, drawn with the same mouth as the Design Studio
  const formGrillz: GrillzDesign = {
    ...DEFAULT_DESIGN.grillz,
    ...grillzFromMaterial(material),
    baseStyle: (selectedCuts.find(c => FREE_STYLES.some(f => f.id === c)) || 'solid') as FreeStyle,
    addons: selectedCuts.filter(c => !FREE_STYLES.some(f => f.id === c)) as AddOn[],
    top: Array.from(selectedTopTeeth),
    bottom: Array.from(selectedBottomTeeth),
    notes: '',
  };

  const handleFormToothClick = (n: number, isTop: boolean) => (isTop ? toggleTopTooth(n) : toggleBottomTooth(n));

  const toggleCut = (cutId: string) => {
    if (selectedCuts.includes(cutId)) {
      setSelectedCuts(selectedCuts.filter(c => c !== cutId));
    } else {
      setSelectedCuts([...selectedCuts, cutId]);
    }
  };

  // Estimate calculation (same prices as the Design Studio)
  const calculateEstimate = () => {
    if (design) {
      const { total } = grillzEstimate(design.grillz);
      return total === null ? 'Custom Quoted on Confirmation' : `$${total.toLocaleString()}`;
    }
    if (serviceType === 'jewelry') return jewelryBudget.trim() ? `Budget: ${formatBudget(jewelryBudget)}` : 'Custom Jewelry Quote upon Consultation';
    if (serviceType === 'adjustment') return '$50 - $120 (Fit depending)';
    if (totalTeethCount === 0) return 'Select teeth above';
    const base = grillzBasePrice(material, totalTeethCount);
    if (base === null) return 'Custom Quoted on Confirmation';
    return `$${(base + addonsPrice(selectedCuts, totalTeethCount)).toLocaleString()}`;
  };

  const designRows: [string, string][] = !design ? [] : [
    ['Teeth', [design.grillz.top.length && `${design.grillz.top.length} top`, design.grillz.bottom.length && `${design.grillz.bottom.length} bottom`].filter(Boolean).join(' + ') || 'None'],
    ['Metal', grillzMetalName(design.grillz)],
    ['Stones', grillzStoneName(design.grillz)],
    ...(!design.grillz.stones ? [['Style', styleName(design.grillz.baseStyle)] as [string, string]] : []),
    ['Add-ons', design.grillz.addons.map(addonName).join(', ') || 'None'],
    ...toothNoteList(design.grillz).map(t => [t.label, t.note] as [string, string]),
    ...(design.grillz.notes ? [['Notes', design.grillz.notes] as [string, string]] : []),
  ];

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    if (!clientName.trim() || !phone.trim()) {
      setFormError('Please provide your full name and phone number so we can confirm your appointment.');
      return;
    }
    setFormError(null);

    const isJewelry = serviceType === 'jewelry';
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
      selectedTopTeeth: isJewelry ? [] : Array.from<number>(selectedTopTeeth).sort((a, b) => a - b),
      selectedBottomTeeth: isJewelry ? [] : Array.from<number>(selectedBottomTeeth).sort((a, b) => a - b),
      material: isJewelry ? jewelryMetal : material,
      cuts: isJewelry ? [] : selectedCuts,
      jewelry: isJewelry ? { metal: jewelryMetal, stone: jewelryStone, size: jewelrySize.trim(), budget: formatBudget(jewelryBudget) } : undefined,
      customNotes,
      estimatedPrice: calculateEstimate(),
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      designSummary: design ? designSummary(design) : undefined,
      designLink: design ? designShareUrl(design) : undefined,
    };

    if (takenSlots.includes(selectedTime)) {
      setFormError('That time is already booked. Please pick another time.');
      return;
    }

    setIsSending(true);
    const slot = await reserveSlot(newBooking);
    if (slot === 'taken') {
      setIsSending(false);
      setTakenSlots(await fetchTakenSlots(selectedDate));
      setFormError(`Sorry, someone just booked ${selectedTime} on that day. Please pick another time.`);
      return;
    }

    try {
      newBooking.deliveredToStudio = await sendBookingToStudio(newBooking);
    } catch (err) {
      console.error(err);
      newBooking.deliveredToStudio = false;
    } finally {
      setIsSending(false);
    }

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
      `Appointment with Jawz Jewelry\nRef: ${booking.id}\nService: ${booking.serviceType}\n${lookingFor(booking)}\nNotes: ${booking.customNotes || 'None'}\nStudio Phone: (469) 487-5734\nStrictly by appointment only.`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${location}&details=${details}`;
  };

  // SMS draft for quick texting owner
  const getSmsDraft = (booking: BookingData) => {
    const text = encodeURIComponent(
      `Hi Jeremy! I just booked an appointment on your site (Ref ${booking.id}). Name: ${booking.clientName}, Date: ${booking.appointmentDate} at ${booking.appointmentTime}. Looking for: ${lookingFor(booking, ', ')}. Notes: ${booking.customNotes || 'None'}.${booking.designLink ? ` My design: ${booking.designLink}` : ''}`
    );
    return `sms:+14694875734?body=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-4xl bg-[#0d0d0d] border border-[#D4D4D8]/40 shadow-[0_0_50px_rgba(212,212,216,0.2)] rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-black via-zinc-900 to-black px-6 py-4 border-b border-[#D4D4D8]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4D4D8]/10 border border-[#D4D4D8]/40 flex items-center justify-center text-[#D4D4D8]">
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
          <FlowSteps
            steps={BOOKING_STEPS}
            active={step - 1}
            onStepClick={step === 3 ? undefined : (i) => setStep((i + 1) as 1 | 2)}
          />
          
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#D4D4D8]">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Perfect Fit</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* STEP 1 (from the Design Studio): review the design instead of asking again */}
          {step === 1 && design && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3 bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-lg p-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 block mb-3">Your Design</span>
                  <MouthPreview design={design.grillz} />
                </div>

                <div className="md:col-span-2 flex flex-col gap-4">
                  <dl className="space-y-2 text-xs">
                    {designRows.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                        <dt className="text-zinc-500 uppercase tracking-wider font-semibold shrink-0">{label}</dt>
                        <dd className="text-white font-bold text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">Estimate</span>
                    <span className="text-2xl font-black text-[#D4D4D8] font-heading">{calculateEstimate()}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-2">How should we take your mold?</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'in-person' as const, title: 'At the Studio', desc: 'Arlington, TX' },
                        { id: 'mail-order' as const, title: 'Mail Me a Kit', desc: 'Free shipping' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setServiceType(opt.id)}
                          aria-pressed={serviceType === opt.id}
                          className={`p-2.5 text-left rounded-sm border transition-all ${serviceType === opt.id ? 'border-[#D4D4D8] bg-[#D4D4D8]/10' : 'border-white/10 bg-[#121212] hover:border-zinc-700'}`}
                        >
                          <span className="block text-xs font-bold text-white uppercase">{opt.title}</span>
                          <span className="text-[10px] text-zinc-400">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
                {onEditDesign ? (
                  <button
                    type="button"
                    onClick={onEditDesign}
                    className="px-6 py-3 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white rounded-sm"
                  >
                    Edit Design
                  </button>
                ) : <span />}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,212,216,0.3)] rounded-sm"
                >
                  <span>Looks Good, Pick a Date</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 (from scratch): Customization & Interactive Tooth Selection */}
          {step === 1 && !design && (
            <div className="space-y-6">

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
                          ? 'border-[#D4D4D8] bg-[#D4D4D8]/10' 
                          : 'border-white/10 bg-[#121212] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-white">{srv.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-[#D4D4D8] border border-[#D4D4D8]/30">
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
                        <span className="text-xs px-2 py-0.5 bg-[#D4D4D8] text-black font-black uppercase rounded-sm">
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
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#D4D4D8]/20 border border-[#D4D4D8]/50 text-[#D4D4D8] hover:bg-[#D4D4D8] hover:text-black rounded-sm"
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

                  <MouthPreview design={formGrillz} onToothClick={handleFormToothClick} />
                  <p className="text-[11px] text-zinc-500">
                    Tap teeth to add or remove them.{onEditDesign && (
                      <> Want stones, gold colors or setting styles?{' '}
                        <button type="button" onClick={onEditDesign} className="text-[#D4D4D8] underline underline-offset-2 hover:text-white">Open the Design Studio</button>
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Custom jewelry & watches: metal, stone, size and budget */}
              {serviceType === 'jewelry' && (
                <div className="bg-[#111] border border-white/10 rounded-sm p-4 sm:p-6 space-y-5">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Your Piece</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Chains, rings, pendants and watches are quoted per piece at your consultation.</p>
                  </div>
                  {([['Metal', JEWELRY_METALS, jewelryMetal, setJewelryMetal], ['Stone', JEWELRY_STONES, jewelryStone, setJewelryStone]] as const).map(([label, options, value, set]) => (
                    <div key={label}>
                      <span className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2">{label}:</span>
                      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
                        {options.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => set(opt)}
                            aria-pressed={value === opt}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                              value === opt
                                ? 'bg-[#D4D4D8] text-black border-[#D4D4D8] font-bold'
                                : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-zinc-500'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="jewelry-size" className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2">Size:</label>
                      <input
                        id="jewelry-size"
                        value={jewelrySize}
                        onChange={e => setJewelrySize(e.target.value)}
                        maxLength={80}
                        placeholder='e.g. ring size 9, 22" chain, 2" pendant'
                        className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4D4D8] placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="jewelry-budget" className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2">Budget:</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">$</span>
                        <input
                          id="jewelry-budget"
                          inputMode="numeric"
                          value={jewelryBudget}
                          onChange={e => setJewelryBudget(e.target.value.replace(/[^\d,]/g, ''))}
                          maxLength={12}
                          placeholder="e.g. 1,500"
                          className="w-full bg-black border border-white/20 rounded-sm p-2.5 pl-7 text-sm text-white focus:outline-none focus:border-[#D4D4D8] placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Material & Metal Selection */}
              {serviceType !== 'jewelry' && (
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
                          ? 'border-[#D4D4D8] bg-[#D4D4D8]/10'
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
              )}

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
                              ? 'bg-[#D4D4D8] text-black border-[#D4D4D8] font-bold shadow-[0_0_10px_rgba(212,212,216,0.3)]'
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
                <label className="block text-xs uppercase tracking-widest font-bold text-[#D4D4D8] mb-1.5 flex items-center justify-between">
                  <span>Customization Notes & Instructions:</span>
                  <span className="text-[10px] text-zinc-400 font-normal lowercase tracking-normal">Tell the jeweler your vision</span>
                </label>
                <textarea
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder={serviceType === 'jewelry'
                    ? 'e.g., Cuban link chain with a custom name pendant, iced-out bezel on my watch. Reference photos on Instagram...'
                    : "e.g., I want an open face on tooth 7 & 8, perm cuts throughout, starburst cut on left canine. Also please let me know diamond tester results. Budget around $1,200..."}
                  rows={4}
                  className="w-full bg-black border border-white/20 rounded-sm p-3 text-sm text-white focus:outline-none focus:border-[#D4D4D8] transition-colors placeholder:text-zinc-600 font-sans"
                />
              </div>

              {/* Action to Step 2 */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400">Estimated Total:</span>
                  <span className="text-xl font-black text-[#D4D4D8] font-heading">{calculateEstimate()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,212,216,0.3)] rounded-sm"
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
              <div className="bg-[#121212] border-l-4 border-[#D4D4D8] p-4 rounded-r-sm space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#D4D4D8]" />
                  <span>Physical Studio: 1201 N Watson Rd, Arlington, TX 76006</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#D4D4D8]" />
                  <span>Hours: 10:00 AM – 7:30 PM</span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Strictly by appointment only. We schedule private 1-on-1 slots so you get dedicated jeweler attention. For mail orders, kit is shipped following phone consultation.
                </p>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4D4D8]" />
                    <span>Select Appointment Date:</span>
                  </label>
                  <DateCalendar value={selectedDate} onChange={setSelectedDate} />
                  <div className="flex gap-2 mt-2">
                    {[
                      { label: 'Tomorrow', offset: 1 },
                      { label: '+2 Days', offset: 2 },
                      { label: 'This Weekend', offset: 3 },
                    ].map((item, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + item.offset);
                      const str = toDateKey(d);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDate(str)}
                          className={`text-[10px] px-2 py-1 rounded border uppercase tracking-wider ${
                            selectedDate === str ? 'bg-[#D4D4D8] text-black font-bold border-[#D4D4D8]' : 'bg-zinc-900 text-zinc-400 border-white/10'
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
                    <Clock className="w-4 h-4 text-[#D4D4D8]" />
                    <span>Select Time Slot:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isTaken = takenSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setSelectedTime(slot)}
                          aria-label={isTaken ? `${slot} (booked)` : slot}
                          className={`py-2 text-xs font-bold rounded-sm border transition-all ${
                            isTaken
                              ? 'bg-black text-zinc-600 border-white/5 line-through cursor-not-allowed'
                              : selectedTime === slot
                                ? 'bg-[#D4D4D8] text-black border-[#D4D4D8]'
                                : 'bg-zinc-900 text-zinc-300 border-white/10 hover:border-zinc-600'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  {takenSlots.length === TIME_SLOTS.length && (
                    <p className="text-[11px] text-amber-300 mt-2">This day is fully booked. Please choose another date.</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-[#111] border border-white/10 p-5 rounded-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4D4D8] border-b border-white/5 pb-2">
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
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
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
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
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
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
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
                      className="w-full bg-black border border-white/20 rounded-sm p-2.5 text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
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
                          className="accent-[#D4D4D8]"
                        />
                        <span>{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Policy & Deposit Notice */}
              <div className="bg-black border border-[#D4D4D8]/30 p-4 rounded-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#D4D4D8] shrink-0 mt-0.5" />
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
                  Back to Design
                </button>

                <button
                  type="submit"
                  disabled={isSending}
                  className="px-8 py-3 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,212,216,0.4)] rounded-sm disabled:opacity-60 disabled:cursor-wait"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSending ? 'Sending to the Studio...' : 'Confirm & Lock Appointment'}</span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: Booking Confirmed Screen */}
          {step === 3 && confirmedBooking && (
            <div className="py-6 px-4 text-center space-y-6">
              
              <div className="w-20 h-20 rounded-full bg-[#D4D4D8]/20 border-2 border-[#D4D4D8] flex items-center justify-center mx-auto text-[#D4D4D8] shadow-[0_0_30px_rgba(212,212,216,0.4)]">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#D4D4D8] font-bold">
                  Appointment Reference: #{confirmedBooking.id}
                </span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight font-heading mt-1">
                  You're Booked with Jawz Jewelry!
                </h3>
                <p className="text-sm text-zinc-400 max-w-lg mx-auto mt-2 font-light">
                  Thank you, <strong className="text-white">{confirmedBooking.clientName}</strong>. We look forward to fitting you on{' '}
                  <strong className="text-[#D4D4D8]">{confirmedBooking.appointmentDate}</strong> at{' '}
                  <strong className="text-[#D4D4D8]">{confirmedBooking.appointmentTime}</strong>.
                </p>
              </div>

              {confirmedBooking.deliveredToStudio ? (
                <p role="status" className="max-w-xl mx-auto text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-sm p-3">
                  Your booking{design ? ' and design were' : ' was'} sent to Jeremy. He'll reach out by your preferred contact method to confirm.
                </p>
              ) : (
                <p role="alert" className="max-w-xl mx-auto text-xs text-amber-200 bg-amber-950/40 border border-amber-500/40 rounded-sm p-3">
                  We couldn't reach the studio automatically. Please tap "Text Details to Owner" below so Jeremy gets your booking.
                </p>
              )}

              {design && (
                <div className="max-w-md mx-auto bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-lg p-3">
                  <MouthPreview design={design.grillz} />
                </div>
              )}

              {/* Booking Summary Box */}
              <div className="max-w-xl mx-auto bg-[#111] border border-white/10 rounded-sm p-6 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Service:</span>
                  <span className="text-white font-bold uppercase">{confirmedBooking.serviceType}</span>
                </div>
                {confirmedBooking.jewelry ? (
                  ([['Metal', confirmedBooking.jewelry.metal], ['Stone', confirmedBooking.jewelry.stone], ['Size', confirmedBooking.jewelry.size || 'Not given'], ['Budget', confirmedBooking.jewelry.budget || 'Not given']] as const).map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                      <span className="text-zinc-500 uppercase tracking-wider font-semibold">{label}:</span>
                      <span className="text-white font-bold">{value}</span>
                    </div>
                  ))
                ) : (<>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Teeth Configured:</span>
                  <span className="text-[#D4D4D8] font-bold">
                    {confirmedBooking.selectedTopTeeth.length} Upper Teeth • {confirmedBooking.selectedBottomTeeth.length} Lower Teeth ({confirmedBooking.selectedTopTeeth.length + confirmedBooking.selectedBottomTeeth.length} Total)
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Metal / Material:</span>
                  <span className="text-white font-bold capitalize">{confirmedBooking.material.replace('-', ' ')}</span>
                </div>
                </>)}
                <div className="flex justify-between items-center border-b border-white/5 pb-2 text-xs">
                  <span className="text-zinc-500 uppercase tracking-wider font-semibold">Estimated Total:</span>
                  <span className="text-[#D4D4D8] font-bold font-heading text-sm">{confirmedBooking.estimatedPrice}</span>
                </div>
                {confirmedBooking.designSummary && (
                  <div className="border-b border-white/5 pb-2 text-xs">
                    <span className="text-zinc-500 uppercase tracking-wider font-semibold block mb-1">Your Design:</span>
                    <p className="text-zinc-300 bg-black/50 p-2 rounded text-[11px] whitespace-pre-line">{confirmedBooking.designSummary}</p>
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
                  <Calendar className="w-4 h-4 text-[#D4D4D8]" />
                  <span>Add to Google Calendar</span>
                </a>

                <a
                  href={getSmsDraft(confirmedBooking)}
                  className="px-5 py-2.5 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-wider rounded-sm flex items-center gap-2 hover:bg-[#ffffff]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Text Details to Owner</span>
                </a>

                <a
                  href="tel:4694875734"
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2 border border-white/10"
                >
                  <Phone className="w-4 h-4 text-[#D4D4D8]" />
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
