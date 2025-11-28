import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';

interface GameInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export const GameInput: React.FC<GameInputProps> = ({
  containerStyle,
  style,
  ...props
}) => {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor={colors.purple[400]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.purple[100],
    borderWidth: 4,
    borderColor: colors.purple[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.purple[900],
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
});
