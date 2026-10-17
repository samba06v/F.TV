import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationScrollView,
  SpatialNavigationNode,
} from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { useMenuContext } from '../components/MenuContext';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { safeZones } from '../theme';

const LIVE_CHANNELS = [
  {
    id: 'ch-1',
    channel: 'CH 101',
    name: 'Fire Sports HD',
    program: 'India vs Australia — 3rd T20I (Live)',
    category: 'Live Sports',
    badge: 'LIVE',
    viewAI: true,
  },
  {
    id: 'ch-2',
    channel: 'CH 102',
    name: 'Vega Tech 24/7',
    program: 'Building for Fire OS & Vega with MCP',
    category: 'Tech',
    badge: 'STREAM',
    viewAI: true,
  },
  {
    id: 'ch-3',
    channel: 'CH 103',
    name: 'Prime Cinema',
    program: 'The Builder Tools Quest (4K)',
    category: 'Movies',
    badge: '4K HDR',
    viewAI: false,
  },
  {
    id: 'ch-4',
    channel: 'CH 104',
    name: 'Global Sports Live',
    program: 'Premier League Matchday Recap',
    category: 'Sports',
    badge: 'HIGHLIGHTS',
    viewAI: true,
  },
];

export default function TVScreen() {
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation();

  // Web keyboard: Escape or Backspace goes back to Home
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          // @ts-ignore
          navigation.jumpTo?.('Home');
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [navigation]);

  const goHome = useCallback(() => {
    // @ts-ignore
    navigation.jumpTo?.('Home');
  }, [navigation]);

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
    toggleMenu(true);
  }, [navigation, toggleMenu]);

  return (
    <SpatialNavigationRoot isActive={isActive}>
      <View style={tvStyles.container}>
        {/* Top Header Bar */}
        <View style={tvStyles.topBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable onPress={openDrawer} style={tvStyles.topButton}>
              <Text style={tvStyles.topButtonText}>☰ Menu</Text>
            </Pressable>

            <Pressable onPress={goHome} style={tvStyles.topButton}>
              <Text style={tvStyles.topButtonText}>← Back to Home</Text>
            </Pressable>
          </View>

          <Text style={tvStyles.topBrandText}>
            F.TV · Live Channels
          </Text>
        </View>

        <SpatialNavigationScrollView
          style={tvStyles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={tvStyles.heroHeader}>
            <Text style={tvStyles.heroTitle}>Live TV Guide</Text>
            <Text style={tvStyles.heroSubtitle}>
              Broadcast channels with instant ViewAI Companion analysis
            </Text>
          </View>

          <SpatialNavigationNode orientation="vertical">
            <View style={tvStyles.channelList}>
              {LIVE_CHANNELS.map((ch, index) =>
                index === 0 ? (
                  <DefaultFocus key={ch.id}>
                    <SpatialNavigationFocusableView onSelect={goHome}>
                      {({ isFocused: isChFocused }) => (
                        <Pressable
                          onPress={goHome}
                          style={[
                            tvStyles.channelCard,
                            isChFocused && tvStyles.channelCardFocused,
                          ]}
                        >
                          <View style={tvStyles.channelNumberPill}>
                            <Text style={tvStyles.channelNumberText}>{ch.channel}</Text>
                          </View>

                          <View style={{ flex: 1 }}>
                            <View style={tvStyles.channelMetaRow}>
                              <Text style={tvStyles.channelName}>{ch.name}</Text>
                              <View style={tvStyles.liveBadge}>
                                <Text style={tvStyles.liveBadgeText}>● {ch.badge}</Text>
                              </View>
                              {ch.viewAI && (
                                <View style={tvStyles.aiBadge}>
                                  <Text style={tvStyles.aiBadgeText}>✨ ViewAI Active</Text>
                                </View>
                              )}
                            </View>
                            <Text style={tvStyles.programTitle}>{ch.program}</Text>
                          </View>

                          <Text style={tvStyles.tuneInText}>▶ Tune In</Text>
                        </Pressable>
                      )}
                    </SpatialNavigationFocusableView>
                  </DefaultFocus>
                ) : (
                  <SpatialNavigationFocusableView key={ch.id} onSelect={goHome}>
                    {({ isFocused: isChFocused }) => (
                      <Pressable
                        onPress={goHome}
                        style={[
                          tvStyles.channelCard,
                          isChFocused && tvStyles.channelCardFocused,
                        ]}
                      >
                        <View style={tvStyles.channelNumberPill}>
                          <Text style={tvStyles.channelNumberText}>{ch.channel}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                          <View style={tvStyles.channelMetaRow}>
                            <Text style={tvStyles.channelName}>{ch.name}</Text>
                            <View style={tvStyles.liveBadge}>
                              <Text style={tvStyles.liveBadgeText}>● {ch.badge}</Text>
                            </View>
                            {ch.viewAI && (
                              <View style={tvStyles.aiBadge}>
                                <Text style={tvStyles.aiBadgeText}>✨ ViewAI Active</Text>
                              </View>
                            )}
                          </View>
                          <Text style={tvStyles.programTitle}>{ch.program}</Text>
                        </View>

                        <Text style={tvStyles.tuneInText}>▶ Tune In</Text>
                      </Pressable>
                    )}
                  </SpatialNavigationFocusableView>
                ),
              )}
            </View>
          </SpatialNavigationNode>
        </SpatialNavigationScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const tvStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingTop: scaledPixels(safeZones.titleSafe.vertical),
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaledPixels(12),
    marginBottom: scaledPixels(16),
  },

  topButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(8),
  },

  topButtonText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(16),
    fontWeight: '700',
  },

  topBrandText: {
    color: '#FF9900',
    fontSize: scaledPixels(18),
    fontWeight: '800',
  },

  scrollContent: {
    flex: 1,
  },

  heroHeader: {
    marginBottom: scaledPixels(24),
  },

  heroTitle: {
    fontSize: scaledPixels(42),
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: scaledPixels(8),
  },

  heroSubtitle: {
    fontSize: scaledPixels(20),
    color: '#94A3B8',
  },

  channelList: {
    gap: scaledPixels(16),
    paddingBottom: scaledPixels(40),
  },

  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: scaledPixels(20),
    borderRadius: scaledPixels(12),
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
    gap: scaledPixels(20),
  },

  channelCardFocused: {
    borderColor: '#FFFFFF',
    backgroundColor: '#334155',
    transform: [{ scale: 1.02 }],
    shadowColor: '#00F0FF',
    shadowOpacity: 0.8,
    shadowRadius: scaledPixels(16),
    elevation: 15,
  },

  channelNumberPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(8),
  },

  channelNumberText: {
    color: '#38BDF8',
    fontSize: scaledPixels(18),
    fontWeight: '800',
  },

  channelMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(12),
    marginBottom: scaledPixels(6),
  },

  channelName: {
    color: '#FFFFFF',
    fontSize: scaledPixels(18),
    fontWeight: '800',
  },

  liveBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
  },

  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(12),
    fontWeight: '800',
  },

  aiBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderColor: '#06B6D4',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
  },

  aiBadgeText: {
    color: '#22D3EE',
    fontSize: scaledPixels(12),
    fontWeight: '700',
  },

  programTitle: {
    color: '#CBD5E1',
    fontSize: scaledPixels(16),
    fontWeight: '500',
  },

  tuneInText: {
    color: '#FF9900',
    fontSize: scaledPixels(16),
    fontWeight: '800',
  },
});
