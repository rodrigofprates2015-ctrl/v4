import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface RevealCardProps {
  isImpostor: boolean;
  category: string;
  secretWord?: string;
}

export const RevealCard: React.FC<RevealCardProps> = ({
  isImpostor,
  category,
  secretWord,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const rotation = useSharedValue(0);

  const handlePress = () => {
    rotation.value = withTiming(isRevealed ? 0 : 180, { duration: 500 });
    setIsRevealed(!isRevealed);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(rotation.value, [0, 90, 180], [1, 0, 0]),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity: interpolate(rotation.value, [0, 90, 180], [0, 0, 1]),
    };
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.95}
      style={styles.container}
    >
      {/* Front (Hidden) */}
      <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
        <View style={styles.frontContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="eye-off" size={64} color={colors.white} />
          </View>
          <Text style={styles.frontTitle}>Toque para</Text>
          <Text style={styles.frontSubtitle}>REVELAR</Text>
          <Text style={styles.frontHint}>Não mostre a ninguém!</Text>
        </View>
      </Animated.View>

      {/* Back (Revealed) */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.backCard,
          backAnimatedStyle,
          isImpostor ? styles.impostorCard : styles.citizenCard,
        ]}
      >
        {isImpostor ? (
          <View style={styles.backContent}>
            <View
              style={[styles.roleIconContainer, styles.impostorIconContainer]}
            >
              <Ionicons name="skull" size={64} color={colors.rose[500]} />
            </View>
            <Text style={styles.impostorTitle}>IMPOSTOR!</Text>
            <Text style={styles.impostorHint}>
              Engane a todos. Descubra o tema pela conversa.
            </Text>

            <View style={styles.categoryBox}>
              <Text style={styles.categoryLabel}>Dica de Categoria</Text>
              <Text style={styles.impostorCategory}>{category}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.backContent}>
            <View
              style={[styles.roleIconContainer, styles.citizenIconContainer]}
            >
              <Ionicons name="person" size={64} color={colors.cyan[600]} />
            </View>
            <Text style={styles.citizenTitle}>CIDADÃO</Text>

            <View style={[styles.categoryBox, styles.citizenCategoryBox]}>
              <Text style={styles.categoryLabel}>Categoria</Text>
              <Text style={styles.citizenCategory}>{category}</Text>
            </View>

            <View style={styles.wordBox}>
              <Text style={styles.wordLabel}>A PALAVRA É</Text>
              <Text style={styles.word}>{secretWord}</Text>
            </View>
          </View>
        )}

        <Text style={styles.backHint}>Toque para esconder</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5,
    maxWidth: 320,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: borderRadius.xl,
    ...shadows.xl,
  },
  frontContent: {
    flex: 1,
    backgroundColor: colors.purple[600],
    borderRadius: borderRadius.xl,
    borderWidth: 8,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: spacing.lg,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  frontTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  frontSubtitle: {
    color: colors.yellow[400],
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  frontHint: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  backCard: {
    backgroundColor: colors.white,
  },
  impostorCard: {
    borderWidth: 8,
    borderColor: colors.rose[500],
  },
  citizenCard: {
    borderWidth: 8,
    borderColor: colors.cyan[500],
  },
  backContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  roleIconContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  impostorIconContainer: {
    backgroundColor: colors.rose[100],
  },
  citizenIconContainer: {
    backgroundColor: colors.cyan[100],
  },
  impostorTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.rose[500],
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  citizenTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.cyan[600],
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  impostorHint: {
    color: 'rgba(159, 18, 57, 0.7)',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  categoryBox: {
    width: '100%',
    backgroundColor: colors.rose[100],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.rose[100],
  },
  citizenCategoryBox: {
    backgroundColor: colors.cyan[100],
    borderColor: colors.cyan[100],
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.rose[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  impostorCategory: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.rose[800],
  },
  citizenCategory: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.cyan[800],
  },
  wordBox: {
    width: '100%',
    backgroundColor: colors.cyan[600],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.md,
  },
  wordLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.cyan[200],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  word: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
  },
  backHint: {
    position: 'absolute',
    bottom: spacing.md,
    fontSize: 10,
    fontWeight: '700',
    color: colors.slate[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
