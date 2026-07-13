"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import GameView from "./components/GameView";
import { useGameState } from "./hooks/useGameState";
import { useHostGameSocket } from "./hooks/useGameSocket";
import {
  createHostSession,
  getGuestUrl,
  loadHostSession,
  saveHostSession,
} from "./lib/storage";
import type { HostSession } from "./lib/types";

export default function Home() {
  const {
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
  } = useGameState();

  const [session, setSession] = useState<HostSession | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const existing = loadHostSession();
    if (existing) {
      setSession(existing);
      return;
    }

    const created = createHostSession();
    saveHostSession(created);
    setSession(created);
  }, [hydrated]);

  const getCurrentState = useCallback(() => stateRef.current, []);

  const { status, publishState } = useHostGameSocket({
    roomId: session?.roomId ?? "",
    hostToken: session?.hostToken ?? "",
    enabled: Boolean(session),
    onStateRequest: getCurrentState,
  });

  useEffect(() => {
    if (!hydrated || !session) {
      return;
    }

    publishState(state);
  }, [state, hydrated, session, publishState]);

  const handleReset = () => {
    resetGame();
    const created = createHostSession();
    saveHostSession(created);
    setSession(created);
    setShowCancelModal(false);
  };

  const copyGuestLink = async () => {
    if (!session) {
      return;
    }

    await navigator.clipboard.writeText(getGuestUrl(session.roomId));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (!hydrated || !session) {
    return (
      <main className='flex min-h-screen flex-col p-6 gap-12'>
        <h1 className='text-4xl font-bold'>Be Kind to Your Neighbor</h1>
        <p>Loading game...</p>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col p-6 gap-12'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>Be Kind to Your Neighbor</h1>
        <div className='flex flex-col gap-2 border border-white rounded-lg p-4'>
          <p className='text-sm text-gray-300'>
            Host connection:{" "}
            <span className='font-semibold text-white'>{status}</span>
          </p>
          <p className='text-sm break-all'>Guest link: {getGuestUrl(session.roomId)}</p>
          <Button
            label={copied ? "copied!" : "copy guest link"}
            action={copyGuestLink}
            color='green'
          />
        </div>
      </div>

      <GameView
        state={state}
        onAddPlayer={addPlayer}
        onRemovePlayer={removePlayer}
        onStartGame={startGame}
        onSetBid={setBid}
        onSetWon={setWon}
        onToggleRoundComplete={toggleRoundComplete}
        onSetCurrentRound={setCurrentRound}
        onResetRequest={() => setShowCancelModal(true)}
      />

      {showCancelModal && (
        <div className='flex flex-col items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2'>
          <div className='flex flex-col items-center gap-6 border border-white rounded-lg p-6 bg-black relative'>
            <h2 className='text-2xl font-bold'>
              Are you sure you want to reset the game?
            </h2>
            <div className='flex flex-row gap-2'>
              <Button label='reset game' action={handleReset} color='red' />
              <Button
                label='cancel'
                action={() => setShowCancelModal(false)}
                color='green'
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
