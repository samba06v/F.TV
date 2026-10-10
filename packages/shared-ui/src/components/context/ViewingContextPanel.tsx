// ============================================================================
// ViewAI — Viewing Context Panel
// Displays context-aware information about the current match state.
// Appears as a compact overlay at the bottom of the player screen,
// showing relevant stats, current partnership, and suggested actions
// based on what's happening in the match at the current timestamp.
// ============================================================================

import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SpatialNavigationFocusableView, SpatialNavigationNode } from 'react-tv-space-navigation';
import { scaledPixels } from '../../hooks/useScale';
import { colors } from '../../theme/colors';
import { demoMatchData, getRelevantHighlights, getCurrentOver } from '../../data/demoMatchData';

interface ViewingContextPanelProps {
  visible: boolean;
  currentTimestamp: number;
  onOpenAI: () => void;
  onOpenHighlights: () => void;
}

const ViewingContextPanel: React.FC<ViewingContextPanelProps> = React.memo(
  ({ visible, currentTimestamp, onOpenAI, onOpenHighlights }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const ms = demoMatchData.matchState;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [visible, fadeAnim]);

    // Determine contextual action based on current timestamp
    const contextAction = useMemo(() => {
      const nearby = getRelevantHighlights(currentTimestamp, 15);
      if (nearby.length > 0) {
        const latest = nearby[nearby.length - 1];
        if (latest.category === 'wicket') {
          return {
            icon: '🏏',
            text: `${latest.involvedPlayers[0]} just got out! Ask AI for details`,
            actionLabel: 'Ask about this wicket',
          };
        }
        if (latest.category === 'six') {
          return {
            icon: '💥',
            text: `Huge six by ${latest.involvedPlayers[0]}!`,
            actionLabel: 'View player stats',
          };
        }
        if (latest.category === 'partnership') {
          return {
            icon: '🤝',
            text: `${latest.title}`,
            actionLabel: 'Compare players',
          };
        }
        return {
          icon: latest.emoji,
          text: latest.title,
          actionLabel: 'Learn more',
        };
      }
      return null;
    }, [currentTimestamp]);

    const currentOver = useMemo(() => getCurrentOver(currentTimestamp), [currentTimestamp]);

    if (!visible) return null;

    return (
      <Animated.View style={[ctxStyles.container, { opacity: fadeAnim }]}>
        {/* Live Score + Match Info */}
        <View style={ctxStyles.scoreSection}>
          <View style={ctxStyles.scoreMain}>
            <Text style={ctxStyles.teamName}>🇮🇳 INDIA</Text>
            <Text style={ctxStyles.scoreText}>
              {ms.currentScore.runs}/{ms.currentScore.wickets}
            </Text>
            <Text style={ctxStyles.oversText}>
              ({ms.currentScore.overs}.{ms.currentScore.balls} ov)
            </Text>
          </View>
          <View style={ctxStyles.scoreMeta}>
            <Text style={ctxStyles.targetText}>
              Target: {ms.currentScore.target} • RR: {ms.currentScore.runRate.toFixed(2)}
            </Text>
            <Text style={ctxStyles.partnershipText}>
              🤝 {ms.partnership.batsman1} & {ms.partnership.batsman2}: {ms.partnership.runs}({ms.partnership.balls})
            </Text>
          </View>
        </View>

        {/* Context Action (if relevant) */}
        {contextAction && (
          <View style={ctxStyles.contextBanner}>
            <Text style={ctxStyles.contextIcon}>{contextAction.icon}</Text>
            <Text style={ctxStyles.contextText} numberOfLines={1}>
              {contextAction.text}
            </Text>
          </View>
        )}

        {/* Current Over Commentary */}
        {currentOver && (
          <View style={ctxStyles.overSection}>
            <Text style={ctxStyles.overLabel}>
              Over {currentOver.overNumber} • {currentOver.bowler}
            </Text>
            <Text style={ctxStyles.overCommentary} numberOfLines={1}>
              {currentOver.commentary}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <SpatialNavigationNode>
          <View style={ctxStyles.actionsRow}>
            <SpatialNavigationFocusableView onSelect={onOpenAI}>
              {({ isFocused }) => (
                <View style={[ctxStyles.actionButton, ctxStyles.aiButton, isFocused && ctxStyles.actionButtonFocused]}>
                  <Text style={[ctxStyles.actionButtonText, isFocused && ctxStyles.actionButtonTextFocused]}>
                    🧠 Ask AI
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>
            <SpatialNavigationFocusableView onSelect={onOpenHighlights}>
              {({ isFocused }) => (
                <View style={[ctxStyles.actionButton, ctxStyles.highlightsButton, isFocused && ctxStyles.actionButtonFocused]}>
                  <Text style={[ctxStyles.actionButtonText, isFocused && ctxStyles.actionButtonTextFocused]}>
                    ⚡ Highlights
                  </Text>
                </View>
              )}
            </SpatialNavigationFocusableView>
          </View>
        </SpatialNavigationNode>
      </Animated.View>
    );
  },
);

const ctxStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: scaledPixels(80),
    start: scaledPixels(40),
    end: scaledPixels(40),
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: scaledPixels(16),
    padding: scaledPixels(16),
    borderWidth: scaledPixels(1),
    borderColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 50,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledPixels(10),
  },
  scoreMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: scaledPixels(10),
  },
  teamName: {
    color: colors.text,
    fontSize: scaledPixels(18),
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreText: {
    color: '#FFD60A',
    fontSize: scaledPixels(28),
    fontWeight: 'bold',
  },
  oversText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(16),
    fontWeight: '500',
  },
  scoreMeta: {
    alignItems: 'flex-end',
  },
  targetText: {
    color: colors.textSecondary,
    fontSize: scaledPixels(14),
    fontWeight: '600',
  },
  partnershipText: {
    color: colors.textTertiary,
    fontSize: scaledPixels(13),
    marginTop: scaledPixels(2),
  },
  contextBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderRadius: scaledPixels(10),
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(8),
    marginBottom: scaledPixels(10),
    borderWidth: scaledPixels(1),
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  contextIcon: {
    fontSize: scaledPixels(18),
    marginEnd: scaledPixels(8),
  },
  contextText: {
    color: colors.text,
    fontSize: scaledPixels(15),
    fontWeight: '600',
    flex: 1,
  },
  overSection: {
    marginBottom: scaledPixels(10),
    paddingTop: scaledPixels(8),
    borderTopWidth: scaledPixels(1),
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  overLabel: {
    color: colors.primary,
    fontSize: scaledPixels(13),
    fontWeight: '700',
    marginBottom: scaledPixels(2),
  },
  overCommentary: {
    color: colors.textSecondary,
    fontSize: scaledPixels(14),
    fontWeight: '400',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: scaledPixels(12),
  },
  actionButton: {
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(12),
    borderRadius: scaledPixels(24),
    borderWidth: scaledPixels(2),
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  aiButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  highlightsButton: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
  },
  actionButtonFocused: {
    backgroundColor: colors.focusBackground,
    borderColor: colors.focusBackground,
    transform: [{ scale: 1.08 }],
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: scaledPixels(12),
    elevation: 8,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: scaledPixels(16),
    fontWeight: '700',
  },
  actionButtonTextFocused: {
    color: colors.textOnPrimary,
  },
});

export default ViewingContextPanel;
