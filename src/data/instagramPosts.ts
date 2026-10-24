import ig0 from '../assets/images/instagram/DeCln0dBT2M.jpg';
import ig1 from '../assets/images/instagram/DeAxLT6NbjN.jpg';
import ig2 from '../assets/images/instagram/DdPijcrMj9q.jpg';
import ig3 from '../assets/images/instagram/DdNSGyhtOdJ.jpg';
import ig4 from '../assets/images/instagram/DayjlMWB4SE.jpg';
import ig5 from '../assets/images/instagram/DdxODVENO0A.jpg';
import ig6 from '../assets/images/instagram/DdfSyp7NBUr.jpg';
import ig7 from '../assets/images/instagram/DbUQpnjN9Mn.jpg';
import ig8 from '../assets/images/instagram/DaQnwoRpS19.jpg';
import ig9 from '../assets/images/instagram/DaGPYMEuPfd.jpg';
import ig10 from '../assets/images/instagram/DZdz5mZtB3c.jpg';
import ig11 from '../assets/images/instagram/DZQBwGTOi3U.jpg';
import ig12 from '../assets/images/instagram/DTbgLN_DSYj.jpg';
import ig13 from '../assets/images/instagram/DPEoxVyDS0e.jpg';
import ig14 from '../assets/images/instagram/DN_en5XEq8m.jpg';
import ig15 from '../assets/images/instagram/DNbMjUGPvYj.jpg';
import ig16 from '../assets/images/instagram/DKfirTzPYF0.jpg';
import ig17 from '../assets/images/instagram/DJR_6ccPRkv.jpg';
import ig18 from '../assets/images/instagram/DHyttwZREQy.jpg';
import ig19 from '../assets/images/instagram/DE_HojhvhG1.jpg';
import ig20 from '../assets/images/instagram/DCmk4CHvrHd.jpg';
import ig21 from '../assets/images/instagram/C_yYcLjvNOY.jpg';
import ig22 from '../assets/images/instagram/C_Lu899PNKG.jpg';
import ig23 from '../assets/images/instagram/C9SwaznP1TV.jpg';
import ig24 from '../assets/images/instagram/C8Z6kHHPFTG.jpg';
import ig25 from '../assets/images/instagram/C8SptlIRW_I.jpg';
import ig26 from '../assets/images/instagram/C67sYTmt2Uv.jpg';
import ig27 from '../assets/images/instagram/C5ZOOKvPt29.jpg';
import ig28 from '../assets/images/instagram/C5Wsk4lPTb5.jpg';
import ig29 from '../assets/images/instagram/C4JX8hIPo8p.jpg';
import ig30 from '../assets/images/instagram/C2Fy7snvFnm.jpg';
import ig31 from '../assets/images/instagram/C0xEGPtvFJ-.jpg';
import ig32 from '../assets/images/instagram/C0xDYuOPL5G.jpg';
import ig33 from '../assets/images/instagram/C0xCpHcv8FD.jpg';
import ig34 from '../assets/images/instagram/C0xBZspPULP.jpg';
import ig35 from '../assets/images/instagram/C0xAeFQPWzS.jpg';
import ig36 from '../assets/images/instagram/DGgy_6qPslW.jpg';
import ig37 from '../assets/images/instagram/DYYNH4PtZtw.jpg';
import ig38 from '../assets/images/instagram/DACBbkMx6AT.jpg';
import ig39 from '../assets/images/instagram/C2tjHK5tnO0.jpg';

export type InstagramCategory = 'grillz' | 'rings' | 'chains-pendants' | 'earrings-bracelets' | 'watches';

export const INSTAGRAM_CATEGORIES: { id: InstagramCategory; label: string }[] = [
  { id: 'grillz', label: 'Grillz' },
  { id: 'rings', label: 'Rings & Diamonds' },
  { id: 'chains-pendants', label: 'Chains & Pendants' },
  { id: 'earrings-bracelets', label: 'Earrings & Bracelets' },
  { id: 'watches', label: 'Watches' },
];

