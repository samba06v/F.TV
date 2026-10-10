// ============================================================================
// ViewAI — Highlights Timeline
// Displays the event timeline for the current match. Viewers can browse
// important moments and jump to their associated video timestamps.
// ============================================================================

import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  SpatialNavigationNode,
  SpatialNavigationScrollView,
} from 'react-tv-space-navigation';
import { scaledPixels } from '../../hooks/useScale';
import { colors } from '../../theme/colors';
import { demoMatchData, type HighlightEvent } from '../../data/demoMatchData';
import HighlightCard from './HighlightCard';

interface HighlightsTimelineProps {
  visible: boolean;
  currentTimestamp: number;
  onSeekTo: (timestampSeconds: number) => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Filter Tabs (pre-defined, no state needed for demo)
// ---------------------------------------------------------------------------

type FilterCategory = 'all' | 'wicket' | 'boundary' | 'six' | 'milestone' | 'partnership';

const FILTER_LABELS: Record<FilterCategory, string> = {
  all: '🔥 All',
  wicket: '🏏 Wickets',
  boundary: '🎯 Fours',
  six: '💥 Sixes',
  milestone: '🌟 Milestones',
  partnership: '🤝 Partnerships',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HighlightsTimeline: React.FC<HighlightsTimelineProps> = React.memo(
  ({ visible, currentTimestamp, onSeekTo, onClose }) => {
    const [activeFilter, setActiveFilter] = React.useState<FilterCategory>('all');

    const filteredHighlights = useMemo(() => {
      if (activeFilter === 'all') return demoMatchData.highlights;
      return demoMatchData.highlights.filter((h) => h.category === activeFilter);
    }, [activeFilter]);

    const handleSeek = useCallback(
      (timestamp: number) => {
        onSeekTo(timestamp);
      },
      [onSeekTo],
    );

    // Stats bar
    const stats = useMemo(() => {
      const hl = demoMatchData.highlights;
      return {
        total: hl.length,
        wickets: hl.filter((h) => h.category === 'wicket').length,
        boundaries: hl.filter((h) => h.category === 'boundary' || h.category === 'six').length,
        keyMoments: hl.filter((h) => h.importance === 'high').length,
      };
    }, []);

    if (!visible) return null;

    return (
      <View style={tlStyles.container}>
        {/* Header */}
        <View style={tlStyles.header}>
          <View>
            <Text style={tlStyles.headerTitle}>⚡ Smart Highlights</Text>
            <Text style={tlStyles.headerSubtitle}>
              {stats.total} moments • {stats.keyMoments} key events
            </Text>
          </View>
        </View>

        {/* Stats Strip */}
        <View style={tlStyles.statsStrip}>
          <View style={tlStyles.statItem}>
            <Text style={tlStyles.statValue}>{stats.wickets}</Text>
            <Text style={tlStyles.statLabel}>Wickets</Text>
          </View>
          <View style={[tlStyles.statDivider]} />
          <View style={tlStyles.statItem}>
            <Text style={tlStyles.statValue}>{stats.boundaries}</Text>
            <Text style={tlStyles.statLabel}>Boundaries</Text>
          </View>
          <View style={[tlStyles.statDivider]} />
          <View style={tlStyles.statItem}>
            <Text style={tlStyles.statValue}>{stats.keyMoments}</Text>
            <Text style={tlStyles.statLabel}>Key moments</Text>
          </View>
        </View>

        {/* Event List */}
        <SpatialNavigationScrollView style={tlStyles.scrollArea}>
          <SpatialNavigationNode>
            <View>
              {filteredHighlights.map((event) => (
                <HighlightCard
                  key={event.id}
                  event={event}
                  onSelect={handleSeek}
                  isActive={
                    currentTimestamp >= event.timestampSeconds - 10 &&
                    currentTimestamp <= event.timestampSeconds + 10
                  }
                />
              ))}
            </View>
          </SpatialNavigationNode>
        </SpatialNavigationScrollView>

        {/* Footer hint */}
        <View style={tlStyles.footer}>
          <Text style={tlStyles.footerText}>
            Use ↑↓ to browse • Press OK to jump • Back to close
          </Text>
        </View>
      </View>
    );
  },
);

const tlStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    end: 0,
    width: '38%',
    backgroundColor: 'rgba(10, 10, 15, 0.95)',
    borderStartWidth: scaledPixels(2),
    borderStartColor: 'rgba(255, 149, 0, 0.4)',
    zIndex: 100,
    paddingHorizontal: scaledPixels(18),
    paddingTop: scaledPixels(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaledPixels(12),
    paddingBottom: scaledPixels(10),
    borderBottomWidth: scaledPixels(1),
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
  statsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scaledPixels(12),
    padding: scaledPixels(12),
    marginBottom: scaledPixels(14),
    borderWidth: scaledPixels(1),
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFD60A',
    fontSize: scaledPixels(22),
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textTertiary,
    fontSize: scaledPixels(12),
    marginTop: scaledPixels(2),
    fontWeight: '600',
  },
  statDivider: {
    width: scaledPixels(1),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  scrollArea: {
    flex: 1,
  },
  footer: {
    paddingVertical: scaledPixels(10),
    borderTopWidth: scaledPixels(1),
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerText: {
    color: colors.textTertiary,
    fontSize: scaledPixels(13),
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HighlightsTimeline;
