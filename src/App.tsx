import React, { useState, useEffect } from 'react';
import { 
  Menu, User, Star, ArrowRight, 
  Instagram, Facebook, X, Calendar, 
  Sparkles, MapPin, Phone, Mail, MessageSquare, Clock
} from 'lucide-react';
import priceSilverMoissanite from './assets/images/pricing/silver-moissanite.jpg';
import priceSilverLabDiamond from './assets/images/pricing/silver-lab-diamond.jpg';
import priceScript from './assets/images/pricing/script.jpg';
import priceNaturalDiamond from './assets/images/pricing/natural-diamond.jpg';
import DiamondStyleGallery from './DiamondStyleGallery';
import goldPlain from './assets/images/gold_plain_1779848593610.png';
import silverPlain from './assets/images/silver_plain_1779848608539.png';
import grillzHero from './assets/images/grillz-hero.jpg';
import jawzLogo from './assets/images/jawz-custom-jewelry-logo.png';
import studioInterior from './assets/images/studio-interior.jpg';
import stripPendant from './assets/images/instagram/DZQBwGTOi3U.jpg';
import stripRing from './assets/images/instagram/DPEoxVyDS0e.jpg';
import stripCuban from './assets/images/instagram/C8Z6kHHPFTG.jpg';
import { MouthPreview } from './design/DesignPreviews';

import Configurator from './Configurator';
import PastWork from './PastWork';
import GoogleReviews from './GoogleReviews';
import { InstagramPostCard, instagramPostUrl } from './InstagramGallery';
import { RECENT_POSTS, InstagramPost } from './data/instagramPosts';
import BookingModal, { BookingPreset, STUDIO_EMAIL } from './BookingModal';
import { StudioDesign, loadSavedDesign, saveDesign, readSharedDesign, METALS, STONES, perToothRate } from './design/designModel';
import { GOOGLE_REVIEWS_DATA } from './data/pastWorkData';

