import React, { useState, useEffect } from 'react';
import { 
  Menu, User, ChevronDown, Check, Star, ArrowRight, 
  Instagram, Facebook, X, Calendar, 
  Sparkles, MapPin, Phone, Award, ExternalLink, MessageSquare, 
  CheckCircle2, ShieldCheck, Heart 
} from 'lucide-react';
import silverMoissanite from './assets/images/silver_moissanite_1779848576581.png';
import goldPlain from './assets/images/gold_plain_1779848593610.png';
import silverPlain from './assets/images/silver_plain_1779848608539.png';
import jawzPendantHero from './assets/images/jawz_pendant_hero.jpg';
import jawzLogo from './assets/images/jawz-custom-jewelry-logo.png';
import ownerHelpingClient from './assets/images/owner-helping-client.jpg';
import stripPendant from './assets/images/instagram/DZQBwGTOi3U.jpg';
import stripRing from './assets/images/instagram/DPEoxVyDS0e.jpg';
import stripCuban from './assets/images/instagram/C8Z6kHHPFTG.jpg';
import { MouthPreview, JewelryPreview } from './design/DesignPreviews';

import Configurator from './Configurator';
import AILab from './AILab';
import PastWork from './PastWork';
import GoogleReviews from './GoogleReviews';
import { InstagramPostCard, instagramPostUrl } from './InstagramGallery';
import { BEST_SELLER_POSTS, InstagramPost } from './data/instagramPosts';
import BookingModal, { BookingData, BookingPreset } from './BookingModal';
import { StudioDesign, loadSavedDesign, saveDesign, readSharedDesign, designPrompt } from './design/designModel';
import { GOOGLE_REVIEWS_DATA } from './data/pastWorkData';

