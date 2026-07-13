import Button from "./Button";
import type { Player, Round } from "../lib/types";

interface RoundProps {
  round: Round;
  roundIndex: number;
  players: Player[];
  readOnly?: boolean;
  setBid: (playerIndex: number, bid: number) => void;
  setWon: (playerIndex: number, won: number) => void;
  toggleRoundComplete: (roundIndex: number) => void;
}

export default function Round({
  round,
  roundIndex,
  players,
  readOnly = false,
  setBid,
  setWon,
  toggleRoundComplete,
}: RoundProps) {
  const totalBids = players.reduce(
    (acc, player) => acc + player.rounds[roundIndex].bid,
    0
  );

  const totalWins = players.reduce(
    (acc, player) => acc + player.rounds[roundIndex].won,
    0
  );

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-flow-row lg:grid-cols-6 grid-cols-1 gap-2'>
        {players.map((player, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 p-2 rounded border ${
              !round.complete
                ? "border-white"
                : player.rounds[roundIndex].bid === player.rounds[roundIndex].won
                ? "border-green-600"
                : "border-red-600"
            }`}
          >
            <h2 className='text-xl font-bold'>{player.name.toUpperCase()}</h2>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row gap-2 w-full items-center'>
                <h3 className='text-l'>bid: </h3>
                <h3 className='text-xl font-bold'>
                  {player.rounds[roundIndex].bid}
                </h3>
                {!round.complete && !readOnly && (
                  <Button
                    label='-'
                    action={() =>
                      setBid(index, player.rounds[roundIndex].bid - 1)
                    }
                    disabled={player.rounds[roundIndex].bid === 0}
                    small
                    color={
                      player.rounds[roundIndex].bid === 0 ? "gray" : "blue"
                    }
                  />
                )}
                {!round.complete && !readOnly && (
                  <Button
                    label='+'
                    action={() =>
                      setBid(index, player.rounds[roundIndex].bid + 1)
                    }
                    small
                  />
                )}
              </div>
              <div className='flex flex-row gap-2 w-full items-center'>
                <h3 className='text-l'>won:</h3>
                <h3 className='text-xl font-bold'>
                  {player.rounds[roundIndex].won}
                </h3>
                {!round.complete && !readOnly && (
                  <Button
                    label='-'
                    action={() =>
                      setWon(index, player.rounds[roundIndex].won - 1)
                    }
                    disabled={player.rounds[roundIndex].won === 0}
                    small
                    color={
                      player.rounds[roundIndex].won === 0 ? "gray" : "blue"
                    }
                  />
                )}
                {!round.complete && !readOnly && (
                  <Button
                    label='+'
                    action={() =>
                      setWon(index, player.rounds[roundIndex].won + 1)
                    }
                    small
                    disabled={totalWins === round.tricks}
                    color={totalWins === round.tricks ? "gray" : "blue"}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-row gap-2'>
        Bids:
        <span
          className={`flex flex-col gap-2 ${
            totalBids > round.tricks && "text-red-600"
          }`}
        >
          {`${totalBids}/${round.tricks}`}
        </span>
      </div>
      <div className='flex flex-col items-start w-full'>
        {readOnly ? (
          round.complete ? (
            <span>Round complete</span>
          ) : totalWins === 0 ? (
            <span>Waiting for host to complete round</span>
          ) : (
            <span>
              Wins recorded: {totalWins}/{round.tricks}
            </span>
          )
        ) : totalWins !== 0 && totalWins === round.tricks ? (
          <Button
            label={round.complete ? "Mark as incomplete" : "Round complete"}
            action={() => toggleRoundComplete(roundIndex)}
            clicked={round.complete}
            color={round.complete ? "black" : "green"}
          />
        ) : totalWins === 0 ? (
          <span>Record wins to complete round</span>
        ) : (
          <span>Wins and tricks do not match</span>
        )}
      </div>
    </div>
  );
}
