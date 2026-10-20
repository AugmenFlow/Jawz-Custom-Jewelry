import React, { useState, useMemo } from 'react';
import { 
  Star, CheckCircle2, ExternalLink, MapPin, MessageSquarePlus, 
  ThumbsUp, ShieldCheck, Filter, Award, ChevronDown, X,
  Camera, Heart, Flame, Sparkles, Phone, Calendar
} from 'lucide-react';
import { GOOGLE_REVIEWS_DATA, GoogleReview } from './data/pastWorkData';

interface GoogleReviewsProps {
  onOpenBooking?: () => void;
  onBackToHome?: () => void;
}

export default function GoogleReviews({ onOpenBooking, onBackToHome }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>(() => {
    try {
      const saved = localStorage.getItem('jawz_customer_reviews');
      if (saved) {
        return [...JSON.parse(saved), ...GOOGLE_REVIEWS_DATA];
      }
    } catch (e) {
      console.error(e);
    }
    return GOOGLE_REVIEWS_DATA;
  });

  const [activeTag, setActiveTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'highest' | 'lowest'>('relevant');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, number>>({});
  
  // Submit new review form state
  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('Arlington, TX');
  const [service, setService] = useState('Custom Engagement Ring / Grillz');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Official Google Business & Reviews URL provided by client
  const googleShareUrl = 'https://share.google/GXB7WauH8A7ATM5wM';
  const businessAddress = '1201 N Watson Rd, Arlington, TX 76006, United States';

  // Toggle helpful like
  const handleToggleLike = (id: string) => {
    setHelpfulLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    const newRev: GoogleReview = {
      id: `rev-${Date.now()}`,
      author: authorName,
      location,
      reviewerMeta: '1 review',
      date: 'Just now',
      rating,
      service,
      verified: true,
      tags: ['quality products'],
      text: reviewText
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const existing = JSON.parse(localStorage.getItem('jawz_customer_reviews') || '[]');
      existing.unshift(newRev);
      localStorage.setItem('jawz_customer_reviews', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitModalOpen(false);
      setAuthorName('');
      setReviewText('');
    }, 2000);
  };

  // Filter chips defined directly from Google Business Profile
  const filterChips = [
    { id: 'all', label: 'All', count: reviews.length },
    { id: 'wedding ring', label: 'wedding ring', count: 3 },
    { id: 'diamond', label: 'diamond', count: 2 },
    { id: 'quality products', label: 'quality products', count: 2 },
    { id: 'engagement', label: 'engagement', count: 2 },
    { id: 'grillz', label: 'custom grillz', count: 4 },
  ];

  // Filtering and sorting
  const processedReviews = useMemo(() => {
    let list = [...reviews];

    // Filter by tag
    if (activeTag !== 'all') {
      list = list.filter(r => {
        const textLower = (r.text + ' ' + (r.service || '') + ' ' + (r.tags || []).join(' ')).toLowerCase();
        if (activeTag === 'wedding ring') {
          return textLower.includes('wedding ring') || textLower.includes('ring');
        }
        if (activeTag === 'diamond') {
          return textLower.includes('diamond');
        }
        if (activeTag === 'quality products') {
          return textLower.includes('quality') || textLower.includes('service') || textLower.includes('top notch');
        }
        if (activeTag === 'engagement') {
          return textLower.includes('engagement') || textLower.includes('fiancé') || textLower.includes('ring');
        }
        if (activeTag === 'grillz') {
          return textLower.includes('grill') || textLower.includes('fang') || textLower.includes('cap');
        }
        return true;
      });
    }

    // Sort
    if (sortBy === 'newest') {
      // Prioritize "6 months ago", "a year ago", then "2 years ago"
      list.sort((a, b) => {
        const weight = (dateStr: string) => {
          if (dateStr.includes('now') || dateStr.includes('week')) return 1;
          if (dateStr.includes('month')) return 2;
          if (dateStr.includes('year') && !dateStr.includes('2')) return 3;
          return 4;
        };
        return weight(a.date) - weight(b.date);
      });
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    }

    return list;
  }, [reviews, activeTag, sortBy]);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      
      {/* Top Banner / Google Business Profile Header */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/5 bg-gradient-to-b from-black via-zinc-950 to-[#050505]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4D4D8] hover:text-white transition-colors mb-6 font-semibold"
            >
              <span>← Back to Overview</span>
            </button>
          )}

          {/* Business Profile Header Card */}
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 shadow">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-zinc-400">
                    Google Business Profile
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verified Listing
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-heading">
                  Jawz Jewelry
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-1">
                  <MapPin className="w-4 h-4 text-[#D4D4D8] shrink-0" />
                  <span className="text-zinc-200 font-medium">{businessAddress}</span>
                </div>
              </div>

              {/* Overall Google Score */}
              <div className="bg-[#181818] border border-white/10 rounded-lg p-5 flex items-center gap-5 shrink-0">
                <div className="text-center">
                  <div className="text-5xl font-black text-white font-heading tracking-tight leading-none">
                    4.9
                  </div>
                  <div className="flex items-center gap-0.5 text-[#FBBC05] justify-center mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium mt-1">
                    14 reviews on Google
                  </div>
                </div>

                <div className="h-12 w-px bg-white/10 hidden sm:block"></div>

                <div className="flex flex-col gap-2">
                  <a
                    href={googleShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>View on Google</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={googleShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-wider rounded-sm hover:bg-[#ffffff] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Write a Review</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Link Attribution */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Active DFW Custom Jewelry & Grillz Studio • Strictly By Appointment Only</span>
              </span>
              <a
                href={googleShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4D4D8] hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>share.google/GXB7WauH8A7ATM5wM</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Reviews Content Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Keyword Filters & Sort bar exactly mirroring Google listing */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs uppercase font-bold text-zinc-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Topics:
              </span>
              {filterChips.map((chip) => {
                const isActive = activeTag === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setActiveTag(chip.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-black border-white font-bold shadow'
                        : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:border-zinc-500'
                    }`}
                  >
                    <span className="capitalize">{chip.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/15 text-black' : 'bg-white/10 text-zinc-400'}`}>
                      {chip.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-[#141414] border border-white/15 text-xs text-white px-3 py-1.5 pr-8 rounded-md font-medium focus:outline-none focus:border-[#D4D4D8]"
                >
                  <option value="relevant">Most relevant</option>
                  <option value="newest">Newest</option>
                  <option value="highest">Highest rating</option>
                  <option value="lowest">Lowest rating</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results count banner */}
          <div className="flex justify-between items-center text-xs text-zinc-500 mb-6 font-mono">
            <span>Showing {processedReviews.length} of {reviews.length} authentic Google reviews</span>
            <span className="text-zinc-600">Source: Google Maps & Local Business Profile</span>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processedReviews.map((rev) => {
              const currentLikes = helpfulLikes[rev.id] || 0;
              return (
                <div
                  key={rev.id}
                  className="bg-[#0f0f0f] border border-white/10 rounded-lg p-6 hover:border-[#D4D4D8]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div>
                    {/* Author & Meta */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center font-bold text-white text-sm shadow-inner">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-white tracking-wide text-sm">
                              {rev.author}
                            </h4>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" title="Verified Reviewer" />
                          </div>
                          
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 flex-wrap">
                            {rev.reviewerMeta && (
                              <span className="text-zinc-400 font-medium">{rev.reviewerMeta}</span>
                            )}
                            {rev.reviewerMeta && <span>•</span>}
                            <span>{rev.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex text-[#FBBC05]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                        ))}
                      </div>
                    </div>

                    {/* Service / Tags Badge */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rev.service && (
                        <span className="inline-block px-2.5 py-0.5 bg-black border border-white/10 text-[10px] uppercase font-bold tracking-wider text-[#D4D4D8] rounded">
                          {rev.service}
                        </span>
                      )}
                      {rev.photosCount && rev.photosCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] text-zinc-300 rounded font-medium">
                          <Camera className="w-3 h-3 text-zinc-400" />
                          <span>{rev.photosCount} photos</span>
                        </span>
                      )}
                    </div>

                    {/* Review text */}
                    <p className="text-xs sm:text-sm text-zinc-200 font-light leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* Footer with reactions and helpful button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                    <div className="flex items-center gap-2">
                      {rev.reaction && (
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold">
                          {rev.reaction}
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleLike(rev.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                          currentLikes > 0
                            ? 'text-[#D4D4D8] bg-[#D4D4D8]/10'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful {currentLikes > 0 && `(${currentLikes})`}</span>
                      </button>
                    </div>

                    <a
                      href={googleShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-zinc-300 text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <span>Google Verified</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Conversion Section */}
          <div className="mt-16 bg-[#111] border border-[#D4D4D8]/30 p-8 sm:p-10 text-center rounded-xl max-w-3xl mx-auto space-y-4 shadow-[0_0_30px_rgba(212,212,216,0.1)]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#D4D4D8]/10 border border-[#D4D4D8]/30 text-[#D4D4D8] rounded-full text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Jewelry & Custom Grillz</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              Ready to Design Your Custom Piece?
            </h3>
            
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-light leading-relaxed">
              Book a private 1-on-1 studio session at our Arlington location or consult with Jeremy on wedding rings, engagement diamonds, and custom grillz.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-2">
              {onOpenBooking && (
                <button
                  onClick={onOpenBooking}
                  className="px-8 py-3.5 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-widest hover:bg-[#ffffff] transition-all rounded-sm shadow-[0_0_15px_rgba(212,212,216,0.3)] flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Studio Appointment</span>
                </button>
              )}
              <a
                href={googleShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-sm flex items-center gap-2"
              >
                <span>Read More on Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* SUBMIT REVIEW MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#111] border border-[#D4D4D8]/40 rounded-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
              <h3 className="text-lg font-black uppercase tracking-wider text-white font-heading">
                Leave A Client Review
              </h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#D4D4D8] mx-auto" />
                <h4 className="text-lg font-bold text-white uppercase">Review Submitted!</h4>
                <p className="text-xs text-zinc-400">Thank you for sharing your feedback with Jawz Jewelry.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baileigh I."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-black border border-white/20 p-2.5 rounded-sm text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arlington, TX"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-black border border-white/20 p-2.5 rounded-sm text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                      Star Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-black border border-white/20 p-2.5 rounded-sm text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
                    >
                      <option value={5}>5 Stars (Exceptional)</option>
                      <option value={4}>4 Stars (Great)</option>
                      <option value={3}>3 Stars (Average)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                    Service / Piece Made
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Custom Wedding Ring / Gold Grillz"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-black border border-white/20 p-2.5 rounded-sm text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the craftsmanship, turnaround time, diamond quality, or customer service..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-black border border-white/20 p-2.5 rounded-sm text-sm text-white focus:outline-none focus:border-[#D4D4D8]"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <a
                    href={googleShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-zinc-400 hover:text-[#D4D4D8] underline flex items-center gap-1"
                  >
                    <span>Post directly on Google Business Listing →</span>
                  </a>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-wider rounded-sm hover:bg-[#ffffff]"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
