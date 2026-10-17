// ============================================================================
// ViewAI — Semantic Scene & Smart Age-Safe Search Engine
// Powers reverse scene search, sports moment discovery, and age-adapted
// storyline recommendations for Fire TV and Vega OS.
// ============================================================================

import {
  CardData,
  SPORTS_CATALOG,
  MOVIES_CATALOG,
  ALL_CONTENT,
  AgeRating,
} from '../data/moviesData';

export type AISearchResult = {
  item: CardData;
  relevanceScore: number; // 0 - 100
  matchedScene?: string;
  matchedTheme?: string;
  aiExplanation: string;
  isAgeRestricted: boolean;
  ageNotice?: string;
  safeAlternatives?: CardData[];
  safeAlternativeReason?: string;
};

export type AISearchParams = {
  query: string;
  category: 'all' | 'sports' | 'movies';
  targetAge?: number; // e.g. 7 for kids, 13 for teens, 18 for adults
  vibe?: string;
};

// Word normalization and stopword removal
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'with', 'by', 'for', 'from', 'about',
  'of', 'to', 'and', 'or', 'that', 'this', 'is', 'was', 'where', 'who', 'show',
  'movie', 'scene', 'film', 'clip', 'video', 'match', 'some', 'like', 'find', 'me',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// Compute semantic relevance score between user query and item
function computeRelevance(
  queryTokens: string[],
  item: CardData,
): { score: number; bestScene?: string; bestTheme?: string } {
  let score = 0;
  let bestScene: string | undefined;
  let bestSceneHits = 0;

  // 1. Check iconic scenes (highest weight for scene-based reverse search)
  if (item.iconicScenes) {
    for (const scene of item.iconicScenes) {
      const sceneTokens = tokenize(scene);
      let hits = 0;
      for (const qt of queryTokens) {
        if (sceneTokens.some((st) => st.includes(qt) || qt.includes(st))) {
          hits += 1;
        }
      }
      if (hits > bestSceneHits) {
        bestSceneHits = hits;
        bestScene = scene;
      }
    }
    score += bestSceneHits * 28;
  }

  // 2. Check plot themes
  let bestTheme: string | undefined;
  if (item.plotThemes) {
    for (const theme of item.plotThemes) {
      const themeTokens = tokenize(theme);
      for (const qt of queryTokens) {
        if (themeTokens.some((tt) => tt.includes(qt) || qt.includes(tt))) {
          score += 18;
          bestTheme = theme;
        }
      }
    }
  }

  // 3. Check description
  const descTokens = tokenize(item.description);
  for (const qt of queryTokens) {
    if (descTokens.some((dt) => dt.includes(qt) || qt.includes(dt))) {
      score += 8;
    }
  }

  // 4. Check genres
  if (item.genres) {
    for (const genre of item.genres) {
      const gt = genre.toLowerCase();
      for (const qt of queryTokens) {
        if (gt.includes(qt) || qt.includes(gt)) {
          score += 10;
        }
      }
    }
  }

  // 5. Check title (lower weight so user doesn't need to know the title!)
  const titleTokens = tokenize(item.title);
  for (const qt of queryTokens) {
    if (titleTokens.some((tt) => tt.includes(qt))) {
      score += 12;
    }
  }

  return { score: Math.min(score, 99), bestScene, bestTheme };
}

export function searchWithAI(params: AISearchParams): AISearchResult[] {
  const { query, category, targetAge, vibe } = params;
  const queryTokens = tokenize(query);

  let pool: CardData[] = [];
  if (category === 'sports') {
    pool = SPORTS_CATALOG;
  } else if (category === 'movies') {
    pool = MOVIES_CATALOG;
  } else {
    pool = ALL_CONTENT;
  }

  const results: AISearchResult[] = [];

  for (const item of pool) {
    const { score, bestScene, bestTheme } = computeRelevance(queryTokens, item);

    // Apply vibe bonus if specified
    let finalScore = score;
    if (vibe) {
      const vibeLower = vibe.toLowerCase();
      if (item.genres?.some((g) => g.toLowerCase().includes(vibeLower))) {
        finalScore += 15;
      }
    }

    if (finalScore >= 12 || queryTokens.length === 0) {
      // Determine age restriction
      const itemMinAge = item.targetAgeMin ?? 0;
      const isAgeRestricted = targetAge !== undefined && itemMinAge > targetAge;

      let ageNotice: string | undefined;
      let safeAlternatives: CardData[] | undefined;
      let safeAlternativeReason: string | undefined;

      if (isAgeRestricted) {
        ageNotice = `⚠️ "${item.title}" is rated ${item.ageRating || item.contentRating} (Recommended age ${itemMinAge}+). Not suitable for age ${targetAge}.`;

        // Resolve age-appropriate alternatives with similar storylines
        if (item.safeAlternativeIds && item.safeAlternativeIds.length > 0) {
          safeAlternatives = ALL_CONTENT.filter(
            (c) =>
              item.safeAlternativeIds!.includes(String(c.id)) &&
              (targetAge === undefined || (c.targetAgeMin ?? 0) <= targetAge),
          );
        }

        // If no explicit IDs, find safe items with overlapping themes or genres
        if (!safeAlternatives || safeAlternatives.length === 0) {
          safeAlternatives = MOVIES_CATALOG.filter(
            (c) =>
              c.id !== item.id &&
              (c.targetAgeMin ?? 0) <= (targetAge ?? 12) &&
              (c.genres?.some((g) => item.genres?.includes(g)) ||
                c.plotThemes?.some((t) => item.plotThemes?.includes(t))),
          ).slice(0, 2);
        }

        safeAlternativeReason =
          item.safeAlternativeReason ||
          `AI Safe Recommendation: These movies share the same core storyline and excitement, but with family-appropriate content safe for age ${targetAge}.`;
      }

      // Generate explainability text
      let aiExplanation = '';
      if (bestScene) {
        aiExplanation = `Matched scene: "${bestScene}"`;
      } else if (bestTheme) {
        aiExplanation = `Matched theme: "${bestTheme}"`;
      } else {
        aiExplanation = `Matched via contextual narrative similarity in ${item.genres?.join(', ') || item.category}.`;
      }

      results.push({
        item,
        relevanceScore: Math.min(Math.max(finalScore, 50), 99),
        matchedScene: bestScene,
        matchedTheme: bestTheme,
        aiExplanation,
        isAgeRestricted,
        ageNotice,
        safeAlternatives,
        safeAlternativeReason,
      });
    }
  }

  // Sort by relevance score descending
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results;
}

// Preset interactive scene prompts for 1-click user queries
export const MOVIE_SCENE_PROMPTS = [
  'spinning top on a table to test if dreaming',
  'docking with spinning space station with ticking clock',
  'gladiator in dusty arena shouting are you not entertained',
  'bank robbery with clown masks eliminating each other',
  'rabbit building clever bamboo traps to fight bullies',
  'giant spider robot walking through city canals',
  'nursing an injured baby dragon in snowy alley',
];

export const SPORTS_MOMENT_PROMPTS = [
  'Dhoni iconic winning six over long-on in 2011 final',
  'bicycle kick overhead volley into top corner',
  'wet rain overtake on outside at Monaco hairpin',
  'deep buzzer-beater 3-pointer from half court',
  'super over yorker death bowling under pressure',
  '48-shot rally ending with lunging passing shot',
];
