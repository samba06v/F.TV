// ============================================================================
// ViewAI — AI Service
// Supports contextual movie questions and the existing cricket demo.
// Movie answers use the metadata provided by the application.
// Cricket answers use demoMatchData.
// A production AI model would be connected through a backend API.
// ============================================================================

import {
  demoMatchData,
  getRelevantHighlights,
  getPlayerByName,
  type HighlightEvent,
  type PlayerStats,
} from '../data/demoMatchData';

// ============================================================================
// Types
// ============================================================================

export type AIResponse = {
  answer: string;
  confidence: 'verified' | 'estimated' | 'unavailable';
  source: string;
  relatedHighlights?: HighlightEvent[];
  relatedPlayers?: PlayerStats[];
  timestamp?: number;
};

export type ContentContext = {
  title: string;
  description: string;
  category?: string;
  genres?: string[];
  releaseYear?: number;
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  duration?: number;
};

export type QuestionCategory =
  | 'score'
  | 'player'
  | 'comparison'
  | 'momentum'
  | 'highlights'
  | 'summary'
  | 'dismissal'
  | 'prediction'
  | 'general';

// ============================================================================
// Question Classification — Cricket Demo
// ============================================================================

function classifyQuestion(question: string): QuestionCategory {
  const q = question.toLowerCase();

  if (
    q.includes('score') ||
    q.includes('runs') ||
    q.includes('how many') ||
    q.includes('target') ||
    q.includes('required')
  ) {
    return 'score';
  }

  if (
    q.includes('compare') ||
    q.includes('better') ||
    q.includes('vs') ||
    q.includes('versus')
  ) {
    return 'comparison';
  }

  if (
    q.includes('momentum') ||
    q.includes('losing') ||
    q.includes('winning') ||
    q.includes('pressure')
  ) {
    return 'momentum';
  }

  if (
    q.includes('highlight') ||
    q.includes('moment') ||
    q.includes('best') ||
    q.includes('last five')
  ) {
    return 'highlights';
  }

  if (
    q.includes('summary') ||
    q.includes('summarize') ||
    q.includes('what happened') ||
    q.includes('recap')
  ) {
    return 'summary';
  }

  if (
    q.includes('out') ||
    q.includes('dismissal') ||
    q.includes('how did') ||
    q.includes('wicket')
  ) {
    return 'dismissal';
  }

  if (
    q.includes('predict') ||
    q.includes('will') ||
    q.includes('chance') ||
    q.includes('who will win')
  ) {
    return 'prediction';
  }

  if (
    q.includes('who') ||
    q.includes('player') ||
    q.includes('stats') ||
    q.includes('strike rate') ||
    q.includes('bowling')
  ) {
    return 'player';
  }

  return 'general';
}

// ============================================================================
// Cricket Demo — Player Name Extraction
// ============================================================================

function extractPlayerName(question: string): string | undefined {
  const allNames = demoMatchData.players.map((player) => player.name);
  const q = question.toLowerCase();

  return allNames.find((name) => q.includes(name.toLowerCase()));
}

function extractTwoPlayerNames(
  question: string,
): [string, string] | undefined {
  const allNames = demoMatchData.players.map((player) => player.name);
  const q = question.toLowerCase();

  const found = allNames.filter((name) =>
    q.includes(name.toLowerCase()),
  );

  if (found.length >= 2) {
    return [found[0], found[1]];
  }

  return undefined;
}

// ============================================================================
// Content-Aware Answers
// ============================================================================

