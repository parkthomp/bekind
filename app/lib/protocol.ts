import type { GameState } from "./types";

export type ClientMessage =
  | { type: "register-host"; hostToken: string }
  | { type: "state-update"; hostToken: string; state: GameState }
  | { type: "state-request" };

export type ServerMessage =
  | { type: "state"; state: GameState }
  | { type: "state-request" }
  | { type: "host-status"; online: boolean }
  | { type: "register-host-ok" }
  | { type: "error"; message: string };

export const parseClientMessage = (raw: string): ClientMessage | null => {
  try {
    const message = JSON.parse(raw) as ClientMessage;
    if (!message || typeof message !== "object" || !("type" in message)) {
      return null;
    }
    return message;
  } catch {
    return null;
  }
};

export const parseServerMessage = (raw: string): ServerMessage | null => {
  try {
    const message = JSON.parse(raw) as ServerMessage;
    if (!message || typeof message !== "object" || !("type" in message)) {
      return null;
    }
    return message;
  } catch {
    return null;
  }
};