const PricingRow = ({ label, price }: { label: string, price: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 transition-colors">
    <span className="text-sm uppercase tracking-widest font-bold text-gray-300">{label}</span>
    <span className="text-sm font-bold text-[#D4D4D8]">{price}</span>
  </div>
);

type Page = 'home' | 'pastwork' | 'reviews' | 'configurator' | 'pricing' | 'info';

// Every page has its own address so links, the back button and Google all work
const PAGE_PATHS: Record<Page, string> = {
  home: '/',
  pastwork: '/past-work',
  reviews: '/reviews',
  configurator: '/design-studio',
  pricing: '/pricing',
  info: '/info',
};

const PAGE_TITLES: Record<Page, string> = {
  home: 'Jawz Jewelry | Arlington, TX | Custom Grillz, Engagement Rings & Fine Jewelry',
  pastwork: 'Past Work | Jawz Custom Jewelry',
  reviews: 'Google Reviews | Jawz Custom Jewelry',
  configurator: 'Design Studio | Design Your Grillz | Jawz',
  pricing: 'Price List | Custom Grillz Prices | Jawz Custom Jewelry',
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
  // The customer's design follows them between the Design Studio and booking
  const [sharedDesign] = useState<StudioDesign | null>(() => readSharedDesign());
  const [studioDesign, setStudioDesign] = useState<StudioDesign>(() => sharedDesign || loadSavedDesign());

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

  const recentWork = RECENT_POSTS;

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
        />
      );
    }

    if (currentPage === 'pricing') {
      return (
        <div className="flex-1 w-full flex flex-col">
          <section id="pricing" className="flex-1 bg-[#050505] py-14 sm:py-20 relative z-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center mb-16">
                <button onClick={() => goTo('home')} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4D4D8] hover:text-white transition-colors mb-6 font-semibold">
                  ← Back to Home
                </button>
                <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg font-heading">
                  Price List
                </h1>
                <div className="w-16 h-1 bg-[#D4D4D8] mx-auto mt-6 mb-4"></div>
                <p className="text-xs text-zinc-400 uppercase tracking-widest font-light">
                  Transparent dental casting prices • Free cuts on standard orders
                </p>
              </div>

              {/* Diamond Tier */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#111] border border-white/10 rounded-sm p-8 hover:border-[#D4D4D8]/50 transition-colors">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Silver Moissanite Grillz</h3>
                  <div className="relative mb-6 aspect-[1170/896] overflow-hidden rounded-sm bg-black">
                    <img src={priceSilverMoissanite} alt="Silver Moissanite grillz, Honeycomb style" width={800} height={613} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-sm border border-white/15 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] text-white">Honeycomb Style</span>
                  </div>
                  <div className="flex flex-col">
                     <PricingRow label="6 on 6" price="$1,175" />
                     <PricingRow label="8 on 8" price="$1,550" />
                     <PricingRow label="10 on 10" price="$1,900" />
                  </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-sm p-8 hover:border-[#D4D4D8]/50 transition-colors">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Silver Lab Diamond Grillz</h3>
                  <div className="relative mb-6 aspect-[1170/896] overflow-hidden rounded-sm bg-black">
                    <img src={priceSilverLabDiamond} alt="Silver Lab Diamond grillz, Honeymoon style" width={800} height={613} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-sm border border-white/15 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] text-white">Honeymoon Style</span>
                  </div>
                  <div className="flex flex-col">
                     <PricingRow label="6 on 6" price="$1,900" />
                     <PricingRow label="8 on 8" price="$2,550" />
                     <PricingRow label="10 on 10" price="$3,180" />
                  </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-sm p-8 hover:border-[#D4D4D8]/50 transition-colors md:col-span-2 lg:col-span-1">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Natural Diamond Grillz</h3>
                  <div className="relative mb-6 aspect-[1170/896] overflow-hidden rounded-sm bg-black">
                    <img src={priceNaturalDiamond} alt="Yellow gold grillz set with natural oval, pear and marquise diamonds" width={800} height={613} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                     <PricingRow label="All Sizes" price="Consultation Only" />
                  </div>
                </div>
              </div>

              <DiamondStyleGallery />

              <p className="text-center text-xs text-zinc-400 -mt-2 mb-10">
                Honeycomb, Honeymoon, Mosaic, Galaxy, Emerald, Jumbo and Hybrid settings are all the same price. Only the metal and stones change it.
              </p>

              {/* Plain Metal Tier */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-[#111] border border-white/10 rounded-sm p-6 hover:border-[#D4D4D8]/50 transition-colors">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Silver Plain Grillz</h3>
                  <div className="relative mb-6 aspect-[600/327] flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                    <img src={silverPlain} alt="Silver Plain grillz" width={600} height={327} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-screen" />
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
                  <div className="relative mb-6 aspect-[600/327] flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                    <img src={goldPlain} alt="10K Gold Plain grillz" width={600} height={327} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-screen" />
                  </div>
                  <div className="flex flex-col">
                     <PricingRow label="2 Teeth" price="$275" />
                     <PricingRow label="4 Teeth" price="$420" />
                     <PricingRow label="6-10 Teeth" price="$95 / Tooth" />
                  </div>
                </div>

                <div className="bg-[#111] border border-[#D4D4D8]/30 border-opacity-50 rounded-sm p-6 hover:border-[#D4D4D8] transition-colors">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">14K Gold Plain Grillz</h3>
                  <div className="relative mb-6 aspect-[600/327] flex items-center justify-center rounded-sm bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.12)_0%,_transparent_70%)]">
                    <img src={goldPlain} alt="14K Gold Plain grillz" width={600} height={327} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-screen brightness-110" />
                  </div>
                  <div className="flex flex-col">
                     <PricingRow label="2 Teeth" price="$350" />
                     <PricingRow label="4 Teeth" price="$520" />
                     <PricingRow label="6-10 Teeth" price="$115 / Tooth" />
                  </div>
                </div>
                
              </div>

              {/* Script Style */}
              <div className="mt-6 max-w-xl mx-auto">
                <div className="bg-[#111] border border-white/10 rounded-sm p-6 hover:border-[#D4D4D8]/50 transition-colors">
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-6 text-center border-b border-white/10 pb-4">Script Grillz</h3>
                  <div className="relative mb-6 aspect-[1170/896] overflow-hidden rounded-sm bg-black">
                    <img src={priceScript} alt="Silver Script grillz on top with Black Chrome grillz on the bottom" width={800} height={613} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-sm border border-white/15 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] text-white">Script Style</span>
                  </div>
                  <div className="flex flex-col">
                     <PricingRow label="8 on 8" price="$690" />
                  </div>
                </div>
              </div>

              {/* Every metal / karat with every stone */}
              <div className="mt-12 max-w-4xl mx-auto bg-[#111] border border-white/10 rounded-sm p-5 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-heading text-center">Every Metal. Every Stone.</h3>
                <p className="text-sm text-zinc-400 mt-2 font-light text-center">
                  Mix any karat with any stone. 10K, 14K and 18K come in yellow, white or rose gold; 22K and 24K come in yellow.
                </p>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-xs sm:text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-zinc-500">
                        <th scope="col" className="text-left font-semibold py-2 pr-3">Per tooth</th>
                        <th scope="col" className="font-semibold py-2 px-2">No Stones</th>
                        {STONES.map(st => <th key={st.id} scope="col" className="font-semibold py-2 px-2">{st.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {METALS.map(m => (
                        <tr key={m.id} className="border-t border-white/5">
                          <th scope="row" className="text-left font-bold uppercase tracking-wider text-white py-2.5 pr-3 whitespace-nowrap">{m.name}</th>
                          {[{ stones: false, stone: STONES[0].id }, ...STONES.map(st => ({ stones: true, stone: st.id }))].map(({ stones, stone }) => {
                            const rate = perToothRate({ metal: m.id, color: 'yellow', stones, stone });
                            return (
                              <td key={stones ? stone : 'none'} className={`text-center py-2.5 px-2 ${rate === null ? 'text-zinc-500 text-[10px] uppercase tracking-wider' : 'text-[#D4D4D8] font-bold'}`}>
                                {rate === null ? 'Quote' : `$${rate}`}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-zinc-500 mt-4 text-center">
                  "Quote" combinations are priced by Jeremy at your consultation. Pick any of them in the Design Studio or the booking form.
                </p>
              </div>

              {/* Not on the price list */}
              <div className="mt-12 max-w-3xl mx-auto bg-[#111] border border-[#D4D4D8]/30 rounded-sm p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider font-heading">Don't See Your Price?</h3>
                <p className="text-sm text-zinc-400 mt-3 font-light leading-relaxed">
                  18K, 22K or 24K gold, gold with moissanite or diamonds, natural diamonds or a one-of-a-kind piece? Book a consultation, text or email Jeremy and get a quote.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <button
                    onClick={() => openBookingWithPreset({ notes: "Pricing inquiry (not on the price list): " })}
                    className="px-6 py-3.5 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all rounded-sm inline-flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span>Book a Consultation</span>
                  </button>
                  <a
                    href={`sms:+14697511734?body=${encodeURIComponent("Hi Jeremy! I didn't see pricing on your site for something I'm looking for: ")}`}
                    className="px-6 py-3.5 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:border-[#D4D4D8] transition-colors rounded-sm inline-flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                    <span>Text to Inquire</span>
                  </a>
                  <a
                    href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent('Pricing inquiry')}`}
                    className="px-6 py-3.5 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:border-[#D4D4D8] transition-colors rounded-sm inline-flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>

            </div>
          </section>
        </div>
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
                 <p className="text-xs uppercase tracking-widest font-bold text-white mb-4 flex items-center gap-2">
                   <Clock className="w-3.5 h-3.5 text-[#D4D4D8]" />
                   <span>Hours: 10:00 AM – 7:30 PM</span>
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
                  For 18K, 22K & 24K Grillz, Gold with Moissanite or Diamonds, Natural Diamonds, and other custom inquiries<br/><span className="text-white font-bold inline-block mt-2">Book an appointment or DM us with your project details</span>
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
        <section className="relative overflow-hidden bg-black md:h-[max(820px,calc(100vh-5rem))]">
          {/* The whole photo stays visible: full width on phones, full height on larger screens */}
          <div className="relative md:absolute md:top-0 md:right-0 md:h-full z-0">
            <img 
              src={grillzHero} 
              alt="Client wearing iced-out custom diamond grillz and a Jawz Cuban link chain with pendant"
              width={704}
              height={1524}
              fetchPriority="high"
              className="block w-full h-auto md:h-full md:w-auto"
            />
            <div className="md:hidden absolute inset-0 bg-[linear-gradient(to_bottom,transparent_28%,rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.6)_68%,transparent_82%)]"></div>
            <div className="hidden md:block absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black to-transparent"></div>
          </div>
          
          <div className="absolute inset-x-0 top-[34%] md:top-0 md:h-full z-20 max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:justify-center">
            <p className="text-zinc-300 uppercase tracking-[0.35em] text-xs sm:text-sm font-medium leading-relaxed mb-5">
              Custom Grillz<br />& Fine Jewelry
            </p>

            <h1 className="font-heading font-black uppercase text-white text-[13vw] md:text-7xl lg:text-9xl leading-[0.88] tracking-tight drop-shadow-2xl">
              Wear<br />Your <span className="text-zinc-300">Shine</span>
            </h1>
            
            <p className="text-zinc-300 uppercase tracking-[0.3em] text-xs sm:text-sm font-medium leading-relaxed mt-6 mb-10">
              Private Studio • Arlington, TX<br />By Appointment Only
            </p>

            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-md lg:max-w-2xl">
              <button 
                onClick={() => openBookingWithPreset()} 
                className="flex-1 px-8 py-5 bg-[#E4E4E7] text-black text-sm font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-3 rounded-md"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <span>Book an Appointment</span>
              </button>

              <button 
                onClick={() => setCurrentPage('pastwork')} 
                className="flex-1 px-8 py-5 border border-white/40 text-white text-sm font-semibold uppercase tracking-[0.2em] bg-black/40 hover:border-white hover:bg-white/10 transition-colors flex items-center justify-center gap-3 rounded-md"
              >
                <span>View Past Work</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION: RECENT WORK */}
        <section id="recent-work" className="py-20 bg-[#080808] border-t border-b border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#D4D4D8] text-xs uppercase font-bold tracking-[0.3em] mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Fresh From the Studio</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
                  Recent Work
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-2 font-light">
                  The latest custom pieces we've finished for clients. Tap a piece to see it on Instagram, or book a session for a style like it.
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

            {/* Recent Work Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentWork.map(post => (
                <InstagramPostCard key={post.id} post={post} onBook={handleBookInstagramPost} />
              ))}
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
                Pick your teeth, metal, color and stones, see a live price, and send your design straight to Jeremy.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={() => goTo('configurator')}
                  className="px-8 py-4 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all rounded-sm shadow-[0_0_20px_rgba(212,212,216,0.3)] inline-flex items-center gap-2"
                >
                  <span>Open the Design Studio</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goTo('configurator')}
              aria-label="Open the Design Studio"
              className="block bg-gradient-to-b from-zinc-900 to-black border border-white/10 hover:border-[#D4D4D8]/60 transition-colors rounded-lg p-4 sm:p-6"
            >
              <MouthPreview design={studioDesign.grillz} />
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

        {/* The Studio */}
        <section id="the-studio" aria-labelledby="studio-heading" className="py-20 sm:py-24 bg-[#111] border-t border-white/5 relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
              <figure className="w-full max-w-md mx-auto border border-[#D4D4D8]/30 rounded-sm overflow-hidden">
                <img
                  src={studioInterior}
                  alt="Inside the Jawz Custom Jewelry studio in Arlington, TX: hexagon ceiling lights, black leather seating, a fitting chair, glass display cases and the Jawz diamond logo rug on a marble floor"
                  width={720}
                  height={1279}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
                <figcaption className="px-6 py-4 bg-[#0a0a0a] text-[#D4D4D8] text-xs font-bold uppercase tracking-widest text-center">
                  Private studio. By appointment only.
                </figcaption>
              </figure>
              <div>
                <p className="text-[#D4D4D8] text-xs font-bold uppercase tracking-[0.25em] mb-4">The Studio</p>
                <h2 id="studio-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter font-heading mb-4">Jawz Custom Jewelry</h2>
                <p className="text-sm text-zinc-300 uppercase tracking-widest mb-6">Arlington, TX &bull; Serving all of DFW</p>
                <div className="w-12 h-1 bg-[#D4D4D8] mb-8"></div>
                <p className="text-base text-zinc-300 font-light leading-relaxed mb-5">
                  Our Arlington studio is private and by appointment only, set aside for one client at a time. No crowded counters and no rush, just a comfortable room to see the work up close and talk through exactly what you want, from your dental mold and fitting to your final pickup.
                </p>
                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-5">
                  We serve the Dallas–Fort Worth community: first-timers getting their first set of grillz, couples shopping for engagement and wedding rings, and collectors adding a chain, pendant or iced-out piece to their rotation. Every piece is custom made and fitted to you.
                </p>
                <p className="text-base text-white font-medium leading-relaxed border-l-2 border-[#D4D4D8] pl-4">
                  We are committed to providing quality custom jewelry that exceeds our clients’ expectations, with every piece held to the same standard from first sketch to final polish.
                </p>
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
                    Verified client feedback for <strong className="text-white font-semibold">Jawz Jewelry</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentPage('reviews')}
                  className="px-5 py-2.5 border border-[#D4D4D8] text-[#D4D4D8] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D4D4D8] hover:text-black transition-all"
                >
                  Read All Reviews
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

        {/* SECTION: PRICING PREVIEW */}
        <section aria-labelledby="pricing-preview-heading" className="py-20 bg-[#050505] relative z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="pricing-preview-heading" className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg font-heading">
                Pricing
              </h2>
              <div className="w-16 h-1 bg-[#D4D4D8] mx-auto mt-6 mb-4"></div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-light">
                Transparent dental casting prices • Free cuts on standard orders
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Plain Grillz', detail: 'Silver, 10K & 14K Gold', price: 'From $225' },
                { name: 'Diamond Grillz', detail: 'Moissanite, Lab & Natural Diamond', price: 'From $1,175' },
                { name: 'Script Grillz', detail: '8 on 8', price: '$690' },
              ].map(tier => (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => goTo('pricing')}
                  className="bg-[#111] border border-white/10 rounded-sm p-6 text-center hover:border-[#D4D4D8]/50 transition-colors"
                >
                  <span className="block text-lg font-bold text-white uppercase tracking-wider">{tier.name}</span>
                  <span className="block text-[11px] text-zinc-400 uppercase tracking-widest mt-1">{tier.detail}</span>
                  <span className="block text-2xl font-black text-[#D4D4D8] mt-4">{tier.price}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => goTo('pricing')}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#D4D4D8] text-black font-black uppercase tracking-widest text-xs hover:bg-[#ffffff] transition-colors rounded-sm shadow-[0_0_15px_rgba(212,212,216,0.3)]"
              >
                <span>View Full Price List</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

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
                { q: "How do in-person appointments work?", a: "Our Arlington, TX studio is strictly by appointment only. When you book a time slot, Jeremy reserves dedicated private time to take your dental impression, consult on engagement/wedding rings or custom cuts, and ensure your fit is natural." },
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
               <p className="text-sm text-zinc-400 mb-6">More on mold kits, add-on prices, deposits and turnaround.</p>
               <div className="flex flex-col sm:flex-row gap-3 justify-center">
                 <button 
                   onClick={() => openBookingWithPreset()}
                   className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#D4D4D8] text-black font-black uppercase tracking-widest text-xs hover:bg-[#ffffff] transition-colors rounded-sm shadow-[0_0_15px_rgba(212,212,216,0.3)]"
                 >
                   <Calendar className="w-4 h-4" aria-hidden="true" />
                   <span>Book Appointment</span>
                 </button>
                 <button
                   onClick={() => goTo('info')}
                   className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:border-[#D4D4D8] hover:text-[#D4D4D8] transition-colors rounded-sm"
                 >
                   <span>How It Works & Policies</span>
                   <ArrowRight className="w-4 h-4" aria-hidden="true" />
                 </button>
               </div>
            </div>
          </div>
        </section>

      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#050505] text-gray-200">
      
      {/* Announcement Bar */}
      <div className="hidden sm:block bg-black border-b border-[#D4D4D8]/20 text-center py-2 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-medium text-gray-400 gap-1.5 sm:gap-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-[#D4D4D8]" />
            <span>1201 N Watson Rd, Arlington, TX 76006</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Mail className="w-3 h-3 text-[#D4D4D8]" />
            <a href={`mailto:${STUDIO_EMAIL}`} className="normal-case tracking-wider hover:text-[#D4D4D8] transition-colors">{STUDIO_EMAIL}</a>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Phone className="w-3 h-3 text-[#D4D4D8]" />
            <a href="tel:4697511734" className="hover:text-[#D4D4D8] transition-colors">(469) 751-1734</a>
            <span className="text-amber-300 normal-case tracking-normal">(Text before calling to avoid spam filter!)</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-black/95 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-20">
            
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
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex-shrink-0 flex items-center">
              <button onClick={() => setCurrentPage('home')} className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-3 group text-center sm:text-left">
                <img 
                  src={jawzLogo} 
                  alt="Jawz Custom Jewelry Logo" 
                  className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain group-hover:scale-105 transition-transform"
                />
                <div>
                  <div className="font-heading font-black text-xl sm:text-2xl lg:text-xl tracking-wider text-white uppercase group-hover:text-[#D4D4D8] transition-colors leading-none">
                    Jawz
                  </div>
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-zinc-300 font-semibold mt-1 whitespace-nowrap">
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
                onClick={() => setCurrentPage('pricing')} 
                className={`uppercase text-[11px] tracking-[0.2em] font-semibold transition-colors ${
                  currentPage === 'pricing' ? 'text-white border-b-2 border-[#D4D4D8] pb-1 font-bold' : 'text-zinc-300 hover:text-[#D4D4D8]'
                }`}
              >
                Pricing
              </button>

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
              <button 
                onClick={() => openBookingWithPreset()} 
                className={`px-4 sm:px-5 py-2.5 bg-[#E4E4E7] text-black text-[11px] uppercase tracking-[0.2em] font-bold rounded-md items-center gap-2 hover:bg-[#ffffff] transition-colors hidden lg:pointer-fine:flex`}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
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
            <span>Design Studio (Grillz)</span>
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('reviews'); }} 
            className="p-4 border-b border-white/5 text-left font-bold text-white flex items-center gap-2"
          >
            <Star className="w-4 h-4 text-[#D4D4D8] fill-[#D4D4D8]" />
            <span>Google Reviews (4.9★ • 14 Reviews)</span>
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('pricing'); }} 
            className="p-4 border-b border-white/5 text-left font-semibold text-zinc-300"
          >
            Price List
          </button>
          <button 
            onClick={() => { setIsMobileMenuOpen(false); setCurrentPage('info'); }} 
            className="p-4 border-b border-white/5 text-left font-semibold text-zinc-300"
          >
            How It Works & Policies
          </button>
          <a 
            href="tel:4697511734" 
            className="p-4 text-zinc-300 text-left font-semibold flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#D4D4D8]" />
            <span>Call (469) 751-1734</span>
          </a>
          <p className="px-4 pb-4 -mt-2 text-xs text-amber-300">Text before calling to avoid spam filter!</p>
          <a 
            href={`mailto:${STUDIO_EMAIL}`} 
            className="p-4 border-t border-white/5 text-zinc-300 text-left font-semibold flex items-center gap-2 normal-case tracking-wider"
          >
            <Mail className="w-4 h-4 text-[#D4D4D8]" />
            <span>{STUDIO_EMAIL}</span>
          </a>
        </div>
      )}

      {/* Main Content View (extra bottom space on phones and tablets for the booking bar) */}
      <div className="flex-1 w-full flex flex-col pb-16 lg:pointer-fine:pb-0">
        {renderContent()}
      </div>

      {/* Phone & tablet booking bar (the header has no Book button on touch screens) */}
      {!isBookingOpen && !isMobileMenuOpen && (
        <nav aria-label="Quick actions" className="lg:pointer-fine:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-md border-t border-[#D4D4D8]/25 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] grid grid-cols-2 gap-2">
          {currentPage === 'configurator' ? (
            <a href="tel:4697511734" className="py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" aria-hidden="true" /> Call Studio
            </a>
          ) : (
            <button onClick={() => goTo('configurator')} className="py-3 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" aria-hidden="true" /> Design Yours
            </button>
          )}
          <button
            onClick={() => openBookingWithPreset(currentPage === 'configurator' ? { design: studioDesign } : undefined)}
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
              <span>1201 N Watson Rd, Arlington, TX 76006, United States • (469) 751-1734 • Text before calling to avoid spam filter!</span>
              <a href={`mailto:${STUDIO_EMAIL}`} className="normal-case tracking-wider hover:text-[#D4D4D8] transition-colors">{STUDIO_EMAIL}</a>
              <span>Hours: 10:00 AM – 7:30 PM • By Appointment</span>
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
              onClick={() => setCurrentPage('pricing')} 
              className="hover:text-[#D4D4D8] transition-colors"
            >
              Price List
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