export interface InstagramPost {
  id: string;
  title: string;
  image: string;
  type: 'reel' | 'p';
  category: InstagramCategory;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  { id: 'DeCln0dBT2M', title: "Custom Script Grillz", image: ig0, type: 'reel', category: 'grillz' },
  { id: 'DeAxLT6NbjN', title: "Emerald Hybrid Set", image: ig1, type: 'reel', category: 'grillz' },
  { id: 'DdPijcrMj9q', title: "10-on-10 Honeycomb Grillz", image: ig2, type: 'reel', category: 'grillz' },
  { id: 'DdNSGyhtOdJ', title: "14K Yellow Gold Galaxy Set", image: ig3, type: 'reel', category: 'grillz' },
  { id: 'DayjlMWB4SE', title: "Rolex Datejust 41 Wimbledon", image: ig4, type: 'reel', category: 'watches' },
  { id: 'DdxODVENO0A', title: "Princess Cut Invisible Setting", image: ig5, type: 'reel', category: 'grillz' },
  { id: 'DdfSyp7NBUr', title: "Iced-Out Audemars Piguet", image: ig6, type: 'reel', category: 'watches' },
  { id: 'DbUQpnjN9Mn', title: "Gold & Silver Custom Grillz", image: ig7, type: 'reel', category: 'grillz' },
  { id: 'DaQnwoRpS19', title: "Custom Galaxy Set", image: ig8, type: 'reel', category: 'grillz' },
  { id: 'DaGPYMEuPfd', title: "Custom Occasion Grillz", image: ig9, type: 'reel', category: 'grillz' },
  { id: 'DZdz5mZtB3c', title: "Custom Grillz Collection", image: ig10, type: 'reel', category: 'grillz' },
  { id: 'DZQBwGTOi3U', title: "Fully Iced Custom Pendant", image: ig11, type: 'reel', category: 'chains-pendants' },
  { id: 'DTbgLN_DSYj', title: "18K Glee Special Grillz", image: ig12, type: 'reel', category: 'grillz' },
  { id: 'DPEoxVyDS0e', title: "Custom Engagement Ring", image: ig13, type: 'p', category: 'rings' },
  { id: 'DN_en5XEq8m', title: "8-on-8 VVS Grillz", image: ig14, type: 'p', category: 'grillz' },
  { id: 'DNbMjUGPvYj', title: "Custom Grillz Spotlight", image: ig15, type: 'p', category: 'grillz' },
  { id: 'DKfirTzPYF0', title: "Client Grillz Showcase", image: ig16, type: 'p', category: 'grillz' },
  { id: 'DJR_6ccPRkv', title: "40mm Iced Cartier", image: ig17, type: 'p', category: 'watches' },
  { id: 'DHyttwZREQy', title: "Custom Chain Reveal", image: ig18, type: 'reel', category: 'chains-pendants' },
  { id: 'DE_HojhvhG1', title: "Custom Piece Showcase", image: ig19, type: 'reel', category: 'grillz' },
  { id: 'DCmk4CHvrHd', title: "Jewelry Collection Highlights", image: ig20, type: 'reel', category: 'grillz' },
  { id: 'C_yYcLjvNOY', title: "Custom Gold Grillz", image: ig21, type: 'reel', category: 'grillz' },
  { id: 'C_Lu899PNKG', title: "Custom Diamond Engagement Ring", image: ig22, type: 'reel', category: 'rings' },
  { id: 'C9SwaznP1TV', title: "Custom Jewelry Roundup", image: ig23, type: 'reel', category: 'grillz' },
  { id: 'C8Z6kHHPFTG', title: "Two-Tone Iced Cuban Link", image: ig24, type: 'reel', category: 'chains-pendants' },
  { id: 'C8SptlIRW_I', title: "Client Style Spotlight", image: ig25, type: 'p', category: 'grillz' },
  { id: 'C67sYTmt2Uv', title: "Custom Pendants: Start to Finish", image: ig26, type: 'reel', category: 'chains-pendants' },
  { id: 'C5ZOOKvPt29', title: "Silver & Moissanite Pendant", image: ig27, type: 'reel', category: 'chains-pendants' },
  { id: 'C5Wsk4lPTb5', title: "Custom Lab Diamond Ring", image: ig28, type: 'reel', category: 'rings' },
  { id: 'C4JX8hIPo8p', title: "Oval Lab Diamond Solitaire Ring", image: ig29, type: 'reel', category: 'rings' },
  { id: 'C2Fy7snvFnm', title: "8-on-8 Gold Rose Cuts & Diamond Dust", image: ig30, type: 'reel', category: 'grillz' },
  { id: 'C0xEGPtvFJ-', title: "Moissanite Stud Earrings", image: ig31, type: 'reel', category: 'earrings-bracelets' },
  { id: 'C0xDYuOPL5G', title: "Moissanite Cluster Earrings", image: ig32, type: 'reel', category: 'earrings-bracelets' },
  { id: 'C0xCpHcv8FD', title: "Moissanite Honeycomb Earrings", image: ig33, type: 'reel', category: 'earrings-bracelets' },
  { id: 'C0xBZspPULP', title: "Two-Tone Moissanite Cuban Bracelet", image: ig34, type: 'reel', category: 'earrings-bracelets' },
  { id: 'C0xAeFQPWzS', title: "White Gold Moissanite Cuban Bracelet", image: ig35, type: 'reel', category: 'earrings-bracelets' },
  { id: 'DGgy_6qPslW', title: "2025 Custom Jewelry Highlights", image: ig36, type: 'reel', category: 'grillz' },
  { id: 'DYYNH4PtZtw', title: "Jawz Custom Jewelry Pendant", image: ig37, type: 'reel', category: 'chains-pendants' },
  { id: 'DACBbkMx6AT', title: "Funnyxay Custom Pendant", image: ig38, type: 'p', category: 'chains-pendants' },
  { id: 'C2tjHK5tnO0', title: "1.53ct Oval VVS2 Diamond", image: ig39, type: 'reel', category: 'rings' },
];

export const BEST_SELLER_POSTS = INSTAGRAM_POSTS.slice(0, 4);

// INSTAGRAM_POSTS is listed newest first
export const RECENT_POSTS = INSTAGRAM_POSTS.slice(0, 4);

// Gallery order: deal posts out one category at a time so the grid mixes piece types,
// with the best sellers placed last so the gallery doesn't open with the same four pieces.
const byCategory = INSTAGRAM_CATEGORIES.map(({ id }) => [
  ...INSTAGRAM_POSTS.filter(post => post.category === id && !BEST_SELLER_POSTS.includes(post)),
  ...INSTAGRAM_POSTS.filter(post => post.category === id && BEST_SELLER_POSTS.includes(post)),
]);
export const GALLERY_POSTS: InstagramPost[] = [];
for (let i = 0; byCategory.some(list => i < list.length); i++) {
  byCategory.forEach(list => { if (list[i]) GALLERY_POSTS.push(list[i]); });
}
