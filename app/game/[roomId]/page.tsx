"use client";

import { useCallback, useState } from "react";
import GameView from "../../components/GameView";
import { useGuestGameSocket } from "../../hooks/useGameSocket";
import { createInitialGameState } from "../../lib/storage";
import type { GameState } from "../../lib/types";

interface GuestGamePageProps {
  params: {
    roomId: string;
  };
}

export default function GuestGamePage({ params }: GuestGamePageProps) {
  const roomId = params.roomId;
  const [state, setState] = useState<GameState>(createInitialGameState);
  const [hasState, setHasState] = useState(false);

  const onState = useCallback((nextState: GameState) => {
    setState(nextState);
    setHasState(true);
  }, []);

  const { status, hostOnline } = useGuestGameSocket({ roomId, onState });

  const showStaleScores = hasState && !hostOnline;

  return (
    <main className='flex min-h-screen flex-col p-6 gap-12'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>Be Kind to Your Neighbor</h1>
        <p className='text-sm text-gray-300'>
          Viewing game <span className='font-semibold text-white'>{roomId}</span>
        </p>
        <p className='text-sm text-gray-300'>
          Connection: <span className='font-semibold text-white'>{status}</span>
        </p>
        <p className='text-sm text-gray-300'>
          Host:{" "}
          <span className='font-semibold text-white'>
            {hostOnline ? "online" : "offline"}
          </span>
        </p>
      </div>

      {showStaleScores && (
        <div className='border border-yellow-600 rounded-lg p-4 text-yellow-200'>
          Host is offline. Showing the last received scores.
        </div>
      )}

      {!hasState && (
        <div className='border border-white rounded-lg p-6'>
          {hostOnline
            ? "Waiting for the host to share the current score..."
            : "The host is offline. Scores will appear when the host reconnects."}
        </div>
      )}

      {hasState && state.gameStarted && (
        <GameView state={state} readOnly />
      )}

      {hasState && !state.gameStarted && (
        <div className='border border-white rounded-lg p-6'>
          The host has not started the game yet.
        </div>
      )}
    </main>
  );
}
