"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import usePartySocket from "partysocket/react";
import type { GameState } from "../lib/types";
import { getPartykitHost } from "../lib/partykit";
import { parseServerMessage } from "../lib/protocol";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface UseHostGameSocketOptions {
  roomId: string;
  hostToken: string;
  onStateRequest: () => GameState;
}

export function useHostGameSocket({
  roomId,
  hostToken,
  onStateRequest,
}: UseHostGameSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [hostOnline, setHostOnline] = useState(false);
  const [partykitHost, setPartykitHost] = useState("localhost:1999");
  const onStateRequestRef = useRef(onStateRequest);
  const hostTokenRef = useRef(hostToken);
  const socketRef = useRef<ReturnType<typeof usePartySocket> | null>(null);

  useEffect(() => {
    setPartykitHost(getPartykitHost());
  }, []);

  useEffect(() => {
    onStateRequestRef.current = onStateRequest;
    hostTokenRef.current = hostToken;
  }, [onStateRequest, hostToken]);

  const socketOptions = useMemo(
    () => ({
      host: partykitHost,
      room: roomId,
      party: "main",
      query: { role: "host" as const },
      enabled: true,
      onOpen() {
        setStatus("connected");
        socketRef.current?.send(
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
      onMessage(event: MessageEvent) {
        const message = parseServerMessage(event.data);
        if (!message) {
          return;
        }

        const ws = socketRef.current;
        if (!ws) {
          return;
        }

        if (message.type === "register-host-ok") {
          setHostOnline(true);
          const state = onStateRequestRef.current();
          ws.send(
            JSON.stringify({
              type: "state-update",
              hostToken: hostTokenRef.current,
              state,
            })
          );
        }

        if (message.type === "state-request") {
          const state = onStateRequestRef.current();
          ws.send(
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
    }),
    [partykitHost, roomId]
  );

  const socket = usePartySocket(socketOptions);
  socketRef.current = socket;

  const publishState = useCallback((state: GameState) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    ws.send(
      JSON.stringify({
        type: "state-update",
        hostToken: hostTokenRef.current,
        state,
      })
    );
  }, []);

  return { status, hostOnline, publishState, partykitHost };
}

interface UseGuestGameSocketOptions {
  roomId: string;
  onState: (state: GameState) => void;
}

export function useGuestGameSocket({ roomId, onState }: UseGuestGameSocketOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [hostOnline, setHostOnline] = useState(false);
  const [partykitHost, setPartykitHost] = useState("localhost:1999");
  const onStateRef = useRef(onState);
  const socketRef = useRef<ReturnType<typeof usePartySocket> | null>(null);

  useEffect(() => {
    setPartykitHost(getPartykitHost());
  }, []);

  useEffect(() => {
    onStateRef.current = onState;
  }, [onState]);

  const socketOptions = useMemo(
    () => ({
      host: partykitHost,
      room: roomId,
      party: "main",
      query: { role: "guest" as const },
      enabled: Boolean(roomId),
      onOpen() {
        setStatus("connected");
        socketRef.current?.send(JSON.stringify({ type: "state-request" }));
      },
      onClose() {
        setStatus("disconnected");
        setHostOnline(false);
      },
      onMessage(event: MessageEvent) {
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
    }),
    [partykitHost, roomId]
  );

  const socket = usePartySocket(socketOptions);
  socketRef.current = socket;

  return { status, hostOnline, partykitHost };
}
