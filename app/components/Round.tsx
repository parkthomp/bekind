import ScoreCard from "./ScoreCard";
import Button from "./Button";

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

interface RoundProps {
  round: Round;
  roundIndex: number;
  players: Player[];
  setBid: (playerIndex: number, bid: number) => void;
  setWon: (playerIndex: number, won: number) => void;
  toggleRoundComplete: (roundIndex: number) => void;
}

export default function Round({
  round,
  roundIndex,
  players,
  setBid,
  setWon,
  toggleRoundComplete,
}: RoundProps) {
  const totalBids = players.reduce(
    (acc, player) => acc + player.rounds[roundIndex].bid,
    0
  );
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-2xl font-bold'>Round: {round.name}</h1>
      <div className={`flex flex-row gap-2`}>
        Bids:
        <span
          className={`flex flex-col gap-2 ${
            totalBids > round.tricks && "text-red-600"
          }`}
        >
          {totalBids}
        </span>
      </div>
      <div className='grid grid-flow-row grid-cols-6 gap-2'>
        {players.map((player, index) => (
          <div
            key={index}
            className='flex flex-col gap-2 p-2 rounded border border-white'
          >
            <h2 className='text-xl font-bold'>{player.name.toUpperCase()}</h2>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row gap-2 w-full'>
                <h3 className='text-l'>bid: </h3>
                <h3 className='text-xl font-bold'>
                  {player.rounds[roundIndex].bid}
                </h3>
                {!round.complete && (
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
                {!round.complete && (
                  <Button
                    label='+'
                    action={() =>
                      setBid(index, player.rounds[roundIndex].bid + 1)
                    }
                    small
                  />
                )}
              </div>
              <div className='flex flex-row gap-2 w-full'>
                <h3 className='text-l'>won:</h3>
                <h3 className='text-xl font-bold'>
                  {player.rounds[roundIndex].won}
                </h3>
                {!round.complete && (
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
                {!round.complete && (
                  <Button
                    label='+'
                    action={() =>
                      setWon(index, player.rounds[roundIndex].won + 1)
                    }
                    small
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-col items-start w-full'>
        <Button
          label={round.complete ? "Mark as incomplete" : "Round complete"}
          action={() => toggleRoundComplete(roundIndex)}
          clicked={round.complete}
          color={round.complete ? "black" : "green"}
        />
      </div>
    </div>
  );
}
