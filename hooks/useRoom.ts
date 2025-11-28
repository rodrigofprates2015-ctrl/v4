import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/template';
import * as roomService from '@/services/roomService';
import type { Room, Player } from '@/services/roomService';

export const useRoom = (roomCode: string | null) => {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll room data every 2 seconds
  const fetchRoom = useCallback(async () => {
    if (!roomCode) {
      setRoom(null);
      setPlayers([]);
      return;
    }

    const { room: fetchedRoom, players: fetchedPlayers, error: fetchError } =
      await roomService.getRoomByCode(roomCode);

    if (fetchError) {
      setError(fetchError);
      setRoom(null);
      setPlayers([]);
    } else {
      setRoom(fetchedRoom);
      setPlayers(fetchedPlayers);
      setError(null);
    }
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;

    fetchRoom();
    const interval = setInterval(fetchRoom, 2000);

    return () => clearInterval(interval);
  }, [roomCode, fetchRoom]);

  const createRoom = async (playerName: string) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    const { room: newRoom, error: createError } = await roomService.createRoom(
      user.id,
      playerName
    );

    setLoading(false);

    if (createError) {
      setError(createError);
      return null;
    }

    return newRoom;
  };

  const joinRoom = async (code: string, playerName: string) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setLoading(true);
    setError(null);

    const { room: joinedRoom, error: joinError } = await roomService.joinRoom(
      code,
      user.id,
      playerName
    );

    setLoading(false);

    if (joinError) {
      setError(joinError);
      return null;
    }

    return joinedRoom;
  };

  const startGame = async () => {
    if (!room) return;

    setLoading(true);
    const { error: startError } = await roomService.startGame(room.id);
    setLoading(false);

    if (startError) {
      setError(startError);
    }
  };

  const resetGame = async () => {
    if (!room) return;

    setLoading(true);
    const { error: resetError } = await roomService.resetRoom(room.id);
    setLoading(false);

    if (resetError) {
      setError(resetError);
    }
  };

  const leaveRoom = async () => {
    if (!room || !user) return;

    await roomService.leaveRoom(room.id, user.id);
    setRoom(null);
    setPlayers([]);
  };

  const isHost = user && room ? room.host_id === user.id : false;
  const isImpostor = user && room ? room.impostor_id === user.id : false;

  return {
    room,
    players,
    loading,
    error,
    createRoom,
    joinRoom,
    startGame,
    resetGame,
    leaveRoom,
    isHost,
    isImpostor,
  };
};