function answerContentQuestion(
  question: string,
  context: ContentContext,
): AIResponse {
  const q = question.toLowerCase();
  const source = 'Provided content metadata';

  // Answer questions about the title.
  if (
    q.includes('title') ||
    q.includes('name of this') ||
    q.includes('what am i watching')
  ) {
    return {
      answer: `You are watching "${context.title}".`,
      confidence: 'verified',
      source,
    };
  }

  // Answer questions about the description, synopsis, or story.
  if (
    q.includes('summary') ||
    q.includes('summarize') ||
    q.includes('about') ||
    q.includes('synopsis') ||
    q.includes('plot') ||
    q.includes('story') ||
    q.includes('description')
  ) {
    return {
      answer: context.description
        ? `${context.title}\n\n${context.description}`
        : `A description for "${context.title}" is not available.`,
      confidence: context.description ? 'verified' : 'unavailable',
      source,
    };
  }

  // Answer genre and category questions.
  if (q.includes('genre') || q.includes('category')) {
    const details = [
      context.category,
      ...(context.genres ?? []),
    ].filter((value): value is string => Boolean(value));

    const uniqueDetails = [...new Set(details)];

    return {
      answer:
        uniqueDetails.length > 0
          ? `${context.title} is categorized as: ${uniqueDetails.join(', ')}.`
          : `Genre information for "${context.title}" is not available.`,
      confidence:
        uniqueDetails.length > 0 ? 'verified' : 'unavailable',
      source,
    };
  }

  // Answer release-year questions.
  if (
    q.includes('release year') ||
    q.includes('released') ||
    q.includes('release date') ||
    q.includes('what year') ||
    q.includes('which year')
  ) {
    return {
      answer:
        context.releaseYear !== undefined
          ? `${context.title} was released in ${context.releaseYear}.`
          : `The release year for "${context.title}" is not available.`,
      confidence:
        context.releaseYear !== undefined ? 'verified' : 'unavailable',
      source,
    };
  }

  // Answer rating questions.
  if (
    q.includes('rating') ||
    q.includes('rated') ||
    q.includes('worth watching') ||
    q.includes('content rating')
  ) {
    const details: string[] = [];

    if (context.rating !== undefined) {
      details.push(`Rating: ${context.rating.toFixed(1)}/10`);
    }

    if (
      context.ratingCount !== undefined &&
      context.ratingCount > 0
    ) {
      details.push(
        `Number of ratings: ${context.ratingCount.toLocaleString()}`,
      );
    }

    if (context.contentRating) {
      details.push(`Content rating: ${context.contentRating}`);
    }

    return {
      answer:
        details.length > 0
          ? `${context.title}\n${details.join('\n')}`
          : `Rating information for "${context.title}" is not available.`,
      confidence: details.length > 0 ? 'verified' : 'unavailable',
      source,
    };
  }

  // Answer runtime questions. Duration is stored in seconds.
  if (
    q.includes('duration') ||
    q.includes('how long') ||
    q.includes('runtime') ||
    q.includes('running time')
  ) {
    const duration = context.duration;

    if (duration !== undefined && duration > 0) {
      const totalMinutes = Math.floor(duration / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      let runtime: string;

      if (hours > 0) {
        runtime = `${hours} hour${hours === 1 ? '' : 's'}`;

        if (minutes > 0) {
          runtime += ` and ${minutes} minute${minutes === 1 ? '' : 's'}`;
        }
      } else {
        runtime = `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'}`;
      }

      return {
        answer: `${context.title} has a runtime of ${runtime}.`,
        confidence: 'verified',
        source,
      };
    }

    return {
      answer: `The runtime for "${context.title}" is not available.`,
      confidence: 'unavailable',
      source,
    };
  }

  // Avoid inventing plot details or claiming access to unseen scenes.
  return {
    answer:
      `You're watching "${context.title}".\n\n` +
      `I don't have enough information in the available metadata ` +
      `to answer that question accurately yet.\n\n` +
      `You can ask about the title, synopsis, genre, release year, ` +
      `runtime, or available ratings.`,
    confidence: 'unavailable',
    source,
  };
}

// ============================================================================
// Cricket Demo — Answer Generators
// ============================================================================

function answerScore(): AIResponse {
  const score = demoMatchData.matchState.currentScore;
  const remaining = (score.target ?? 0) - score.runs;
  const ballsRemaining =
    20 * 6 - (score.overs * 6 + score.balls);

  const requiredRate =
    ballsRemaining > 0
      ? ((remaining / ballsRemaining) * 6).toFixed(2)
      : 'N/A';

  return {
    answer:
      `India are ${score.runs}/${score.wickets} ` +
      `in ${score.overs}.${score.balls} overs.\n\n` +
      `📊 Run rate: ${score.runRate.toFixed(2)}\n` +
      (score.target
        ? `🎯 Target: ${score.target}\n` +
          `🏃 Need: ${remaining} runs off ${ballsRemaining} balls\n` +
          `📈 Required rate: ${requiredRate}`
        : ''),
    confidence: 'verified',
    source: 'Demo scorecard',
  };
}

function answerPlayer(question: string): AIResponse {
  const name = extractPlayerName(question);

  if (!name) {
    return {
      answer:
        'I could not identify which player you are asking about. ' +
        'Try using their full name, e.g., "How is Virat Kohli doing?"',
      confidence: 'unavailable',
      source: 'N/A',
    };
  }

  const player = getPlayerByName(name);

  if (!player) {
    return {
      answer: `Player information for ${name} is unavailable.`,
      confidence: 'unavailable',
      source: 'N/A',
    };
  }

  const batting = player.battingStats;

  let answer =
    `🏏 ${player.name} (${player.team} — ${player.role})\n\n`;

  if (batting.status === 'batting') {
    answer += `Currently batting: ${batting.runs} off ${batting.balls} balls\n`;
    answer += `Fours: ${batting.fours} | Sixes: ${batting.sixes}\n`;
    answer += `Strike rate: ${batting.strikeRate.toFixed(1)}`;
  } else if (batting.status === 'out') {
    answer += `Scored: ${batting.runs} off ${batting.balls} balls\n`;
    answer += `Dismissal: ${batting.dismissal}\n`;
    answer +=
      `Fours: ${batting.fours} | Sixes: ${batting.sixes} | ` +
      `SR: ${batting.strikeRate.toFixed(1)}`;
  } else {
    answer += 'Yet to bat.';
  }

  if (player.bowlingStats) {
    const bowling = player.bowlingStats;

    answer +=
      `\n\n🎳 Bowling: ${bowling.wickets}/${bowling.runs} ` +
      `in ${bowling.overs} overs ` +
      `(Econ: ${bowling.economy.toFixed(2)})`;
  }

  return {
    answer,
    confidence: 'verified',
    source: 'Demo player scorecard',
    relatedPlayers: [player],
  };
}

function answerComparison(question: string): AIResponse {
  const names = extractTwoPlayerNames(question);

  if (!names) {
    return {
      answer:
        'Please mention two players to compare. ' +
        'For example: "Compare Rohit and Kohli".',
      confidence: 'unavailable',
      source: 'N/A',
    };
  }

  const player1 = getPlayerByName(names[0]);
  const player2 = getPlayerByName(names[1]);

  if (!player1 || !player2) {
    return {
      answer: 'I could not retrieve the requested player information.',
      confidence: 'unavailable',
      source: 'N/A',
    };
  }

  const batting1 = player1.battingStats;
  const batting2 = player2.battingStats;

  const answer =
    `📊 Head-to-head: ${player1.name} vs ${player2.name}\n\n` +
    `Metric              | ${player1.name} | ${player2.name}\n` +
    `Runs                | ${batting1.runs} | ${batting2.runs}\n` +
    `Balls               | ${batting1.balls} | ${batting2.balls}\n` +
    `Strike Rate         | ${batting1.strikeRate.toFixed(1)} | ` +
    `${batting2.strikeRate.toFixed(1)}\n` +
    `Fours               | ${batting1.fours} | ${batting2.fours}\n` +
    `Sixes               | ${batting1.sixes} | ${batting2.sixes}`;

  return {
    answer,
    confidence: 'verified',
    source: 'Demo player comparison',
    relatedPlayers: [player1, player2],
  };
}

function answerMomentum(): AIResponse {
  return {
    answer:
      demoMatchData.contextInsights.momentum +
      '\n\n' +
      demoMatchData.contextInsights.match_situation,
    confidence: 'verified',
    source: 'Demo match analysis',
  };
}

function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return (
    `${minutes.toString().padStart(2, '0')}:` +
    `${remainingSeconds.toString().padStart(2, '0')}`
  );
}

