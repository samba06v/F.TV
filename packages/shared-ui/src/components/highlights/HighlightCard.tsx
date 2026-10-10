// ============================================================================
// ViewAI — Highlight Card
// Individual event card for the timeline. Remote-focusable, shows event
// details, and triggers video seeking on selection.
// ============================================================================

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { scaledPixels } from '../../hooks/useScale';
import { colors } from '../../theme/colors';
import type { HighlightEvent } from '../../data/demoMatchData';

interface HighlightCardProps {
  event: HighlightEvent;
  onSelect: (timestampSeconds: number) => void;
  isActive?: boolean; // true if the player is near this event's timestamp
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const categoryColors: Record<string, string> = {
  wicket: '#FF453A',
  boundary: '#34C759',
  milestone: '#FFD60A',
  six: '#FF9F0A',
  runout: '#FF453A',
  review: '#BF5AF2',
  partnership: '#0A84FF',
  other: '#8E8E93',
};

const HighlightCard: React.FC<HighlightCardProps> = React.memo(
  ({ event, onSelect, isActive = false }) => {
    const accentColor = useMemo(
      () => categoryColors[event.category] || categoryColors.other,
      [event.category],
    );

    return (
      <SpatialNavigationFocusableView onSelect={() => onSelect(event.timestampSeconds)}>
        {({ isFocused }) => (
          <Pressable
            style={[
              cardStyles.container,
              isFocused && cardStyles.containerFocused,
              isActive && cardStyles.containerActive,
              { borderStartColor: accentColor },
            ]}
            onPress={() => onSelect(event.timestampSeconds)}
          >
            <View style={cardStyles.topRow}>
              <Text style={cardStyles.emoji}>{event.emoji}</Text>
              <View style={cardStyles.titleArea}>
                <Text
                  style={[cardStyles.title, isFocused && cardStyles.titleFocused]}
                  numberOfLines={1}
                >
                  {event.title}
                </Text>
                <View style={cardStyles.metaRow}>
                  <Text style={[cardStyles.timestamp, { color: accentColor }]}>
                    ▶ {formatTimestamp(event.timestampSeconds)}
                  </Text>
                  <View style={[cardStyles.categoryBadge, { backgroundColor: accentColor + '30' }]}>
                    <Text style={[cardStyles.categoryText, { color: accentColor }]}>
                      {event.category.toUpperCase()}
                    </Text>
                  </View>
                  {event.importance === 'high' && (
                    <Text style={cardStyles.importanceStar}>⭐</Text>
                  )}
                </View>
              </View>
            </View>
            {isFocused && (
              <Text style={cardStyles.description} numberOfLines={2}>
                {event.description}
              </Text>
            )}
            {isFocused && (
              <Text style={cardStyles.playHint}>Press OK to jump to this moment →</Text>
            )}
          </Pressable>
        )}
      </SpatialNavigationFocusableView>
    );
  },
);

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: scaledPixels(12),
    padding: scaledPixels(14),
    marginBottom: scaledPixels(8),
    borderStartWidth: scaledPixels(4),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
  },
  containerFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1.02 }],
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: scaledPixels(16),
    elevation: 10,
  },
  containerActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: 'rgba(0, 122, 255, 0.4)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: scaledPixels(28),
    marginEnd: scaledPixels(12),
  },
  titleArea: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: scaledPixels(18),
    fontWeight: '700',
    marginBottom: scaledPixels(4),
  },
  titleFocused: {
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(10),
  },
  timestamp: {
    fontSize: scaledPixels(14),
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(8),
  },
  categoryText: {
    fontSize: scaledPixels(11),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  importanceStar: {
    fontSize: scaledPixels(14),
  },
  description: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    lineHeight: scaledPixels(22),
    marginTop: scaledPixels(10),
  },
  playHint: {
    color: colors.primary,
    fontSize: scaledPixels(13),
    fontWeight: '600',
    marginTop: scaledPixels(8),
    textAlign: 'right',
  },
});

export default HighlightCard;
