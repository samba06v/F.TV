// Details Screen with scrollbar enabled
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View, Image, Text, Platform, Pressable, ScrollView } from 'react-native';
import { SpatialNavigationRoot, DefaultFocus, SpatialNavigationFocusableView } from 'react-tv-space-navigation';
import { scaledPixels } from '../hooks/useScale';
import { useCallback, useMemo, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { safeZones, colors } from '../theme';
import PlatformLinearGradient from '../components/PlatformLinearGradient';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const {
    title,
    description,
    movie,
    headerImage,
    category,
    genres,
    releaseYear,
    rating,
    ratingCount,
    contentRating,
    duration,
  } = route.params;

  const isFocused = useIsFocused();

  // Keyboard navigation on Web: Escape or Backspace goes back
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          navigation.goBack();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [navigation]);

  // Memoize image source
  const imageSource = useMemo(() => ({ uri: headerImage }), [headerImage]);

  // Format duration
  const formattedDuration = useMemo(() => {
    if (!duration) return '';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  }, [duration]);

  // Format rating display
  const ratingDisplay = useMemo(() => {
    if (!rating) return '';
    return `⭐ ${rating.toFixed(1)} (${ratingCount || 0} reviews)`;
  }, [rating, ratingCount]);

  const navigateToPlayer = useCallback(() => {
    navigation.navigate('Player', {
      movie,
      headerImage,
      title,
      description,
      category,
      genres,
      releaseYear,
      rating,
      ratingCount,
      contentRating,
      duration,
    });
  }, [
    navigation,
    movie,
    headerImage,
    title,
    description,
    category,
    genres,
    releaseYear,
    rating,
    ratingCount,
    contentRating,
    duration,
  ]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SpatialNavigationRoot isActive={isFocused}>
      <View style={detailsStyles.container}>
        {/* Full-bleed Backdrop Image */}
        <Image source={imageSource} style={detailsStyles.backgroundImage} resizeMode="cover" />

        {/* Global image dim overlay */}
        <View style={detailsStyles.imageDimOverlay} />

        {/* Deep Left-to-Right gradient: guarantees 100% text contrast and readability */}
        <PlatformLinearGradient
          colors={[
            'rgba(3, 7, 18, 0.98)',
            'rgba(3, 7, 18, 0.94)',
            'rgba(3, 7, 18, 0.82)',
            'rgba(3, 7, 18, 0.40)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={detailsStyles.gradientLeft}
        />

        {/* Top bar with prominent Back button */}
        <View style={detailsStyles.topBar}>
          <SpatialNavigationFocusableView onSelect={goBack}>
            {({ isFocused: isBackFocused }) => (
              <Pressable
                onPress={goBack}
                style={[
                  detailsStyles.backButton,
                  isBackFocused && detailsStyles.backButtonFocused,
                ]}
              >
                <Text
                  style={[
                    detailsStyles.backButtonText,
                    isBackFocused && detailsStyles.backButtonTextFocused,
                  ]}
                >
                  ← Back to Browse
                </Text>
              </Pressable>
            )}
          </SpatialNavigationFocusableView>

          <View style={detailsStyles.topBadgeRow}>
            <View style={detailsStyles.badgeAI}>
              <Text style={detailsStyles.badgeAIText}>✨ ViewAI Companion Enabled</Text>
            </View>
            <Text style={detailsStyles.techBadge}>4K ULTRA HD</Text>
          </View>
        </View>

        <ScrollView
          style={detailsStyles.contentContainer}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: scaledPixels(40) }}
        >
          <View style={detailsStyles.topContent}>
            {/* Badges / metadata */}
            <View style={detailsStyles.metadataRow}>
              {contentRating && (
                <View style={detailsStyles.ratingPill}>
                  <Text style={detailsStyles.ratingPillText}>{contentRating}</Text>
                </View>
              )}
              {releaseYear && (
                <Text style={detailsStyles.metadataText}>{releaseYear}</Text>
              )}
              {formattedDuration && (
                <Text style={detailsStyles.metadataText}>{formattedDuration}</Text>
              )}
              {ratingDisplay && (
                <Text style={detailsStyles.ratingText}>{ratingDisplay}</Text>
              )}
            </View>

            {/* Title */}
            <Text style={detailsStyles.title} numberOfLines={2}>
              {title}
            </Text>

            {/* Genres */}
            {genres && genres.length > 0 && (
              <View style={detailsStyles.genresContainer}>
                {genres.map((genre, index) => (
                  <View key={index} style={detailsStyles.genreTag}>
                    <Text style={detailsStyles.genreText}>{genre}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Synopsis */}
            <Text style={detailsStyles.description}>{description}</Text>

            {/* Contextual Specs & Info */}
            <View style={detailsStyles.crewContainer}>
              <View style={detailsStyles.crewMember}>
                <Text style={detailsStyles.crewRole}>Platform</Text>
                <Text style={detailsStyles.crewName}>Fire OS · Vega OS</Text>
              </View>
              <View style={detailsStyles.crewMember}>
                <Text style={detailsStyles.crewRole}>Experience</Text>
                <Text style={detailsStyles.crewName}>ViewAI Interactive</Text>
              </View>
              <View style={detailsStyles.crewMember}>
                <Text style={detailsStyles.crewRole}>Quality</Text>
                <Text style={detailsStyles.crewName}>4K UHD · HDR</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons Row */}
          <View style={detailsStyles.actionRow}>
            <DefaultFocus>
              <SpatialNavigationFocusableView onSelect={navigateToPlayer}>
                {({ isFocused: isPlayFocused }) => (
                  <Pressable
                    onPress={navigateToPlayer}
                    style={[
                      detailsStyles.playButton,
                      isPlayFocused && detailsStyles.playButtonFocused,
                    ]}
                  >
                    <Text
                      style={[
                        detailsStyles.playButtonText,
                        isPlayFocused && detailsStyles.playButtonTextFocused,
                      ]}
                    >
                      ▶  Watch Now
                    </Text>
                  </Pressable>
                )}
              </SpatialNavigationFocusableView>
            </DefaultFocus>

            <SpatialNavigationFocusableView onSelect={navigateToPlayer}>
              {({ isFocused: isAIFocused }) => (
                <Pressable
                  onPress={navigateToPlayer}
                  style={[
                    detailsStyles.aiButton,
                    isAIFocused && detailsStyles.aiButtonFocused,
                  ]}
                >
                  <Text
                    style={[
                      detailsStyles.aiButtonText,
                      isAIFocused && detailsStyles.aiButtonTextFocused,
                    ]}
                  >
                    ✨  Launch with ViewAI Companion
                  </Text>
                </Pressable>
              )}
            </SpatialNavigationFocusableView>
          </View>
        </ScrollView>
      </View>
    </SpatialNavigationRoot>
  );
}

const detailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    position: 'relative',
  },

  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  imageDimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  gradientLeft: {
    position: 'absolute',
    start: 0,
    top: 0,
    bottom: 0,
    width: '78%',
  },

  topBar: {
    position: 'absolute',
    top: scaledPixels(safeZones.titleSafe.vertical),
    start: scaledPixels(safeZones.titleSafe.horizontal),
    end: scaledPixels(safeZones.titleSafe.horizontal),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },

  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(10),
  },

  backButtonFocused: {
    backgroundColor: '#FF9900',
    borderColor: '#FF9900',
    transform: [{ scale: 1.05 }],
    shadowColor: '#FF9900',
    shadowOpacity: 0.9,
    shadowRadius: scaledPixels(16),
    elevation: 15,
  },

  backButtonText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(18),
    fontWeight: '800',
  },

  backButtonTextFocused: {
    color: '#000000',
  },

  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(12),
  },

  badgeAI: {
    backgroundColor: 'rgba(6, 182, 212, 0.18)',
    borderColor: '#06B6D4',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(6),
    borderRadius: scaledPixels(6),
  },

  badgeAIText: {
    color: '#22D3EE',
    fontSize: scaledPixels(14),
    fontWeight: '800',
  },

  techBadge: {
    color: '#94A3B8',
    fontSize: scaledPixels(13),
    fontWeight: '700',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(5),
    borderRadius: scaledPixels(4),
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingTop: scaledPixels(safeZones.titleSafe.vertical + 70),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical),
    justifyContent: 'center',
    zIndex: 10,
    width: '68%',
  },

  topContent: {
    marginBottom: scaledPixels(32),
  },

  title: {
    fontSize: scaledPixels(56),
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: scaledPixels(66),
    marginBottom: scaledPixels(18),
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 16,
  },

  description: {
    fontSize: scaledPixels(22),
    color: '#CBD5E1',
    marginBottom: scaledPixels(26),
    lineHeight: scaledPixels(34),
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },

  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: scaledPixels(14),
    gap: scaledPixels(14),
  },

  ratingPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(4),
  },

  ratingPillText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(14),
    fontWeight: '800',
  },

  metadataText: {
    fontSize: scaledPixels(18),
    color: '#94A3B8',
    fontWeight: '700',
  },

  ratingText: {
    fontSize: scaledPixels(18),
    color: '#FBBF24',
    fontWeight: '700',
  },

  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: scaledPixels(20),
    gap: scaledPixels(10),
  },

  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(6),
    borderRadius: scaledPixels(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  genreText: {
    fontSize: scaledPixels(15),
    color: '#E2E8F0',
    fontWeight: '600',
  },

  crewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(36),
    marginTop: scaledPixels(10),
  },

  crewMember: {
    marginBottom: scaledPixels(8),
  },

  crewRole: {
    fontSize: scaledPixels(15),
    color: '#64748B',
    fontWeight: '600',
    marginBottom: scaledPixels(4),
  },

  crewName: {
    fontSize: scaledPixels(20),
    color: '#F8FAFC',
    fontWeight: '800',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(18),
  },

  playButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: scaledPixels(16),
    paddingHorizontal: scaledPixels(36),
    borderRadius: scaledPixels(10),
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
  },

  playButtonFocused: {
    backgroundColor: '#FF9900',
    borderColor: '#FF9900',
    transform: [{ scale: 1.06 }],
    shadowColor: '#FF9900',
    shadowOpacity: 0.9,
    shadowRadius: scaledPixels(20),
    elevation: 20,
  },

  playButtonText: {
    color: '#000000',
    fontSize: scaledPixels(20),
    fontWeight: '800',
  },

  playButtonTextFocused: {
    color: '#FFFFFF',
  },

  aiButton: {
    backgroundColor: 'rgba(6, 182, 212, 0.18)',
    borderColor: '#06B6D4',
    borderWidth: scaledPixels(2),
    paddingVertical: scaledPixels(16),
    paddingHorizontal: scaledPixels(32),
    borderRadius: scaledPixels(10),
  },

  aiButtonFocused: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(6, 182, 212, 0.5)',
    transform: [{ scale: 1.06 }],
    shadowColor: '#06B6D4',
    shadowOpacity: 0.9,
    shadowRadius: scaledPixels(20),
    elevation: 20,
  },

  aiButtonText: {
    color: '#22D3EE',
    fontSize: scaledPixels(20),
    fontWeight: '800',
  },

  aiButtonTextFocused: {
    color: '#FFFFFF',
  },
});
