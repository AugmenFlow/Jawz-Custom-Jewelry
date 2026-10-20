import React from 'react';
import { Instagram, Play, ExternalLink, Star, Calendar } from 'lucide-react';
import { InstagramPost } from './data/instagramPosts';

export const instagramPostUrl = (post: InstagramPost) => `https://www.instagram.com/${post.type}/${post.id}/`;

interface InstagramPostCardProps {
  post: InstagramPost;
  rank?: number;
  onBook?: (post: InstagramPost) => void;
  key?: string;
}

export function InstagramPostCard({ post, rank, onBook }: InstagramPostCardProps) {
  const isReel = post.type === 'reel';

  return (
    <div className="group flex flex-col overflow-hidden rounded-sm border border-white/10 bg-[#111] hover:border-[#D4D4D8] transition-colors">
      <a
        href={instagramPostUrl(post)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${post.title} — ${isReel ? 'watch' : 'view'} on Instagram (opens in a new tab)`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4D4D8]"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <img
            src={post.image}
            alt={post.title}
            width={640}
            height={640}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover motion-safe:group-hover:scale-105 motion-safe:transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          {rank && (
            <div className="absolute top-3 left-3 bg-[#D4D4D8] text-black font-black uppercase text-[10px] tracking-wider px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-black" />
              <span>#{rank} Best Seller</span>
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 border border-white/60 text-white group-hover:bg-[#D4D4D8] group-hover:text-black transition-colors">
              {isReel ? <Play className="w-5 h-5 ml-0.5 fill-current" /> : <Instagram className="w-5 h-5" />}
            </span>
          </span>
          <span className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white">
            <Instagram className="w-3.5 h-3.5" aria-hidden="true" /> {isReel ? 'Instagram Reel' : 'Instagram Post'}
          </span>
        </div>
      </a>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wide leading-snug group-hover:text-[#D4D4D8] transition-colors">
          {post.title}
        </h3>
        <a
          href={instagramPostUrl(post)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#D4D4D8] hover:text-white transition-colors"
        >
          {isReel ? 'Watch' : 'View'} on Instagram <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
        </a>
        {onBook && (
          <button
            onClick={() => onBook(post)}
            className="mt-4 w-full py-2.5 bg-[#D4D4D8] text-black text-xs font-black uppercase tracking-wider hover:bg-[#ffffff] transition-all rounded-sm flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(212,212,216,0.2)]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book This Style</span>
          </button>
        )}
      </div>
    </div>
  );
}