function answerHighlights(currentTimestamp: number): AIResponse {
  const recent = getRelevantHighlights(currentTimestamp, 120);

  if (recent.length === 0) {
    const topEvents = demoMatchData.highlights
      .filter((highlight) => highlight.importance === 'high')
      .slice(0, 5);

    const text = topEvents
      .map(
        (highlight) =>
          `${highlight.emoji} ` +
          `${formatTimestamp(highlight.timestampSeconds)} — ` +
          `${highlight.title}`,
      )
      .join('\n');

    return {
      answer: `🔥 Key moments from the match:\n\n${text}`,
      confidence: 'verified',
      source: 'Demo match highlights',
      relatedHighlights: topEvents,
    };
  }

  const text = recent
    .map(
      (highlight) =>
        `${highlight.emoji} ` +
        `${formatTimestamp(highlight.timestampSeconds)} — ` +
        `${highlight.title}\n${highlight.description}`,
    )
    .join('\n\n');

  return {
    answer:
      `Recent events near ${formatTimestamp(currentTimestamp)}:\n\n${text}`,
    confidence: 'verified',
    source: 'Demo timeline events',
    relatedHighlights: recent,
  };
}

function answerSummary(): AIResponse {
  const match = demoMatchData.matchState;
  const recentOvers = demoMatchData.overSummaries.slice(-5);

  const overText = recentOvers
    .map(
      (over) =>
        `Over ${over.overNumber}: ${over.runs} runs` +
        `${over.wickets ? `, ${over.wickets}W` : ''} — ` +
        `${over.commentary}`,
    )
    .join('\n');

  return {
    answer:
      `📋 Match Summary — ${match.title}\n\n` +
      `📍 ${match.venue} | ${match.date}\n` +
      `🏏 ${match.status}\n\n` +
      `Score: ${match.currentScore.runs}/${match.currentScore.wickets} ` +
      `(${match.currentScore.overs}.${match.currentScore.balls} overs)\n` +
      `Target: ${match.currentScore.target}\n\n` +
      `🤝 Current partnership: ${match.partnership.batsman1} & ` +
      `${match.partnership.batsman2}\n` +
      `${match.partnership.runs} runs off ${match.partnership.balls} balls\n\n` +
      `📝 Last 5 overs:\n${overText}`,
    confidence: 'verified',
    source: 'Demo match summary',
  };
}

