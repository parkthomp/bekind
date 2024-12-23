"use client";

import AddPlayer from "./components/AddPlayer";
import Button from "./components/Button";
import Round from "./components/Round";
import { useState, useEffect } from "react";
import ScoreCard from "./components/ScoreCard";
import { getScore } from "./utils";

const roundNames = ["one", "two", "three", "four", "five", "six", "seven"];

const generateRounds = () => {
  const rounds = [];
  let x = 0;
  for (let i = 0; i < 14; i++) {
    rounds.push({
      index: i,
      name: i < 7 ? roundNames[x] : `${roundNames[x]} trumps`,
      tricks: x + 1,
      bid: 0,
      won: 0,
      complete: false,
    });
    if (i < 6) {
      x++;
    } else if (i == 6) {
    } else {
      x--;
    }
  }
  return rounds;
};

interface Round {
  index: number;
  name: string;
  tricks: number;
  bid: number;
  won: number;
  complete: boolean;
}

interface Player {
  name: string;
  rounds: Round[];
}

export default function Home() {
  const [rounds, setRounds] = useState<Round[]>(generateRounds());
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Load state from localStorage after component mounts
  useEffect(() => {
    const savedRounds = localStorage.getItem("rounds");
    const savedPlayers = localStorage.getItem("players");
    const savedCurrentRound = localStorage.getItem("currentRound");
    const savedGameStarted = localStorage.getItem("gameStarted");

    if (savedRounds) setRounds(JSON.parse(savedRounds));
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedCurrentRound) setCurrentRound(JSON.parse(savedCurrentRound));
    if (savedGameStarted) setGameStarted(JSON.parse(savedGameStarted));
  }, []);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("rounds", JSON.stringify(rounds));
  }, [rounds]);

  useEffect(() => {
    localStorage.setItem("gameStarted", JSON.stringify(gameStarted));
  }, [gameStarted]);

  useEffect(() => {
    localStorage.setItem("currentRound", JSON.stringify(currentRound));
  }, [currentRound]);

  const resetGame = () => {
    setPlayers([]);
    setRounds(generateRounds());
    setCurrentRound(0);
    setGameStarted(false);
    localStorage.clear();
    setShowCancelModal(false);
  };

  const goToNextRound = () => {
    if (currentRound < rounds.length - 1) {
      console.log("currentRound", currentRound);
      setCurrentRound(currentRound + 1);
    }
  };

  // const calculateRounds = () => {
  //   const cards = 52;
  //   const maxRounds = 7;
  //   const cardsLeft = cards - 1 % players.length;
  //   // determine if there are cards left over after calculating cards left
  //   // if there are cards left over, add 7 rounds to the total rounds
  //   // if there are no cards left over, add only the amount of rounds there can be with cards left over
  //   const totalRounds =
  //     cardsLeft > 0
  //       ? maxRounds + Math.floor(cardsLeft / players.length)
  //       : Math.floor(cardsLeft / players.length);
  //   const rounds = [];
  //   for (let i = 0; i < totalRounds; i++) {
  //     rounds.push({
  //       index: i,
  //       name: `Round ${i + 1}`,
  //       tricks: i + 1,
  //       bid: 0,
  //       won: 0,
  //       complete: false,
  //     });
  //   }

  // };

  const addPlayer = (playerName: string) => {
    players.length > 0
      ? setPlayers([
          ...players,
          {
            name: playerName,
            rounds: rounds.map((round) => ({ ...round })),
          },
        ])
      : setPlayers([
          {
            name: playerName,
            rounds: rounds.map((round) => ({ ...round })),
          },
        ]);
  };
  const removePlayer = (index: number) => {
    setPlayers(players.filter((player, i) => i !== index));
  };

  // const getScore = (player: Player) => {
  //   const calcScore = (bid: number, won: number) => {
  //     if (bid === won) {
  //       return 10 + bid;
  //     } else {
  //       return won;
  //     }
  //   };

  //   return player.rounds.reduce((score, round) => {
  //     if (rounds[round.index].complete) {
  //       return score + calcScore(round.bid, round.won);
  //     } else {
  //       return score;
  //     }
  //   }, 0);
  // };

  const setBid = (playerIndex: number, bid: number) => {
    setPlayers(
      players.map((player, index) => {
        if (index === playerIndex) {
          return {
            ...player,
            rounds: player.rounds.map((round, index) => {
              if (index === currentRound) {
                return {
                  ...round,
                  bid: bid,
                };
              } else {
                return round;
              }
            }),
          };
        } else {
          return player;
        }
      })
    );
  };

  const setWon = (playerIndex: number, won: number) => {
    setPlayers(
      players.map((player, index) => {
        if (index === playerIndex) {
          return {
            ...player,
            rounds: player.rounds.map((round, index) => {
              if (index === currentRound) {
                return {
                  ...round,
                  won: won,
                };
              } else {
                return round;
              }
            }),
          };
        } else {
          return player;
        }
      })
    );
  };

  const toggleRoundComplete = (roundIndex: number) => {
    setRounds(
      rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            complete: !round.complete,
          };
        } else {
          return round;
        }
      })
    );
    goToNextRound();
  };

  return (
    <main className='flex min-h-screen flex-col p-6 gap-12'>
      <h1 className='text-4xl font-bold'>Be Kind to Your Neighbor</h1>
      {!gameStarted && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h1 className='text-2xl font-bold'>Add Players</h1>
          {players.length < 53 ? (
            <AddPlayer addPlayer={addPlayer} />
          ) : (
            <span>Max amount of players reached</span>
          )}
          <div className='flex flex-row gap-2 flex-wrap'>
            {players.map((player, index) => (
              <div key={index} className='flex flex-col'>
                <h1 className='text-1xl font-bold'>
                  {player.name.toUpperCase()}
                </h1>
                <Button
                  label='remove'
                  action={() => removePlayer(index)}
                  small
                  color='red'
                />
              </div>
            ))}
          </div>
          {players.length > 1 && (
            <Button
              label='start game'
              action={() => setGameStarted(true)}
              color='green'
            />
          )}
        </div>
      )}

      {gameStarted && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h1 className='text-2xl font-bold'>Players</h1>
          <div className='flex flex-row gap-6 flex-wrap'>
            {players
              .slice() // Create a shallow copy to avoid mutating the original array
              .sort((a, b) => getScore(rounds, b) - getScore(rounds, a)) // Sort players by score in descending order
              .map((player, index) => (
                <div key={index} className='flex flex-col'>
                  <h1 className='text-1xl font-bold'>
                    {player.name.toUpperCase()}
                  </h1>
                  <h2 className='text-xl'>{getScore(rounds, player)}</h2>
                </div>
              ))}
          </div>
        </div>
      )}

      {gameStarted && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h1 className='text-2xl font-bold'>Rounds</h1>
          <div className='flex gap-2 flex-wrap'>
            {rounds.map((round, index) => (
              <Button
                key={index}
                label={round.name}
                action={() => setCurrentRound(index)}
                color={
                  round.index === currentRound
                    ? "blue"
                    : round.complete
                    ? "green"
                    : "gray"
                }
              />
            ))}
          </div>
          <Round
            round={rounds[currentRound]}
            roundIndex={currentRound}
            players={players}
            setBid={setBid}
            setWon={setWon}
            toggleRoundComplete={toggleRoundComplete}
          />
        </div>
      )}
      {gameStarted && (
        <div className='flex flex-col items-start gap-6 border border-white rounded-lg p-6'>
          <h1 className='text-2xl font-bold'>Scorecard</h1>
          <div className='max-w-full overflow-auto'>
            <ScoreCard rounds={rounds} players={players} />
          </div>
        </div>
      )}
      {gameStarted && (
        <div className='flex flex-col items-start max-w-xs mt-auto'>
          <Button
            label='reset game'
            action={() => setShowCancelModal(true)}
            color='red'
          />
        </div>
      )}
      {showCancelModal && (
        <div className='flex flex-col items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2'>
          <div className='flex flex-col items-center gap-6 border border-white rounded-lg p-6 bg-black relative'>
            <h1 className='text-2xl font-bold'>
              Are you sure you want to reset the game?
            </h1>
            <div className='flex flex-row gap-2'>
              <Button label='reset game' action={resetGame} color='red' />
              <Button
                label='cancel'
                action={() => {
                  setShowCancelModal(false);
                }}
                color='green'
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
