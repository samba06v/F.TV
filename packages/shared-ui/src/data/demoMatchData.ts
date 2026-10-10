// ============================================================================
// ViewAI — Demo Cricket Match Data
// Provides grounded, factual data for the AI companion to reference.
// Every answer the AI produces is drawn from this dataset, not generated.
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlayerStats = {
  id: string;
  name: string;
  team: 'India' | 'Australia';
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  battingStats: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    status: 'batting' | 'out' | 'yet to bat';
    dismissal?: string;
  };
  bowlingStats?: {
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
  };
  imageUrl?: string;
};

export type HighlightEvent = {
  id: string;
  title: string;
  description: string;
  timestampSeconds: number;
  category: 'wicket' | 'boundary' | 'milestone' | 'six' | 'runout' | 'review' | 'partnership' | 'other';
  involvedPlayers: string[];
  importance: 'high' | 'medium' | 'low';
  emoji: string;
};

export type OverSummary = {
  overNumber: number;
  bowler: string;
  runs: number;
  wickets: number;
  extras: number;
  commentary: string;
  timestampStart: number;
  timestampEnd: number;
};

export type MatchState = {
  matchId: string;
  title: string;
  venue: string;
  date: string;
  format: string;
  status: string;
  toss: string;
  battingTeam: string;
  bowlingTeam: string;
  currentScore: {
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    runRate: number;
    target?: number;
  };
  recentOvers: string;       // e.g. "1 4 0 W 2 6 | 0 1 4 0 0 2"
  partnership: {
    runs: number;
    balls: number;
    batsman1: string;
    batsman2: string;
  };
};

