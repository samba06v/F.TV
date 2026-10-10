// ============================================================================
// ViewAI — Suggested Questions
// Remote-friendly selectable question prompts for the AI companion panel.
// Uses spatial navigation so users can navigate with a TV remote.
// ============================================================================

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SpatialNavigationFocusableView, SpatialNavigationNode } from 'react-tv-space-navigation';
import { scaledPixels } from '../../hooks/useScale';
import { colors } from '../../theme/colors';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  isLoading?: boolean;
}

const QuestionChip = React.memo(
  ({ question, onSelect }: { question: string; onSelect: (q: string) => void }) => {
    return (
      <SpatialNavigationFocusableView onSelect={() => onSelect(question)}>
        {({ isFocused }) => (
          <Pressable
            style={[styles.chip, isFocused && styles.chipFocused]}
            onPress={() => onSelect(question)}
          >
            <Text style={[styles.chipText, isFocused && styles.chipTextFocused]} numberOfLines={2}>
              {question}
            </Text>
          </Pressable>
        )}
      </SpatialNavigationFocusableView>
    );
  },
);

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = React.memo(
  ({ questions, onSelect, isLoading = false }) => {
    const chips = useMemo(
      () =>
        questions.map((q, index) => (
          <QuestionChip key={`${q}-${index}`} question={q} onSelect={onSelect} />
        )),
      [questions, onSelect],
    );

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text style={styles.label}>✨ Thinking...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.label}>💡 Suggested questions</Text>
        <SpatialNavigationNode>
          <View style={styles.chipGrid}>{chips}</View>
        </SpatialNavigationNode>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: scaledPixels(12),
  },
  label: {
    color: colors.textSecondary,
    fontSize: scaledPixels(18),
    fontWeight: '600',
    marginBottom: scaledPixels(12),
    letterSpacing: 0.5,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaledPixels(10),
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: scaledPixels(24),
    paddingHorizontal: scaledPixels(20),
    paddingVertical: scaledPixels(12),
    borderWidth: scaledPixels(2),
    borderColor: 'rgba(255, 255, 255, 0.15)',
    maxWidth: scaledPixels(380),
  },
  chipFocused: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderColor: colors.primary,
    transform: [{ scale: 1.05 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: scaledPixels(12),
    elevation: 8,
  },
  chipText: {
    color: colors.text,
    fontSize: scaledPixels(17),
    fontWeight: '500',
  },
  chipTextFocused: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default SuggestedQuestions;
