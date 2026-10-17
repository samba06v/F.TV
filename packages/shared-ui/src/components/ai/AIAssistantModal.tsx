// ============================================================================
// ViewAI — Embedded AI Scene & Safe Storyline Assistant
// Allows finding movies and sports without titles or actor names by describing
// scenes, moments, or vibes. Automatically detects age appropriateness and
// recommends age-adapted storyline alternatives.
// ============================================================================

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import {
  SpatialNavigationFocusableView,
  SpatialNavigationRoot,
  SpatialNavigationScrollView,
} from 'react-tv-space-navigation';
import { scaledPixels } from '../../hooks/useScale';
import { colors } from '../../theme/colors';
import {
  searchWithAI,
  AISearchResult,
  MOVIE_SCENE_PROMPTS,
  SPORTS_MOMENT_PROMPTS,
} from '../../services/aiSearchService';
import { CardData } from '../../data/moviesData';

interface AIAssistantModalProps {
  visible: boolean;
  onClose: () => void;
  category: 'sports' | 'movies';
  onSelectItem: (item: CardData) => void;
  onPlayItem: (item: CardData) => void;
}

export default function AIAssistantModal({
  visible,
  onClose,
  category,
  onSelectItem,
  onPlayItem,
}: AIAssistantModalProps) {
  const [query, setQuery] = useState('');
  const [targetAge, setTargetAge] = useState<number | undefined>(undefined);
  const [selectedVibe, setSelectedVibe] = useState<string | undefined>(undefined);

  const isSports = category === 'sports';
  const presets = isSports ? SPORTS_MOMENT_PROMPTS : MOVIE_SCENE_PROMPTS;

  const results: AISearchResult[] = useMemo(() => {
    return searchWithAI({
      query,
      category,
      targetAge,
      vibe: selectedVibe,
    });
  }, [query, category, targetAge, selectedVibe]);

  const handleApplyPrompt = useCallback((prompt: string) => {
    setQuery(prompt);
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Modal Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.titleGroup}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>✨ VIEWAI AGENT</Text>
            </View>
            <Text style={styles.modalTitle}>
              {isSports
                ? 'Find Sports by Iconic Moments & Plays'
                : 'Find Movies by Describing Any Scene'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {isSports
                ? 'No match or player name needed. Describe the play, turning point, or commentary.'
                : 'No movie title or actor needed. Describe what happens on screen — AI will match the scene.'}
            </Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </Pressable>
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔍</Text>
          <TextInput
            style={styles.textInput}
            value={query}
            onChangeText={setQuery}
            placeholder={
              isSports
                ? "Describe play: e.g. 'helicopter shot in final over', 'bicycle kick', 'Monaco wet overtake'..."
                : "Describe scene: e.g. 'spinning top on table', 'docking in space with ticking clock', 'gladiator arena'..."
            }
            placeholderTextColor="#64748B"
            autoFocus
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Filter Controls: Quick Prompts & Smart Age Selector */}
        <View style={styles.filterSection}>
          {/* Quick Scene Prompts */}
          <Text style={styles.filterLabel}>⚡ Quick Example Queries:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {presets.map((prompt, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleApplyPrompt(prompt)}
                style={[
                  styles.promptChip,
                  query === prompt && styles.promptChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.promptChipText,
                    query === prompt && styles.promptChipTextActive,
                  ]}
                  numberOfLines={1}
                >
                  "{prompt}"
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Age Safety Selector (Vital for movies!) */}
          {!isSports ? (
            <View style={styles.ageSelectorContainer}>
              <Text style={styles.filterLabel}>
                🛡️ AI Age Safety Target (Recommends similar safe storylines):
              </Text>
              <View style={styles.ageChipsRow}>
                {[
                  { label: '🌐 All Ages (No Filter)', age: undefined },
                  { label: '👶 Kids (Ages 6-10)', age: 7 },
                  { label: '🧑 Teens (Ages 13+)', age: 13 },
                  { label: '🔞 Mature (18+)', age: 18 },
                ].map((item, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => setTargetAge(item.age)}
                    style={[
                      styles.ageChip,
                      targetAge === item.age && styles.ageChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ageChipText,
                        targetAge === item.age && styles.ageChipTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        {/* Results List */}
        <ScrollView
          style={styles.resultsScroll}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={true}
        >
          {results.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🤔</Text>
              <Text style={styles.emptyTitle}>No exact scene match found</Text>
              <Text style={styles.emptySubtitle}>
                Try describing key objects (e.g. 'top', 'dragon', 'rocket'), actions
                ('dunk', 'dive', 'overtake'), or select a quick example above.
              </Text>
            </View>
          ) : (
            results.map((res, index) => {
              const {
                item,
                relevanceScore,
                matchedScene,
                aiExplanation,
                isAgeRestricted,
                ageNotice,
                safeAlternatives,
                safeAlternativeReason,
              } = res;

              return (
                <View key={item.id} style={styles.resultCard}>
                  {/* Left: Poster/Thumb */}
                  <Image
                    source={{ uri: item.headerImage }}
                    style={styles.resultThumb}
                    resizeMode="cover"
                  />

                  {/* Center: Details & AI Breakdown */}
                  <View style={styles.resultDetails}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultTitle}>{item.title}</Text>
                      <View style={styles.scorePill}>
                        <Text style={styles.scorePillText}>
                          ✨ {relevanceScore}% Match
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.agePill,
                          isAgeRestricted && styles.agePillRestricted,
                        ]}
                      >
                        <Text style={styles.agePillText}>
                          {item.ageRating || item.contentRating || 'HD'}
                        </Text>
                      </View>
                    </View>

                    {/* Matched Scene / Reason Banner */}
                    <View style={styles.sceneBanner}>
                      <Text style={styles.sceneBannerLabel}>
                        🎯 {isSports ? 'IDENTIFIED PLAY' : 'IDENTIFIED SCENE'}:
                      </Text>
                      <Text style={styles.sceneBannerText}>
                        {matchedScene || aiExplanation}
                      </Text>
                    </View>

                    {/* Description */}
                    <Text style={styles.resultDesc} numberOfLines={2}>
                      {item.description}
                    </Text>

                    {/* Age Alert & Safe Alternative Box */}
                    {isAgeRestricted ? (
                      <View style={styles.ageAlertBox}>
                        <Text style={styles.ageAlertTitle}>
                          {ageNotice}
                        </Text>
                        <Text style={styles.ageAlertBody}>
                          🛡️ {safeAlternativeReason}
                        </Text>

                        {/* Render Safe Alternative Cards */}
                        {safeAlternatives && safeAlternatives.length > 0 ? (
                          <View style={styles.safeCardsRow}>
                            {safeAlternatives.map((alt) => (
                              <Pressable
                                key={alt.id}
                                onPress={() => onSelectItem(alt)}
                                style={styles.safeCard}
                              >
                                <Image
                                  source={{ uri: alt.headerImage }}
                                  style={styles.safeCardThumb}
                                />
                                <View style={styles.safeCardInfo}>
                                  <View style={styles.safeBadge}>
                                    <Text style={styles.safeBadgeText}>
                                      SAFE FOR AGE {targetAge}+
                                    </Text>
                                  </View>
                                  <Text style={styles.safeCardTitle} numberOfLines={1}>
                                    {alt.title}
                                  </Text>
                                  <Text style={styles.safeCardMeta}>
                                    {alt.ageRating || 'G'} · {alt.genres?.[0]}
                                  </Text>
                                </View>
                              </Pressable>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    ) : null}

                    {/* Action buttons */}
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => onPlayItem(item)}
                        style={styles.playBtn}
                      >
                        <Text style={styles.playBtnText}>▶ Watch Now</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => onSelectItem(item)}
                        style={styles.detailsBtn}
                      >
                        <Text style={styles.detailsBtnText}>ℹ Details</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 7, 18, 0.94)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledPixels(20),
  },
  modalContainer: {
    width: '94%',
    height: '92%',
    backgroundColor: '#0F172A',
    borderRadius: scaledPixels(16),
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    overflow: 'hidden',
    padding: scaledPixels(24),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scaledPixels(16),
  },
  titleGroup: {
    flex: 1,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    paddingHorizontal: scaledPixels(10),
    paddingVertical: scaledPixels(4),
    borderRadius: scaledPixels(6),
    marginBottom: scaledPixels(6),
    borderWidth: 1,
    borderColor: '#22D3EE',
  },
  aiBadgeText: {
    color: '#22D3EE',
    fontSize: scaledPixels(12),
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: scaledPixels(26),
    fontWeight: '800',
    marginBottom: scaledPixels(4),
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: scaledPixels(15),
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonText: {
    color: '#F8FAFC',
    fontSize: scaledPixels(15),
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: scaledPixels(12),
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(10),
    marginBottom: scaledPixels(14),
    borderWidth: 1.5,
    borderColor: 'rgba(34, 211, 238, 0.5)',
  },
  inputIcon: {
    fontSize: scaledPixels(20),
    marginRight: scaledPixels(10),
  },
  textInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: scaledPixels(17),
    padding: 0,
  },
  clearBtn: {
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(4),
  },
  clearBtnText: {
    color: '#94A3B8',
    fontSize: scaledPixels(14),
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: scaledPixels(16),
  },
  filterLabel: {
    color: '#CBD5E1',
    fontSize: scaledPixels(13),
    fontWeight: '700',
    marginBottom: scaledPixels(8),
  },
  chipsRow: {
    flexDirection: 'row',
    gap: scaledPixels(8),
    paddingBottom: scaledPixels(4),
  },
  promptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(7),
    borderRadius: scaledPixels(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  promptChipActive: {
    backgroundColor: '#22D3EE',
    borderColor: '#22D3EE',
  },
  promptChipText: {
    color: '#CBD5E1',
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },
  promptChipTextActive: {
    color: '#030712',
    fontWeight: '800',
  },
  ageSelectorContainer: {
    marginTop: scaledPixels(12),
  },
  ageChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(8),
  },
  ageChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: scaledPixels(12),
    paddingVertical: scaledPixels(6),
    borderRadius: scaledPixels(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  ageChipActive: {
    backgroundColor: '#FF9900',
    borderColor: '#FF9900',
  },
  ageChipText: {
    color: '#94A3B8',
    fontSize: scaledPixels(13),
    fontWeight: '600',
  },
  ageChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    gap: scaledPixels(16),
    paddingBottom: scaledPixels(20),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaledPixels(60),
  },
  emptyEmoji: {
    fontSize: scaledPixels(48),
    marginBottom: scaledPixels(12),
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: scaledPixels(20),
    fontWeight: '700',
    marginBottom: scaledPixels(6),
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: scaledPixels(15),
    textAlign: 'center',
    maxWidth: scaledPixels(500),
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: scaledPixels(12),
    padding: scaledPixels(14),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: scaledPixels(16),
  },
  resultThumb: {
    width: scaledPixels(220),
    height: scaledPixels(130),
    borderRadius: scaledPixels(8),
    backgroundColor: '#1E293B',
  },
  resultDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(10),
    marginBottom: scaledPixels(6),
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: scaledPixels(20),
    fontWeight: '800',
    flex: 1,
  },
  scorePill: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(6),
    borderWidth: 1,
    borderColor: '#22D3EE',
  },
  scorePillText: {
    color: '#22D3EE',
    fontSize: scaledPixels(12),
    fontWeight: '700',
  },
  agePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: scaledPixels(8),
    paddingVertical: scaledPixels(3),
    borderRadius: scaledPixels(6),
  },
  agePillRestricted: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  agePillText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(12),
    fontWeight: '700',
  },
  sceneBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: scaledPixels(8),
    borderRadius: scaledPixels(6),
    marginBottom: scaledPixels(6),
    borderLeftWidth: 3,
    borderLeftColor: '#22D3EE',
  },
  sceneBannerLabel: {
    color: '#22D3EE',
    fontSize: scaledPixels(11),
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: scaledPixels(2),
  },
  sceneBannerText: {
    color: '#E2E8F0',
    fontSize: scaledPixels(13),
    fontStyle: 'italic',
  },
  resultDesc: {
    color: '#94A3B8',
    fontSize: scaledPixels(14),
    marginBottom: scaledPixels(8),
  },
  ageAlertBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: scaledPixels(8),
    padding: scaledPixels(10),
    marginBottom: scaledPixels(10),
  },
  ageAlertTitle: {
    color: '#F87171',
    fontSize: scaledPixels(13),
    fontWeight: '700',
    marginBottom: scaledPixels(4),
  },
  ageAlertBody: {
    color: '#CBD5E1',
    fontSize: scaledPixels(12),
    marginBottom: scaledPixels(8),
  },
  safeCardsRow: {
    flexDirection: 'row',
    gap: scaledPixels(10),
  },
  safeCard: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: scaledPixels(6),
    padding: scaledPixels(6),
    alignItems: 'center',
    gap: scaledPixels(8),
    borderWidth: 1,
    borderColor: '#10B981',
    flex: 1,
  },
  safeCardThumb: {
    width: scaledPixels(60),
    height: scaledPixels(40),
    borderRadius: scaledPixels(4),
  },
  safeCardInfo: {
    flex: 1,
  },
  safeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: scaledPixels(4),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
    alignSelf: 'flex-start',
    marginBottom: scaledPixels(2),
  },
  safeBadgeText: {
    color: '#10B981',
    fontSize: scaledPixels(9),
    fontWeight: '800',
  },
  safeCardTitle: {
    color: '#FFFFFF',
    fontSize: scaledPixels(12),
    fontWeight: '700',
  },
  safeCardMeta: {
    color: '#94A3B8',
    fontSize: scaledPixels(10),
  },
  actionRow: {
    flexDirection: 'row',
    gap: scaledPixels(10),
  },
  playBtn: {
    backgroundColor: '#FF9900',
    paddingHorizontal: scaledPixels(16),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(6),
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(14),
    fontWeight: '800',
  },
  detailsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: scaledPixels(14),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(6),
  },
  detailsBtnText: {
    color: '#FFFFFF',
    fontSize: scaledPixels(14),
    fontWeight: '700',
  },
});
