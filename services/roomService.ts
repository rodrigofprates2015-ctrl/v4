import { getSupabaseClient } from '@/template';
import { getRandomCategory, getRandomWord } from '@/constants/wordDatabase';

const supabase = getSupabaseClient();

export interface Player {
  id: string;
  user_id: string;
  player_name: string;
  score: number;
  joined_at: string;
}

export interface Room {
  id: string;
  code: string;
  host_id: string;
  status: 'lobby' | 'playing' | 'finished';
  category: string | null;
  secret_word: string | null;
  impostor_id: string | null;
  created_at: string;
  updated_at: string;
  players?: Player[];
}

const generateRoomCode = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const createRoom = async (
  hostId: string,
  playerName: string
): Promise<{ room: Room | null; error: string | null }> => {
  const code = generateRoomCode();

  // Create room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .insert({
      code,
      host_id: hostId,
      status: 'lobby',
    })
    .select()
    .single();

  if (roomError || !room) {
    return { room: null, error: 'Erro ao criar sala' };
  }

  // Add host as first player
  const { error: playerError } = await supabase.from('room_players').insert({
    room_id: room.id,
    user_id: hostId,
    player_name: playerName,
    score: 0,
  });

  if (playerError) {
    return { room: null, error: 'Erro ao adicionar jogador' };
  }

  return { room, error: null };
};

export const joinRoom = async (
  code: string,
  userId: string,
  playerName: string
): Promise<{ room: Room | null; error: string | null }> => {
  // Find room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (roomError || !room) {
    return { room: null, error: 'Sala não encontrada' };
  }

  // Check if already in room
  const { data: existing } = await supabase
    .from('room_players')
    .select('*')
    .eq('room_id', room.id)
    .eq('user_id', userId)
    .single();

  if (!existing) {
    // Add player
    const { error: playerError } = await supabase.from('room_players').insert({
      room_id: room.id,
      user_id: userId,
      player_name: playerName,
      score: 0,
    });

    if (playerError) {
      return { room: null, error: 'Erro ao entrar na sala' };
    }
  }

  return { room, error: null };
};

export const getRoomByCode = async (
  code: string
): Promise<{ room: Room | null; players: Player[]; error: string | null }> => {
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (roomError || !room) {
    return { room: null, players: [], error: 'Sala não encontrada' };
  }

  const { data: players, error: playersError } = await supabase
    .from('room_players')
    .select('*')
    .eq('room_id', room.id)
    .order('joined_at', { ascending: true });

  if (playersError) {
    return { room: null, players: [], error: 'Erro ao carregar jogadores' };
  }

  return { room, players: players || [], error: null };
};

export const startGame = async (
  roomId: string
): Promise<{ error: string | null }> => {
  const category = getRandomCategory();
  const secretWord = getRandomWord(category);

  // Get players
  const { data: players } = await supabase
    .from('room_players')
    .select('user_id')
    .eq('room_id', roomId);

  if (!players || players.length === 0) {
    return { error: 'Nenhum jogador na sala' };
  }

  // Select random impostor
  const randomPlayer = players[Math.floor(Math.random() * players.length)];

  const { error } = await supabase
    .from('rooms')
    .update({
      status: 'playing',
      category,
      secret_word: secretWord,
      impostor_id: randomPlayer.user_id,
    })
    .eq('id', roomId);

  if (error) {
    return { error: 'Erro ao iniciar jogo' };
  }

  return { error: null };
};

export const resetRoom = async (
  roomId: string
): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from('rooms')
    .update({
      status: 'lobby',
      category: null,
      secret_word: null,
      impostor_id: null,
    })
    .eq('id', roomId);

  if (error) {
    return { error: 'Erro ao resetar sala' };
  }

  return { error: null };
};

export const leaveRoom = async (
  roomId: string,
  userId: string
): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from('room_players')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);

  if (error) {
    return { error: 'Erro ao sair da sala' };
  }

  return { error: null };
};
