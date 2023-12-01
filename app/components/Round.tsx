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
            className='flex flex-col gap-2 p-2 rounded border border-white'
          >
            <h2 className='text-xl font-bold'>{player.name.toUpperCase()}</h2>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row gap-2 w-full items-center'>
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
              <div className='flex flex-row gap-2 w-full items-center'>
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
                    disabled={
                      players.reduce(
                        (acc, player) => acc + player.rounds[roundIndex].won,
                        0
                      ) === round.tricks
                    }
                    color={
                      players.reduce(
                        (acc, player) => acc + player.rounds[roundIndex].won,
                        0
                      ) === round.tricks
                        ? "gray"
                        : "blue"
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`flex flex-row gap-2`}>
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
        {totalWins != 0 && totalWins === round.tricks ? (
          <Button
            label={round.complete ? "Mark as incomplete" : "Round complete"}
            action={
              totalWins === round.tricks
                ? () => toggleRoundComplete(roundIndex)
                : () => alert("Wins and tricks do not match")
            }
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