const PricingRow = ({ label, price }: { label: string, price: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 transition-colors">
    <span className="text-sm uppercase tracking-widest font-bold text-gray-300">{label}</span>
    <span className="text-sm font-bold text-[#D4D4D8]">{price}</span>
  </div>
);

type Page = 'home' | 'pastwork' | 'reviews' | 'configurator' | 'ailab' | 'info';

// Every page has its own address so links, the back button and Google all work
const PAGE_PATHS: Record<Page, string> = {
  home: '/',
  pastwork: '/past-work',
  reviews: '/reviews',
  configurator: '/design-studio',
  ailab: '/ai-preview',
  info: '/info',
};

const PAGE_TITLES: Record<Page, string> = {
  home: 'Jawz Jewelry | Arlington, TX | Custom Grillz, Engagement Rings & Fine Jewelry',
  pastwork: 'Past Work | Jawz Custom Jewelry',
  reviews: 'Google Reviews | Jawz Custom Jewelry',
  configurator: 'Design Studio | Design Your Grillz or Jewelry | Jawz',
  ailab: 'AI Preview | See Your Design Realistic | Jawz',
  info: 'Add-Ons, Policies & How It Works | Jawz Custom Jewelry',
};

const pageFromPath = (path: string): Page => {
  const clean = path.replace(/\/+$/, '') || '/';
  return (Object.keys(PAGE_PATHS) as Page[]).find(page => PAGE_PATHS[page] === clean) || 'home';
};

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setPageState] = useState<Page>(() => pageFromPath(window.location.pathname));

  const setCurrentPage = (page: Page) => {
    if (PAGE_PATHS[page] !== window.location.pathname) window.history.pushState(null, '', PAGE_PATHS[page]);
    setPageState(page);
    window.scrollTo(0, 0);
  };

  // Browser back/forward buttons
  useEffect(() => {
    const onPopState = () => setPageState(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.title = PAGE_TITLES[currentPage];
  }, [currentPage]);
  // The customer's design follows them between the Design Studio, AI Preview and booking
  const [sharedDesign] = useState<StudioDesign | null>(() => readSharedDesign());
  const [studioDesign, setStudioDesign] = useState<StudioDesign>(() => sharedDesign || loadSavedDesign());
  const [aiFromStudio, setAiFromStudio] = useState(false);

  useEffect(() => {
    saveDesign(studioDesign);
  }, [studioDesign]);

  // Opening a shared design link lands on the Design Studio
  useEffect(() => {
    if (sharedDesign) {
      setPageState('configurator');
      window.history.replaceState(null, '', PAGE_PATHS.configurator);
    }
  }, [sharedDesign]);

  const goTo = setCurrentPage;

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreset, setBookingPreset] = useState<BookingPreset | undefined>(undefined);

  const openBookingWithPreset = (preset?: BookingPreset) => {
    setBookingPreset(preset);
    setIsBookingOpen(true);
  };

  const handleBookInstagramPost = (post: InstagramPost) => {
    openBookingWithPreset({
      notes: `I'd like a piece like "${post.title}" from your Instagram: ${instagramPostUrl(post)}`
    });
  };

  const bestSellers = BEST_SELLER_POSTS;

  const renderContent = () => {
    if (currentPage === 'pastwork') {
      return (
        <PastWork 
          onBookPost={handleBookInstagramPost} 
          onOpenBooking={() => openBookingWithPreset()}
          onBackToHome={() => setCurrentPage('home')}
        />
      );
    }

    if (currentPage === 'reviews') {
      return (
        <GoogleReviews 
          onOpenBooking={() => openBookingWithPreset()}
          onBackToHome={() => setCurrentPage('home')}
        />
      );
    }

    if (currentPage === 'configurator') {
      return (
        <Configurator 
          design={studioDesign}
          onChange={setStudioDesign}
          onBack={() => goTo('home')} 
          onBook={() => openBookingWithPreset({ design: studioDesign })}
          onOpenAIPreview={() => {
            setAiFromStudio(true);
            goTo('ailab');
          }}
        />
      );
    }

    if (currentPage === 'ailab') {
      return (
        <AILab 
          onBack={() => goTo('home')} 
          initialIdea={aiFromStudio ? designPrompt(studioDesign) : undefined}
          onOpenToothLab={() => goTo('configurator')}
          onBookConsultation={(data) => {
            openBookingWithPreset({
              notes: data.notes,
              serviceType: data.serviceType,
              material: data.material,
              teeth: data.teeth,
              cuts: data.cuts,
              attachedMockupImage: data.attachedMockupImage,
              geminiShareLink: data.geminiShareLink,
              design: aiFromStudio ? studioDesign : undefined,
            });
          }}
        />
      );
    }

    if (currentPage === 'info') {
      return (
        <div className="flex-1 w-full flex flex-col">
          <section className="py-14 sm:py-20 bg-gradient-to-b from-black via-zinc-950 to-[#050505] border-b border-white/5 text-center">
            <div className="max-w-4xl mx-auto px-4">
              <button onClick={() => goTo('home')} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4D4D8] hover:text-white transition-colors mb-6 font-semibold">
                ← Back to Home
              </button>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-heading">How It Works & Policies</h1>
              <p className="text-sm text-zinc-400 mt-4 font-light">Mold kits and studio fittings, custom jewelry, add-on prices, deposits and turnaround.</p>
            </div>
          </section>

        {/* How It Works (Mail Orders & In-Person Appointment Studio) */}
        <section id="how-it-works" className="py-24 bg-[#0a0a0a] border-t border-white/5 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg font-heading">
                How It Works
              </h2>
              <div className="w-16 h-1 bg-[#D4D4D8] mx-auto mt-6 mb-6"></div>
              <p className="text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
                Whether you visit our private studio in Arlington, TX by appointment or order nationwide via mail, we deliver an immaculate custom fit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#111] border border-white/10 p-8 text-center relative hover:border-[#D4D4D8]/50 transition-colors">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#D4D4D8] text-black font-black flex items-center justify-center text-xl shadow-[0_0_15px_rgba(212,212,216,0.4)]">1</div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mt-6 mb-4">Book Or Order Kit</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  Book an in-person mold session at our Arlington studio (1201 N Watson Rd) or select mail-order to receive an impression mold kit with video guidance.
                </p>
              </div>
              
              <div className="bg-[#111] border border-white/10 p-8 text-center relative hover:border-[#D4D4D8]/50 transition-colors">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#D4D4D8] text-black font-black flex items-center justify-center text-xl shadow-[0_0_15px_rgba(212,212,216,0.4)]">2</div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mt-6 mb-4">Mold Review & Deposit</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  Our jewelers inspect your impression to guarantee accurate dental margins. Once approved and 60% deposit is secured, dental casting commences.
                </p>
              </div>

              <div className="bg-[#111] border border-[#D4D4D8]/30 p-8 text-center relative hover:border-[#D4D4D8] transition-colors">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white text-black font-black flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,255,255,0.4)]">3</div>
                <h3 className="text-xl font-bold text-[#D4D4D8] uppercase tracking-wider mt-6 mb-4">Hand Finish & Shine</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  Hand polished to a mirror gleam with laser cuts, stone pave, and deep perm lines. Pick up in studio or receive insured express delivery to your door.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Jewelry & Appointments */}
        <section id="custom" className="py-24 bg-[#050505] border-t border-white/5 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Custom Jewelry Offerings */}
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 font-heading">
                  Custom Jewelry & Sourcing
                </h2>
                <div className="w-12 h-1 bg-[#D4D4D8] mb-8"></div>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
                  Beyond premium grillz, Jeremy acts as your personal jeweler. Sourcing certified GIA/IGI diamonds, crafting custom engagement rings, iced-out watches, and Miami Cuban link chains.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-[#111] p-4 border border-white/5">
                    <div className="w-12 h-12 bg-black flex items-center justify-center border border-white/10 shrink-0">
                      <Star className="w-5 h-5 text-[#D4D4D8]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Custom Diamond Rings</h4>
                      <p className="text-xs text-zinc-500">Engagement rings, wedding bands, and custom solitaire settings.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-[#111] p-4 border border-white/5">
                     <div className="w-12 h-12 bg-black flex items-center justify-center border border-white/10 shrink-0">
                      <Star className="w-5 h-5 text-[#D4D4D8]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Bespoke Watches & Chains</h4>
                      <p className="text-xs text-zinc-500">Diamond setting for luxury timepieces and custom heavy link chains.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  <button 
                    onClick={() => openBookingWithPreset({ serviceType: 'jewelry', notes: 'Interested in custom jewelry: diamond ring / watch / chain consultation.' })} 
                    className="px-8 py-3 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-colors rounded-sm"
                  >
                    Book Jewelry Consultation
                  </button>

                  <a 
                    href="https://www.instagram.com/jawz_grillzz?igsh=ZDNlZDc0MzIxNw==" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-8 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:border-[#D4D4D8] hover:text-[#D4D4D8] transition-colors rounded-sm inline-flex items-center gap-2"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>DM Inspiration</span>
                  </a>
                </div>
              </div>

              {/* In-Person Appointments */}
              <div className="bg-[#111] border border-[#D4D4D8]/30 p-10 flex flex-col justify-center items-center text-center relative overflow-hidden rounded-sm">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4D4D8] opacity-5 blur-3xl rounded-full"></div>
                 <User className="w-12 h-12 text-[#D4D4D8] mb-6" strokeWidth={1} />
                 <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4 font-heading">
                   Arlington Private Studio
                 </h3>
                 <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6 max-w-sm">
                   1201 N Watson Rd, Arlington, TX 76006, United States. We do not operate an open retail storefront — the studio opens exclusively for scheduled client appointments.
                 </p>
                 <div className="bg-black border border-red-900/50 text-red-400 px-4 py-2 uppercase text-[10px] tracking-widest font-bold mb-8">
                   Strictly By Appointment Only
                 </div>
                 <button 
                   onClick={() => openBookingWithPreset({ serviceType: 'in-person' })} 
                   className="px-10 py-4 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-colors w-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,212,216,0.2)] rounded-sm"
                 >
                   <Calendar className="w-4 h-4" />
                   <span>Book Studio Fitting</span>
                 </button>
              </div>
              
            </div>
          </div>
        </section>

        {/* Add Ons & Policies */}
        <section id="policies" className="py-20 bg-[#0a0a0a] border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg font-heading">
                Add Ons & Policies
              </h2>
              <div className="w-16 h-1 bg-[#D4D4D8] mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* ADD ONS */}
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-widest text-[#D4D4D8] mb-8 flex items-center font-heading">
                  <span className="w-8 h-px bg-[#D4D4D8] mr-4"></span> Add Ons <span className="w-8 h-px bg-[#D4D4D8] ml-4"></span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                  <div className="flex flex-col gap-2">
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider">Open Face</span><span className="text-sm font-bold text-[#D4D4D8]">FREE</span></div>
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider">Perm Cut</span><span className="text-sm font-bold text-[#D4D4D8]">FREE</span></div>
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider">Diamond Cuts</span><span className="text-sm font-bold text-[#D4D4D8]">FREE</span></div>
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider">Nugget Cut</span><span className="text-sm font-bold text-[#D4D4D8]">FREE</span></div>
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider">Rose Cuts</span><span className="text-sm font-bold text-[#D4D4D8]">$7/Tooth</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider text-xs sm:text-sm">Starburst Cuts</span><span className="text-sm font-bold text-[#D4D4D8]">$7/Tooth</span></div>
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider text-[10px] sm:text-xs">Speciality Cut Open Face</span><span className="text-sm font-bold text-[#D4D4D8]">$20/Tooth</span></div>
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider text-xs sm:text-sm">Laser Design</span><span className="text-sm font-bold text-[#D4D4D8]">$25/Tooth</span></div>
                     <div className="flex justify-between items-center bg-[#111] p-3 border border-white/5"><span className="text-sm font-bold uppercase tracking-wider text-xs sm:text-sm">Diamond Dust</span><span className="text-sm font-bold text-[#D4D4D8]">$5/Tooth</span></div>
                     <div className="flex justify-between items-center bg-[#111]/80 border border-[#D4D4D8]/50 p-3 mt-auto"><span className="text-lg font-bold uppercase tracking-wider text-[#D4D4D8]">3D Design</span><span className="text-sm font-bold text-[#D4D4D8]">$85/Tooth<br/><span className="text-[10px]">AND UP</span></span></div>
                  </div>
                </div>
                
                <div className="text-center p-6 border border-[#D4D4D8]/30 bg-[#111] text-xs leading-relaxed uppercase tracking-widest text-[#D4D4D8]">
                  For 18K Grillz, Natural Diamonds, and other custom inquiries<br/><span className="text-white font-bold inline-block mt-2">Book an appointment or DM us with your project details</span>
                </div>
              </div>

              {/* POLICIES */}
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold uppercase tracking-widest text-[#D4D4D8] mb-8 flex items-center font-heading">
                  <span className="w-8 h-px bg-[#D4D4D8] mr-4"></span> Policies <span className="w-8 h-px bg-[#D4D4D8] ml-4"></span>
                </h3>

                <div className="bg-[#111] border border-white/5 p-8 flex-1 flex flex-col gap-6">
                   <div className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#D4D4D8] mt-1.5 shrink-0"></div>
                      <p className="text-sm font-bold uppercase tracking-wider text-white">Open by appointment only</p>
                   </div>
                   <div className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#D4D4D8] mt-1.5 shrink-0"></div>
                      <p className="text-sm font-bold uppercase tracking-wider text-white leading-relaxed">60% deposit required. Deposits are non-refundable.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#D4D4D8] mt-1.5 shrink-0"></div>
                      <p className="text-sm font-bold uppercase tracking-wider text-white leading-relaxed">Balance due within 21 days of completion/invoice. $5/day holding fee incurs after first 7 days.</p>
                   </div>
                   <div className="mt-8 pt-8 border-t border-white/10 text-xs text-gray-400 font-light leading-relaxed uppercase tracking-widest">
                     We guarantee our work and will remake and/or fix defects should they occur. Any quality disputes should be discussed upon pickup. We do not cover customer faults such as broken, bent, or lost jewelry.
                   </div>
                   
                   <div className="mt-auto flex justify-center py-4">
                       <svg className="w-16 h-16 text-[#D4D4D8] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                       </svg>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        </div>
      );
    }

    // HOME PAGE
    return (
      <div className="flex-1 w-full flex flex-col">

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#050505]">
          <div className="absolute inset-0 z-0">
            <img 
              src={jawzPendantHero} 
              alt="Jawz Custom Jewelry iced-out pendant on a silver rope chain" 
              className="w-full h-full object-cover opacity-60 object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
          </div>
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center justify-center min-h-[62vh] text-center">
            
            {/* Top Quality Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D4D4D8]/10 border border-[#D4D4D8]/30 text-[#D4D4D8] text-[11px] uppercase tracking-[0.25em] font-bold mb-6 rounded-full shadow-[0_0_15px_rgba(212,212,216,0.15)]">
              <Award className="w-3.5 h-3.5" />
              <span>Arlington, TX • Strictly By Appointment Only • Est. 2023</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white mb-4 uppercase drop-shadow-2xl font-heading">
              Made to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4D4D8] to-[#ffffff]">Shine</span>
            </h1>
            
            <p className="text-zinc-300 uppercase tracking-[0.3em] text-xs sm:text-sm font-semibold mb-3 max-w-2xl mx-auto">
              Custom Dental Grillz & Fine Jewelry Studio
            </p>

            <p className="text-zinc-400 text-xs sm:text-sm font-light mb-10 max-w-xl mx-auto leading-relaxed">
              Private 1-on-1 in-person impressions at our Arlington, TX studio (1201 N Watson Rd) & direct express mail-order mold kits shipped nationwide. Solid gold, flawless moissanite, and certified lab diamonds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl">
              {/* PRIMARY BOOKING CTA */}
              <button 
                onClick={() => openBookingWithPreset()} 
                className="px-8 py-4 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all shadow-[0_0_25px_rgba(212,212,216,0.4)] flex items-center justify-center gap-2 rounded-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Custom Appointment</span>
              </button>

              {/* PAST WORK & BEST SELLERS CTA */}
              <button 
                onClick={() => setCurrentPage('pastwork')} 
                className="px-8 py-4 border border-[#D4D4D8]/50 text-white text-xs font-bold uppercase tracking-widest bg-black/60 hover:bg-[#D4D4D8]/15 transition-all backdrop-blur-sm flex items-center justify-center gap-2 rounded-sm"
              >
                <Sparkles className="w-4 h-4 text-[#D4D4D8]" />
                <span>Explore Past Work</span>
              </button>

              {/* REVIEWS SHORTCUT */}
              <button 
                onClick={() => setCurrentPage('reviews')} 
                className="px-6 py-4 border border-white/10 text-zinc-300 text-xs font-bold uppercase tracking-widest bg-zinc-900/60 hover:border-zinc-500 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center gap-2 rounded-sm"
              >
                <div className="flex text-[#D4D4D8]">
                  <Star className="w-3.5 h-3.5 fill-[#D4D4D8]" />
                </div>
                <span>4.9★ Reviews</span>
              </button>
            </div>

            {/* Direct Gemini AI Mockup Callout */}
            <div className="mt-8">
              <button 
                onClick={() => goTo('configurator')}
                className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-[#D4D4D8]/40 hover:border-[#D4D4D8] text-xs text-zinc-300 hover:text-white transition-all shadow-md"
              >
                <span className="w-2 h-2 rounded-full bg-[#D4D4D8] animate-pulse"></span>
                <span className="text-[#D4D4D8] font-bold">Have an idea?</span>
                <span>Design it in the Design Studio, then see it realistic with AI Preview</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4D4D8] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Micro Info */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#D4D4D8]" /> Guaranteed Snug Fit
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#D4D4D8]" /> 10K, 14K, 18K Solid Gold
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#D4D4D8]" /> Moissanite Passes Diamond Tester
              </span>
            </div>

          </div>
        </section>

        {/* SECTION: BEST SELLERS AMONGST PAST WORK */}
        <section id="best-sellers" className="py-20 bg-[#080808] border-t border-b border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#D4D4D8] text-xs uppercase font-bold tracking-[0.3em] mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Most Requested Custom Work</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
                  Best Sellers Amongst Past Work
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-2 font-light">
                  Our top client favorites crafted since 2023. Tap a piece to see it on Instagram, or book a session for a style like it.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage('pastwork')}
                  className="px-6 py-3 border border-[#D4D4D8] text-[#D4D4D8] text-xs font-bold uppercase tracking-widest hover:bg-[#D4D4D8] hover:text-black transition-all rounded-sm flex items-center gap-2"
                >
                  <span>View All Past Work</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Best Sellers Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((post, idx) => (
                <InstagramPostCard key={post.id} post={post} rank={idx + 1} onBook={handleBookInstagramPost} />
              ))}
            </div>

            {/* Quick Consultation Banner */}
            <div className="mt-12 p-6 bg-gradient-to-r from-zinc-950 via-[#111] to-zinc-950 border border-white/10 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold uppercase text-white font-heading">
                  Want To Mix & Match Cuts Or Add Diamond Dust?
                </h4>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  In our booking system, you can select your exact teeth on the interactive arch and write specific custom notes.
                </p>
              </div>

              <button
                onClick={() => openBookingWithPreset()}
                className="px-6 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm shrink-0"
              >
                Custom Tooth Selection
              </button>
            </div>

          </div>
        </section>

        {/* Design Studio callout */}
        <section aria-labelledby="studio-callout-heading" className="py-20 sm:py-24 bg-[#050505] border-b border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 text-[#D4D4D8] text-xs uppercase font-bold tracking-[0.3em] mb-3">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Design Studio</span>
              </div>
              <h2 id="studio-callout-heading" className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
                Design Yours in Minutes
              </h2>
              <p className="text-sm text-zinc-400 mt-4 max-w-lg font-light leading-relaxed">
                Tap the teeth you want covered, pick your metal, cuts, jewels and cutouts, and watch your grill come to life with a live price. Building a pendant, chain or ring instead? That's in the Design Studio too.
              </p>
              <ol className="mt-6 space-y-2 text-sm text-zinc-300">
                <li><span className="text-[#D4D4D8] font-bold">1.</span> Design it in the Design Studio</li>
                <li><span className="text-[#D4D4D8] font-bold">2.</span> See it realistic with AI Preview (optional)</li>
                <li><span className="text-[#D4D4D8] font-bold">3.</span> Book. Your design is sent to Jeremy with your appointment</li>
              </ol>
              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={() => goTo('configurator')}
                  className="px-8 py-4 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all rounded-sm shadow-[0_0_20px_rgba(212,212,216,0.3)] inline-flex items-center gap-2"
                >
                  <span>Open the Design Studio</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => openBookingWithPreset({ design: studioDesign })}
                  className="px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:border-[#D4D4D8] transition-colors rounded-sm inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Book This Design</span>
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goTo('configurator')}
              aria-label="Open the Design Studio"
              className="block bg-gradient-to-b from-zinc-900 to-black border border-white/10 hover:border-[#D4D4D8]/60 transition-colors rounded-lg p-4 sm:p-6"
            >
              {studioDesign.mode === 'grillz'
                ? <MouthPreview design={studioDesign.grillz} />
                : <div className="flex justify-center"><JewelryPreview design={studioDesign.jewelry} /></div>}
              <span className="block mt-3 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Your saved design • Tap to edit</span>
            </button>
          </div>
        </section>

        {/* Jewelry photo strip */}
        <section aria-label="Custom jewelry made by Jawz" className="bg-black border-b border-white/5 relative z-20">
          <div className="grid grid-cols-3 h-48 sm:h-72">
            {[
              { src: stripPendant, alt: 'Iced-out custom "JR" letter pendant', pos: 'object-[center_60%]', id: 'DZQBwGTOi3U', type: 'reel' },
              { src: stripRing, alt: 'Custom diamond engagement ring on a client', pos: 'object-[center_70%]', id: 'DPEoxVyDS0e', type: 'p' },
              { src: stripCuban, alt: 'Two-tone iced Cuban link chain in its box', pos: 'object-center', id: 'C8Z6kHHPFTG', type: 'reel' },
            ].map(photo => (
              <a key={photo.id} href={`https://www.instagram.com/${photo.type}/${photo.id}/`} target="_blank" rel="noopener noreferrer" aria-label={`${photo.alt} — view on Instagram (opens in a new tab)`} className="block overflow-hidden group">
                <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className={`w-full h-full object-cover ${photo.pos} motion-safe:group-hover:scale-105 motion-safe:transition-transform duration-500`} />
              </a>
            ))}
          </div>
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-zinc-500 py-3">Pendants • Rings • Chains — Made in Arlington, TX</p>
        </section>

        {/* Meet the Owner */}
        <section id="meet-the-owner" aria-labelledby="owner-heading" className="py-20 sm:py-24 bg-[#111] border-t border-white/5 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
              <figure className="w-full max-w-md mx-auto border border-[#D4D4D8]/30 rounded-sm overflow-hidden">
                <img
                  src={ownerHelpingClient}
                  alt="Jeremy King, owner of Jawz Custom Jewelry, helping a client try on a necklace in the studio"
                  width={816}
                  height={1278}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
                <figcaption className="px-6 py-4 bg-[#0a0a0a] text-[#D4D4D8] text-xs font-bold uppercase tracking-widest text-center">
                  Custom jewelry. Personal attention.
                </figcaption>
              </figure>
              <div>
                <p className="text-[#D4D4D8] text-xs font-bold uppercase tracking-[0.25em] mb-4">Meet the Owner</p>
                <h2 id="owner-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter font-heading mb-4">Jeremy King</h2>
                <p className="text-sm text-zinc-300 uppercase tracking-widest mb-6">The person behind Jawz Custom Jewelry</p>
                <div className="w-12 h-1 bg-[#D4D4D8] mb-8"></div>
                <p className="text-base text-zinc-300 font-light leading-relaxed mb-5">
                  Jeremy is from the same community he serves. For him, Jawz Custom Jewelry is a way to bring personal service and custom pieces to the people who call this area home.
                </p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-8">
                  From your first idea to the final fit, Jeremy helps you explore the details that make a piece yours. Whether you’re looking for custom grillz, a ring, or a chain, it starts with a conversation at the Arlington studio.
                </p>
                <button
                  onClick={() => openBookingWithPreset({ serviceType: 'in-person' })}
                  className="px-8 py-4 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4D4D8] transition-colors rounded-sm inline-flex items-center justify-center gap-3"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: GOOGLE REVIEWS & SOCIAL PROOF RIBBON */}
        <section className="py-16 bg-[#050505] border-b border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white font-heading">4.9</span>
                    <div className="flex text-[#FBBC05]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                      ))}
                    </div>
                    <span className="text-xs uppercase font-bold text-zinc-300 tracking-wider">
                      (14 Google Reviews)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-light">
                    Verified client feedback for <strong className="text-white font-semibold">Jawz Jewelry</strong> • 1201 N Watson Rd, Arlington, TX 76006
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://share.google/GXB7WauH8A7ATM5wM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google Reviews</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setCurrentPage('reviews')}
                  className="px-5 py-2.5 border border-[#D4D4D8] text-[#D4D4D8] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D4D4D8] hover:text-black transition-all"
                >
                  Read Verified Reviews
                </button>
              </div>
            </div>

            {/* Testimonials Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {GOOGLE_REVIEWS_DATA.slice(0, 3).map((rev) => (
                <div key={rev.id} className="bg-[#111] border border-white/5 p-6 rounded-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase">{rev.author}</div>
                        <div className="text-[10px] text-zinc-500">{rev.location}</div>
                      </div>
                    </div>
                    <div className="flex text-[#D4D4D8]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4D4D8]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    "{rev.text}"
                  </p>

                  <div className="pt-2 text-[10px] text-[#D4D4D8] font-semibold uppercase tracking-wider">
                    {rev.service}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION: PRICING LIST */}
        <main id="pricing" className="flex-1 bg-[#050505] py-20 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg font-heading">
                New Price List
              </h2>
              <div className="w-16 h-1 bg-[#D4D4D8] mx-auto mt-6 mb-4"></div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-light">
                Transparent dental casting prices • Free cuts on standard orders
              </p>
            </div>

            {/* Diamond Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#111] border border-white/10 rounded-sm p-8 hover:border-[#D4D4D8]/50 transition-colors">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Silver Moissanite Grillz</h3>
                <div className="relative mb-6 h-36 flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                  <img src={silverMoissanite} alt="Silver Moissanite grillz" loading="lazy" decoding="async" className="h-full object-contain mix-blend-screen" />
                  <img src={jawzLogo} alt="" aria-hidden="true" className="absolute bottom-0 right-0 w-9 h-9 object-contain opacity-80" />
                </div>
                <div className="flex flex-col">
                   <PricingRow label="6 on 6" price="$1,175" />
                   <PricingRow label="8 on 8" price="$1,550" />
                   <PricingRow label="10 on 10" price="$1,900" />
                </div>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-sm p-8 hover:border-[#D4D4D8]/50 transition-colors">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Silver Lab Diamond Grillz</h3>
                <div className="relative mb-6 h-36 flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                  <img src={silverMoissanite} alt="Silver Lab Diamond grillz" loading="lazy" decoding="async" className="h-full object-contain mix-blend-screen contrast-125 brightness-110" />
                  <img src={jawzLogo} alt="" aria-hidden="true" className="absolute bottom-0 right-0 w-9 h-9 object-contain opacity-80" />
                </div>
                <div className="flex flex-col">
                   <PricingRow label="6 on 6" price="$1,900" />
                   <PricingRow label="8 on 8" price="$2,550" />
                   <PricingRow label="10 on 10" price="$3,180" />
                </div>
              </div>
            </div>

            {/* Plain Metal Tier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#111] border border-white/10 rounded-sm p-6 hover:border-[#D4D4D8]/50 transition-colors">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Silver Plain Grillz</h3>
                <div className="relative mb-6 h-28 flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                  <img src={silverPlain} alt="Silver Plain grillz" loading="lazy" decoding="async" className="h-full object-contain mix-blend-screen" />
                  <img src={jawzLogo} alt="" aria-hidden="true" className="absolute bottom-0 right-0 w-9 h-9 object-contain opacity-80" />
                </div>
                <div className="flex flex-col">
                   <PricingRow label="2 Teeth" price="$225" />
                   <PricingRow label="4 Teeth" price="$45 / Tooth" />
                   <PricingRow label="6-10 Teeth" price="$40 / Tooth" />
                </div>
              </div>

              <div className="bg-[#111] border border-[#D4D4D8]/30 rounded-sm p-6 hover:border-[#D4D4D8] transition-colors relative">
                <div className="absolute top-0 right-0 py-1 px-3 bg-[#D4D4D8] text-black text-[9px] font-bold uppercase tracking-widest">Popular</div>
                <h3 className="text-xl font-bold text-[#D4D4D8] uppercase tracking-wider mb-6 text-center border-b border-[#D4D4D8]/10 pb-4">10K Gold Plain Grillz</h3>
                <div className="relative mb-6 h-28 flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                  <img src={goldPlain} alt="10K Gold Plain grillz" loading="lazy" decoding="async" className="h-full object-contain mix-blend-screen" />
                  <img src={jawzLogo} alt="" aria-hidden="true" className="absolute bottom-0 right-0 w-9 h-9 object-contain opacity-80" />
                </div>
                <div className="flex flex-col">
                   <PricingRow label="2 Teeth" price="$275" />
                   <PricingRow label="4 Teeth" price="$420" />
                   <PricingRow label="6-10 Teeth" price="$95 / Tooth" />
                </div>
              </div>

              <div className="bg-[#111] border border-[#D4D4D8]/30 border-opacity-50 rounded-sm p-6 hover:border-[#D4D4D8] transition-colors">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">14K Gold Plain Grillz</h3>
                <div className="relative mb-6 h-28 flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                  <img src={goldPlain} alt="14K Gold Plain grillz" loading="lazy" decoding="async" className="h-full object-contain mix-blend-screen brightness-110" />
                  <img src={jawzLogo} alt="" aria-hidden="true" className="absolute bottom-0 right-0 w-9 h-9 object-contain opacity-80" />
                </div>
                <div className="flex flex-col">
                   <PricingRow label="2 Teeth" price="$350" />
                   <PricingRow label="4 Teeth" price="$520" />
                   <PricingRow label="6-10 Teeth" price="$115 / Tooth" />
                </div>
              </div>
              
            </div>

            {/* Quick Action Button below Pricing */}
            <div className="mt-12 text-center">
              <button
                onClick={() => openBookingWithPreset()}
                className="px-10 py-4 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all rounded-sm shadow-[0_0_20px_rgba(212,212,216,0.3)] inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book With Price Lock</span>
              </button>
            </div>

          </div>
        </main>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-[#050505] border-t border-white/5 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-heading text-center">
                Frequently Asked Questions
              </h2>
              <div className="w-12 h-1 bg-[#D4D4D8] mx-auto mt-6"></div>
            </div>

            <div className="space-y-6">
              {[
                { q: "How do in-person appointments work?", a: "Our Arlington, TX location (1201 N Watson Rd) is strictly by appointment only. When you book a time slot, Jeremy reserves dedicated private time to take your dental impression, consult on engagement/wedding rings or custom cuts, and ensure your fit is natural." },
                { q: "How long does the process take?", a: "Once we receive your completed mold impression or ring specs, turnaround time for standard pieces is typically 10-14 business days. Intricate custom designs with heavy diamond setting may take 3-4 weeks to perfect." },
                { q: "Do you ship mold kits nationwide?", a: "Yes! Our direct mail-order mold kits are shipped directly to customers anywhere within the United States with full instructions and video support." },
                { q: "What materials do you cast?", a: "We cast exclusively using dental-grade silver, 10k, 14k, and 18k solid gold. Our iced-out pieces feature hand-set lab diamonds, flawless moissanite, or natural conflict-free diamonds based on your preference." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-[#111] border border-white/5 p-6 hover:border-[#D4D4D8]/30 transition-colors">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2 flex items-start gap-3">
                    <span className="text-[#D4D4D8] font-black shrink-0">Q.</span>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
               <p className="text-xs uppercase tracking-widest text-zinc-500 mb-6">Ready to start?</p>
               <button 
                 onClick={() => openBookingWithPreset()}
                 className="inline-flex items-center justify-center px-10 py-4 bg-[#D4D4D8] text-black font-black uppercase tracking-widest text-xs hover:bg-[#ffffff] transition-colors rounded-sm shadow-[0_0_15px_rgba(212,212,216,0.3)]"
               >
                 Book Appointment Now
               </button>
            </div>
          </div>
        </section>

        {/* More info */}
        <section className="py-12 bg-[#0a0a0a] border-t border-white/5 relative z-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm text-zinc-400 mb-4">Want the details on how mold kits work, add-on prices, deposits and turnaround?</p>
            <button
              onClick={() => goTo('info')}
              className="px-8 py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:border-[#D4D4D8] hover:text-[#D4D4D8] transition-colors rounded-sm inline-flex items-center gap-2"
            >
              <span>How It Works, Add-Ons & Policies</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>

      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#050505] text-gray-200 border-x-8 border-[#111]">
      
      {/* Announcement Bar */}
      <div className="bg-black border-b border-[#D4D4D8]/20 text-center py-2 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-medium text-gray-400 gap-1.5 sm:gap-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-[#D4D4D8]" />
            <span>1201 N Watson Rd, Arlington, TX 76006</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[#D4D4D8] font-bold tracking-[0.2em]">Private Studio • By Appointment Only</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Phone className="w-3 h-3 text-[#D4D4D8]" />
            <a href="tel:4694875734" className="hover:text-[#D4D4D8] transition-colors">(469) 487-5734</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#D4D4D8]/20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 -ml-2 text-[#D4D4D8] hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X strokeWidth={1.5} className="w-6 h-6" /> : <Menu strokeWidth={1.5} className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group text-left">
                <img 
                  src={jawzLogo} 
                  alt="Jawz Custom Jewelry Logo" 
                  className="w-12 h-12 sm:w-13 sm:h-13 object-contain group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="font-heading font-black text-lg sm:text-xl tracking-wider text-white uppercase group-hover:text-[#D4D4D8] transition-colors leading-none">
                    Jawz
                  </div>
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-[#D4D4D8] font-semibold mt-1">
                    Jewelry & Custom Grillz
                  </div>
                </div>
              </button>
            </div>

            {/* Clean Desktop Nav Links - Single instance per page */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <button 
                onClick={() => setCurrentPage('pastwork')} 
                className={`uppercase text-[11px] tracking-[0.2em] font-semibold transition-colors ${
                  currentPage === 'pastwork' ? 'text-white border-b-2 border-[#D4D4D8] pb-1 font-bold' : 'text-zinc-300 hover:text-[#D4D4D8]'
                }`}
              >
                Past Work
              </button>

              <button 
                onClick={() => setCurrentPage('configurator')} 
                className={`uppercase text-[11px] tracking-[0.2em] font-semibold transition-colors ${
                  currentPage === 'configurator' ? 'text-white border-b-2 border-[#D4D4D8] pb-1 font-bold' : 'text-zinc-300 hover:text-[#D4D4D8]'
                }`}
              >
                Design Studio
              </button>

              <button 
                onClick={() => setCurrentPage('ailab')} 
                className={`uppercase text-[11px] tracking-[0.2em] font-semibold transition-colors flex items-center gap-1.5 ${
                  currentPage === 'ailab' ? 'text-white border-b-2 border-[#D4D4D8] pb-1 font-bold' : 'text-zinc-300 hover:text-[#D4D4D8]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4D4D8]" />
                <span>AI Preview</span>
              </button>

              <a 
                href="#pricing" 
                onClick={() => {
                  if (currentPage !== 'home') {
                    setCurrentPage('home');
                    setTimeout(() => {
                      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }} 
                className="uppercase text-[11px] tracking-[0.2em] font-semibold text-zinc-300 hover:text-[#D4D4D8] transition-colors"
              >
                Pricing
              </a>

              <button 
                onClick={() => setCurrentPage('reviews')} 
                className={`uppercase text-[11px] tracking-[0.2em] font-semibold transition-colors flex items-center gap-1.5 ${
                  currentPage === 'reviews' ? 'text-white border-b-2 border-[#D4D4D8] pb-1 font-bold' : 'text-[#D4D4D8] hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-[#D4D4D8] text-[#D4D4D8]" />
                <span>Reviews (4.9★)</span>
              </button>
            </nav>

            {/* Right Contact & Single Primary Booking Action */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a 
                href="tel:4694875734" 
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 text-[10px] uppercase tracking-wider text-zinc-300 hover:border-[#D4D4D8] hover:text-[#D4D4D8] transition-colors"
              >
                <Phone className="w-3 h-3 text-[#D4D4D8]" />
                <span>(469) 487-5734</span>
              </a>

              <button 
                onClick={() => openBookingWithPreset()} 
                className="px-4 sm:px-5 py-2.5 bg-[#D4D4D8] text-black text-[10px] sm:text-[11px] uppercase tracking-widest font-black rounded-sm flex items-center gap-2 hover:bg-[#ffffff] transition-all shadow-[0_0_15px_rgba(212,212,216,0.3)] hover:scale-[1.02]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden sticky top-[80px] bg-[#111] border-b border-[#D4D4D8]/30 z-40 flex flex-col uppercase text-[11px] tracking-[0.2em] font-medium text-[#D4D4D8]">
          <button 
            onClick={() => { setIsMobileMenuOpen(false); openBookingWithPreset(); }} 
            className="p-4 bg-[#D4D4D8] text-black text-left font-black flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment (In-Person / Mail-Order)</span>
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('pastwork'); }} 
            className="p-4 border-b border-white/5 text-left font-bold text-white flex items-center gap-2"
          >
            <span>Past Work & Best Sellers</span>
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('configurator'); }} 
            className="p-4 border-b border-white/5 text-left font-bold text-white flex items-center gap-2"
          >
            <span>Design Studio (Grillz & Jewelry)</span>
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('ailab'); }} 
            className="p-4 border-b border-white/5 text-[#D4D4D8] text-left font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#D4D4D8]" />
            <span>AI Preview (Realistic Pictures)</span>
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('reviews'); }} 
            className="p-4 border-b border-white/5 text-left font-bold text-white flex items-center gap-2"
          >
            <Star className="w-4 h-4 text-[#D4D4D8] fill-[#D4D4D8]" />
            <span>Google Reviews (4.9★ • 14 Reviews)</span>
          </button>
          <a 
            href="#pricing" 
            className="p-4 border-b border-white/5 text-left font-semibold text-zinc-300" 
            onClick={() => { 
              setIsMobileMenuOpen(false); 
              if (currentPage !== 'home') setCurrentPage('home'); 
              setTimeout(() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Price List
          </a>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('info'); }} 
            className="p-4 border-b border-white/5 text-left font-semibold text-zinc-300"
          >
            How It Works & Policies
          </button>
          <a 
            href="tel:4694875734" 
            className="p-4 text-zinc-300 text-left font-semibold flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#D4D4D8]" />
            <span>Call (469) 487-5734</span>
          </a>
        </div>
      )}

      {/* Main Content View (extra bottom space on phones for the booking bar) */}
      <div className="flex-1 w-full flex flex-col pb-16 lg:pb-0">
        {renderContent()}
      </div>

      {/* Phone booking bar */}
      {!isBookingOpen && !isMobileMenuOpen && (
        <nav aria-label="Quick actions" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-md border-t border-[#D4D4D8]/25 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] grid grid-cols-2 gap-2">
          {currentPage === 'configurator' ? (
            <a href="tel:4694875734" className="py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" aria-hidden="true" /> Call Studio
            </a>
          ) : (
            <button onClick={() => goTo('configurator')} className="py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" aria-hidden="true" /> Design Yours
            </button>
          )}
          <button
            onClick={() => openBookingWithPreset(currentPage === 'configurator' || (currentPage === 'ailab' && aiFromStudio) ? { design: studioDesign } : undefined)}
            className="py-3 bg-[#D4D4D8] text-black text-[11px] font-black uppercase tracking-widest rounded-sm flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" aria-hidden="true" /> {currentPage === 'configurator' ? 'Book This Design' : 'Book'}
          </button>
        </nav>
      )}

      {/* Booking Modal (Accessible across all screens) */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPreset={bookingPreset}
        onEditDesign={() => {
          setIsBookingOpen(false);
          goTo('configurator');
        }}
      />

      {/* Footer */}
      <footer className="py-8 px-6 sm:px-10 border-t border-white/10 bg-[#050505] z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-3">
            <img 
              src={jawzLogo} 
              alt="Jawz Custom Jewelry Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold flex flex-col gap-0.5">
              <span className="text-zinc-300">&copy; {new Date().getFullYear()} JAWZ JEWELRY • EST. 2023</span>
              <span>1201 N Watson Rd, Arlington, TX 76006, United States • (469) 487-5734</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
            <button 
              onClick={() => openBookingWithPreset()} 
              className="text-[#D4D4D8] hover:text-white transition-colors"
            >
              Book Appointment
            </button>
            <button 
              onClick={() => setCurrentPage('pastwork')} 
              className="hover:text-[#D4D4D8] transition-colors"
            >
              Past Work
            </button>
            <button 
              onClick={() => setCurrentPage('reviews')} 
              className="hover:text-[#D4D4D8] transition-colors"
            >
              Google Reviews
            </button>
            <button 
              onClick={() => setCurrentPage('info')} 
              className="hover:text-[#D4D4D8] transition-colors"
            >
              How It Works & Policies
            </button>
            <a 
              href="https://share.google/GXB7WauH8A7ATM5wM" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google Profile</span>
            </a>
            <a 
              href="https://www.instagram.com/jawz_grillzz?igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3 h-3" /> Instagram
            </a>
            <a 
              href="https://www.facebook.com/jeremy.king.216708" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Facebook className="w-3 h-3" /> Facebook
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
