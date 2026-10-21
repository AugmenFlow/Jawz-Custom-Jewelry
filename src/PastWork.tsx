import React, { useState } from 'react';
import { 
  Sparkles, Star, ArrowRight, ShieldCheck, MapPin, Clock, 
  Check, Filter, ZoomIn, Calendar, Heart, Award, ChevronRight, X
} from 'lucide-react';
import { InstagramPostCard } from './InstagramGallery';
import { BEST_SELLER_POSTS, GALLERY_POSTS, INSTAGRAM_CATEGORIES, InstagramCategory, InstagramPost } from './data/instagramPosts';

interface PastWorkProps {
  onBookPost: (post: InstagramPost) => void;
  onOpenBooking: () => void;
  onBackToHome?: () => void;
}

export default function PastWork({ onBookPost, onOpenBooking, onBackToHome }: PastWorkProps) {
  const [selectedCategory, setSelectedCategory] = useState<InstagramCategory | 'all'>('all');

  const bestSellers = BEST_SELLER_POSTS;
  const galleryPosts = selectedCategory === 'all'
    ? GALLERY_POSTS
    : GALLERY_POSTS.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/5 bg-gradient-to-b from-black via-zinc-950 to-[#050505]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,212,216,0.1)_0%,_transparent_70%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4D4D8] hover:text-white transition-colors mb-6 font-semibold"
            >
              <span>← Back to Overview</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4D4D8]/10 border border-[#D4D4D8]/30 text-[#D4D4D8] text-xs uppercase tracking-widest font-bold mb-4 rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>Master Dental Casting & Custom Jeweler • Est. 2023</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-heading">
            Past Work & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4D4D8] to-[#ffffff]">Portfolio</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-4 font-light leading-relaxed">
            Every piece is hand-carved, cast in dental solid gold or fine silver, and custom-fit for tight suction. Browse our past client commissions below or book your custom session.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={onOpenBooking}
              className="px-8 py-4 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all shadow-[0_0_20px_rgba(212,212,216,0.3)] flex items-center gap-2 rounded-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book An Appointment</span>
            </button>
            <a
              href="#best-sellers"
              className="px-8 py-4 border border-white/20 hover:border-[#D4D4D8] text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm"
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
              <div className="flex items-center gap-2 text-[#D4D4D8] text-xs uppercase font-bold tracking-[0.3em] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Client Favorites</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
                Best Sellers Amongst Past Work
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-2 font-light">
                Our most requested designs since 2023. Tap a piece to see it on Instagram, or book a session for a style like it.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-3 border border-[#D4D4D8] text-[#D4D4D8] text-xs font-bold uppercase tracking-widest hover:bg-[#D4D4D8] hover:text-black transition-all shrink-0 rounded-sm"
            >
              Custom Appointment
            </button>
          </div>

          {/* Best Sellers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((post, idx) => (
              <InstagramPostCard key={post.id} post={post} rank={idx + 1} onBook={onBookPost} />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION: FULL PORTFOLIO GALLERY */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
              Complete Past Work Gallery
            </h2>
            <div className="w-16 h-1 bg-[#D4D4D8] mx-auto mt-4 mb-4"></div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-light">
              Explore custom grillz, VVS moissanite sets, diamond rings, chains, and bespoke jewelry created for our clients across Arlington, Dallas-Fort Worth, and nationwide. Tap any piece to see the full post on Instagram.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[{ id: 'all' as const, label: 'All Work' }, ...INSTAGRAM_CATEGORIES].map((tab) => {
              const count = tab.id === 'all' ? GALLERY_POSTS.length : GALLERY_POSTS.filter(post => post.category === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  aria-pressed={selectedCategory === tab.id}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm border transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-[#D4D4D8] text-black border-[#D4D4D8] shadow-[0_0_12px_rgba(212,212,216,0.3)]'
                      : 'bg-[#111] text-zinc-400 border-white/10 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {tab.label} <span className="opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryPosts.map((post) => (
              <InstagramPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Custom Vision CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-zinc-950 via-[#111] to-zinc-950 border border-[#D4D4D8]/30 p-8 sm:p-12 text-center rounded-sm">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              Have A Custom Design Not Shown Here?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto mt-2 font-light leading-relaxed">
              We specialize in 1-of-1 bespoke creations: custom logos, vampire fangs, continuous bridge cuts, and custom stone settings. Book an appointment or send notes with your vision.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all rounded-sm shadow-[0_0_15px_rgba(212,212,216,0.3)]"
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

    </div>
  );
}
