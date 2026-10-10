// ============================================================================
// ViewAI — AI Companion Panel
// Displays a contextual companion alongside video playback.
// Uses the selected movie's metadata for answers and suggested questions.
// ============================================================================

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';

import {
  SpatialNavigationFocusableView,
  SpatialNavigationScrollView,
} from 'react-tv-space-navigation';

import { scaledPixels } from '../../hooks/useScale';
import { colors } from '../../theme/colors';

import {
  askAI,
  getSuggestedQuestions,
  type AIResponse,
  type ContentContext,
} from '../../services/aiService';

import SuggestedQuestions from './SuggestedQuestions';

// ============================================================================
// Types
// ============================================================================

interface AICompanionPanelProps {
  visible: boolean;
  currentTimestamp: number;
  onClose: () => void;
  onSeekTo?: (timestamp: number) => void;

  // Information about the current movie or show.
  title: string;
  description: string;
  category?: string;
  genres?: string[];
  releaseYear?: number;
  rating?: number;
  ratingCount?: number;
  contentRating?: string;
  duration?: number;
}

type ConversationEntry = {
  id: string;
  question: string;
  response: AIResponse;
  timestamp: number;
};

// ============================================================================
// Utility
// ============================================================================

function formatDuration(duration?: number): string | undefined {
  if (duration === undefined || duration <= 0) {
    return undefined;
  }

  const totalMinutes = Math.floor(duration / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${totalMinutes}m`;
}

// ============================================================================
// Confidence Badge
// ============================================================================

const ConfidenceBadge = React.memo(
  ({
    confidence,
  }: {
    confidence: AIResponse['confidence'];
  }) => {
    const badgeColor = useMemo(() => {
      switch (confidence) {
        case 'verified':
          return {
            bg: 'rgba(52, 199, 89, 0.2)',
            text: '#34C759',
            label: '✓ Verified',
          };

        case 'estimated':
          return {
            bg: 'rgba(255, 149, 0, 0.2)',
            text: '#FF9500',
            label: '~ Estimated',
          };

        case 'unavailable':
          return {
            bg: 'rgba(142, 142, 147, 0.2)',
            text: '#8E8E93',
            label: '? Limited data',
          };
      }
    }, [confidence]);

    return (
      <View
        style={[
          badgeStyles.badge,
          { backgroundColor: badgeColor.bg },
        ]}
      >
        <Text
          style={[
            badgeStyles.text,
            { color: badgeColor.text },
          ]}
        >
          {badgeColor.label}
        </Text>
      </View>
    );
  },
);

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(12),
    alignSelf: 'flex-start',
  },

  text: {
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },
});

// ============================================================================
// AI Response Card
// ============================================================================

const ResponseCard = React.memo(
  ({ entry }: { entry: ConversationEntry }) => {
    return (
      <View style={responseStyles.card}>
        {/* User question */}
        <View style={responseStyles.questionRow}>
          <Text style={responseStyles.questionIcon}>
            🧑
          </Text>

          <Text style={responseStyles.questionText}>
            {entry.question}
          </Text>
        </View>

        {/* AI answer */}
        <View style={responseStyles.answerRow}>
          <Text style={responseStyles.answerIcon}>
            🤖
          </Text>

          <View style={responseStyles.answerContent}>
            <Text style={responseStyles.answerText}>
              {entry.response.answer}
            </Text>

            <View style={responseStyles.metaRow}>
              <ConfidenceBadge
                confidence={entry.response.confidence}
              />

              <Text style={responseStyles.sourceText}>
                Source: {entry.response.source}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const responseStyles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: scaledPixels(16),
    padding: scaledPixels(16),
    marginBottom: scaledPixels(12),
    borderWidth: scaledPixels(1),
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaledPixels(12),
  },

  questionIcon: {
    fontSize: scaledPixels(20),
    marginEnd: scaledPixels(10),
  },

  questionText: {
    color: colors.primary,
    fontSize: scaledPixels(18),
    fontWeight: '700',
    flex: 1,
  },

  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  answerIcon: {
    fontSize: scaledPixels(20),
    marginEnd: scaledPixels(10),
  },

  answerContent: {
    flex: 1,
  },

  answerText: {
    color: colors.text,
    fontSize: scaledPixels(16),
    lineHeight: scaledPixels(24),
    fontWeight: '400',
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: scaledPixels(10),
    gap: scaledPixels(12),
  },

  sourceText: {
    color: colors.textTertiary,
    fontSize: scaledPixels(13),
    fontStyle: 'italic',
  },
});

// ============================================================================
// Main AI Companion Panel
// ============================================================================

const AICompanionPanel: React.FC<AICompanionPanelProps> =
  React.memo(
    ({
      visible,
      currentTimestamp,
      onClose,
      title,
      description,
      category,
      genres,
      releaseYear,
      rating,
      ratingCount,
      contentRating,
      duration,
    }) => {
      const [conversation, setConversation] = useState<
        ConversationEntry[]
      >([]);

      const [isLoading, setIsLoading] = useState(false);

      const slideAnim = useRef(
        new Animated.Value(600),
      ).current;

      // ----------------------------------------------------------------------
      // Create context for the AI service.
      // ----------------------------------------------------------------------

      const contentContext = useMemo<ContentContext>(
        () => ({
          title,
          description,
          category,
          genres,
          releaseYear,
          rating,
          ratingCount,
          contentRating,
          duration,
        }),
        [
          title,
          description,
          category,
          genres,
          releaseYear,
          rating,
          ratingCount,
          contentRating,
          duration,
        ],
      );

      // ----------------------------------------------------------------------
      // Movie metadata shown at the top of the panel.
      // ----------------------------------------------------------------------

      const metadata = useMemo(() => {
        const items: string[] = [];

        if (releaseYear !== undefined) {
          items.push(String(releaseYear));
        }

        if (contentRating) {
          items.push(contentRating);
        }

        if (category) {
          items.push(category);
        }

        if (genres && genres.length > 0) {
          items.push(genres.join(', '));
        }

        if (rating !== undefined && rating > 0) {
          const ratingText = `${rating.toFixed(1)} ★`;

          items.push(
            ratingCount !== undefined && ratingCount > 0
              ? `${ratingText} (${ratingCount.toLocaleString()} ratings)`
              : ratingText,
          );
        }

        const formattedDuration = formatDuration(duration);

        if (formattedDuration) {
          items.push(formattedDuration);
        }

        return items;
      }, [
        releaseYear,
        contentRating,
        category,
        genres,
        rating,
        ratingCount,
        duration,
      ]);

      // ----------------------------------------------------------------------
      // Suggested questions use the current movie's metadata.
      // ----------------------------------------------------------------------

      const suggestedQuestions = useMemo(
        () =>
          getSuggestedQuestions(
            currentTimestamp,
            contentContext,
          ),
        [currentTimestamp, contentContext],
      );

      // ----------------------------------------------------------------------
      // Animate the panel in and out.
      // ----------------------------------------------------------------------

      useEffect(() => {
        if (visible) {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        } else {
          Animated.timing(slideAnim, {
            toValue: 600,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
      }, [visible, slideAnim]);

      // ----------------------------------------------------------------------
      // Ask the AI service a question about the current movie.
      // ----------------------------------------------------------------------

      const handleAskQuestion = useCallback(
        async (question: string) => {
          if (isLoading) {
            return;
          }

          setIsLoading(true);

          try {
            const response = await askAI(
              question,
              currentTimestamp,
              contentContext,
            );

            const entry: ConversationEntry = {
              id: `conv-${Date.now()}`,
              question,
              response,
              timestamp: currentTimestamp,
            };

            setConversation((previous) => [
              entry,
              ...previous,
            ]);
          } catch (error) {
            console.error('AI query failed:', error);

            const errorEntry: ConversationEntry = {
              id: `conv-${Date.now()}`,
              question,
              timestamp: currentTimestamp,
              response: {
                answer:
                  'Sorry, I could not process your question. Please try again.',
                confidence: 'unavailable',
                source: 'Error handling',
              },
            };

            setConversation((previous) => [
              errorEntry,
              ...previous,
            ]);
          } finally {
            setIsLoading(false);
          }
        },
        [
          currentTimestamp,
          contentContext,
          isLoading,
        ],
      );

      // Do not render the panel while it is closed.
      if (!visible) {
        return null;
      }

      return (
        <Animated.View
          style={[
            panelStyles.container,
            {
              transform: [
                {
                  translateX: slideAnim,
                },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={panelStyles.header}>
            <View style={panelStyles.headerLeft}>
              <Text style={panelStyles.headerIcon}>
                🧠
              </Text>

              <View style={panelStyles.headerTextContainer}>
                <Text style={panelStyles.headerTitle}>
                  ViewAI Companion
                </Text>

                <Text
                  style={panelStyles.headerSubtitle}
                  numberOfLines={2}
                >
                  Ask about {title}
                </Text>
              </View>
            </View>

            <SpatialNavigationFocusableView
              onSelect={onClose}
            >
              {({ isFocused }) => (
                <Pressable
                  style={[
                    panelStyles.closeButton,
                    isFocused &&
                      panelStyles.closeButtonFocused,
                  ]}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close AI companion"
                >
                  <Text
                    style={[
                      panelStyles.closeText,
                      isFocused &&
                        panelStyles.closeTextFocused,
                    ]}
                  >
                    ✕
                  </Text>
                </Pressable>
              )}
            </SpatialNavigationFocusableView>
          </View>

          {/* Current movie information */}
          <View style={panelStyles.contentBanner}>
            <Text
              style={panelStyles.contentBannerTitle}
              numberOfLines={2}
            >
              🎬 {title}
            </Text>

            {metadata.length > 0 && (
              <Text style={panelStyles.contentMetadata}>
                {metadata.join(' • ')}
              </Text>
            )}

            <Text
              style={panelStyles.contentDescription}
              numberOfLines={3}
            >
              {description}
            </Text>
          </View>

          {/* Scrollable content */}
          <SpatialNavigationScrollView
            style={panelStyles.scrollArea}
          >
            {/* Suggested questions */}
            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelect={handleAskQuestion}
              isLoading={isLoading}
            />

            {/* Loading indicator */}
            {isLoading && (
              <View style={panelStyles.loadingContainer}>
                <Text style={panelStyles.loadingText}>
                  Thinking about {title}...
                </Text>
              </View>
            )}

            {/* Conversation history */}
            {conversation.length > 0 && (
              <View style={panelStyles.conversationSection}>
                <Text style={panelStyles.sectionTitle}>
                  💬 Conversation
                </Text>

                {conversation.map((entry) => (
                  <ResponseCard
                    key={entry.id}
                    entry={entry}
                  />
                ))}
              </View>
            )}

            {/* Empty state */}
            {conversation.length === 0 && !isLoading && (
              <View style={panelStyles.emptyState}>
                <Text style={panelStyles.emptyIcon}>
                  🎯
                </Text>

                <Text style={panelStyles.emptyTitle}>
                  Your AI Companion
                </Text>

                <Text style={panelStyles.emptyDescription}>
                  Explore insights about {title}. Ask about its
                  description, genre, release year, runtime, or
                  ratings. Your companion will use the information
                  available for this title.
                </Text>
              </View>
            )}
          </SpatialNavigationScrollView>
        </Animated.View>
      );
    },
  );

// ============================================================================
// Styles
// ============================================================================

const panelStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    end: 0,
    width: '42%',
    backgroundColor: 'rgba(10, 10, 15, 0.97)',
    borderStartWidth: scaledPixels(2),
    borderStartColor: 'rgba(0, 122, 255, 0.3)',
    zIndex: 100,
    paddingHorizontal: scaledPixels(20),
    paddingTop: scaledPixels(20),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledPixels(16),
    paddingBottom: scaledPixels(12),
    borderBottomWidth: scaledPixels(1),
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(12),
    flex: 1,
    marginEnd: scaledPixels(12),
  },

  headerTextContainer: {
    flex: 1,
  },

  headerIcon: {
    fontSize: scaledPixels(32),
  },

  headerTitle: {
    color: colors.text,
    fontSize: scaledPixels(24),
    fontWeight: 'bold',
  },

  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(14),
    marginTop: scaledPixels(2),
  },

  closeButton: {
    width: scaledPixels(44),
    height: scaledPixels(44),
    borderRadius: scaledPixels(22),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },

  closeButtonFocused: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    transform: [{ scale: 1.1 }],
  },

  closeText: {
    color: colors.text,
    fontSize: scaledPixels(20),
    fontWeight: 'bold',
  },

  closeTextFocused: {
    color: '#FFFFFF',
  },

  // Current movie information banner.
  contentBanner: {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    borderRadius: scaledPixels(10),
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(12),
    marginBottom: scaledPixels(12),
    borderWidth: scaledPixels(1),
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },

  contentBannerTitle: {
    color: colors.text,
    fontSize: scaledPixels(18),
    fontWeight: '700',
    textAlign: 'center',
  },

  contentMetadata: {
    color: colors.textSecondary,
    fontSize: scaledPixels(12),
    lineHeight: scaledPixels(18),
    marginTop: scaledPixels(6),
    textAlign: 'center',
  },

  contentDescription: {
    color: colors.textSecondary,
    fontSize: scaledPixels(13),
    lineHeight: scaledPixels(19),
    marginTop: scaledPixels(8),
    textAlign: 'center',
  },

  scrollArea: {
    flex: 1,
  },

  loadingContainer: {
    paddingVertical: scaledPixels(16),
    alignItems: 'center',
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(14),
  },

  conversationSection: {
    marginTop: scaledPixels(16),
  },

  sectionTitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    fontWeight: '600',
    marginBottom: scaledPixels(12),
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaledPixels(40),
    paddingHorizontal: scaledPixels(20),
  },

  emptyIcon: {
    fontSize: scaledPixels(48),
    marginBottom: scaledPixels(16),
  },

  emptyTitle: {
    color: colors.text,
    fontSize: scaledPixels(22),
    fontWeight: 'bold',
    marginBottom: scaledPixels(8),
    textAlign: 'center',
  },

  emptyDescription: {
    color: colors.textSecondary,
    fontSize: scaledPixels(16),
    lineHeight: scaledPixels(24),
    textAlign: 'center',
  },
});

export default AICompanionPanel;