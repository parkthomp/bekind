import type { GameState, HostSession } from "./types";
import { generateRounds } from "./rounds";

const GAME_KEYS = {
  rounds: "rounds",
  players: "players",
  currentRound: "currentRound",
  gameStarted: "gameStarted",
} as const;

const SESSION_KEY = "hostSession";

export const createInitialGameState = (): GameState => ({
  rounds: generateRounds(),
  players: [],
  currentRound: 0,
  gameStarted: false,
});

export const loadGameState = (): GameState => {
  if (typeof window === "undefined") {
    return createInitialGameState();
  }

  const savedRounds = localStorage.getItem(GAME_KEYS.rounds);
  const savedPlayers = localStorage.getItem(GAME_KEYS.players);
  const savedCurrentRound = localStorage.getItem(GAME_KEYS.currentRound);
  const savedGameStarted = localStorage.getItem(GAME_KEYS.gameStarted);

  return {
    rounds: savedRounds ? JSON.parse(savedRounds) : generateRounds(),
    players: savedPlayers ? JSON.parse(savedPlayers) : [],
    currentRound: savedCurrentRound ? JSON.parse(savedCurrentRound) : 0,
    gameStarted: savedGameStarted ? JSON.parse(savedGameStarted) : false,
  };
};

export const saveGameState = (state: GameState) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(GAME_KEYS.rounds, JSON.stringify(state.rounds));
  localStorage.setItem(GAME_KEYS.players, JSON.stringify(state.players));
  localStorage.setItem(
    GAME_KEYS.currentRound,
    JSON.stringify(state.currentRound)
  );
  localStorage.setItem(
    GAME_KEYS.gameStarted,
    JSON.stringify(state.gameStarted)
  );
};

export const clearGameState = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(GAME_KEYS.rounds);
  localStorage.removeItem(GAME_KEYS.players);
  localStorage.removeItem(GAME_KEYS.currentRound);
  localStorage.removeItem(GAME_KEYS.gameStarted);
};

export const loadHostSession = (): HostSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const saved = localStorage.getItem(SESSION_KEY);
  return saved ? (JSON.parse(saved) as HostSession) : null;
};

export const saveHostSession = (session: HostSession) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearHostSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
};

export const createHostSession = (): HostSession => ({
  roomId: crypto.randomUUID(),
  hostToken: crypto.randomUUID(),
});

export const getGuestUrl = (roomId: string) => {
  if (typeof window === "undefined") {
    return `/game/${roomId}`;
  }

  return `${window.location.origin}/game/${roomId}`;
};
