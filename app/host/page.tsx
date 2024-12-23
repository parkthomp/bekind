"use client";

import React from "react";
import Heading from "../components/Heading";
import Form from "../components/Form";
import GameId from "../components/GameId";
import toast, { Toaster } from "react-hot-toast";

export default function Host() {
  const [hostName, setHostName] = React.useState("");
  const [players, setPlayers] = React.useState<string[]>([]);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameId, setGameId] = React.useState("");
  const [currentRound, setCurrentRound] = React.useState(1);
  const [showScoreboard, setShowScoreboard] = React.useState(false);
  const [biddingActive, setBiddingActive] = React.useState(true);

  const toggleScoreboard = () => {
    setShowScoreboard(!showScoreboard);
  };

  const toggleBidding = () => {
    setBiddingActive(!biddingActive);
  };

  const navigateToNextRound = () => {
    currentRound < 14 && setCurrentRound(currentRound + 1);
  };

  const navigateToPreviousRound = () => {
    currentRound > 1 && setCurrentRound(currentRound - 1);
  };

  const createGameId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let gameId = "";
    for (let i = 0; i < 3; i++) {
      gameId += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    gameId += "-";
    for (let i = 0; i < 3; i++) {
      gameId += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return gameId;
  };

  const handleHostFormSubmit = (input: string) => {
    setHostName(input);
  };

  const handlePlayerFormSubmit = (input: string) => {
    // allow up to 6 players plus the host (7 total)
    if (input) {
      if (players.length < 6) {
        setPlayers([...players, input]);
      } else {
        toast.error("Maximum number of players reached");
      }
    }
  };

  if (gameStarted) {
    return (
      <>
        <GameId gameId={gameId} />
        <main className="flex flex-col p-8 gap-12 min-h-screen relative items-center font-extralight mt-[300px]">
          <Heading text="Game started" />
          <Toaster />
        </main>
      </>
    );
  } else if (!hostName) {
    return (
      <main className="flex flex-col p-8 gap-12 min-h-screen relative items-center font-extralight mt-[300px]">
        <Heading text="Who is hosting?" />
        <Form
          inputLabel="Your Name"
          actionLabel="Continue"
          submitHandler={(input) => handleHostFormSubmit(input)}
        />
        <Toaster />
      </main>
    );
  } else {
    return (
      <main className="flex flex-col p-8 gap-8 min-h-screen relative items-center font-extralight mt-[300px]">
        <Heading text="Who is playing?" />
        <div className="flex gap-12">
          <Form
            inputLabel="Name"
            actionLabel="Add Player"
            submitHandler={(input) => handlePlayerFormSubmit(input)}
          />
          <div className="uppercase text-sm font-light flex flex-col gap-4">
            <h2>Players</h2>
            <ul className="text-xl">
              <li>{hostName} (HOST)</li>
              {players.map((player, index) => (
                <li key={`${player}-${index}`}>{player}</li>
              ))}
            </ul>
            {players.length > 0 && (
              <button
                onClick={() => {
                  setGameId(createGameId());
                  setGameStarted(true);
                }}
                className="bg-black text-white uppercase text-sm py-2 w-full text-left font-light hover:text-myyellow focus:text-myyellow focus:outline-none   focus:border-none"
              >
                Continue &rarr;
              </button>
            )}
          </div>
        </div>
        <Toaster />
      </main>
    );
  }
}
