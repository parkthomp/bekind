import { useCallback, useEffect, useState } from "react";
import type { GameState } from "../lib/types";
import { generateRounds } from "../lib/rounds";
import {
  clearGameState,
  clearHostSession,
  createInitialGameState,
  loadGameState,
  saveGameState,
} from "../lib/storage";

export function useGameState() {
  const [state, setState] = useState<GameState>(createInitialGameState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadGameState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveGameState(state);
  }, [state, hydrated]);

  const addPlayer = useCallback((playerName: string) => {
    const trimmed = playerName.trim();
    if (!trimmed) {
      return;
    }

    setState((current) => ({
      ...current,
      players: [
        ...current.players,
        {
          name: trimmed,
          rounds: current.rounds.map((round) => ({ ...round })),
        },
      ],
    }));
  }, []);

  const removePlayer = useCallback((index: number) => {
    setState((current) => ({
      ...current,
      players: current.players.filter((_, playerIndex) => playerIndex !== index),
    }));
  }, []);

  const setBid = useCallback((playerIndex: number, bid: number) => {
    setState((current) => ({
      ...current,
      players: current.players.map((player, index) => {
        if (index !== playerIndex) {
          return player;
        }

        return {
          ...player,
          rounds: player.rounds.map((round, roundIndex) => {
            if (roundIndex !== current.currentRound) {
              return round;
            }

            return { ...round, bid };
          }),
        };
      }),
    }));
  }, []);

  const setWon = useCallback((playerIndex: number, won: number) => {
    setState((current) => ({
      ...current,
      players: current.players.map((player, index) => {
        if (index !== playerIndex) {
          return player;
        }

        return {
          ...player,
          rounds: player.rounds.map((round, roundIndex) => {
            if (roundIndex !== current.currentRound) {
              return round;
            }

            return { ...round, won };
          }),
        };
      }),
    }));
  }, []);

  const setCurrentRound = useCallback((roundIndex: number) => {
    setState((current) => ({ ...current, currentRound: roundIndex }));
  }, []);

  const toggleRoundComplete = useCallback((roundIndex: number) => {
    setState((current) => {
      const nextRounds = current.rounds.map((round, index) => {
        if (index !== roundIndex) {
          return round;
        }

        return { ...round, complete: !round.complete };
      });

      const nextCurrentRound =
        current.currentRound < nextRounds.length - 1
          ? current.currentRound + 1
          : current.currentRound;

      return {
        ...current,
        rounds: nextRounds,
        currentRound: nextCurrentRound,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setState((current) => ({ ...current, gameStarted: true }));
  }, []);

  const resetGame = useCallback(() => {
    const initial = createInitialGameState();
    setState(initial);
    clearGameState();
    clearHostSession();
  }, []);

  const replaceState = useCallback((nextState: GameState) => {
    setState(nextState);
  }, []);

  return {
    state,
    hydrated,
    addPlayer,
    removePlayer,
    setBid,
    setWon,
    setCurrentRound,
    toggleRoundComplete,
    startGame,
    resetGame,
    replaceState,
  };
}
