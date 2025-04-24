
// Mock data for casino games

export interface Game {
  id: string;
  title: string;
  image: string;
  category: 'slots' | 'fishing' | 'color';
  isNew?: boolean;
  isHot?: boolean;
  description?: string;
}

// Slots Games
export const slotGames: Game[] = [
  {
    id: 'lucky-dragon',
    title: 'Lucky Dragon',
    image: 'https://placehold.co/400x300/9b87f5/FFFFFF?text=Lucky+Dragon',
    category: 'slots',
    isHot: true,
    description: 'Unleash the power of the dragon in this Asian-themed slot machine!'
  },
  {
    id: 'fortune-wheel',
    title: 'Fortune Wheel',
    image: 'https://placehold.co/400x300/6E59A5/FFFFFF?text=Fortune+Wheel',
    category: 'slots',
    isNew: true,
    description: 'Spin the wheel of fortune and win massive jackpots!'
  },
  {
    id: 'gold-rush',
    title: 'Gold Rush',
    image: 'https://placehold.co/400x300/FFD700/000000?text=Gold+Rush',
    category: 'slots',
    isHot: true,
    description: 'Dig for gold and uncover hidden treasures in this mining-themed slot!'
  },
  {
    id: 'wild-west',
    title: 'Wild West',
    image: 'https://placehold.co/400x300/8B4513/FFFFFF?text=Wild+West',
    category: 'slots',
    description: 'Saddle up for an adventure in the old wild west!'
  },
  {
    id: 'fruit-fiesta',
    title: 'Fruit Fiesta',
    image: 'https://placehold.co/400x300/FF6347/FFFFFF?text=Fruit+Fiesta',
    category: 'slots',
    description: 'Classic fruit slot with modern twists and big payouts!'
  },
  {
    id: 'cosmic-cash',
    title: 'Cosmic Cash',
    image: 'https://placehold.co/400x300/000066/FFFFFF?text=Cosmic+Cash',
    category: 'slots',
    isNew: true,
    description: 'Blast off into space and collect cosmic rewards!'
  },
  {
    id: 'egyptian-riches',
    title: 'Egyptian Riches',
    image: 'https://placehold.co/400x300/DEB887/000000?text=Egyptian+Riches',
    category: 'slots',
    description: 'Uncover the treasures of ancient Egypt in this pyramid-themed slot!'
  },
  {
    id: 'zeus-thunder',
    title: 'Zeus Thunder',
    image: 'https://placehold.co/400x300/4682B4/FFFFFF?text=Zeus+Thunder',
    category: 'slots',
    description: 'Harness the power of Zeus and his mighty thunderbolts!'
  },
  {
    id: 'diamond-deluxe',
    title: 'Diamond Deluxe',
    image: 'https://placehold.co/400x300/B0E0E6/000000?text=Diamond+Deluxe',
    category: 'slots',
    isHot: true,
    description: 'Sparkle and shine with this gem-filled slot machine!'
  },
  {
    id: 'lucky-777',
    title: 'Lucky 777',
    image: 'https://placehold.co/400x300/FF0000/FFFFFF?text=Lucky+777',
    category: 'slots',
    description: 'Classic Vegas-style slot with triple sevens and big wins!'
  },
];

// Fishing Games
export const fishingGames: Game[] = [
  {
    id: 'golden-catch',
    title: 'Golden Catch',
    image: 'https://placehold.co/400x300/1E90FF/FFFFFF?text=Golden+Catch',
    category: 'fishing',
    isHot: true,
    description: 'Catch golden fish and win massive prizes in this underwater adventure!'
  },
  {
    id: 'deep-sea-treasures',
    title: 'Deep Sea Treasures',
    image: 'https://placehold.co/400x300/008080/FFFFFF?text=Deep+Sea+Treasures',
    category: 'fishing',
    isNew: true,
    description: 'Dive deep into the ocean and discover hidden treasures!'
  },
  {
    id: 'fish-hunter',
    title: 'Fish Hunter',
    image: 'https://placehold.co/400x300/00BFFF/FFFFFF?text=Fish+Hunter',
    category: 'fishing',
    description: 'Hunt for exotic fish and earn points with every catch!'
  },
  {
    id: 'fishing-fortune',
    title: 'Fishing Fortune',
    image: 'https://placehold.co/400x300/4169E1/FFFFFF?text=Fishing+Fortune',
    category: 'fishing',
    description: 'Cast your line and reel in fortune with big multipliers!'
  },
  {
    id: 'ocean-king',
    title: 'Ocean King',
    image: 'https://placehold.co/400x300/191970/FFFFFF?text=Ocean+King',
    category: 'fishing',
    isHot: true,
    description: 'Rule the ocean as you hunt for the legendary Ocean King!'
  },
  {
    id: 'fishing-joy',
    title: 'Fishing Joy',
    image: 'https://placehold.co/400x300/6495ED/FFFFFF?text=Fishing+Joy',
    category: 'fishing',
    description: 'Experience the joy of fishing with this exciting arcade game!'
  },
];

// Color Games
export const colorGames: Game[] = [
  {
    id: 'color-wheel',
    title: 'Color Wheel',
    image: 'https://placehold.co/400x300/FF1493/FFFFFF?text=Color+Wheel',
    category: 'color',
    isHot: true,
    description: 'Spin the vibrant wheel and win based on where it lands!'
  },
  {
    id: 'rainbow-riches',
    title: 'Rainbow Riches',
    image: 'https://placehold.co/400x300/FF4500/FFFFFF?text=Rainbow+Riches',
    category: 'color',
    isNew: true,
    description: 'Follow the rainbow to find your pot of gold!'
  },
  {
    id: 'color-blast',
    title: 'Color Blast',
    image: 'https://placehold.co/400x300/9400D3/FFFFFF?text=Color+Blast',
    category: 'color',
    description: 'Explosive color combinations lead to massive payouts!'
  },
  {
    id: 'lucky-colors',
    title: 'Lucky Colors',
    image: 'https://placehold.co/400x300/32CD32/FFFFFF?text=Lucky+Colors',
    category: 'color',
    description: 'Choose your lucky color and see if fortune favors you!'
  },
  {
    id: 'color-match',
    title: 'Color Match',
    image: 'https://placehold.co/400x300/FF8C00/FFFFFF?text=Color+Match',
    category: 'color',
    isHot: true,
    description: 'Match colors and patterns to win big in this fast-paced game!'
  },
];

export const featuredGames: Game[] = [
  ...slotGames.filter((game) => game.isHot || game.isNew).slice(0, 3),
  ...fishingGames.filter((game) => game.isHot || game.isNew).slice(0, 2),
  ...colorGames.filter((game) => game.isHot || game.isNew).slice(0, 1),
];

export const allGames: Game[] = [
  ...slotGames,
  ...fishingGames,
  ...colorGames,
];
