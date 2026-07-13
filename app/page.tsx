"use client";

import React, { useState, useEffect } from "react";
import Heading from "./components/Heading";
import Form from "./components/Form";
import GameId from "./components/GameId";
import toast, { Toaster } from "react-hot-toast";
import New from "./components/statuses/New";

export default function Host() {
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameId, setGameId] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [biddingActive, setBiddingActive] = useState(true);
  const [status, setStatus] = useState<
    "new" | "setup" | "playing" | "finished"
  >("new");

  // Load state from localStorage after component mounts
  useEffect(() => {
    const savedStatus = localStorage.getItem("status");
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus);
        // Validate that the parsed value is one of the allowed status types
        if (["new", "setup", "playing", "finished"].includes(parsed)) {
          setStatus(parsed);
        }
      } catch (e) {
        // Handle invalid JSON in localStorage
        localStorage.removeItem("status");
      }
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem("status", JSON.stringify(status));
  }, [status]);

  const statusMap: Record<typeof status, React.JSX.Element> = {
    new: <New setStatus={setStatus} />,
    setup: <div>Setup component coming soon</div>,
    playing: <div>Playing component coming soon</div>,
    finished: <div>Finished component coming soon</div>,
  };

  return <>{statusMap[status]}</>;
}
