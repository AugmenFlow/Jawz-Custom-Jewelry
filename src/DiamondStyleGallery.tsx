import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styleHoneycomb from './assets/images/pricing/silver-moissanite.jpg';
import styleHoneymoon from './assets/images/pricing/silver-lab-diamond.jpg';
import styleMosaic from './assets/images/pricing/silver.jpg';
import styleGalaxy from './assets/images/pricing/gold-10k.jpg';
import styleEmerald from './assets/images/pricing/gold-14k.jpg';

const DIAMOND_STYLES = [
  { name: 'Honeycomb', image: styleHoneycomb },
  { name: 'Honeymoon', image: styleHoneymoon },
  { name: 'Mosaic', image: styleMosaic },
  { name: 'Galaxy', image: styleGalaxy },
  { name: 'Emerald', image: styleEmerald },
];

export default function DiamondStyleGallery() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.firstElementChild as HTMLElement | null;
    const step = slide ? slide.offsetWidth + 16 : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="diamond-styles-heading" className="mb-10">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h3 id="diamond-styles-heading" className="text-xl font-bold text-white uppercase tracking-wider font-heading">Diamond Grill Styles</h3>
          <p className="text-xs text-zinc-400 mt-1">Swipe to see each setting style.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous style"
            className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-sm text-white hover:border-[#D4D4D8] hover:text-[#D4D4D8] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next style"
            className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-sm text-white hover:border-[#D4D4D8] hover:text-[#D4D4D8] transition-colors"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DIAMOND_STYLES.map(style => (
          <figure key={style.name} className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%] relative aspect-[1170/896] overflow-hidden rounded-sm bg-black border border-white/10">
            <img src={style.image} alt={`${style.name} style diamond grillz`} width={800} height={613} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            <figcaption className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-sm border border-white/15 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] text-white">{style.name} Style</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
