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
import type { GameState, HostSession } from "./lib/types";

interface HostGameProps {
  session: HostSession;
  state: GameState;
  addPlayer: (name: string) => void;
  removePlayer: (index: number) => void;
  setBid: (playerIndex: number, bid: number) => void;
  setWon: (playerIndex: number, won: number) => void;
  setCurrentRound: (roundIndex: number) => void;
  toggleRoundComplete: (roundIndex: number) => void;
  startGame: () => void;
  resetGame: () => void;
  onSessionReset: (session: HostSession) => void;
}

function HostGame({
  session,
  state,
  addPlayer,
  removePlayer,
  setBid,
  setWon,
  setCurrentRound,
  toggleRoundComplete,
  startGame,
  resetGame,
  onSessionReset,
}: HostGameProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const getCurrentState = useCallback(() => stateRef.current, []);

  const { status, publishState } = useHostGameSocket({
    roomId: session.roomId,
    hostToken: session.hostToken,
    onStateRequest: getCurrentState,
  });

  useEffect(() => {
    publishState(state);
  }, [state, publishState]);

  const handleReset = () => {
    resetGame();
    const created = createHostSession();
    saveHostSession(created);
    onSessionReset(created);
    setShowCancelModal(false);
  };

  const copyGuestLink = async () => {
    await navigator.clipboard.writeText(getGuestUrl(session.roomId));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>Be Kind to Your Neighbor</h1>
        <div className='flex flex-col gap-2 border border-white rounded-lg p-4'>
          <p className='text-sm text-gray-300'>
            Host connection:{" "}
            <span className='font-semibold text-white'>{status}</span>
          </p>
          <p className='text-sm break-all'>
            Guest link: {getGuestUrl(session.roomId)}
          </p>
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
    </>
  );
}

export default function Home() {
  const game = useGameState();
  const [session, setSession] = useState<HostSession | null>(null);

  useEffect(() => {
    if (!game.hydrated) {
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
  }, [game.hydrated]);

  if (!game.hydrated || !session) {
    return (
      <main className='flex min-h-screen flex-col p-6 gap-12'>
        <h1 className='text-4xl font-bold'>Be Kind to Your Neighbor</h1>
        <p>Loading game...</p>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col p-6 gap-12'>
      <HostGame
        session={session}
        state={game.state}
        addPlayer={game.addPlayer}
        removePlayer={game.removePlayer}
        setBid={game.setBid}
        setWon={game.setWon}
        setCurrentRound={game.setCurrentRound}
        toggleRoundComplete={game.toggleRoundComplete}
        startGame={game.startGame}
        resetGame={game.resetGame}
        onSessionReset={setSession}
      />
    </main>
  );
}
