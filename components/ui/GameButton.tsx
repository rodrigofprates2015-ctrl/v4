import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

type ButtonColor = 'green' | 'yellow' | 'purple' | 'red' | 'cyan';

interface GameButtonProps {
  onPress: () => void;
  disabled?: boolean;
  color?: ButtonColor;
  children: React.ReactNode;
  style?: ViewStyle;
}

const colorStyles: Record<
  ButtonColor,
  { bg: string; border: string; text: string }
> = {
  green: {
    bg: colors.lime[500],
    border: colors.lime[600],
    text: colors.white,
  },
  yellow: {
    bg: colors.yellow[400],
    border: colors.yellow[500],
    text: colors.purple[900],
  },
  purple: {
    bg: colors.purple[500],
    border: colors.purple[600],
    text: colors.white,
  },
  red: {
    bg: colors.rose[500],
    border: colors.rose[600],
    text: colors.white,
  },
  cyan: {
    bg: colors.cyan[400],
    border: colors.cyan[500],
    text: colors.cyan[800],
  },
};

export const GameButton: React.FC<GameButtonProps> = ({
  onPress,
  disabled = false,
  color = 'green',
  children,
  style,
}) => {
  const { bg, border, text } = colorStyles[color];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderBottomColor: border,
          borderLeftColor: border,
          borderRightColor: border,
          borderTopColor: bg,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, { color: text }]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderBottomWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  text: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
