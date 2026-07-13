"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import usePartySocket from "partysocket/react";
import type { GameState } from "../lib/types";
import { PARTYKIT_HOST } from "../lib/partykit";
import { parseServerMessage } from "../lib/protocol";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface UseHostGameSocketOptions {
  roomId: string;
  hostToken: string;
  enabled: boolean;
  onStateRequest: () => GameState;
}

export function useHostGameSocket({
  roomId,
  hostToken,
  enabled,
  onStateRequest,
}: UseHostGameSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [hostOnline, setHostOnline] = useState(false);
  const onStateRequestRef = useRef(onStateRequest);
  const hostTokenRef = useRef(hostToken);

  useEffect(() => {
    onStateRequestRef.current = onStateRequest;
    hostTokenRef.current = hostToken;
  }, [onStateRequest, hostToken]);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    party: "main",
    query: { role: "host" },
    startClosed: !enabled,
    onOpen() {
      setStatus("connected");
      socket.send(
        JSON.stringify({
          type: "register-host",
          hostToken: hostTokenRef.current,
        })
      );
    },
    onClose() {
      setStatus("disconnected");
      setHostOnline(false);
    },
    onMessage(event) {
      const message = parseServerMessage(event.data);
      if (!message) {
        return;
      }

      if (message.type === "register-host-ok") {
        setHostOnline(true);
        const state = onStateRequestRef.current();
        socket.send(
          JSON.stringify({
            type: "state-update",
            hostToken: hostTokenRef.current,
            state,
          })
        );
      }

      if (message.type === "state-request") {
        const state = onStateRequestRef.current();
        socket.send(
          JSON.stringify({
            type: "state-update",
            hostToken: hostTokenRef.current,
            state,
          })
        );
      }

      if (message.type === "host-status") {
        setHostOnline(message.online);
      }
    },
  });

  useEffect(() => {
    if (enabled && roomId) {
      socket.reconnect();
    } else {
      socket.close();
      setStatus("disconnected");
    }
  }, [enabled, roomId, hostToken, socket]);

  const publishState = useCallback(
    (state: GameState) => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      socket.send(
        JSON.stringify({
          type: "state-update",
          hostToken: hostTokenRef.current,
          state,
        })
      );
    },
    [socket]
  );

  return { status, hostOnline, publishState };
}

interface UseGuestGameSocketOptions {
  roomId: string;
  onState: (state: GameState) => void;
}

export function useGuestGameSocket({ roomId, onState }: UseGuestGameSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [hostOnline, setHostOnline] = useState(false);
  const onStateRef = useRef(onState);

  useEffect(() => {
    onStateRef.current = onState;
  }, [onState]);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    party: "main",
    query: { role: "guest" },
    onOpen() {
      setStatus("connected");
      socket.send(JSON.stringify({ type: "state-request" }));
    },
    onClose() {
      setStatus("disconnected");
      setHostOnline(false);
    },
    onMessage(event) {
      const message = parseServerMessage(event.data);
      if (!message) {
        return;
      }

      if (message.type === "state") {
        onStateRef.current(message.state);
      }

      if (message.type === "host-status") {
        setHostOnline(message.online);
      }
    },
  });

  return { status, hostOnline };
}
