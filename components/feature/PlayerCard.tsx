import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import type { Player } from '@/services/roomService';

interface PlayerCardProps {
  player: Player;
  isHost: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isHost }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {player.player_name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{player.player_name}</Text>
      </View>
      {isHost && (
        <Ionicons name="crown" size={20} color={colors.yellow[500]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 4,
    borderBottomColor: colors.purple[200],
    ...shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.purple[600],
    fontWeight: '700',
    fontSize: 16,
  },
  name: {
    color: colors.purple[900],
    fontWeight: '700',
    fontSize: 16,
  },
});
