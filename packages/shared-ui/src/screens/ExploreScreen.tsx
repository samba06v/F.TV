// ============================================================================
// ViewAI — Explore Screen (repurposed as ViewAI Feature Showcase)
// Displays the platform's AI capabilities and available content categories.
// ============================================================================

import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
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
import { Direction } from '@bam.tech/lrud';
import { useCallback, useState } from 'react';
import { safeZones, colors } from '../theme';
import { getOpenDrawerDirection } from '../utils/rtl';
import { Pressable } from 'react-native';

// Feature cards data
const FEATURES = [
  {
    icon: '🧠',
    title: 'Ask Your Screen',
    description: 'AI companion that answers questions about the content you\'re watching in real-time.',
    category: 'AI-Enhanced Viewing',
    color: '#007AFF',
  },
  {
    icon: '⚡',
    title: 'Smart Highlights',
    description: 'Automatically curated timeline of key moments. Jump to any event with your remote.',
    category: 'Sports Intelligence',
    color: '#FF9F0A',
  },
  {
    icon: '📊',
    title: 'Live Context',
    description: 'Contextual scorecards, player stats, and commentary that update as you watch.',
    category: 'Multi-Modal UX',
    color: '#34C759',
  },
  {
    icon: '🎯',
    title: 'Player Comparison',
    description: 'Compare any two players\' performance with side-by-side verified statistics.',
    category: 'Sports Analytics',
    color: '#FF453A',
  },
  {
    icon: '🤝',
    title: 'Partnership Tracker',
    description: 'Follow batting partnerships in real-time with run rate and ball count.',
    category: 'Cricket Intelligence',
    color: '#BF5AF2',
  },
  {
    icon: '📺',
    title: 'DRS Review Insights',
    description: 'Get instant context when umpire reviews happen — technology overlays and outcomes.',
    category: 'Computer Vision',
    color: '#FFD60A',
  },
];

const CATEGORIES = [
  { icon: '🏏', label: 'Cricket', count: 12 },
  { icon: '⚽', label: 'Football', count: 8 },
  { icon: '🏋️', label: 'Fitness', count: 15 },
  { icon: '👨‍👩‍👧‍👦', label: 'Family', count: 20 },
  { icon: '📚', label: 'Education', count: 10 },
  { icon: '🎬', label: 'Entertainment', count: 25 },
];

