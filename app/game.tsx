import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoom } from '@/hooks/useRoom';
import { GameButton } from '@/components/ui/GameButton';
import { RevealCard } from '@/components/feature/RevealCard';
import { colors, spacing } from '@/constants/theme';

export default function GameScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ code: string; playerName: string }>();
  const { room, players, resetGame, loading, isHost, isImpostor } = useRoom(
    params.code
  );

  const handleNewRound = async () => {
    await resetGame();
    router.replace({
      pathname: '/lobby',
      params: { code: params.code, playerName: params.playerName },
    });
  };

  if (!room || room.status !== 'playing') {
    return (
      <LinearGradient
        colors={[colors.purple[600], colors.purple[700]]}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Carregando jogo...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.purple[600], colors.purple[700]]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View
        style={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
      >
        {/* Header Info */}
        <View style={styles.header}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>Sala {room.code}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>{players.length} Jogadores</Text>
          </View>
        </View>

        {/* Main Game Area */}
        <View style={styles.gameArea}>
          <Text style={styles.title}>Sua Identidade</Text>

          <View style={styles.cardContainer}>
            <RevealCard
              isImpostor={isImpostor}
              category={room.category || ''}
              secretWord={room.secret_word || ''}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {isHost ? (
            <GameButton
              onPress={handleNewRound}
              color="purple"
              disabled={loading}
            >
              NOVA RODADA
            </GameButton>
          ) : (
            <Text style={styles.waitingText}>Aguardando o host...</Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  infoBadge: {
    backgroundColor: colors.purple[800],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  infoBadgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '700',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  actions: {
    paddingTop: spacing.lg,
  },
  waitingText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
