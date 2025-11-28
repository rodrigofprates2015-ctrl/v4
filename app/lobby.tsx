import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoom } from '@/hooks/useRoom';
import { GameButton } from '@/components/ui/GameButton';
import { GameCard } from '@/components/ui/GameCard';
import { PlayerCard } from '@/components/feature/PlayerCard';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

export default function LobbyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ code: string; playerName: string }>();
  const { room, players, startGame, loading, isHost } = useRoom(params.code);

  useEffect(() => {
    if (room?.status === 'playing') {
      router.replace({
        pathname: '/game',
        params: { code: params.code, playerName: params.playerName },
      });
    }
  }, [room?.status]);

  const handleStartGame = async () => {
    await startGame();
  };

  const handleBack = () => {
    router.back();
  };

  if (!room) {
    return (
      <LinearGradient
        colors={[colors.purple[600], colors.purple[700]]}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Carregando sala...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.purple[600], colors.purple[700]]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="home" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lobby</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Room Code Card */}
          <GameCard style={styles.codeCard}>
            <View style={styles.colorBar} />
            <Text style={styles.codeLabel}>Código da Sala</Text>
            <Text style={styles.code}>{room.code}</Text>
          </GameCard>

          {/* Players Section */}
          <View style={styles.playersContainer}>
            <View style={styles.playersHeader}>
              <Ionicons name="people" size={24} color={colors.yellow[400]} />
              <Text style={styles.playersTitle}>
                Jogadores ({players.length})
              </Text>
            </View>

            <View style={styles.playersList}>
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isHost={player.user_id === room.host_id}
                />
              ))}
            </View>
          </View>

          {/* Start Button or Waiting Message */}
          <View style={styles.actionContainer}>
            {isHost ? (
              <GameButton
                onPress={handleStartGame}
                color="green"
                disabled={loading || players.length < 2}
              >
                COMEÇAR JOGO
              </GameButton>
            ) : (
              <View style={styles.waitingContainer}>
                <Text style={styles.waitingText}>
                  Aguardando o anfitrião iniciar...
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  spacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  codeCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  colorBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: colors.cyan[400],
  },
  codeLabel: {
    color: colors.purple[400],
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  code: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.purple[900],
    letterSpacing: 4,
  },
  playersContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: spacing.lg,
  },
  playersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  playersTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playersList: {
    gap: spacing.sm,
  },
  actionContainer: {
    marginTop: spacing.md,
  },
  waitingContainer: {
    backgroundColor: 'rgba(107, 33, 168, 0.5)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  waitingText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
