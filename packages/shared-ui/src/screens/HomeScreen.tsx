import { StyleSheet, View, Image, Text, Pressable, TextInput } from 'react-native';
import { useNavigation, DrawerActions, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState, useEffect } from 'react';

import { useMenuContext } from '../components/MenuContext';

import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationScrollView,
  SpatialNavigationNode,
  SpatialNavigationVirtualizedList,
  DefaultFocus,
} from 'react-tv-space-navigation';

import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { RootStackParamList } from '../navigation/types';
import {
  fetchMoviesData,
  CardData,
  SPORTS_CATALOG,
  MOVIES_CATALOG,
  ALL_CONTENT,
} from '../data/moviesData';
import { colors, safeZones } from '../theme';
import PlatformLinearGradient from '../components/PlatformLinearGradient';
import { getOpenDrawerDirection } from '../utils/rtl';
import AIAssistantModal from '../components/ai/AIAssistantModal';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DrawerNavigator'
>;

// Memoized MovieItem component with high-contrast TV card styling
const MovieItem = React.memo(
  ({
    item,
    isFocused,
    styles,
  }: {
    item: CardData;
    isFocused: boolean;
    styles: any;
  }) => {
    const imageSource = useMemo(
      () => ({ uri: item.headerImage }),
      [item.headerImage],
    );

    const isLive = item.isLive || item.contentRating === 'LIVE';

    return (
      <View
        style={[
          styles.highlightThumbnail,
          isFocused && styles.highlightThumbnailFocused,
        ]}
      >
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Card bottom vignette for high-contrast title readability */}
        <PlatformLinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.55)', 'rgba(0, 0, 0, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cardGradient}
        />

        {/* Top badge on card: LIVE or Sport or Category */}
        {isLive ? (
          <View style={styles.cardLiveBadge}>
            <Text style={styles.cardLiveBadgeText}>● LIVE</Text>
          </View>
        ) : item.sportType ? (
          <View style={styles.cardCategoryBadge}>
            <Text style={styles.cardCategoryBadgeText}>{item.sportType}</Text>
          </View>
        ) : item.ageRating ? (
          <View style={styles.cardCategoryBadge}>
            <Text style={styles.cardCategoryBadgeText}>{item.ageRating}</Text>
          </View>
        ) : null}

        {/* Card Title & Meta Info */}
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.cardMetaRow}>
            {item.rating ? (
              <Text style={styles.cardMetaRating}>⭐ {item.rating.toFixed(1)}</Text>
            ) : null}
            <Text style={styles.cardMetaText}>
              {item.releaseYear ? `${item.releaseYear}` : 'Fire TV'}
            </Text>
            {item.ageRating || item.contentRating ? (
              <Text style={styles.cardRatingPill}>
                {item.ageRating || item.contentRating}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  },
);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();

  const [activeTab, setActiveTab] = useState<'home' | 'sports' | 'ai' | 'movies'>('home');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Sports Manual Search & Sort States
  const [sportsSearch, setSportsSearch] = useState('');
  const [sportsFilter, setSportsFilter] = useState<string>('all');

  // Movies Manual Search & Sort States
  const [moviesSearch, setMoviesSearch] = useState('');
  const [moviesGenreFilter, setMoviesGenreFilter] = useState<string>('all');
  const [moviesAgeFilter, setMoviesAgeFilter] = useState<number | undefined>(undefined);

  // AI Assistant Modal State
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiModalCategory, setAiModalCategory] = useState<'sports' | 'movies'>('movies');

  const isFocused = useIsFocused();
  const isActive = isFocused && !isMenuOpen;

  // Active pool depending on tab:
  // - 'sports': strictly SPORTS_CATALOG
  // - 'movies': strictly MOVIES_CATALOG
  // - 'home': ALL_CONTENT
  const currentTabPool = useMemo(() => {
    if (activeTab === 'sports') return SPORTS_CATALOG;
    if (activeTab === 'movies') return MOVIES_CATALOG;
    return ALL_CONTENT;
  }, [activeTab]);

  // Filtered Sports based on manual search and manual sort
  const filteredSports = useMemo(() => {
    let list = [...SPORTS_CATALOG];
    if (sportsSearch.trim()) {
      const q = sportsSearch.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.sportType?.toLowerCase().includes(q) ||
          s.genres?.some((g) => g.toLowerCase().includes(q)),
      );
    }
    if (sportsFilter === 'live') {
      list = list.filter((s) => s.isLive);
    } else if (sportsFilter === 'cricket') {
      list = list.filter((s) => s.sportType === 'Cricket');
    } else if (sportsFilter === 'football') {
      list = list.filter((s) => s.sportType === 'Football');
    } else if (sportsFilter === 'f1') {
      list = list.filter((s) => s.sportType === 'F1');
    } else if (sportsFilter === 'basketball') {
      list = list.filter((s) => s.sportType === 'Basketball');
    } else if (sportsFilter === 'tennis') {
      list = list.filter((s) => s.sportType === 'Tennis');
    } else if (sportsFilter === 'rating') {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    return list;
  }, [sportsSearch, sportsFilter]);

  // Filtered Movies based on manual search, genre filter, and age safety filter
  const filteredMovies = useMemo(() => {
    let list = [...MOVIES_CATALOG];
    if (moviesSearch.trim()) {
      const q = moviesSearch.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.genres?.some((g) => g.toLowerCase().includes(q)) ||
          m.plotThemes?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (moviesGenreFilter === 'scifi') {
      list = list.filter((m) => m.genres?.includes('Sci-Fi'));
    } else if (moviesGenreFilter === 'action') {
      list = list.filter((m) => m.genres?.includes('Action'));
    } else if (moviesGenreFilter === 'animation') {
      list = list.filter((m) => m.genres?.includes('Animation'));
    } else if (moviesGenreFilter === 'rating') {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    // Apply age safety filter
    if (moviesAgeFilter !== undefined) {
      list = list.filter((m) => (m.targetAgeMin ?? 0) <= moviesAgeFilter);
    }

    return list;
  }, [moviesSearch, moviesGenreFilter, moviesAgeFilter]);

  // Focused item for Hero
  const focusedItem = useMemo(() => {
    if (activeTab === 'sports') {
      return filteredSports[focusedIndex] || filteredSports[0] || SPORTS_CATALOG[0];
    }
    if (activeTab === 'movies') {
      return filteredMovies[focusedIndex] || filteredMovies[0] || MOVIES_CATALOG[0];
    }
    return ALL_CONTENT[focusedIndex] || ALL_CONTENT[0];
  }, [activeTab, focusedIndex, filteredSports, filteredMovies]);

  // Reset focused index when switching tab
  useEffect(() => {
    setFocusedIndex(0);
  }, [activeTab]);

  // Memoize header image source
  const headerImageSource = useMemo(
    () => (focusedItem ? { uri: focusedItem.headerImage } : undefined),
    [focusedItem?.headerImage],
  );

  const navigateToPlayerWithItem = useCallback(
    (item: CardData) => {
      navigation.navigate('Player', {
        title: item.title,
        description: item.description,
        headerImage: item.headerImage,
        movie: item.movie,
        category: item.category,
        genres: item.genres,
        releaseYear: item.releaseYear,
        rating: item.rating,
        ratingCount: item.ratingCount,
        contentRating: item.contentRating,
        duration: item.duration,
      });
    },
    [navigation],
  );

  const navigateToDetailsWithItem = useCallback(
    (item: CardData) => {
      navigation.navigate('Details', {
        title: item.title,
        description: item.description,
        headerImage: item.headerImage,
        movie: item.movie,
        category: item.category,
        genres: item.genres,
        releaseYear: item.releaseYear,
        rating: item.rating,
        ratingCount: item.ratingCount,
        contentRating: item.contentRating,
        duration: item.duration,
      });
    },
    [navigation],
  );

  const navigateToPlayer = useCallback(() => {
    if (!focusedItem) return;
    navigateToPlayerWithItem(focusedItem);
  }, [focusedItem, navigateToPlayerWithItem]);

  const navigateToDetails = useCallback(() => {
    if (!focusedItem) return;
    navigateToDetailsWithItem(focusedItem);
  }, [focusedItem, navigateToDetailsWithItem]);

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
    toggleMenu(true);
  }, [navigation, toggleMenu]);

  // Open AI Assistant modal
  const openAIAssistant = useCallback(
    (category: 'sports' | 'movies') => {
      setAiModalCategory(category);
      setAiModalVisible(true);
    },
    [],
  );

  // Tab click actions
  const handleTabClick = useCallback(
    (tab: 'home' | 'sports' | 'ai' | 'movies') => {
      if (tab === 'ai') {
        openAIAssistant('movies');
        return;
      }
      setActiveTab(tab);
      setFocusedIndex(0);
    },
    [openAIAssistant],
  );

  const renderHeader = useCallback(() => {
    if (!focusedItem) return null;

    const isLive = focusedItem.isLive || focusedItem.contentRating === 'LIVE';

    return (
      <View style={gridStyles.header}>
        {/* Full-bleed Hero Visual */}
        <Image
          style={gridStyles.headerImage}
          source={headerImageSource}
          resizeMode="cover"
        />

        {/* Global image dim overlay */}
        <View style={gridStyles.imageDimOverlay} />

        {/* Heavy Left-to-Right gradient: guarantees 100% text contrast and readability */}
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
          style={gridStyles.gradientLeft}
        />

        {/* Bottom gradient scrim: seamlessly melts hero into the horizontal rails */}
        <PlatformLinearGradient
          colors={[
            'transparent',
            'rgba(3, 7, 18, 0.4)',
            'rgba(3, 7, 18, 0.85)',
            colors.background,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={gridStyles.gradientBottom}
        />

        {/* Top Header & Branding Bar */}
        <View style={gridStyles.topBar}>
          <View style={gridStyles.brandContainer}>
            {/* Clickable Menu button to open Left Drawer anytime */}
            <Pressable onPress={openDrawer} style={gridStyles.menuButton}>
              <Text style={gridStyles.menuButtonText}>☰ Menu</Text>
            </Pressable>

            <Text style={gridStyles.brandLogo}>
              F<Text style={gridStyles.brandAccent}>.TV</Text>
            </Text>
            <View style={gridStyles.platformBadge}>
              <Text style={gridStyles.platformBadgeText}>FIRE TV · VEGA OS</Text>
            </View>
          </View>

          {/* Navigation Chips */}
          <View style={gridStyles.topNavChips}>
            <Pressable
              onPress={() => handleTabClick('home')}
              style={[
                gridStyles.navChip,
                activeTab === 'home' && gridStyles.navChipActive,
              ]}
            >
              <Text
                style={[
                  gridStyles.navChipText,
                  activeTab === 'home' && gridStyles.navChipTextActive,
                ]}
              >
                🏠 Home
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleTabClick('sports')}
              style={[
                gridStyles.navChip,
                activeTab === 'sports' && gridStyles.navChipActive,
              ]}
            >
              <Text
                style={[
                  gridStyles.navChipText,
                  activeTab === 'sports' && gridStyles.navChipTextActive,
                ]}
              >
                ⚡ Live Sports
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleTabClick('movies')}
              style={[
                gridStyles.navChip,
                activeTab === 'movies' && gridStyles.navChipActive,
              ]}
            >
              <Text
                style={[
                  gridStyles.navChipText,
                  activeTab === 'movies' && gridStyles.navChipTextActive,
                ]}
              >
                🎬 Movies
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleTabClick('ai')}
              style={[
                gridStyles.navChip,
                gridStyles.navChipAI,
              ]}
            >
              <Text style={gridStyles.navChipAIText}>
                ✨ ViewAI Assistant
              </Text>
            </Pressable>
          </View>

          <View style={gridStyles.topRightMeta}>
            <Text style={gridStyles.techBadge}>4K UHD</Text>
            <Text style={gridStyles.techBadge}>DOLBY VISION</Text>
          </View>
        </View>

        {/* Hero Content Information Panel */}
        <View style={gridStyles.headerTextContainer}>
          {/* Metadata Badges Row */}
          <View style={gridStyles.badgeRow}>
            {isLive ? (
              <View style={gridStyles.badgeLive}>
                <Text style={gridStyles.badgeLiveText}>● LIVE NOW</Text>
              </View>
            ) : (
              <View style={gridStyles.badgeTrending}>
                <Text style={gridStyles.badgeTrendingText}>
                  {activeTab === 'sports' ? '🏆 FEATURED MATCH' : '🔥 BLOCKBUSTER'}
                </Text>
              </View>
            )}

            <View style={gridStyles.badgeAI}>
              <Text style={gridStyles.badgeAIText}>✨ ViewAI Companion Enabled</Text>
            </View>

            {focusedItem.sportType ? (
              <View style={gridStyles.badgeMeta}>
                <Text style={gridStyles.badgeMetaText}>{focusedItem.sportType}</Text>
              </View>
            ) : null}

            {focusedItem.ageRating ? (
              <View style={gridStyles.badgeAge}>
                <Text style={gridStyles.badgeAgeText}>{focusedItem.ageRating}</Text>
              </View>
            ) : null}

            {focusedItem.rating ? (
              <View style={gridStyles.badgeMeta}>
                <Text style={gridStyles.badgeMetaText}>⭐ {focusedItem.rating.toFixed(1)}</Text>
              </View>
            ) : null}

            {focusedItem.releaseYear ? (
              <View style={gridStyles.badgeMeta}>
                <Text style={gridStyles.badgeMetaText}>{focusedItem.releaseYear}</Text>
              </View>
            ) : null}
          </View>

          {/* Hero Title */}
          <Text style={gridStyles.headerTitle} numberOfLines={2}>
            {focusedItem.title}
          </Text>

          {/* Hero Synopsis */}
          <Text style={gridStyles.headerDescription} numberOfLines={3}>
            {focusedItem.description}
          </Text>

          {/* Action CTAs */}
          <View style={gridStyles.heroActionRow}>
            <SpatialNavigationFocusableView onSelect={navigateToPlayer}>
              {({ isFocused }) => (
                <Pressable
                  onPress={navigateToPlayer}
                  style={[
                    gridStyles.heroButtonPrimary,
                    isFocused && gridStyles.heroButtonPrimaryFocused,
                  ]}
                >
                  <Text
                    style={[
                      gridStyles.heroButtonPrimaryText,
                      isFocused && gridStyles.heroButtonPrimaryTextFocused,
                    ]}
                  >
                    ▶  Watch Now
                  </Text>
                </Pressable>
              )}
            </SpatialNavigationFocusableView>

            <SpatialNavigationFocusableView
              onSelect={() =>
                openAIAssistant(activeTab === 'sports' ? 'sports' : 'movies')
              }
            >
              {({ isFocused }) => (
                <Pressable
                  onPress={() =>
                    openAIAssistant(activeTab === 'sports' ? 'sports' : 'movies')
                  }
                  style={[
                    gridStyles.heroButtonAI,
                    isFocused && gridStyles.heroButtonAIFocused,
                  ]}
                >
                  <Text
                    style={[
                      gridStyles.heroButtonAIText,
                      isFocused && gridStyles.heroButtonAITextFocused,
                    ]}
                  >
                    ✨  {activeTab === 'sports' ? 'AI Play Finder' : 'AI Scene Finder'}
                  </Text>
                </Pressable>
              )}
            </SpatialNavigationFocusableView>

            <SpatialNavigationFocusableView onSelect={navigateToDetails}>
              {({ isFocused }) => (
                <Pressable
                  onPress={navigateToDetails}
                  style={[
                    gridStyles.heroButtonSecondary,
                    isFocused && gridStyles.heroButtonSecondaryFocused,
                  ]}
                >
                  <Text
                    style={[
                      gridStyles.heroButtonSecondaryText,
                      isFocused && gridStyles.heroButtonSecondaryTextFocused,
                    ]}
                  >
                    ℹ  Details
                  </Text>
                </Pressable>
              )}
            </SpatialNavigationFocusableView>
          </View>
        </View>
      </View>
    );
  }, [
    headerImageSource,
    focusedItem,
    navigateToPlayer,
    navigateToDetails,
    openDrawer,
    activeTab,
    handleTabClick,
    openAIAssistant,
  ]);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection() && focusedIndex === 0) {
        openDrawer();
      }
    },
    [openDrawer, focusedIndex],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CardData; index: number }) => (
      <SpatialNavigationFocusableView
        onSelect={() => navigateToDetailsWithItem(item)}
        onFocus={() => setFocusedIndex(index)}
      >
        {({ isFocused }) => (
          <Pressable onPress={() => navigateToDetailsWithItem(item)}>
            <MovieItem
              item={item}
              isFocused={isFocused}
              styles={gridStyles}
            />
          </Pressable>
        )}
      </SpatialNavigationFocusableView>
    ),
    [navigateToDetailsWithItem],
  );

  // Render a horizontal content rail
  const renderScrollableRow = useCallback(
    (title: string, dataList: CardData[], subtitle?: string) => {
      if (!dataList || dataList.length === 0) return null;

      return (
        <View style={gridStyles.highlightsContainer}>
          <View style={gridStyles.rowHeader}>
            <Text style={gridStyles.highlightsTitle}>{title}</Text>
            {subtitle ? (
              <Text style={gridStyles.highlightsSubtitle}>{subtitle}</Text>
            ) : null}
          </View>

          <SpatialNavigationNode>
            <DefaultFocus>
              <View style={gridStyles.listContainer}>
                <SpatialNavigationVirtualizedList
                  data={dataList}
                  orientation="horizontal"
                  renderItem={renderItem}
                  itemSize={scaledPixels(440)}
                  onEndReachedThresholdItemsNumber={3}
                  style={gridStyles.virtualizedList}
                />
              </View>
            </DefaultFocus>
          </SpatialNavigationNode>
        </View>
      );
    },
    [renderItem],
  );

  // Sub-view: SPORTS ONLY
  const renderSportsView = () => {
    const liveMatches = filteredSports.filter((s) => s.isLive);
    const classics = filteredSports.filter((s) => !s.isLive);

    return (
      <View style={gridStyles.pageContent}>
        {/* Sports Interactive Search & Sort Bar */}
        <View style={gridStyles.controlBar}>
          <View style={gridStyles.searchRow}>
            <Text style={gridStyles.searchIcon}>🔍</Text>
            <TextInput
              style={gridStyles.searchInput}
              value={sportsSearch}
              onChangeText={setSportsSearch}
              placeholder="Search sports by match, league, tournament, team, or player..."
              placeholderTextColor="#64748B"
            />
            {sportsSearch ? (
              <Pressable onPress={() => setSportsSearch('')} style={gridStyles.clearSearch}>
                <Text style={gridStyles.clearSearchText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>

          {/* AI Embed Callout Button */}
          <Pressable
            onPress={() => openAIAssistant('sports')}
            style={gridStyles.aiCalloutBanner}
          >
            <View style={gridStyles.aiCalloutLeft}>
              <Text style={gridStyles.aiCalloutTitle}>✨ ViewAI Sports Scout</Text>
              <Text style={gridStyles.aiCalloutSubtitle}>
                Find any match by describing an iconic moment (e.g. "helicopter shot", "bicycle kick", "Monaco wet pass")
              </Text>
            </View>
            <View style={gridStyles.aiCalloutButton}>
              <Text style={gridStyles.aiCalloutButtonText}>Open AI Scout ➔</Text>
            </View>
          </Pressable>

          {/* Manual Sort Pills */}
          <View style={gridStyles.filterPillContainer}>
            <Text style={gridStyles.filterHeader}>⚡ Filter & Sort by Sport:</Text>
            <View style={gridStyles.pillsRow}>
              {[
                { id: 'all', label: 'All Sports' },
                { id: 'live', label: '🔴 Live Now' },
                { id: 'cricket', label: '🏏 Cricket' },
                { id: 'football', label: '⚽ Football' },
                { id: 'f1', label: '🏎️ F1 / Racing' },
                { id: 'basketball', label: '🏀 Basketball' },
                { id: 'tennis', label: '🎾 Tennis' },
                { id: 'rating', label: '⭐ Highest Rated' },
              ].map((pill) => (
                <Pressable
                  key={pill.id}
                  onPress={() => setSportsFilter(pill.id)}
                  style={[
                    gridStyles.filterPill,
                    sportsFilter === pill.id && gridStyles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      gridStyles.filterPillText,
                      sportsFilter === pill.id && gridStyles.filterPillTextActive,
                    ]}
                  >
                    {pill.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Content Rails */}
        {renderScrollableRow(
          '🔴 Live Matches & Deciders',
          liveMatches,
          'Real-time momentum tracking, pitch telemetry & DRS companion',
        )}
        {renderScrollableRow(
          '🏆 Championship Classics & World Cups',
          classics,
          'Legendary moments, tournament-winning sixes & 5-set finals',
        )}
        {renderScrollableRow(
          '⚡ All Sports Results',
          filteredSports,
          `${filteredSports.length} matches matched to your filters`,
        )}
      </View>
    );
  };

  // Sub-view: MOVIES ONLY
  const renderMoviesView = () => {
    const scifi = filteredMovies.filter((m) => m.genres?.includes('Sci-Fi'));
    const action = filteredMovies.filter((m) => m.genres?.includes('Action'));
    const familyAnimation = filteredMovies.filter((m) => m.genres?.includes('Animation'));

    return (
      <View style={gridStyles.pageContent}>
        {/* Movies Interactive Search & Sort Bar */}
        <View style={gridStyles.controlBar}>
          <View style={gridStyles.searchRow}>
            <Text style={gridStyles.searchIcon}>🔍</Text>
            <TextInput
              style={gridStyles.searchInput}
              value={moviesSearch}
              onChangeText={setMoviesSearch}
              placeholder="Search movies by title, genre, director, or keywords..."
              placeholderTextColor="#64748B"
            />
            {moviesSearch ? (
              <Pressable onPress={() => setMoviesSearch('')} style={gridStyles.clearSearch}>
                <Text style={gridStyles.clearSearchText}>Clear</Text>
              </Pressable>
            ) : null}
          </View>

          {/* AI Embed Callout Button */}
          <Pressable
            onPress={() => openAIAssistant('movies')}
            style={gridStyles.aiCalloutBanner}
          >
            <View style={gridStyles.aiCalloutLeft}>
              <Text style={gridStyles.aiCalloutTitle}>
                ✨ ViewAI Scene & Safe Storyline Genius
              </Text>
              <Text style={gridStyles.aiCalloutSubtitle}>
                Describe any scene (e.g. "spinning top on table", "space docking", "gladiator arena") + Smart Age-Appropriate Alternatives!
              </Text>
            </View>
            <View style={gridStyles.aiCalloutButton}>
              <Text style={gridStyles.aiCalloutButtonText}>Launch AI Finder ➔</Text>
            </View>
          </Pressable>

          {/* Age Safety Selector */}
          <View style={gridStyles.filterPillContainer}>
            <Text style={gridStyles.filterHeader}>
              🛡️ Age Safety Filter (Recommends similar age-safe storylines):
            </Text>
            <View style={gridStyles.pillsRow}>
              {[
                { label: '🌐 All Ages', age: undefined },
                { label: '👶 Kids (Ages 6-10)', age: 7 },
                { label: '🧑 Teens (Ages 13+)', age: 13 },
                { label: '🔞 Mature (18+)', age: 18 },
              ].map((pill, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setMoviesAgeFilter(pill.age)}
                  style={[
                    gridStyles.filterPill,
                    moviesAgeFilter === pill.age && gridStyles.filterPillActiveAge,
                  ]}
                >
                  <Text
                    style={[
                      gridStyles.filterPillText,
                      moviesAgeFilter === pill.age && gridStyles.filterPillTextActive,
                    ]}
                  >
                    {pill.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Manual Genre & Sort Pills */}
          <View style={gridStyles.filterPillContainer}>
            <Text style={gridStyles.filterHeader}>🍿 Filter & Sort Movies:</Text>
            <View style={gridStyles.pillsRow}>
              {[
                { id: 'all', label: 'All Movies' },
                { id: 'scifi', label: '🚀 Sci-Fi & Mind-Bending' },
                { id: 'action', label: '⚔️ Action & Epics' },
                { id: 'animation', label: '🎨 Animation & Family' },
                { id: 'rating', label: '⭐ Highest Rated' },
              ].map((pill) => (
                <Pressable
                  key={pill.id}
                  onPress={() => setMoviesGenreFilter(pill.id)}
                  style={[
                    gridStyles.filterPill,
                    moviesGenreFilter === pill.id && gridStyles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      gridStyles.filterPillText,
                      moviesGenreFilter === pill.id && gridStyles.filterPillTextActive,
                    ]}
                  >
                    {pill.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Content Rails */}
        {renderScrollableRow(
          '🚀 Mind-Bending Sci-Fi & Space Epics',
          scifi,
          'Subconscious dreams, wormhole travel and mechanical worlds',
        )}
        {renderScrollableRow(
          '⚔️ Blockbuster Action & Historical Drama',
          action,
          'Gladiator arenas, masked vigilantes and cyberpunk showdowns',
        )}
        {renderScrollableRow(
          '🎨 Family, Kids & Heartwarming Animation',
          familyAnimation,
          'Safe for all ages: clever bunny traps, wounded dragons & comedy',
        )}
        {renderScrollableRow(
          '🍿 All Filtered Movies',
          filteredMovies,
          `${filteredMovies.length} titles matching your preferences`,
        )}
      </View>
    );
  };

  // Sub-view: HOME (Combined Landing Page)
  const renderHomeView = () => {
    return (
      <View style={gridStyles.pageContent}>
        {renderScrollableRow(
          '⚡ Live Sports & Championship Showdowns',
          SPORTS_CATALOG,
          'Real-time match tracking, DRS telemetry & multi-camera analysis',
        )}
        {renderScrollableRow(
          '🎬 Featured Blockbusters & Cinema',
          MOVIES_CATALOG,
          'Top rated movies enabled with ViewAI Companion & scene breakdown',
        )}
        {renderScrollableRow(
          '✨ ViewAI Companion Experiences',
          ALL_CONTENT.filter((c) => c.trending),
          'Interact with in-stream AI questions, timeline markers & stats',
        )}
      </View>
    );
  };

  return (
    <SpatialNavigationRoot
      isActive={isActive}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={gridStyles.container}>
        {renderHeader()}

        <SpatialNavigationScrollView
          offsetFromStart={scaledPixels(40)}
          style={gridStyles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {activeTab === 'sports'
            ? renderSportsView()
            : activeTab === 'movies'
            ? renderMoviesView()
            : renderHomeView()}
        </SpatialNavigationScrollView>

        {/* Embedded Interactive AI Assistant Modal */}
        <AIAssistantModal
          visible={aiModalVisible}
          onClose={() => setAiModalVisible(false)}
          category={aiModalCategory}
          onSelectItem={(item) => {
            setAiModalVisible(false);
            navigateToDetailsWithItem(item);
          }}
          onPlayItem={(item) => {
            setAiModalVisible(false);
            navigateToPlayerWithItem(item);
          }}
        />
      </View>
    </SpatialNavigationRoot>
  );
}

const gridStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },

  scrollContent: {
    flex: 1,
    marginTop: scaledPixels(-40),
    marginBottom: scaledPixels(safeZones.actionSafe.vertical),
  },

  pageContent: {
    paddingBottom: scaledPixels(40),
  },

  controlBar: {
    paddingHorizontal: scaledPixels(safeZones.actionSafe.horizontal),
    marginBottom: scaledPixels(24),
    marginTop: scaledPixels(10),
    gap: scaledPixels(14),
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: scaledPixels(12),
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(10),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  searchIcon: {
    fontSize: scaledPixels(18),
    marginRight: scaledPixels(10),
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: scaledPixels(16),
    padding: 0,
  },

  clearSearch: {
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(4),
  },

  clearSearchText: {
    color: '#94A3B8',
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },

  aiCalloutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: scaledPixels(12),
    paddingHorizontal: scaledPixels(18),
    paddingVertical: scaledPixels(14),
    borderWidth: 1.5,
    borderColor: '#22D3EE',
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  aiCalloutLeft: {
    flex: 1,
    paddingRight: scaledPixels(16),
  },

  aiCalloutTitle: {
    color: '#22D3EE',
    fontSize: scaledPixels(18),
    fontWeight: '800',
    marginBottom: scaledPixels(4),
  },

  aiCalloutSubtitle: {
    color: '#CBD5E1',
    fontSize: scaledPixels(13),
  },

  aiCalloutButton: {
    backgroundColor: '#22D3EE',
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(10),
    borderRadius: scaledPixels(8),
  },

  aiCalloutButtonText: {
    color: '#030712',
    fontSize: scaledPixels(14),
    fontWeight: '800',
  },

  filterPillContainer: {
    gap: scaledPixels(8),
  },

  filterHeader: {
    color: '#94A3B8',
    fontSize: scaledPixels(13),
    fontWeight: '700',
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(8),
  },

  filterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(7),
    borderRadius: scaledPixels(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  filterPillActive: {
    backgroundColor: '#FF9900',
    borderColor: '#FF9900',
  },

  filterPillActiveAge: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },

  filterPillText: {
    color: '#CBD5E1',
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },

  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  rowHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: scaledPixels(16),
    gap: scaledPixels(16),
  },

  highlightsContainer: {
    minHeight: scaledPixels(340),
    marginBottom: scaledPixels(42),
    paddingStart: scaledPixels(safeZones.actionSafe.horizontal),
  },

  listContainer: {
    height: scaledPixels(265),
    width: '100%',
  },

  virtualizedList: {
    height: scaledPixels(265),
    width: '100%',
  },

  highlightsTitle: {
    fontSize: scaledPixels(24),
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  highlightsSubtitle: {
    fontSize: scaledPixels(14),
    fontWeight: '500',
    color: '#94A3B8',
  },

  header: {
    width: '100%',
    height: scaledPixels(640),
    position: 'relative',
    overflow: 'hidden',
  },

  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  imageDimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 7, 18, 0.35)',
  },

  gradientLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '78%',
  },

  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaledPixels(240),
  },

  topBar: {
    position: 'absolute',
    top: scaledPixels(safeZones.titleSafe.vertical),
    left: scaledPixels(safeZones.titleSafe.horizontal),
    right: scaledPixels(safeZones.titleSafe.horizontal),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(12),
  },

  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(8),
  },

  menuButtonText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(15),
    fontWeight: '700',
  },

  brandLogo: {
    fontSize: scaledPixels(32),
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  brandAccent: {
    color: '#FF9900',
  },

  platformBadge: {
    backgroundColor: 'rgba(255, 153, 0, 0.15)',
    borderColor: '#FF9900',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(4),
  },

  platformBadgeText: {
    color: '#FF9900',
    fontSize: scaledPixels(10),
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  topNavChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(8),
  },

  navChip: {
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(20),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },

  navChipActive: {
    backgroundColor: '#FF9900',
    borderColor: '#FF9900',
  },

  navChipAI: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    borderColor: '#22D3EE',
  },

  navChipText: {
    color: '#CBD5E1',
    fontSize: scaledPixels(14),
    fontWeight: '600',
  },

  navChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  navChipAIText: {
    color: '#22D3EE',
    fontSize: scaledPixels(14),
    fontWeight: '800',
  },

  topRightMeta: {
    flexDirection: 'row',
    gap: scaledPixels(8),
  },

  techBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    color: '#94A3B8',
    fontSize: scaledPixels(11),
    fontWeight: '700',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
  },

  headerTextContainer: {
    position: 'absolute',
    bottom: scaledPixels(110),
    left: scaledPixels(safeZones.titleSafe.horizontal),
    width: scaledPixels(720),
    zIndex: 5,
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: scaledPixels(8),
    marginBottom: scaledPixels(14),
  },

  badgeLive: {
    backgroundColor: '#EF4444',
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(6),
  },

  badgeLiveText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(11),
    fontWeight: '900',
    letterSpacing: 1,
  },

  badgeTrending: {
    backgroundColor: '#FF9900',
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(6),
  },

  badgeTrendingText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(11),
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  badgeAI: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    borderColor: '#22D3EE',
    borderWidth: 1,
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(6),
  },

  badgeAIText: {
    color: '#22D3EE',
    fontSize: scaledPixels(11),
    fontWeight: '800',
  },

  badgeAge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },

  badgeAgeText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(11),
    fontWeight: '800',
  },

  badgeMeta: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(4),
  },

  badgeMetaText: {
    color: '#CBD5E1',
    fontSize: scaledPixels(12),
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: scaledPixels(44),
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: scaledPixels(52),
    marginBottom: scaledPixels(12),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  headerDescription: {
    fontSize: scaledPixels(17),
    color: '#CBD5E1',
    lineHeight: scaledPixels(24),
    marginBottom: scaledPixels(22),
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  heroActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(14),
  },

  heroButtonPrimary: {
    backgroundColor: '#FF9900',
    paddingHorizontal: scaledPixels(26),
    paddingVertical: scaledPixels(14),
    borderRadius: scaledPixels(10),
    borderWidth: 2,
    borderColor: '#FF9900',
  },

  heroButtonPrimaryFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },

  heroButtonPrimaryText: {
    color: '#030712',
    fontSize: scaledPixels(16),
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  heroButtonPrimaryTextFocused: {
    color: '#030712',
  },

  heroButtonAI: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    borderColor: '#22D3EE',
    borderWidth: 2,
    paddingHorizontal: scaledPixels(22),
    paddingVertical: scaledPixels(14),
    borderRadius: scaledPixels(10),
  },

  heroButtonAIFocused: {
    backgroundColor: '#22D3EE',
    transform: [{ scale: 1.05 }],
  },

  heroButtonAIText: {
    color: '#22D3EE',
    fontSize: scaledPixels(16),
    fontWeight: '800',
  },

  heroButtonAITextFocused: {
    color: '#030712',
  },

  heroButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    paddingHorizontal: scaledPixels(22),
    paddingVertical: scaledPixels(14),
    borderRadius: scaledPixels(10),
  },

  heroButtonSecondaryFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },

  heroButtonSecondaryText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(16),
    fontWeight: '700',
  },

  heroButtonSecondaryTextFocused: {
    color: '#FFFFFF',
  },

  highlightThumbnail: {
    width: scaledPixels(410),
    height: scaledPixels(230),
    borderRadius: scaledPixels(12),
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    marginRight: scaledPixels(20),
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  highlightThumbnailFocused: {
    borderColor: '#FF9900',
    transform: [{ scale: 1.06 }],
    shadowColor: '#FF9900',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 20,
  },

  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },

  cardLiveBadge: {
    position: 'absolute',
    top: scaledPixels(10),
    left: scaledPixels(10),
    backgroundColor: '#EF4444',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(4),
  },

  cardLiveBadgeText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(10),
    fontWeight: '900',
  },

  cardCategoryBadge: {
    position: 'absolute',
    top: scaledPixels(10),
    left: scaledPixels(10),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(4),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  cardCategoryBadgeText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(10),
    fontWeight: '700',
  },

  cardTextContainer: {
    position: 'absolute',
    left: scaledPixels(12),
    right: scaledPixels(12),
    bottom: scaledPixels(12),
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: scaledPixels(16),
    fontWeight: '800',
    marginBottom: scaledPixels(4),
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(8),
  },

  cardMetaRating: {
    color: '#FACC15',
    fontSize: scaledPixels(12),
    fontWeight: '700',
  },

  cardMetaText: {
    color: '#94A3B8',
    fontSize: scaledPixels(12),
    fontWeight: '500',
  },

  cardRatingPill: {
    color: '#CBD5E1',
    fontSize: scaledPixels(10),
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: scaledPixels(6),
    paddingVertical: scaledPixels(1),
    borderRadius: scaledPixels(3),
  },
});