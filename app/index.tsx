import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth, useAlert } from '@/template';
import { useRoom } from '@/hooks/useRoom';
import { GameButton } from '@/components/ui/GameButton';
import { GameCard } from '@/components/ui/GameCard';
import { GameInput } from '@/components/ui/GameInput';
import { colors, spacing, borderRadius } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const { createRoom, joinRoom, loading } = useRoom(null);

  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      showAlert('Atenção', 'Como devemos te chamar?');
      return;
    }

    if (!user) {
      showAlert('Erro', 'Conectando...');
      return;
    }

    const room = await createRoom(playerName.trim());
    if (room) {
      router.push({
        pathname: '/lobby',
        params: { code: room.code, playerName: playerName.trim() },
      });
    } else if (error) {
      showAlert('Erro', error);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      showAlert('Atenção', 'Como devemos te chamar?');
      return;
    }

    if (!roomCode.trim()) {
      showAlert('Atenção', 'Digite o código da sala!');
      return;
    }

    if (!user) {
      showAlert('Erro', 'Conectando...');
      return;
    }

    const room = await joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    if (room) {
      router.push({
        pathname: room.status === 'playing' ? '/game' : '/lobby',
        params: { code: room.code, playerName: playerName.trim() },
      });
    } else if (error) {
      showAlert('Erro', error);
    }
  };

  const isLoading = authLoading || loading;

  return (
    <LinearGradient
      colors={[colors.purple[600], colors.purple[700]]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, spacing.lg) },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="eye" size={80} color={colors.yellow[400]} />
            </View>
            <Text style={styles.title}>Adivinhe o Impostor</Text>
          </View>

          {/* Main Card */}
          <GameCard style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Novo Jogo</Text>
            </View>

            {/* Player Name Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Seu Apelido</Text>
              <GameInput
                value={playerName}
                onChangeText={setPlayerName}
                placeholder="Digite seu nome..."
                maxLength={20}
                autoCapitalize="words"
              />
            </View>

            {/* Create Room Button */}
            <GameButton
              onPress={handleCreateRoom}
              color="green"
              disabled={isLoading}
            >
              Criar Sala
            </GameButton>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Join Room Section */}
            <View style={styles.joinSection}>
              <GameInput
                value={roomCode}
                onChangeText={(text) => setRoomCode(text.toUpperCase())}
                placeholder="CÓDIGO"
                maxLength={4}
                autoCapitalize="characters"
                style={styles.codeInput}
              />
              <GameButton
                onPress={handleJoinRoom}
                color="yellow"
                disabled={isLoading}
                style={styles.joinButton}
              >
                Entrar
              </GameButton>
            </View>
          </GameCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: colors.purple[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.purple[600],
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.purple[900],
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginLeft: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.purple[200],
  },
  dividerText: {
    color: colors.purple[400],
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginHorizontal: spacing.sm,
  },
  joinSection: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  codeInput: {
    flex: 1,
    fontSize: 20,
    letterSpacing: 2,
  },
  joinButton: {
    flex: 2,
  },
});