export default function ExploreScreen() {
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;
  const navigation = useNavigation();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection() && focusedIndex === 0) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, focusedIndex, navigation],
  );

  return (
    <SpatialNavigationRoot isActive={isActive} onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}>
      <View style={exploreStyles.container}>
        <SpatialNavigationScrollView offsetFromStart={scaledPixels(20)}>
          {/* Hero Section */}
          <View style={exploreStyles.heroSection}>
            <Text style={exploreStyles.heroTag}>VIEWAI PLATFORM</Text>
            <Text style={exploreStyles.heroTitle}>Watch Anything.{'\n'}Understand More.</Text>
            <Text style={exploreStyles.heroSubtitle}>
              AI-powered interactive viewing for Fire TV & Vega OS
            </Text>
          </View>

          {/* Category Chips */}
          <View style={exploreStyles.categoriesSection}>
            <Text style={exploreStyles.sectionTitle}>📂 Content Categories</Text>
            <SpatialNavigationNode>
              <View style={exploreStyles.categoryGrid}>
                {CATEGORIES.map((cat, index) => (
                  <SpatialNavigationFocusableView key={cat.label} onFocus={() => setFocusedIndex(index)}>
                    {({ isFocused }) => (
                      <View style={[exploreStyles.categoryChip, isFocused && exploreStyles.categoryChipFocused]}>
                        <Text style={exploreStyles.categoryIcon}>{cat.icon}</Text>
                        <Text style={[exploreStyles.categoryLabel, isFocused && exploreStyles.categoryLabelFocused]}>
                          {cat.label}
                        </Text>
                        <Text style={exploreStyles.categoryCount}>{cat.count}</Text>
                      </View>
                    )}
                  </SpatialNavigationFocusableView>
                ))}
              </View>
            </SpatialNavigationNode>
          </View>

          {/* Feature Cards */}
          <Text style={exploreStyles.sectionTitle}>🚀 ViewAI Features</Text>
          <SpatialNavigationNode>
            <View style={exploreStyles.featureGrid}>
              {FEATURES.map((feature) => (
                <SpatialNavigationFocusableView key={feature.title}>
                  {({ isFocused }) => (
                    <View
                      style={[
                        exploreStyles.featureCard,
                        isFocused && exploreStyles.featureCardFocused,
                        { borderStartColor: feature.color },
                      ]}
                    >
                      <Text style={exploreStyles.featureIcon}>{feature.icon}</Text>
                      <Text style={[exploreStyles.featureTitle, isFocused && { color: '#FFFFFF' }]}>
                        {feature.title}
                      </Text>
                      <Text style={exploreStyles.featureDescription} numberOfLines={2}>
                        {feature.description}
                      </Text>
                      <View style={[exploreStyles.featureBadge, { backgroundColor: feature.color + '25' }]}>
                        <Text style={[exploreStyles.featureBadgeText, { color: feature.color }]}>
                          {feature.category}
                        </Text>
                      </View>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              ))}
            </View>
          </SpatialNavigationNode>

          {/* Tech Stack */}
          <View style={exploreStyles.techSection}>
            <Text style={exploreStyles.sectionTitle}>🔧 Built With</Text>
            <View style={exploreStyles.techRow}>
              {['React Native', 'TypeScript', 'Fire OS', 'Vega OS', 'Spatial Nav'].map((tech) => (
                <View key={tech} style={exploreStyles.techBadge}>
                  <Text style={exploreStyles.techText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
        </SpatialNavigationScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const exploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingTop: scaledPixels(safeZones.titleSafe.vertical),
  },
  heroSection: {
    paddingVertical: scaledPixels(40),
    paddingHorizontal: scaledPixels(20),
  },
  heroTag: {
    color: colors.primary,
    fontSize: scaledPixels(16),
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: scaledPixels(12),
  },
  heroTitle: {
    color: colors.text,
    fontSize: scaledPixels(48),
    fontWeight: 'bold',
    lineHeight: scaledPixels(58),
    marginBottom: scaledPixels(12),
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: scaledPixels(22),
    fontWeight: '500',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: scaledPixels(28),
    fontWeight: 'bold',
    marginBottom: scaledPixels(16),
    marginTop: scaledPixels(20),
    paddingHorizontal: scaledPixels(20),
  },
  categoriesSection: {
    marginBottom: scaledPixels(10),
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(12),
    paddingHorizontal: scaledPixels(20),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(14),
    borderRadius: scaledPixels(30),
    borderWidth: scaledPixels(2),
    borderColor: 'transparent',
    gap: scaledPixels(8),
  },
  categoryChipFocused: {
    backgroundColor: colors.focusBackground,
    borderColor: colors.focusBackground,
    transform: [{ scale: 1.05 }],
  },
  categoryIcon: {
    fontSize: scaledPixels(22),
  },
  categoryLabel: {
    color: colors.text,
    fontSize: scaledPixels(18),
    fontWeight: '600',
  },
  categoryLabelFocused: {
    color: colors.textOnPrimary,
  },
  categoryCount: {
    color: colors.textTertiary,
    fontSize: scaledPixels(14),
    fontWeight: '500',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(16),
    paddingHorizontal: scaledPixels(20),
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: scaledPixels(16),
    padding: scaledPixels(20),
    width: scaledPixels(380),
    borderStartWidth: scaledPixels(4),
    borderWidth: scaledPixels(2),
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  featureCardFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1.03 }],
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: scaledPixels(16),
    elevation: 10,
  },
  featureIcon: {
    fontSize: scaledPixels(36),
    marginBottom: scaledPixels(10),
  },
  featureTitle: {
    color: colors.text,
    fontSize: scaledPixels(22),
    fontWeight: 'bold',
    marginBottom: scaledPixels(6),
  },
  featureDescription: {
    color: colors.textSecondary,
    fontSize: scaledPixels(15),
    lineHeight: scaledPixels(22),
    marginBottom: scaledPixels(12),
  },
  featureBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(10),
  },
  featureBadgeText: {
    fontSize: scaledPixels(12),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  techSection: {
    marginBottom: scaledPixels(40),
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(10),
    paddingHorizontal: scaledPixels(20),
  },
  techBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(8),
    borderWidth: scaledPixels(1),
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  techText: {
    color: colors.primary,
    fontSize: scaledPixels(14),
    fontWeight: '700',
  },
});
