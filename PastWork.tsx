import React, { useState } from 'react';
import { 
  Sparkles, Star, ArrowRight, ShieldCheck, MapPin, Clock, 
  Check, Filter, ZoomIn, Calendar, Heart, Award, ChevronRight, X
} from 'lucide-react';
import { PAST_WORKS, PastWorkItem } from './pastWorkData';

interface PastWorkProps {
  onBookItem: (item: PastWorkItem) => void;
  onOpenBooking: () => void;
  onBackToHome?: () => void;
}

export default function PastWork({ onBookItem, onOpenBooking, onBackToHome }: PastWorkProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<PastWorkItem | null>(null);

  const bestSellers = PAST_WORKS.filter(item => item.isBestSeller).sort((a, b) => (a.bestSellerRank || 99) - (b.bestSellerRank || 99));

  const filteredItems = selectedCategory === 'all' 
    ? PAST_WORKS 
    : selectedCategory === 'best-sellers'
      ? bestSellers
      : PAST_WORKS.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/5 bg-gradient-to-b from-black via-zinc-950 to-[#050505]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors mb-6 font-semibold"
            >
              <span>← Back to Overview</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-widest font-bold mb-4 rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>Master Dental Casting & Custom Jeweler • Est. 2023</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-heading">
            Past Work & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#fff4d1]">Portfolio</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Every piece is hand-carved, cast in dental solid gold or fine silver, and custom-fit for tight suction. Browse our past client commissions below or book your custom session.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={onOpenBooking}
              className="px-8 py-4 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffe175] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2 rounded-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book An Appointment</span>
            </button>
            <a
              href="#best-sellers"
              className="px-8 py-4 border border-white/20 hover:border-[#D4AF37] text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm"
            >
              View Best Sellers
            </a>
          </div>
        </div>
      </section>

      {/* SECTION: BEST SELLERS AMONGST PAST WORK */}
      <section id="best-sellers" className="py-20 border-b border-white/5 bg-[#080808] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase font-bold tracking-[0.3em] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Client Favorites</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
                Best Sellers Amongst Past Work
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-2 font-light">
                Our most requested designs since 2023. You can click any best seller to load its exact teeth setup and cuts directly into the booking form.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shrink-0 rounded-sm"
            >
              Custom Appointment
            </button>
          </div>

          {/* Best Sellers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((item) => (
              <div 
                key={item.id}
                className="bg-[#111] border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-[#D4AF37]/60 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]"
              >
                {/* Image Container with Badges */}
                <div className="relative h-64 bg-black overflow-hidden flex items-center justify-center p-6 border-b border-white/10">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Best Seller Rank Badge */}
                  <div className="absolute top-3 left-3 bg-[#D4AF37] text-black font-black uppercase text-[10px] tracking-wider px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    <span>{item.badge || `#${item.bestSellerRank} Best Seller`}</span>
                  </div>

                  {/* Location Tag */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-white/10 text-zinc-400 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{item.clientLocation}</span>
                  </div>

                  {/* Quick Zoom Trigger */}
                  <button 
                    onClick={() => setActiveModalItem(item)}
                    className="absolute bottom-3 right-3 p-2 bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 transition-all rounded-sm opacity-0 group-hover:opacity-100"
                    title="View Details"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">
                    {item.metal}
                  </div>

                  <h3 className="text-lg font-bold text-white uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors leading-snug mb-2 font-heading">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Quick Specs Pills */}
                  <div className="space-y-1.5 mb-6 text-[11px] bg-black/50 p-3 rounded border border-white/5">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase">Teeth Count:</span>
                      <span className="text-zinc-200 font-semibold">{item.teethCount > 0 ? `${item.teethCount} Teeth` : 'Bespoke Item'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase">Cut & Style:</span>
                      <span className="text-zinc-200 font-semibold truncate max-w-[180px]">{item.cuts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase">Estimate:</span>
                      <span className="text-[#D4AF37] font-bold">{item.priceEstimate}</span>
                    </div>
                  </div>

                  {/* Client Review Quote if exists */}
                  {item.clientReview && (
                    <div className="mb-6 p-3 bg-zinc-900/60 border-l-2 border-[#D4AF37] text-xs text-zinc-300 italic font-light">
                      "{item.clientReview.text}"
                      <span className="block mt-1 font-bold text-[10px] text-zinc-400 not-italic uppercase tracking-wider">
                        — {item.clientReview.author}
                      </span>
                    </div>
                  )}

                  {/* Book This Style CTA (Directly pre-fills booking!) */}
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3">
                    <button
                      onClick={() => onBookItem(item)}
                      className="flex-1 py-3 bg-[#D4AF37] text-black font-black uppercase text-xs tracking-widest hover:bg-[#ffe175] transition-all flex items-center justify-center gap-2 rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book This Style</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-3 py-3 border border-white/20 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors rounded-sm"
                      title="Inspect Specifications"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION: FULL PORTFOLIO GALLERY WITH FILTERING */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
              Complete Past Work Gallery
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4 mb-4"></div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-light">
              Explore custom gold grillz, VVS moissanite sets, open-face diamond cuts, and bespoke jewelry created for our clients across Arlington, Dallas-Fort Worth, and nationwide.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: 'all', label: 'All Portfolio' },
              { id: 'best-sellers', label: 'Best Sellers' },
              { id: 'gold', label: 'Solid Gold Grillz' },
              { id: 'moissanite', label: 'Moissanite & Diamonds' },
              { id: 'cuts', label: 'Custom Cuts & Fangs' },
              { id: 'jewelry', label: 'Custom Jewelry & Watches' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm border transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-[#111] text-zinc-400 border-white/10 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#111] border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                <div className="relative h-60 bg-black overflow-hidden flex items-center justify-center p-6 border-b border-white/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.isBestSeller && (
                    <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      Best Seller
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/80 text-[9px] uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded-sm border border-white/10">
                    {item.clientLocation}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1">
                    {item.metal}
                  </div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2 font-heading">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Estimate:</span>
                      <span className="text-xs font-bold text-[#D4AF37]">{item.priceEstimate}</span>
                    </div>

                    <button
                      onClick={() => onBookItem(item)}
                      className="px-4 py-2 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ffe175] transition-colors rounded-sm flex items-center gap-1.5"
                    >
                      <span>Book Style</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Vision CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-zinc-950 via-[#111] to-zinc-950 border border-[#D4AF37]/30 p-8 sm:p-12 text-center rounded-sm">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              Have A Custom Design Not Shown Here?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mt-2 font-light leading-relaxed">
              We specialize in 1-of-1 bespoke creations: custom logos, vampire fangs, continuous bridge cuts, and custom stone settings. Book an appointment or send notes with your vision.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 bg-[#D4AF37] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffe175] transition-all rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Book Custom Design Session
              </button>
              <a
                href="https://www.instagram.com/jawz_grillzz?igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 border border-zinc-700 hover:border-white text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm"
              >
                DM Inspiration on Instagram
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* MODAL / LIGHTBOX FOR ITEM DETAILS */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#111] border border-[#D4AF37]/40 rounded-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/60">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Past Work Specification Sheet
              </span>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="h-64 bg-black rounded flex items-center justify-center p-4 border border-white/5">
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white font-heading">
                  {activeModalItem.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 font-light leading-relaxed">
                  {activeModalItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-black/60 p-4 rounded border border-white/5">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Metal Spec:</span>
                  <span className="text-white font-bold">{activeModalItem.metal}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Estimated Price:</span>
                  <span className="text-[#D4AF37] font-bold">{activeModalItem.priceEstimate}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Cuts / Finish:</span>
                  <span className="text-white font-bold">{activeModalItem.cuts}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider block text-[10px]">Turnaround Time:</span>
                  <span className="text-white font-bold">{activeModalItem.turnaround}</span>
                </div>
              </div>

              {activeModalItem.clientReview && (
                <div className="p-4 bg-zinc-900 border-l-2 border-[#D4AF37] text-xs text-zinc-300 italic">
                  "{activeModalItem.clientReview.text}"
                  <span className="block mt-1 font-bold text-[10px] text-[#D4AF37] not-italic">
                    — {activeModalItem.clientReview.author}
                  </span>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => {
                    const item = activeModalItem;
                    setActiveModalItem(null);
                    onBookItem(item);
                  }}
                  className="flex-1 py-3.5 bg-[#D4AF37] text-black font-black uppercase text-xs tracking-widest hover:bg-[#ffe175] transition-all rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Exact Setup</span>
                </button>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-6 py-3.5 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
