// Main App Navigator
export { default as AppNavigator } from './navigation/AppNavigator';
export type { AppNavigatorProps } from './navigation/AppNavigator';

// Theme
export * from './theme';

// Components
export { default as FocusablePressable } from './components/FocusablePressable';
export { default as LoadingIndicator } from './components/LoadingIndicator';
export { MenuProvider, useMenuContext } from './components/MenuContext';
export { default as CustomDrawerContent } from './components/CustomDrawerContent';

// ViewAI Components
export { default as AICompanionPanel } from './components/ai/AICompanionPanel';
export { default as SuggestedQuestions } from './components/ai/SuggestedQuestions';
export { default as HighlightsTimeline } from './components/highlights/HighlightsTimeline';
export { default as HighlightCard } from './components/highlights/HighlightCard';
export { default as ViewingContextPanel } from './components/context/ViewingContextPanel';

// Screens
export { default as HomeScreen } from './screens/HomeScreen';
export { default as DetailsScreen } from './screens/DetailsScreen';
export { default as PlayerScreen } from './screens/PlayerScreen';
export { default as ExploreScreen } from './screens/ExploreScreen';
export { default as TVScreen } from './screens/TVScreen';
export { default as SettingsScreen } from './screens/SettingsScreen';

// Utils
export { VideoHandler } from './utils/VideoHandler';
export { isRTL, getOpenDrawerDirection, getCloseDrawerDirection } from './utils/rtl';

// Navigation
export { default as RootNavigator } from './navigation/RootNavigator';
export { default as DrawerNavigator } from './navigation/DrawerNavigator';
export * from './navigation/types';

// Hooks
export { scaledPixels } from './hooks/useScale';

// ViewAI Services
export { askAI, getSuggestedQuestions } from './services/aiService';
export type { AIResponse, QuestionCategory } from './services/aiService';

// ViewAI Data
export { demoMatchData, getRelevantHighlights, getCurrentOver, getPlayerByName } from './data/demoMatchData';
export type { DemoMatch, HighlightEvent, PlayerStats, MatchState, OverSummary } from './data/demoMatchData';