export type DemoMatch = {
  matchState: MatchState;
  players: PlayerStats[];
  highlights: HighlightEvent[];
  overSummaries: OverSummary[];
  contextInsights: Record<string, string>;
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const demoMatchData: DemoMatch = {
  matchState: {
    matchId: 'IND-AUS-T20-2024-01',
    title: 'India vs Australia — 3rd T20I',
    venue: 'Wankhede Stadium, Mumbai',
    date: '2024-12-15',
    format: 'T20 International',
    status: 'Live — India batting',
    toss: 'Australia won the toss and elected to field',
    battingTeam: 'India',
    bowlingTeam: 'Australia',
    currentScore: {
      runs: 156,
      wickets: 4,
      overs: 16,
      balls: 3,
      runRate: 9.58,
      target: 185,
    },
    recentOvers: '1 4 0 W 2 6 | 0 1 4 0 0 2',
    partnership: {
      runs: 47,
      balls: 28,
      batsman1: 'Hardik Pandya',
      batsman2: 'Rinku Singh',
    },
  },

  players: [
    // ---- India Batting ----
    {
      id: 'p1',
      name: 'Rohit Sharma',
      team: 'India',
      role: 'Batsman',
      battingStats: {
        runs: 42,
        balls: 28,
        fours: 5,
        sixes: 2,
        strikeRate: 150.0,
        status: 'out',
        dismissal: 'c Maxwell b Zampa',
      },
    },
    {
      id: 'p2',
      name: 'Yashasvi Jaiswal',
      team: 'India',
      role: 'Batsman',
      battingStats: {
        runs: 18,
        balls: 15,
        fours: 3,
        sixes: 0,
        strikeRate: 120.0,
        status: 'out',
        dismissal: 'b Starc',
      },
    },
    {
      id: 'p3',
      name: 'Virat Kohli',
      team: 'India',
      role: 'Batsman',
      battingStats: {
        runs: 34,
        balls: 22,
        fours: 3,
        sixes: 1,
        strikeRate: 154.5,
        status: 'out',
        dismissal: 'lbw Cummins',
      },
    },
    {
      id: 'p4',
      name: 'Suryakumar Yadav',
      team: 'India',
      role: 'Batsman',
      battingStats: {
        runs: 12,
        balls: 10,
        fours: 1,
        sixes: 0,
        strikeRate: 120.0,
        status: 'out',
        dismissal: 'c Carey b Hazlewood',
      },
    },
    {
      id: 'p5',
      name: 'Hardik Pandya',
      team: 'India',
      role: 'All-rounder',
      battingStats: {
        runs: 31,
        balls: 16,
        fours: 2,
        sixes: 2,
        strikeRate: 193.8,
        status: 'batting',
      },
    },
    {
      id: 'p6',
      name: 'Rinku Singh',
      team: 'India',
      role: 'Batsman',
      battingStats: {
        runs: 14,
        balls: 8,
        fours: 1,
        sixes: 1,
        strikeRate: 175.0,
        status: 'batting',
      },
    },
    // ---- Australia Bowling ----
    {
      id: 'p7',
      name: 'Mitchell Starc',
      team: 'Australia',
      role: 'Bowler',
      battingStats: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'yet to bat' },
      bowlingStats: { overs: 4, maidens: 0, runs: 38, wickets: 1, economy: 9.5 },
    },
    {
      id: 'p8',
      name: 'Josh Hazlewood',
      team: 'Australia',
      role: 'Bowler',
      battingStats: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'yet to bat' },
      bowlingStats: { overs: 3.3, maidens: 0, runs: 30, wickets: 1, economy: 8.57 },
    },
    {
      id: 'p9',
      name: 'Pat Cummins',
      team: 'Australia',
      role: 'Bowler',
      battingStats: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'yet to bat' },
      bowlingStats: { overs: 3, maidens: 0, runs: 28, wickets: 1, economy: 9.33 },
    },
    {
      id: 'p10',
      name: 'Adam Zampa',
      team: 'Australia',
      role: 'Bowler',
      battingStats: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'yet to bat' },
      bowlingStats: { overs: 4, maidens: 0, runs: 35, wickets: 1, economy: 8.75 },
    },
    {
      id: 'p11',
      name: 'Glenn Maxwell',
      team: 'Australia',
      role: 'All-rounder',
      battingStats: { runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, status: 'yet to bat' },
      bowlingStats: { overs: 2, maidens: 0, runs: 22, wickets: 0, economy: 11.0 },
    },
  ],

  highlights: [
    {
      id: 'h1',
      title: 'Rohit Sharma smashes first six!',
      description: 'Rohit launches Starc over mid-wicket for a massive six on just the 4th ball of the innings, setting the tone.',
      timestampSeconds: 25,
      category: 'six',
      involvedPlayers: ['Rohit Sharma', 'Mitchell Starc'],
      importance: 'medium',
      emoji: '💥',
    },
    {
      id: 'h2',
      title: 'Jaiswal falls early',
      description: 'A beautiful inswinger from Starc bowls Jaiswal through the gate. India 38/1 in 3.4 overs.',
      timestampSeconds: 55,
      category: 'wicket',
      involvedPlayers: ['Yashasvi Jaiswal', 'Mitchell Starc'],
      importance: 'high',
      emoji: '🏏',
    },
    {
      id: 'h3',
      title: 'Rohit-Kohli partnership flourishes',
      description: 'The two veterans add 52 runs together in just 32 balls, dominating the Australian bowling.',
      timestampSeconds: 100,
      category: 'partnership',
      involvedPlayers: ['Rohit Sharma', 'Virat Kohli'],
      importance: 'high',
      emoji: '🤝',
    },
    {
      id: 'h4',
      title: 'Kohli\'s exquisite cover drive',
      description: 'Kohli leans into a Hazlewood delivery, threading it through cover for four. Textbook cricket.',
      timestampSeconds: 130,
      category: 'boundary',
      involvedPlayers: ['Virat Kohli', 'Josh Hazlewood'],
      importance: 'medium',
      emoji: '🎯',
    },
    {
      id: 'h5',
      title: 'Zampa traps Rohit!',
      description: 'Zampa flights one outside off, Rohit goes for a big heave and Maxwell takes a stunning catch at long-on. Rohit departs for a quickfire 42.',
      timestampSeconds: 180,
      category: 'wicket',
      involvedPlayers: ['Rohit Sharma', 'Adam Zampa', 'Glenn Maxwell'],
      importance: 'high',
      emoji: '⚡',
    },
    {
      id: 'h6',
      title: 'Kohli brings up his fifty?',
      description: 'Kohli drives Cummins for a single, reaching 34. He was looking set for a big knock.',
      timestampSeconds: 220,
      category: 'milestone',
      involvedPlayers: ['Virat Kohli'],
      importance: 'medium',
      emoji: '🌟',
    },
    {
      id: 'h7',
      title: 'Cummins strikes — Kohli LBW!',
      description: 'Cummins delivers a perfect yorker-length ball, catches Kohli plumb in front. India 106/3 in 11.2 overs.',
      timestampSeconds: 260,
      category: 'wicket',
      involvedPlayers: ['Virat Kohli', 'Pat Cummins'],
      importance: 'high',
      emoji: '🔥',
    },
    {
      id: 'h8',
      title: 'SKY departs cheaply',
      description: 'Hazlewood gets extra bounce, Suryakumar edges to Carey behind the stumps. India in a spot at 118/4.',
      timestampSeconds: 310,
      category: 'wicket',
      involvedPlayers: ['Suryakumar Yadav', 'Josh Hazlewood'],
      importance: 'high',
      emoji: '😱',
    },
    {
      id: 'h9',
      title: 'Pandya counter-attacks!',
      description: 'Hardik smashes three boundaries in the 14th over, turning the momentum back towards India.',
      timestampSeconds: 360,
      category: 'boundary',
      involvedPlayers: ['Hardik Pandya'],
      importance: 'high',
      emoji: '💪',
    },
    {
      id: 'h10',
      title: 'Rinku\'s first six!',
      description: 'Rinku Singh deposits Maxwell into the stands over long-on. The crowd erupts at Wankhede!',
      timestampSeconds: 400,
      category: 'six',
      involvedPlayers: ['Rinku Singh', 'Glenn Maxwell'],
      importance: 'medium',
      emoji: '🎉',
    },
    {
      id: 'h11',
      title: 'Pandya-Rinku partnership reaches 40',
      description: 'The pair has added 40 runs in just 24 balls, keeping India in the chase with 4 overs remaining.',
      timestampSeconds: 430,
      category: 'partnership',
      involvedPlayers: ['Hardik Pandya', 'Rinku Singh'],
      importance: 'high',
      emoji: '🔥',
    },
    {
      id: 'h12',
      title: 'DRS Review — Australia challenge',
      description: 'Australia review an LBW appeal against Pandya. Ultra-edge shows inside edge — NOT OUT! India survive.',
      timestampSeconds: 460,
      category: 'review',
      involvedPlayers: ['Hardik Pandya', 'Pat Cummins'],
      importance: 'high',
      emoji: '📺',
    },
  ],

  overSummaries: [
    { overNumber: 1, bowler: 'Mitchell Starc', runs: 8, wickets: 0, extras: 1, commentary: 'Rohit attacks from ball one, hitting two fours.', timestampStart: 0, timestampEnd: 30 },
    { overNumber: 2, bowler: 'Josh Hazlewood', runs: 6, wickets: 0, extras: 0, commentary: 'Jaiswal finds a boundary through point.', timestampStart: 30, timestampEnd: 50 },
    { overNumber: 3, bowler: 'Mitchell Starc', runs: 4, wickets: 0, extras: 0, commentary: 'Tight over from Starc, only one boundary.', timestampStart: 50, timestampEnd: 55 },
    { overNumber: 4, bowler: 'Mitchell Starc', runs: 2, wickets: 1, extras: 0, commentary: 'Starc bowls Jaiswal with a beautiful inswinger!', timestampStart: 55, timestampEnd: 70 },
    { overNumber: 5, bowler: 'Pat Cummins', runs: 10, wickets: 0, extras: 0, commentary: 'Rohit slams Cummins for two fours and a six.', timestampStart: 70, timestampEnd: 90 },
    { overNumber: 6, bowler: 'Josh Hazlewood', runs: 7, wickets: 0, extras: 1, commentary: 'Powerplay ends. India 37/1.', timestampStart: 90, timestampEnd: 100 },
    { overNumber: 7, bowler: 'Adam Zampa', runs: 8, wickets: 0, extras: 0, commentary: 'Kohli takes on Zampa, smashing a four through mid-off.', timestampStart: 100, timestampEnd: 120 },
    { overNumber: 8, bowler: 'Glenn Maxwell', runs: 12, wickets: 0, extras: 0, commentary: 'Rohit hits Maxwell for two sixes! Partnership crosses 50.', timestampStart: 120, timestampEnd: 150 },
    { overNumber: 9, bowler: 'Adam Zampa', runs: 5, wickets: 1, extras: 0, commentary: 'Zampa has the last laugh — Maxwell catches Rohit at long-on.', timestampStart: 150, timestampEnd: 190 },
    { overNumber: 10, bowler: 'Pat Cummins', runs: 6, wickets: 0, extras: 0, commentary: 'Kohli and Suryakumar rotate strike well.', timestampStart: 190, timestampEnd: 220 },
    { overNumber: 11, bowler: 'Adam Zampa', runs: 7, wickets: 0, extras: 0, commentary: 'Kohli drives elegantly, looking in superb touch.', timestampStart: 220, timestampEnd: 245 },
    { overNumber: 12, bowler: 'Pat Cummins', runs: 3, wickets: 1, extras: 0, commentary: 'Cummins yorker gets Kohli LBW! Massive wicket.', timestampStart: 245, timestampEnd: 270 },
    { overNumber: 13, bowler: 'Josh Hazlewood', runs: 6, wickets: 1, extras: 0, commentary: 'SKY edges behind, India wobbling at 118/4.', timestampStart: 270, timestampEnd: 320 },
    { overNumber: 14, bowler: 'Mitchell Starc', runs: 14, wickets: 0, extras: 0, commentary: 'Pandya counter-attacks brilliantly, three fours!', timestampStart: 320, timestampEnd: 370 },
    { overNumber: 15, bowler: 'Glenn Maxwell', runs: 10, wickets: 0, extras: 0, commentary: 'Rinku joins the party, hitting a huge six over long-on.', timestampStart: 370, timestampEnd: 410 },
    { overNumber: 16, bowler: 'Adam Zampa', runs: 7, wickets: 0, extras: 0, commentary: 'Pandya and Rinku keep the scoreboard ticking. DRS review survives.', timestampStart: 410, timestampEnd: 465 },
  ],

  // Pre-computed insights keyed by topic, so the AI doesn't need to generate them
  contextInsights: {
    momentum:
      'India lost momentum with three wickets between overs 9–13. The Pandya-Rinku partnership has restored the required run rate from 12.5 to 7.9 runs per over. Australia\'s bowlers are under pressure.',
    required_rate:
      'India need 29 runs from 22 balls (3.4 overs). Current run rate is 9.58. Required rate is 7.91. This is well within reach if no more wickets fall.',
    top_performer_india:
      'Rohit Sharma scored 42 off 28 (SR 150.0) and set the platform. Currently, Hardik Pandya is the most impactful batsman with 31 off 16 balls at a strike rate of 193.8.',
    top_performer_australia:
      'Adam Zampa has been Australia\'s best bowler with 1/35 in 4 overs. Pat Cummins delivered the key wicket of Kohli. Starc was expensive (1/38) but got the early breakthrough.',
    powerplay:
      'India scored 37/1 in the powerplay. Jaiswal\'s early dismissal was the only setback. Rohit was aggressive from ball one.',
    death_overs:
      'Australia have 3.4 overs remaining. Starc and Hazlewood typically bowl at the death. With Pandya\'s hitting ability, India are favourites but one wicket could change the dynamics.',
    head_to_head:
      'In T20Is, India lead the head-to-head 18-12 against Australia. At Wankhede, India have won 5 of their last 6 T20I matches.',
    kohli_dismissal:
      'Kohli was dismissed LBW by Cummins in the 12th over for 34 off 22 balls. The ball was a yorker-length delivery that caught him plumb in front. DRS confirmed it was hitting middle stump.',
    partnership_analysis:
      'The current Pandya-Rinku partnership is worth 47 runs off 28 balls. Before this, the best partnership was Rohit-Kohli\'s 52 off 32 balls. India need these two to stay till the end.',
    match_situation:
      'This is a classic T20 chase. India were cruising at 90/1 after 8 overs, then lost 3 wickets for 28 runs (overs 9–13). Pandya\'s counter-attack has brought India back. The next 2 overs will be decisive.',
  },
};

// ---------------------------------------------------------------------------
// Helper — get events relevant to a given video timestamp
// ---------------------------------------------------------------------------
export function getRelevantHighlights(
  currentTimestamp: number,
  windowSeconds: number = 60,
): HighlightEvent[] {
  return demoMatchData.highlights.filter(
    (h) =>
      h.timestampSeconds >= currentTimestamp - windowSeconds &&
      h.timestampSeconds <= currentTimestamp + windowSeconds,
  );
}

export function getCurrentOver(currentTimestamp: number): OverSummary | undefined {
  return demoMatchData.overSummaries.find(
    (o) => currentTimestamp >= o.timestampStart && currentTimestamp <= o.timestampEnd,
  );
}

export function getPlayerByName(name: string): PlayerStats | undefined {
  return demoMatchData.players.find(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  );
}
