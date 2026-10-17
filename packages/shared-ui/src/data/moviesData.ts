// ============================================================================
// ViewAI & Fire TV — Content Catalog (Sports & Movies)
// Provides rich metadata including iconic scenes for reverse-scene AI search,
// age ratings, themes, and age-safe alternative recommendations.
// ============================================================================

export type AgeRating = 'G' | 'PG' | 'PG-13' | 'R' | 'TV-MA' | 'TV-Y7';

export type CardData = {
  id: string | number;
  title: string;
  description: string;
  headerImage: string;
  movie: string;
  duration?: number;
  category?: 'Live Sports' | 'Sports' | 'Movies' | 'Animation' | 'Sci-Fi' | 'Action';
  genres?: string[];
  releaseYear?: number;
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  ageRating?: AgeRating;
  targetAgeMin?: number; // 0 for G, 7 for PG, 13 for PG-13, 17 for R
  trending?: boolean;
  isLive?: boolean;
  sportType?: 'Cricket' | 'Football' | 'F1' | 'Basketball' | 'Tennis' | 'Combat';
  iconicScenes?: string[];
  plotThemes?: string[];
  safeAlternativeIds?: string[];
  safeAlternativeReason?: string;
};

export const SPORTS_CATALOG: CardData[] = [
  {
    id: 'live-cricket-ind-aus',
    title: 'India vs Australia — 3rd T20I (Live)',
    description:
      'Live nail-biting T20 decider under the lights at Ahmedabad. Kohli and Maxwell in electric form. Ball-by-ball ViewAI telemetry, pitch mapping, and momentum swings.',
    headerImage:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 10800,
    category: 'Live Sports',
    sportType: 'Cricket',
    genres: ['Live Sports', 'Cricket', 'T20', 'ViewAI Enabled'],
    releaseYear: 2026,
    rating: 4.9,
    ratingCount: 38400,
    contentRating: 'LIVE',
    ageRating: 'G',
    targetAgeMin: 0,
    trending: true,
    isLive: true,
    iconicScenes: [
      'helicopter shot whipped over deep midwicket for six off 148 kmh yorker',
      'flying diving catch inches above boundary rope with relay throw',
      'DRS ball-tracking technology overturns umpire lbw call on leg stump',
      'super over high pressure showdown with yorker death bowling',
      'stump mic banter and tactical field changes in final over',
    ],
    plotThemes: ['live tension', 'rivalry', 'championship decider', 'cricket'],
  },
  {
    id: 'football-ucl-final',
    title: 'UEFA Champions League Final — Real Madrid vs Man City',
    description:
      'The pinnacle of European football at Wembley. 90,000 roaring fans, tactical masterclass between Ancelotti and Guardiola, and high-drama extra time.',
    headerImage:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 7200,
    category: 'Live Sports',
    sportType: 'Football',
    genres: ['Live Sports', 'Football', 'Champions League', 'Soccer'],
    releaseYear: 2026,
    rating: 4.8,
    ratingCount: 52100,
    contentRating: 'LIVE',
    ageRating: 'G',
    targetAgeMin: 0,
    trending: true,
    isLive: true,
    iconicScenes: [
      'spectacular bicycle kick overhead volley screaming into top right corner',
      '94th minute stoppage time bullet header equalizer off corner kick',
      'goalkeeper double reflex save stopping point-blank penalty rebound',
      'solo counter attack dribble past three defenders from own half',
      'wild bench celebration and coach sliding on knees after winning goal',
    ],
    plotThemes: ['european glory', 'tactical masterclass', 'stoppage time drama', 'football'],
  },
  {
    id: 'f1-monaco-gp',
    title: 'Monaco Grand Prix 2026 — Rain Masterclass',
    description:
      'Torrential rain on the treacherous streets of Monte Carlo. Zero room for error, heart-stopping wet overtakes at Sainte Devote, and 1.9s pit stop precision.',
    headerImage:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 6800,
    category: 'Live Sports',
    sportType: 'F1',
    genres: ['Live Sports', 'F1', 'Motorsport', 'Racing'],
    releaseYear: 2026,
    rating: 4.9,
    ratingCount: 29800,
    contentRating: 'LIVE',
    ageRating: 'G',
    targetAgeMin: 0,
    trending: true,
    isLive: true,
    iconicScenes: [
      'audacious outside overtake in heavy spray entering casino square hairpin',
      'flawless 1.9 second four-wheel tire change while raindrops bounce off visors',
      'wheel-to-wheel millimeter duel brushing the armco barriers at swimming pool chicane',
      'safety car restart divebomb late braking into turn 1',
      'champagne podium celebration over royal yacht harbor',
    ],
    plotThemes: ['extreme speed', 'rain masterclass', 'high risk racing', 'f1'],
  },
  {
    id: 'nba-finals-game7',
    title: 'NBA Finals Game 7 — Lakers vs Celtics',
    description:
      'Historic Game 7 showdown for the Larry O\'Brien Trophy. Tied game with 8 seconds left. Defensive lockdown and ice-cold buzzer beaters.',
    headerImage:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 9000,
    category: 'Sports',
    sportType: 'Basketball',
    genres: ['Sports', 'Basketball', 'NBA', 'Championship'],
    releaseYear: 2025,
    rating: 4.7,
    ratingCount: 21500,
    contentRating: 'HD',
    ageRating: 'G',
    targetAgeMin: 0,
    trending: false,
    isLive: false,
    iconicScenes: [
      'deep step-back buzzer-beater three-pointer from half court as red light illuminates',
      'fastbreak alley-oop posterizing two-handed monster dunk in transition',
      'game-saving chasedown pin block against the glass with 3 seconds on the clock',
      'crossover ankle breaker shake driving baseline for reverse layup',
    ],
    plotThemes: ['clutch moment', 'basketball championship', 'historic game 7'],
  },
  {
    id: 'wimbledon-final',
    title: 'Wimbledon Men\'s Final — Epic 5-Set Battle',
    description:
      'A grueling 4 hour 50 minute marathon on Centre Court grass. Incredible lunging passing shots, net volleys, and historic championship point.',
    headerImage:
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 17400,
    category: 'Sports',
    sportType: 'Tennis',
    genres: ['Sports', 'Tennis', 'Grand Slam', 'Wimbledon'],
    releaseYear: 2025,
    rating: 4.9,
    ratingCount: 18900,
    contentRating: '4K',
    ageRating: 'G',
    targetAgeMin: 0,
    trending: false,
    isLive: false,
    iconicScenes: [
      'breathless 48-shot baseline rally ending with lunging down-the-line backhand winner',
      'diving grass-court volley saving match point at 12-12 in final set tiebreaker',
      '142 mph flat ace down the center T chalk line followed by falling to knees in joy',
      'gentleman handshake at the net with standing ovation from royal box',
    ],
    plotThemes: ['tennis endurance', 'centre court grass', 'grand slam glory'],
  },
  {
    id: 'cricket-worldcup-2011',
    title: 'World Cup 2011 Final — India vs Sri Lanka Classic',
    description:
      'Relive India\'s legendary World Cup triumph at Wankhede Stadium. Gambhir\'s gritty 97 and Dhoni\'s immortal tournament-winning six.',
    headerImage:
      'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 14400,
    category: 'Sports',
    sportType: 'Cricket',
    genres: ['Sports', 'Cricket', 'Classic', 'World Cup'],
    releaseYear: 2011,
    rating: 5.0,
    ratingCount: 89400,
    contentRating: 'HD',
    ageRating: 'G',
    targetAgeMin: 0,
    trending: true,
    isLive: false,
    iconicScenes: [
      'Dhoni hitting iconic winning six over long-on with bat revolving in hand as fireworks explode',
      'Gambhir gritty 97 with dirt on jersey resurrecting India chase from 31 for 2',
      'Sachin Tendulkar carried on teammates shoulders during emotional victory lap around stadium',
      'Zaheer Khan fiery opening spell of 3 maidens under intense pressure',
      'Ravi Shastri booming commentary: "Dhoni finishes off in style! A magnificent strike into the crowd!"',
    ],
    plotThemes: ['world champion', 'iconic winning six', 'historic comeback', 'cricket'],
  },
];