function answerDismissal(question: string): AIResponse {
  const name = extractPlayerName(question);

  if (name) {
    const player = getPlayerByName(name);

    if (player && player.battingStats.status === 'out') {
      const insight =
        name === 'Virat Kohli'
          ? '\n\n' + demoMatchData.contextInsights.kohli_dismissal
          : '';

      return {
        answer:
          `${player.name} was dismissed: ` +
          `${player.battingStats.dismissal}\n` +
          `Scored ${player.battingStats.runs} off ` +
          `${player.battingStats.balls} balls.${insight}`,
        confidence: 'verified',
        source: 'Demo scorecard',
        relatedPlayers: [player],
      };
    }

    if (player && player.battingStats.status === 'batting') {
      return {
        answer:
          `${player.name} is still batting! ` +
          `Currently on ${player.battingStats.runs} off ` +
          `${player.battingStats.balls} balls.`,
        confidence: 'verified',
        source: 'Demo scorecard',
        relatedPlayers: [player],
      };
    }
  }

  const dismissed = demoMatchData.players.filter(
    (player) => player.battingStats.status === 'out',
  );

  const text = dismissed
    .map(
      (player) =>
        `• ${player.name}: ${player.battingStats.runs}` +
        `(${player.battingStats.balls}) — ` +
        `${player.battingStats.dismissal}`,
    )
    .join('\n');

  return {
    answer: `Wickets fallen so far:\n\n${text}`,
    confidence: 'verified',
    source: 'Demo scorecard',
  };
}

function answerPrediction(): AIResponse {
  return {
    answer:
      '⚠️ I do not make predictions based on speculation.\n\n' +
      "Here's what the demo data shows:\n\n" +
      demoMatchData.contextInsights.required_rate +
      '\n\n' +
      demoMatchData.contextInsights.death_overs +
      '\n\n' +
      '📊 Historical context: ' +
      demoMatchData.contextInsights.head_to_head,
    confidence: 'estimated',
    source: 'Demo statistical analysis',
  };
}

