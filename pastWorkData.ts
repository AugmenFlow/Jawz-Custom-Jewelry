import goldPlain from '../assets/images/gold_plain_1779848593610.png';
import silverMoissanite from '../assets/images/silver_moissanite_1779848576581.png';
import silverPlain from '../assets/images/silver_plain_1779848608539.png';

export interface PastWorkItem {
  id: string;
  title: string;
  category: 'best-seller' | 'gold' | 'moissanite' | 'cuts' | 'jewelry';
  isBestSeller: boolean;
  bestSellerRank?: number;
  badge?: string;
  image: string;
  priceEstimate: string;
  metal: string;
  stones?: string;
  cuts: string;
  teethCount: number;
  teethPosition: 'top' | 'bottom' | 'both' | 'jewelry';
  presetTeeth: {
    top: number[];
    bottom: number[];
  };
  suggestedNotes: string;
  turnaround: string;
  clientLocation: string;
  completedDate: string;
  description: string;
  clientReview?: {
    author: string;
    rating: number;
    text: string;
  };
}

export const PAST_WORKS: PastWorkItem[] = [
  {
    id: 'pw-1',
    title: '6-on-6 Solid 10K Yellow Gold Deep Perm Cut',
    category: 'best-seller',
    isBestSeller: true,
    bestSellerRank: 1,
    badge: '#1 Most Requested',
    image: goldPlain,
    priceEstimate: '$1,140 ($95 / tooth)',
    metal: '10K Solid Yellow Gold',
    cuts: 'Deep Perm Cut Separation with Mirror Polish',
    teethCount: 12,
    teethPosition: 'both',
    presetTeeth: {
      top: [4, 5, 6, 7, 8, 9],
      bottom: [4, 5, 6, 7, 8, 9]
    },
    suggestedNotes: '10K Solid Yellow Gold, Deep perm cut lines for authentic individual tooth look, high mirror shine polish, tight suction fit.',
    turnaround: '10-14 Business Days',
    clientLocation: 'Dallas, TX',
    completedDate: 'March 2026',
    description: 'Our most requested custom set of all time. Deeply defined perm cuts create the illusion of individual permanent caps with comfortable removable convenience.',
    clientReview: {
      author: 'Marcus T. (Oak Cliff)',
      rating: 5,
      text: 'Went to the studio by appointment. Jeremy took my molds, and in under 2 weeks I had them. The perm cuts look like actual permanent teeth. Pure gold shine!'
    }
  },
  {
    id: 'pw-2',
    title: '8-on-8 Silver VVS Moissanite Flawless Honeycomb',
    category: 'best-seller',
    isBestSeller: true,
    bestSellerRank: 2,
    badge: 'Insane Fire & Brilliance',
    image: silverMoissanite,
    priceEstimate: '$1,550 Full Set',
    metal: 'Solid 925 Dental Silver',
    stones: 'Flawless VVS Moissanite (Tests positive on diamond testers)',
    cuts: 'Honeycomb Micro-Prong Setting',
    teethCount: 16,
    teethPosition: 'both',
    presetTeeth: {
      top: [3, 4, 5, 6, 7, 8, 9, 10],
      bottom: [3, 4, 5, 6, 7, 8, 9, 10]
    },
    suggestedNotes: 'Silver Moissanite 8 on 8 full iced set, tight honeycomb micro-pave stones, tests positive on diamond tester, clean perimeter gold/silver border.',
    turnaround: '14-18 Business Days',
    clientLocation: 'Lancaster, TX',
    completedDate: 'April 2026',
    description: 'Over 650 hand-set round brilliant moissanite stones set in high-grade dental silver. Extreme refractive fire that outperforms standard diamonds under direct sunlight or flash.',
    clientReview: {
      author: 'DeAndre W. (Fort Worth)',
      rating: 5,
      text: 'Diamond tester went crazy green across all 16 teeth. The flash at night is unreal. Worth every penny.'
    }
  },
  {
    id: 'pw-3',
    title: 'Top 6 Open Face 14K Gold with Diamond Dust Accents',
    category: 'best-seller',
    isBestSeller: true,
    bestSellerRank: 3,
    badge: 'Trending Design',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800&auto=format&fit=crop',
    priceEstimate: '$690 + Custom Cut',
    metal: '14K Solid Yellow Gold',
    cuts: 'Open Face Window with Diamond Dust Sparkle Edges',
    teethCount: 6,
    teethPosition: 'top',
    presetTeeth: {
      top: [4, 5, 6, 7, 8, 9],
      bottom: []
    },
    suggestedNotes: 'Top 6 in 14K Yellow Gold. Center two teeth open face, canines solid with diamond dust sparkle texture. Clean beveled borders.',
    turnaround: '10-12 Business Days',
    clientLocation: 'Houston, TX (Mail Order)',
    completedDate: 'May 2026',
    description: 'A refined look that shows your natural enamel framed in rich 14K gold with micro-textured diamond dust sparkle along the outer borders.',
    clientReview: {
      author: 'Brianna K.',
      rating: 5,
      text: 'Did the mail order mold kit from Houston. Instructions were easy, fit is like a glove, and the open face style gets compliments constantly.'
    }
  },
  {
    id: 'pw-4',
    title: 'Canine Fangs Pair 14K Yellow Gold + Starburst Cuts',
    category: 'best-seller',
    isBestSeller: true,
    bestSellerRank: 4,
    badge: 'Sharp Precision Fit',
    image: goldPlain,
    priceEstimate: '$350 Pair',
    metal: '14K Solid Yellow Gold',
    cuts: 'Extended Fang Sharp Taper with Hand Starburst Cut',
    teethCount: 2,
    teethPosition: 'top',
    presetTeeth: {
      top: [4, 9],
      bottom: []
    },
    suggestedNotes: 'Canines only (left & right upper), sharp fang silhouette, hand-carved starburst diamond cuts, 14K yellow gold.',
    turnaround: '7-10 Business Days',
    clientLocation: 'Arlington, TX',
    completedDate: 'February 2026',
    description: 'Subtle yet aggressive. Custom sculpted extended fang canines crafted in solid 14k gold with light-catching starburst engravings on the facial surface.',
    clientReview: {
      author: 'Trey V.',
      rating: 5,
      text: 'Pop them in on weekends, zero dental adhesive needed. Super snug snap fit.'
    }
  },
  {
    id: 'pw-5',
    title: '10-on-10 Solid 14K White Gold Mirror Ice Finish',
    category: 'gold',
    isBestSeller: false,
    image: silverPlain,
    priceEstimate: '$2,300 ($115 / tooth)',
    metal: 'Solid 14K White Gold (Rhodium Plated)',
    cuts: 'Deep Perm Separation with High Polish',
    teethCount: 20,
    teethPosition: 'both',
    presetTeeth: {
      top: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      bottom: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    suggestedNotes: 'Full mouth 10 on 10 white gold mirror finish. Clean deep cuts, heavy solid feel, custom dental casting.',
    turnaround: '14-16 Business Days',
    clientLocation: 'Dallas, TX',
    completedDate: 'January 2026',
    description: 'Full mouth 20-tooth setup in solid 14K white gold. Electroplated with bright platinum-rhodium for an icy cold, liquid mirror finish.',
    clientReview: {
      author: 'Jordan R.',
      rating: 5,
      text: 'Jeremy spent over an hour making sure my impression took every single tooth back to the molars. When the set came back, it slipped in like butter.'
    }
  },
  {
    id: 'pw-6',
    title: '8-on-8 Silver Lab-Grown VVS Diamond Grillz',
    category: 'moissanite',
    isBestSeller: false,
    image: silverMoissanite,
    priceEstimate: '$2,550 Full Set',
    metal: 'Dental Silver with Anti-Tarnish Alloy',
    stones: 'IGI-Certified Lab Grown VVS Diamonds (D-F Color)',
    cuts: 'Hand-Set Micro Pave Setting',
    teethCount: 16,
    teethPosition: 'both',
    presetTeeth: {
      top: [3, 4, 5, 6, 7, 8, 9, 10],
      bottom: [3, 4, 5, 6, 7, 8, 9, 10]
    },
    suggestedNotes: '100% genuine lab grown diamonds (D-F color, VVS clarity), silver base, hand micro-pave setting with diamond certificate.',
    turnaround: '18-21 Business Days',
    clientLocation: 'Atlanta, GA (Mail Order)',
    completedDate: 'April 2026',
    description: 'Certified lab diamonds hand set one by one. Colorless D-F grading provides unmatched clarity and prestige without retail jewelry markups.',
    clientReview: {
      author: 'Malik B.',
      rating: 5,
      text: 'Unbelievable work. I compared these to my friend’s set that cost triple in NYC and mine have tighter stone setting. Certified Jawz customer for life.'
    }
  },
  {
    id: 'pw-7',
    title: 'Top 6 Nugget Cut Solid 10K Yellow Gold',
    category: 'cuts',
    isBestSeller: false,
    image: goldPlain,
    priceEstimate: '$570 ($95 / tooth)',
    metal: '10K Solid Yellow Gold',
    cuts: 'Heavy Textured Nugget Cut with Polished Edges',
    teethCount: 6,
    teethPosition: 'top',
    presetTeeth: {
      top: [4, 5, 6, 7, 8, 9],
      bottom: []
    },
    suggestedNotes: 'Top 6 in 10K Yellow Gold, heavy textured nugget cut across all teeth, diamond cut borders.',
    turnaround: '10-12 Business Days',
    clientLocation: 'Lancaster, TX',
    completedDate: 'March 2026',
    description: 'Raw textured aesthetic inspired by natural gold nuggets. Hand-carved relief patterns catch light from every angle with zero gemstones needed.',
    clientReview: {
      author: 'Corey S.',
      rating: 5,
      text: 'The nugget cut texture is heavy and masculine. Exactly the 90s vintage look I wanted.'
    }
  },
  {
    id: 'pw-8',
    title: 'Bespoke Bust-Down Automatic Watch & 14K Miami Cuban Link',
    category: 'jewelry',
    isBestSeller: true,
    bestSellerRank: 5,
    badge: 'Custom VIP Commission',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop',
    priceEstimate: 'Custom Commission (Quote on Request)',
    metal: 'Solid 14K Yellow Gold Chain & Stainless Steel Timepiece',
    stones: 'Hand-Selected VVS Diamonds throughout bezel, dial & links',
    cuts: 'Invisible Baguette & Micro-Pave Hand Setting',
    teethCount: 0,
    teethPosition: 'jewelry',
    presetTeeth: {
      top: [],
      bottom: []
    },
    suggestedNotes: 'Custom jewelry commission: Looking for custom iced timepiece and matching 14K Miami Cuban link chain. Please contact me with diamond clarity and weight options.',
    turnaround: '3-5 Weeks',
    clientLocation: 'Dallas, TX',
    completedDate: 'May 2026',
    description: 'Full custom jewelry sourcing and gemstone setting. We act as your private jeweler, sourcing raw stones and custom fabrication directly from our master jewelers.',
    clientReview: {
      author: 'Kendrick P.',
      rating: 5,
      text: 'Jeremy sourced the watch, set the VVS stones, and made the Cuban chain lock fit seamlessly. Honest brother who does business the right way.'
    }
  },
  {
    id: 'pw-9',
    title: 'Custom Diamond Engagement Ring & Eternity Band Set',
    category: 'jewelry',
    isBestSeller: false,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    priceEstimate: 'Custom Commission (Quote on Request)',
    metal: 'Solid 18K White Gold & Platinum',
    stones: '3.0ct Cushion Cut Center Diamond with French Pave Band',
    cuts: 'Ideal Cut Cushion Solitaire with Hidden Halo',
    teethCount: 0,
    teethPosition: 'jewelry',
    presetTeeth: {
      top: [],
      bottom: []
    },
    suggestedNotes: 'Custom diamond ring project: Sourcing center stone and custom 14k/18k setting. Private Arlington consultation.',
    turnaround: '3-4 Weeks',
    clientLocation: 'Arlington, TX',
    completedDate: 'February 2026',
    description: 'Custom bespoke engagement ring crafted to the client’s exact CAD specifications. Sourced with full GIA grading certification.',
    clientReview: {
      author: 'Darnell & Tasha M.',
      rating: 5,
      text: 'She cried when she saw it. Jeremy beat every mall jeweler price by thousands and the diamond quality was way higher.'
    }
  }
];

export interface GoogleReview {
  id: string;
  author: string;
  location: string;
  reviewerMeta?: string;
  date: string;
  rating: number;
  text: string;
  service: string;
  verified: boolean;
  photosCount?: number;
  reaction?: string;
  tags?: string[];
}

export const GOOGLE_REVIEWS_DATA: GoogleReview[] = [
  {
    id: 'gr-1',
    author: 'Baileigh Ivey',
    location: 'Arlington / DFW, TX',
    reviewerMeta: '2 reviews · 2 photos',
    date: 'a year ago',
    rating: 5,
    service: 'Bespoke Diamond Engagement Ring',
    verified: true,
    photosCount: 2,
    reaction: '❤️ 1',
    tags: ['wedding ring', 'diamond', 'engagement', 'quality products'],
    text: 'Although I didn’t have much to do with the planning process, my ring is exactly what I’ve dreamed of. Obsessed with the shine and twinkle of the diamond!! I am so thankful to Jeremy for helping my fiancé in the selection process. I will wear and cherish this forever!'
  },
  {
    id: 'gr-2',
    author: 'Ryan Bornemeier',
    location: 'Arlington / DFW, TX',
    reviewerMeta: '1 review · 2 photos',
    date: 'a year ago',
    rating: 5,
    service: 'Custom Engagement Ring & Center Stone Setting',
    verified: true,
    photosCount: 2,
    reaction: '🔥 1',
    tags: ['engagement', 'diamond', 'quality products', 'wedding ring'],
    text: 'This guy is the real deal. Got me set up with exactly what I wanted, the engagement ring was perfect. Communicated through the entire process of getting the stone and getting it set. Professional quality service and product, cannot recommend enough!'
  },
  {
    id: 'gr-3',
    author: 'Breezy Bree (onnagirls)',
    location: 'Dallas-Fort Worth, TX',
    reviewerMeta: '2 reviews · 2 photos',
    date: '2 years ago',
    rating: 5,
    service: 'Custom Gold Chain & Multiple Stud Earrings',
    verified: true,
    photosCount: 2,
    tags: ['quality products', 'chains', 'earrings'],
    text: 'Jawz jewelry is top notch and never disappoints. I always get quality products and constant communication! I have bought a chain and multiple stud earrings! And I’m planning on going back to Jawz Jewelry soon!'
  },
  {
    id: 'gr-4',
    author: 'Anthony Barney',
    location: 'Dallas Trip / Out of State',
    reviewerMeta: '6 reviews · 5 photos',
    date: '2 years ago',
    rating: 5,
    service: 'Mobile On-Site Grill Consultation & Custom Fit',
    verified: true,
    photosCount: 5,
    tags: ['grillz', 'quality products', 'custom fit'],
    text: 'I visited Dallas for a short trip and wanted a grill while I was in town. Jaws not only came to my location but advise me on what look best as well as my options on options that suited my needs. Flawless turnaround and craftsmanship.'
  },
  {
    id: 'gr-5',
    author: 'Jordan Andrews',
    location: 'Arlington, TX',
    reviewerMeta: '2 reviews',
    date: '2 years ago',
    rating: 5,
    service: 'Two Custom Grillz in 14K Gold',
    verified: true,
    tags: ['grillz', 'quality products', '14k gold'],
    text: 'This guy doesn’t mess around with his craft. He goes all in. Extremely professional, timely, knowledgeable, will be in constant communication with you on updates for your piece. And the quality is second to none! Bought two grillz in 14k and couldn\'t be happier.'
  },
  {
    id: 'gr-6',
    author: 'Christian Cobb',
    location: 'Dallas-Fort Worth, TX',
    reviewerMeta: '2 reviews',
    date: '2 years ago',
    rating: 5,
    service: 'Exceptional Fine Jewelry Pieces',
    verified: true,
    tags: ['quality products', 'jewelry'],
    text: 'Jermy offers exceptional service and Amazing jewelry. He is knowledgeable and attentive, ensuring a personalized and satisfying experience. Highly recommend for anyone seeking high-quality pieces!'
  },
  {
    id: 'gr-7',
    author: 'Ne o',
    location: 'Dallas-Fort Worth, TX',
    reviewerMeta: '7 reviews',
    date: '2 years ago',
    rating: 5,
    service: 'Custom Grillz & Fine Jewelry',
    verified: true,
    tags: ['grillz', 'quality products'],
    text: 'I recently started working with Jeremy King (Jaws Grills) and I couldn\'t be happier with the service and pricing. Despite being new to the industry, they have demonstrated exceptional professionalism and expertise. Their competitive pricing and dedicated craftsmanship are top tier.'
  },
  {
    id: 'gr-8',
    author: 'Marquis Stimpson',
    location: 'DFW Metroplex',
    reviewerMeta: 'Local Guide · 17 reviews',
    date: '2 years ago',
    rating: 5,
    service: 'Custom Wedding Ring for Wife',
    verified: true,
    tags: ['wedding ring', 'quality products', 'diamond'],
    text: 'Purchased a wedding ring for my wife and she loves it. Great work excellent service! Will buy from again.'
  },
  {
    id: 'gr-9',
    author: 'Michael Carter',
    location: 'Texas',
    reviewerMeta: '1 review',
    date: '6 months ago',
    rating: 5,
    service: 'Custom Jewelry & Grill Service',
    verified: true,
    tags: ['quality products'],
    text: 'Good service nice people I give them a 5⭐'
  },
  {
    id: 'gr-10',
    author: 'Eazy Duzzit',
    location: 'Dallas-Fort Worth, TX',
    reviewerMeta: '1 review',
    date: '2 years ago',
    rating: 5,
    service: 'Top & Bottoms w/ Diamond Dust Fangs & Quarter Caps',
    verified: true,
    tags: ['grillz', 'diamond', 'fangs'],
    text: 'bro got me AND wifey situated. top and bottoms w/ diamond dust on fangs for me, quarter caps w/ full fangs for her. GREAT work.'
  },
  {
    id: 'gr-11',
    author: 'Zach Voss',
    location: 'Dallas-Fort Worth, TX',
    reviewerMeta: '1 review',
    date: '2 years ago',
    rating: 5,
    service: 'Custom Gold Jewelry & Grillz',
    verified: true,
    tags: ['quality products', 'pricing'],
    text: 'Best jeweler and great prices, amazing communication with the best results 💯'
  },
  {
    id: 'gr-12',
    author: 'Jaquan Tatum',
    location: 'Arlington, TX',
    reviewerMeta: '5 reviews · 1 photo',
    date: '2 years ago',
    rating: 5,
    service: 'Custom Fine Jewelry',
    verified: true,
    photosCount: 1,
    tags: ['quality products'],
    text: 'Great customer service, great jewelry'
  },
  {
    id: 'gr-13',
    author: 'Naz 214',
    location: 'Dallas-Fort Worth, TX',
    reviewerMeta: '3 reviews · 1 photo',
    date: 'a year ago',
    rating: 5,
    service: 'Express Custom Birthday Present Piece',
    verified: true,
    photosCount: 1,
    reaction: '❤️ 1',
    tags: ['quality products'],
    text: 'Seriously quick turnaround. Exactly when i needed it for a birthday present'
  },
  {
    id: 'gr-14',
    author: 'Daniel Davis',
    location: 'Texas',
    reviewerMeta: '1 review',
    date: '2 years ago',
    rating: 5,
    service: 'Custom Jewelry Service',
    verified: true,
    tags: ['quality products'],
    text: 'Great customer service, even better prices!!'
  }
];