export const MOVIES_CATALOG: CardData[] = [
  {
    id: 'movie-interstellar',
    title: 'Interstellar: Beyond Horizons',
    description:
      'When Earth faces extinction, a team of courageous explorers travels through a wormhole near Saturn in search of a new home for humanity.',
    headerImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 10140,
    category: 'Movies',
    genres: ['Sci-Fi', 'Adventure', 'Drama', 'Space'],
    releaseYear: 2024,
    rating: 4.9,
    ratingCount: 76000,
    contentRating: 'PG-13',
    ageRating: 'PG-13',
    targetAgeMin: 13,
    trending: true,
    iconicScenes: [
      'docking with spinning destroyed space station while organ music swells frantically ("it\'s necessary")',
      'gigantic mountain-sized water tidal wave towering over astronauts on water planet',
      'father communicating with daughter across 4th dimension through bookshelf using gravity Morse code on watch',
      'entering black hole Gargantua into 5-dimensional tesseract hypercube',
      'years of video messages watched in silence with tears streaming down face',
    ],
    plotThemes: ['space exploration', 'saving humanity', 'father daughter love', 'relativity', 'sacrifice'],
    safeAlternativeIds: ['movie-bigbuckbunny', 'movie-charge'],
    safeAlternativeReason:
      'For younger children, Interstellar contains intense cosmic peril and existential dread. Safe alternatives like WALL-E or Big Buck Bunny feature heartwarming missions to save ecosystems without distressing themes.',
  },
  {
    id: 'movie-inception',
    title: 'Inception: The Architect of Dreams',
    description:
      'A skilled extractor who steals secrets from deep within the subconscious during dream states is offered a chance to regain his family by pulling off an impossible inception.',
    headerImage:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 8880,
    category: 'Movies',
    genres: ['Sci-Fi', 'Action', 'Heist', 'Mind-Bending'],
    releaseYear: 2023,
    rating: 4.8,
    ratingCount: 68400,
    contentRating: 'PG-13',
    ageRating: 'PG-13',
    targetAgeMin: 13,
    trending: true,
    iconicScenes: [
      'spinning metal totem top on wooden table to determine reality vs dream world',
      'zero gravity hallway brawl rotating walls and ceiling while hotel rolls in dream above',
      'Paris city streets bending and folding upwards into a massive vertical 3D cube',
      'freight train plowing directly through downtown rain-slicked city traffic',
      'snow fortress mountain heist synchronized kick explosion dropping through water',
    ],
    plotThemes: ['dreams within dreams', 'mind-bending heist', 'subconscious', 'reality questioning'],
    safeAlternativeIds: ['movie-elephantsdream', 'movie-bigbuckbunny'],
    safeAlternativeReason:
      'Inception involves complex subconscious trauma and intense firearms combat. For younger kids (under 13), Elephant\'s Dream or Inside Out explore whimsical worlds inside the mind in a playful, age-safe manner.',
  },
  {
    id: 'movie-gladiator',
    title: 'Gladiator: Shadows of the Arena',
    description:
      'A betrayed Roman general is stripped of his family and rank, sold into slavery, and rises through the gladiatorial arenas of Rome to avenge his emperor and family.',
    headerImage:
      'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 9300,
    category: 'Movies',
    genres: ['Action', 'Drama', 'Epic', 'Historical'],
    releaseYear: 2022,
    rating: 4.9,
    ratingCount: 92100,
    contentRating: 'R',
    ageRating: 'R',
    targetAgeMin: 17,
    trending: false,
    iconicScenes: [
      'gladiator standing in center of bloody dusty arena shouting "Are you not entertained? Is this not why you are here?"',
      'brushing open hand across golden wheat stalks in dream of reunion with family in Elysium',
      'Colosseum chariot ambush reversed by gladiators forming disciplined tortoise shield wall',
      'emperor giving public thumbs down gesture in imperial box',
      'final duel in white sands of Colosseum with fallen rose petals',
    ],
    plotThemes: ['revenge', 'honorable warrior', 'exile to champion', 'corrupt ruler', 'brotherhood'],
    safeAlternativeIds: ['movie-bigbuckbunny', 'movie-sintel'],
    safeAlternativeReason:
      'Gladiator is rated R for brutal sword violence and gore (17+). For kids aged 7-12, stories like Kung Fu Panda, The Lion King, or Big Buck Bunny share the EXACT SAME core plot (an exiled hero overcoming tragedy through training to defeat a tyrant) in a family-friendly rating.',
  },
  {
    id: 'movie-darkknight',
    title: 'The Dark Knight: Gotham Under Siege',
    description:
      'Batman faces his greatest psychological test when the sadistic, anarchic mastermind known as the Joker plunges Gotham City into absolute chaos.',
    headerImage:
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 9120,
    category: 'Movies',
    genres: ['Action', 'Crime', 'Thriller', 'Superhero'],
    releaseYear: 2023,
    rating: 5.0,
    ratingCount: 124000,
    contentRating: 'PG-13',
    ageRating: 'PG-13',
    targetAgeMin: 13,
    trending: true,
    iconicScenes: [
      'bank robbery heist opening with clown masks eliminating each other one by one',
      'magic pencil disappearing trick during tense underworld mob meeting',
      'semi-truck flipped completely upside down end-over-end with steel tow cables',
      'interrogation room confrontation smashing mirror with lightbulb swing',
      'two ferry dilemma with detonator switches testing moral conscience of citizens',
    ],
    plotThemes: ['moral dilemma', 'masked vigilante', 'chaos vs order', 'superhero thriller'],
    safeAlternativeIds: ['movie-charge', 'movie-bigbuckbunny'],
    safeAlternativeReason:
      'The Dark Knight is PG-13 due to dark psychological themes and terror. For ages 7-12, animated hero adventures like The Incredibles or Charge deliver thrilling masked crime-fighting gadgets without the terror.',
  },
  {
    id: 'movie-sintel',
    title: 'Sintel: The Dragon\'s Quest',
    description:
      'A lonely orphan girl nurses a wounded baby dragon back to health and embarks on a perilous journey across ice-capped mountain peaks when it is captured.',
    headerImage:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 3120,
    category: 'Animation',
    genres: ['Animation', 'Fantasy', 'Adventure', 'Family'],
    releaseYear: 2024,
    rating: 4.6,
    ratingCount: 14200,
    contentRating: 'PG',
    ageRating: 'PG',
    targetAgeMin: 7,
    trending: false,
    iconicScenes: [
      'nursing tiny injured baby dragon with broken wing using warm soup in snowy alley',
      'mountain climb through blizzard with spear and fur cloak tracking giant beast',
      'confrontation inside volcanic mountain cavern with massive blind dragon',
      'heartbreaking recognition of scar on dragon wing in emotional climax',
    ],
    plotThemes: ['unbreakable bond', 'dragon fantasy', 'perseverance', 'quest'],
    safeAlternativeIds: ['movie-bigbuckbunny'],
    safeAlternativeReason: 'Safe for ages 7+. Features emotional themes of loyalty and devotion.',
  },
  {
    id: 'movie-bigbuckbunny',
    title: 'Big Buck Bunny: Meadow Defender',
    description:
      'When three bullying forest rodents disrupt a peaceful spring morning and torment harmless butterflies, a gentle giant rabbit crafts ingenious comedy traps.',
    headerImage:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 1800,
    category: 'Animation',
    genres: ['Animation', 'Comedy', 'Family', 'Kids'],
    releaseYear: 2025,
    rating: 4.8,
    ratingCount: 41200,
    contentRating: 'G',
    ageRating: 'G',
    targetAgeMin: 0,
    trending: true,
    iconicScenes: [
      'giant fluffy rabbit stepping out of tree hollow into flower meadow on sunny morning',
      'chubby flying squirrel and ferret gang shooting berries through bamboo blowpipes',
      'rabbit building elaborate Rube Goldberg bamboo and vine booby traps',
      'flying squirrel tied to kite glider spinning in dizzy comical circles',
      'peaceful butterfly landing gently on bunny ear in happy celebration',
    ],
    plotThemes: ['standing up to bullies', 'clever humor', 'slapstick traps', 'family friendly'],
    safeAlternativeIds: [],
    safeAlternativeReason: 'Perfect for all ages! 100% wholesome slapstick comedy.',
  },
  {
    id: 'movie-tearsofsteel',
    title: 'Tears of Steel: Amsterdam Vanguard',
    description:
      'In a dystopian future Amsterdam, a ragtag team of scientists and cybernetic soldiers attempt to reset the mind of an omnipotent cyborg matriarch.',
    headerImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 2900,
    category: 'Sci-Fi',
    genres: ['Sci-Fi', 'Cyberpunk', 'Action', 'VFX'],
    releaseYear: 2024,
    rating: 4.4,
    ratingCount: 16500,
    contentRating: 'PG-13',
    ageRating: 'PG-13',
    targetAgeMin: 13,
    trending: false,
    iconicScenes: [
      'giant spider robot walking through historic Amsterdam canal streets beneath rocket tower',
      'connecting glowing cybernetic arm prosthetic inside old church command center',
      'holographic memory projection of college argument between lovers on bridge',
      'laser sniper battle defense against robotic army drones',
    ],
    plotThemes: ['cyberpunk', 'giant robots', 'reconciliation', 'futuristic battle'],
    safeAlternativeIds: ['movie-charge', 'movie-bigbuckbunny'],
    safeAlternativeReason:
      'Contains mild sci-fi combat. For kids, Charge offers fun robot action without dystopian tension.',
  },
  {
    id: 'movie-elephantsdream',
    title: 'Elephant\'s Dream: The Mechanical Mind',
    description:
      'Two explorers navigate the endless corridors, ticking gears, and living telephone cables of a surreal, gigantic machine world.',
    headerImage:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 2400,
    category: 'Animation',
    genres: ['Animation', 'Surreal', 'Sci-Fi', 'Steampunk'],
    releaseYear: 2023,
    rating: 4.3,
    ratingCount: 12900,
    contentRating: 'PG',
    ageRating: 'PG',
    targetAgeMin: 7,
    trending: false,
    iconicScenes: [
      'walking across narrow suspension bridge flanked by thousands of pulsating mechanical gears',
      'tangled labyrinth of red telephone cords forming living organic tentacles',
      'old mentor cautioning young apprentice as giant mechanical eye opens in wall',
      'surreal steam explosion unveiling infinite clockwork horizon',
    ],
    plotThemes: ['surreal machinery', 'mentor and pupil', 'steampunk architecture'],
    safeAlternativeIds: ['movie-bigbuckbunny'],
    safeAlternativeReason: 'Safe for ages 7+. Mild surreal atmosphere.',
  },
  {
    id: 'movie-charge',
    title: 'Charge: Neon Velocity',
    description:
      'An old security android defending a battery storage facility in a cyberpunk alleyway must supercharge his power core to fend off high-tech cyber thieves.',
    headerImage:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop',
    movie:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 1950,
    category: 'Action',
    genres: ['Action', 'Sci-Fi', 'Animation', 'Robots'],
    releaseYear: 2025,
    rating: 4.7,
    ratingCount: 22100,
    contentRating: 'PG',
    ageRating: 'PG',
    targetAgeMin: 7,
    trending: true,
    iconicScenes: [
      'rusty robot plugging heavy neon jumper cables directly into chest power core',
      'high-voltage electric shockwave sending three cloaked cyber thieves skidding into dumpsters',
      'acrobatic leap between neon signs with sparks raining down on alleyway',
      'low-battery red light beeping before final heroic knockout punch',
    ],
    plotThemes: ['robot hero', 'neon aesthetic', 'fast paced action', 'electric overdrive'],
    safeAlternativeIds: ['movie-bigbuckbunny'],
    safeAlternativeReason: 'Great for ages 7+! Fun energetic robot slapstick action.',
  },
];

// Complete dataset combining both for Home landing page
export const ALL_CONTENT: CardData[] = [...SPORTS_CATALOG, ...MOVIES_CATALOG];

export const fetchMoviesData = async (): Promise<CardData[]> => {
  return ALL_CONTENT;
};

export const moviesData: CardData[] = ALL_CONTENT;