function answerGeneral(question: string): AIResponse {
  const q = question.toLowerCase();

  for (const [key, value] of Object.entries(
    demoMatchData.contextInsights,
  )) {
    if (q.includes(key.replace('_', ' ')) || q.includes(key)) {
      return {
        answer: value,
        confidence: 'verified',
        source: `Demo insight: ${key}`,
      };
    }
  }

  return {
    answer:
      'I can help with this cricket demo. Try asking about:\n\n' +
      '📊 Current score and required run rate\n' +
      '🏏 A player’s performance\n' +
      '🔄 Player comparisons\n' +
      '💥 Match highlights and key moments\n' +
      '📋 Match summary\n' +
      '🎯 Momentum and match analysis\n' +
      '❌ How a player got out\n\n' +
      `Your question was: "${question}"`,
    confidence: 'unavailable',
    source: 'Demo help',
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Answers a viewer's question.
 *
 * When contentContext is supplied, answers use the selected title's
 * metadata. Otherwise, the existing cricket demo is used.
 *
 * This implementation does not call an external language model.
 */
export async function askAI(
  question: string,
  currentTimestamp: number = 0,
  contentContext?: ContentContext,
): Promise<AIResponse> {
  // Simulate a short delay to mimic a service request.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 200 + Math.random() * 400);
  });

  // Use the selected movie/show's metadata when available.
  if (contentContext) {
    return answerContentQuestion(question, contentContext);
  }

  // Preserve the existing cricket demo behavior.
  const category = classifyQuestion(question);

  switch (category) {
    case 'score':
      return answerScore();

    case 'player':
      return answerPlayer(question);

    case 'comparison':
      return answerComparison(question);

    case 'momentum':
      return answerMomentum();

    case 'highlights':
      return answerHighlights(currentTimestamp);

    case 'summary':
      return answerSummary();

    case 'dismissal':
      return answerDismissal(question);

    case 'prediction':
      return answerPrediction();

    case 'general':
    default:
      return answerGeneral(question);
  }
}

/**
 * Returns suggested questions based on the current content.
 *
 * With contentContext, questions are about the selected title.
 * Without it, the existing cricket demo suggestions are returned.
 */
export function getSuggestedQuestions(
  currentTimestamp: number,
  contentContext?: ContentContext,
): string[] {
  if (contentContext) {
    const questions = [
      `What is "${contentContext.title}" about?`,
      `What genre is "${contentContext.title}"?`,
    ];

    if (contentContext.releaseYear !== undefined) {
      questions.push('What year was it released?');
    }

    if (
      contentContext.rating !== undefined ||
      contentContext.contentRating
    ) {
      questions.push('What is its rating?');
    }

    if (
      contentContext.duration !== undefined &&
      contentContext.duration > 0
    ) {
      questions.push('How long is it?');
    }

    questions.push(
      `What information is available about "${contentContext.title}"?`,
    );

    return [...new Set(questions)].slice(0, 6);
  }

  // Existing cricket demo suggestions.
  const baseQuestions = [
    "What's the current score?",
    'Summarize the match so far',
    'Who is performing best?',
  ];

  const nearbyHighlights = getRelevantHighlights(
    currentTimestamp,
    30,
  );

  const contextual: string[] = [];

  if (nearbyHighlights.length > 0) {
    const lastEvent =
      nearbyHighlights[nearbyHighlights.length - 1];

    if (lastEvent.category === 'wicket') {
      const player = lastEvent.involvedPlayers[0];

      contextual.push(`How did ${player} get out?`);
    }

    if (
      lastEvent.category === 'six' ||
      lastEvent.category === 'boundary'
    ) {
      const player = lastEvent.involvedPlayers[0];

      contextual.push(`Show me ${player}'s stats`);
    }

    if (lastEvent.category === 'partnership') {
      contextual.push(
        `Compare ${lastEvent.involvedPlayers[0]} and ` +
        `${lastEvent.involvedPlayers[1]}`,
      );
    }
  }

  if (currentTimestamp > 300) {
    contextual.push('Is India winning or losing momentum?');
  }

  const combined = [...contextual, ...baseQuestions];

  return [...new Set(combined)].slice(0, 6);
}