import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

interface GameCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GameCard: React.FC<GameCardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 4,
    borderColor: colors.purple[200],
    ...shadows.xl,
  },
});
