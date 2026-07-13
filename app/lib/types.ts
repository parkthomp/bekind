export interface Round {
  index: number;
  name: string;
  tricks: number;
  bid: number;
  won: number;
  complete: boolean;
}

export interface Player {
  name: string;
  rounds: Round[];
}

export interface GameState {
  rounds: Round[];
  players: Player[];
  currentRound: number;
  gameStarted: boolean;
}

export interface HostSession {
  roomId: string;
  hostToken: string;
}
